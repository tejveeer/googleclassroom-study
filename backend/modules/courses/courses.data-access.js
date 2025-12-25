export const repository = {
  GET_USER_COURSES: `
    SELECT
      c.id,
      c.course_name,
      c.course_room,
      c.join_id,
      c.banner_color,
      cm.id        AS member_id,
      cm.role      AS user_role,
      cm.joined_at
    FROM classroom.course_members cm
    JOIN classroom.courses c ON c.id = cm.course_id
    WHERE cm.user_id = $1
      AND cm.left_at IS NULL
    ORDER BY c.created_at DESC;
  `,
  CREATE_COURSE: `
    INSERT INTO classroom.courses (creator_id, course_name, course_room, join_id, banner_color)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `,
  GET_COURSEID_FROM_JOINID: `
    SELECT id
    FROM classroom.courses
    WHERE join_id = $1
  `,
  JOIN_COURSE: `
    INSERT INTO classroom.course_members (user_id, course_id, role)
    VALUES ($1, $2, $3)  -- $3 is 'teacher' or 'student'
    ON CONFLICT (user_id, course_id)
    DO UPDATE SET left_at = NULL
    RETURNING *;
  `,
  DELETE_COURSE: `
    DELETE FROM classroom.courses
    WHERE creator_id = $1 AND id = $2
    RETURNING *;
  `
}