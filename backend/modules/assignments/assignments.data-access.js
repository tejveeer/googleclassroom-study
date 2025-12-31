export const repository = {
  LIST_ASSIGNMENTS: `
    SELECT
      ca.id,
      ca.course_id,
      ca.assignment_name,
      ca.topic,
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
    SELECT topic
    FROM classroom.course_topics
    WHERE course_id = $1
    ORDER BY topic;
  `,
  CREATE_ASSIGNMENT: `
    INSERT INTO classroom.course_assignments
      (course_id, creator_member_id, topic, assignment_name, instructions, total_marks)
    VALUES
      ($1, $2, $3, $4, $5, $6)
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
    WHERE id = $1;
  `,
  DELETE_TOPIC: `
    DELETE FROM classroom.course_topics
    WHERE course_id = $1 AND topic = $2;
  `
};