export const repository = {
  LIST_ASSIGNMENTS: `
    SELECT
      ca.id,
      ca.course_id,
      ca.assignment_name,
      ca.topic_id,
      ca.accepting_submissions,
      ca.instructions,
      ca.total_marks,
      ca.created_at,

      cm.id   AS creator_member_id,
      cm.role AS creator_role,
      u.id    AS creator_user_id,
      u.name  AS creator_name,
      u.avatar_url AS creator_avatar_url
    FROM classroom.course_assignments ca
    JOIN classroom.course_members cm ON cm.id = ca.creator_member_id
    JOIN classroom.users u ON u.id = cm.user_id
    WHERE ca.course_id = $1
    ORDER BY ca.created_at DESC;
  `,
  LIST_TOPICS: `
    SELECT *
    FROM classroom.course_topics
    WHERE course_id = $1
    ORDER BY topic;
  `,
  CREATE_ASSIGNMENT: `
    INSERT INTO classroom.course_assignments
      (course_id, creator_member_id, topic_id, accepting_submissions, assignment_name, instructions, total_marks, due_date)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `,
  CREATE_TOPIC: `
    INSERT INTO classroom.course_topics (course_id, topic)
    VALUES ($1, $2)
    ON CONFLICT (course_id, topic) DO NOTHING
    RETURNING *;
  `,
  DELETE_ASSIGNMENT: `
    DELETE FROM classroom.course_assignments
    WHERE id = $1
    RETURNING *;
  `,
  DELETE_TOPIC: `
    DELETE FROM classroom.course_topics
    WHERE course_id = $1 AND id = $2
    RETURNING *;
  `,

  LIST_ALL_ASSIGNMENT_GRADES: `
    WITH students AS (
      SELECT
        cm.id AS member_id,
        u.id AS user_id,
        u.name,
        u.avatar_url
      FROM classroom.course_members cm
      JOIN classroom.users u ON u.id = cm.user_id
      WHERE cm.course_id = $1
        AND cm.left_at IS NULL
        AND cm.role = 'student'
    ),
    assignments AS (
      SELECT
        id AS assignment_id,
        assignment_name,
        total_marks
      FROM classroom.course_assignments
      WHERE course_id = $1
    )
    SELECT
      s.user_id,
      s.name AS user_name,
      s.avatar_url AS user_avatar,
      a.assignment_id,
      a.assignment_name,
      a.total_marks,
      css.mark AS user_mark,
      css.status AS submission_status,
      css.submitted_at
    FROM students s
    CROSS JOIN assignments a
    LEFT JOIN classroom.course_student_submissions css
      ON css.student_member_id = s.member_id
    AND css.assignment_id = a.assignment_id
    ORDER BY s.name, a.assignment_id;
  `,
  LIST_ASSIGNMENT_GRADES: `
    SELECT
      css.student_member_id,
      u.id AS user_id,
      u.name,
      u.avatar_url,
      css.status,
      css.submitted_at,
      css.mark,
      css.marker_member_id
    FROM classroom.course_student_submissions css
    JOIN classroom.course_members cm ON cm.id = css.student_member_id
    JOIN classroom.users u ON u.id = cm.user_id
    WHERE css.assignment_id = $1
    ORDER BY css.submitted_at DESC;
  `,
  LIST_ASSIGNMENT_SUBMISSION_STATUS: `
    SELECT accepting_submissions
    FROM classroom.course_assignments
    WHERE course_id = $1
      AND id = $2;
  `,
  GET_ASSIGNMENT_DUE_DATE: `
    SELECT due_date
    FROM classroom.course_assignments
    WHERE id = $1
  `,
  UPDATE_ASSIGNMENT_SUBMISSION_STATUS: `
    UPDATE classroom.course_assignments
    SET accepting_submissions = $3
    WHERE course_id = $1
      AND id = $2
    RETURNING *;
  `,
  ADD_STUDENT_SUBMISSION: `
    INSERT INTO classroom.course_student_submissions (assignment_id, student_member_id, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
  UPDATE_STUDENT_SUBMISSION_MARK: `
    UPDATE classroom.course_student_submissions
    SET mark = $3,
        marker_member_id = $4
    WHERE assignment_id = $1
      AND student_member_id = $2
    RETURNING *;
  `,
  UPDATE_STUDENT_SUBMISSION_STATUS: `
    UPDATE classroom.course_student_submissions
    SET status = $3
    WHERE assignment_id = $1
      AND student_member_id = $2
    RETURNING *;
  `,
};