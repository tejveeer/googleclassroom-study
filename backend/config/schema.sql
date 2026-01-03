-- SCHEMA
CREATE SCHEMA IF NOT EXISTS classroom;

-- Optional but recommended (UUID join codes, case-insensitive emails)
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- CREATE EXTENSION IF NOT EXISTS citext;

-- USERS
CREATE TABLE IF NOT EXISTS classroom.users (
  id          integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email       text NOT NULL UNIQUE, -- consider CITEXT if you enable extension
  name        text NOT NULL,
  avatar_url  text NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- COURSES
CREATE TABLE IF NOT EXISTS classroom.courses (
  id           integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  creator_id   integer NOT NULL REFERENCES classroom.users(id) ON DELETE CASCADE,
  course_name  text   NOT NULL,
  course_room  text   NOT NULL,
  join_id      text   NOT NULL UNIQUE,
  banner_color text   NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- MEMBER ROLE TYPE (cleaner than TEXT + CHECK)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_role') THEN
    CREATE TYPE classroom.course_role AS ENUM ('teacher', 'student');
  END IF;
END $$;

-- COURSE MEMBERS (the user-in-course identity)
CREATE TABLE IF NOT EXISTS classroom.course_members (
  id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id    integer NOT NULL REFERENCES classroom.users(id) ON DELETE CASCADE,
  course_id  integer NOT NULL REFERENCES classroom.courses(id) ON DELETE CASCADE,
  role       classroom.course_role NOT NULL,
  joined_at  timestamptz NOT NULL DEFAULT now(),
  left_at    timestamptz NULL,

  UNIQUE (user_id, course_id),
  UNIQUE (id, course_id)
);

-- TOPICS (composite PK)
CREATE TABLE IF NOT EXISTS classroom.course_topics (
  id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  course_id  integer NOT NULL REFERENCES classroom.courses(id) ON DELETE CASCADE,
  topic      text   NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (course_id, topic)
);

-- ASSIGNMENTS
CREATE TABLE IF NOT EXISTS classroom.course_assignments (
  id                    integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  course_id              integer NOT NULL REFERENCES classroom.courses(id) ON DELETE CASCADE,
  creator_member_id      integer NOT NULL REFERENCES classroom.course_members(id) ON DELETE SET NULL,
  topic_id               integer NULL REFERENCES classroom.course_topics(id) ON DELETE CASCADE,
  assignment_name        text NOT NULL,
  accepting_submissions  boolean NOT NULL DEFAULT true,
  instructions           text NOT NULL,
  due_date               timestamptz NOT NULL,
  total_marks            integer NOT NULL CHECK (total_marks >= 0),
  created_at             timestamptz NOT NULL DEFAULT now()
);

-- SUBMISSION STATUS TYPE
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status') THEN
    CREATE TYPE classroom.submission_status AS ENUM ('awaiting', 'submitted', 'missing', 'returned');
  END IF;
END $$;

-- STUDENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS classroom.course_student_submissions (
  id                 integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  assignment_id      integer NOT NULL REFERENCES classroom.course_assignments(id) ON DELETE CASCADE,
  student_member_id  integer NOT NULL REFERENCES classroom.course_members(id) ON DELETE CASCADE,
  content            text NOT NULL,
  status             classroom.submission_status NOT NULL DEFAULT 'submitted',
  marker_member_id   integer NULL REFERENCES classroom.course_members(id) ON DELETE SET NULL,
  mark               integer NULL CHECK (mark IS NULL OR mark >= 0),
  submitted_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assignment_id, student_member_id)
);

-- POSTS
CREATE TABLE IF NOT EXISTS classroom.course_posts (
  id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  course_id  integer NOT NULL REFERENCES classroom.courses(id) ON DELETE CASCADE,
  member_id  integer NOT NULL,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT fk_member
    FOREIGN KEY (member_id, course_id)
    REFERENCES classroom.course_members(id, course_id) ON DELETE CASCADE
);

-- POST COMMENTS
CREATE TABLE IF NOT EXISTS classroom.course_post_comments (
  id         integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id    integer NOT NULL REFERENCES classroom.course_posts(id) ON DELETE CASCADE,
  member_id  integer NOT NULL REFERENCES classroom.course_members(id) ON DELETE CASCADE,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ASSIGNMENT COMMENTS (merged public/private)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'comment_visibility') THEN
    CREATE TYPE classroom.comment_visibility AS ENUM ('public', 'private');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS classroom.course_assignment_comments (
  id            integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  assignment_id integer NOT NULL REFERENCES classroom.course_assignments(id) ON DELETE CASCADE,
  member_id     integer NOT NULL REFERENCES classroom.course_members(id) ON DELETE CASCADE,
  visibility    classroom.comment_visibility NOT NULL DEFAULT 'public',
  content       text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_course_members_course ON classroom.course_members(course_id) WHERE left_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_course_posts_course ON classroom.course_posts(course_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_post ON classroom.course_post_comments(post_id, created_at);
CREATE INDEX IF NOT EXISTS idx_assignments_course ON classroom.course_assignments(course_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON classroom.course_student_submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_comments_assignment ON classroom.course_assignment_comments(assignment_id, created_at);

-- (Optional) auto-update updated_at on posts
CREATE OR REPLACE FUNCTION classroom.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_course_posts_updated_at ON classroom.course_posts;
CREATE TRIGGER trg_course_posts_updated_at
BEFORE UPDATE ON classroom.course_posts
FOR EACH ROW EXECUTE FUNCTION classroom.set_updated_at();
