export const repository = {
  LIST_TEACHERS: `
SELECT
  cm.id AS member_id,
  cm.role,
  cm.joined_at,
  u.id AS user_id,
  u.name,
  u.email,
  u.avatar_url
FROM classroom.course_members cm
JOIN classroom.users u ON u.id = cm.user_id
WHERE cm.course_id = $1
  AND cm.left_at IS NULL
  AND cm.role = 'teacher'
ORDER BY u.name;
  `,
  LIST_STUDENTS: `
SELECT
  cm.id AS member_id,
  cm.role,
  cm.joined_at,
  u.id AS user_id,
  u.name,
  u.email,
  u.avatar_url
FROM classroom.course_members cm
JOIN classroom.users u ON u.id = cm.user_id
WHERE cm.course_id = $1
  AND cm.left_at IS NULL
  AND cm.role = 'student'
ORDER BY u.name;
  `,
  DELETE_COURSE_MEMBER: `
UPDATE classroom.course_members
SET left_at = now()
WHERE id = $1 AND course_id = $2
RETURNING *;
  `,
}