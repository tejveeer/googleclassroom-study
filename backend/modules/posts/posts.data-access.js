export const repository = {
  LIST_POSTS: `
    SELECT
      cp.id,
      cp.course_id,
      cp.content,
      cp.created_at,
      cp.updated_at,

      author_cm.id      AS author_member_id,
      author_cm.role    AS author_role,
      author_u.id       AS author_user_id,
      author_u.name     AS author_name,
      author_u.avatar_url AS author_avatar_url,

      COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'comment_id', cpc.id,
            'content', cpc.content,
            'created_at', cpc.created_at,
            'member_id', commenter_cm.id,
            'role', commenter_cm.role,
            'user_id', commenter_u.id,
            'name', commenter_u.name,
            'avatar_url', commenter_u.avatar_url
          )
          ORDER BY cpc.created_at
        ) FILTER (WHERE cpc.id IS NOT NULL),
        '[]'::jsonb
      ) AS comments
    FROM classroom.course_posts cp
    JOIN classroom.course_members author_cm ON author_cm.id = cp.member_id
    JOIN classroom.users author_u ON author_u.id = author_cm.user_id

    LEFT JOIN classroom.course_post_comments cpc ON cpc.post_id = cp.id
    LEFT JOIN classroom.course_members commenter_cm ON commenter_cm.id = cpc.member_id
    LEFT JOIN classroom.users commenter_u ON commenter_u.id = commenter_cm.user_id

    WHERE cp.course_id = $1
    GROUP BY
      cp.id, author_cm.id, author_u.id
    ORDER BY cp.created_at DESC;
  `,
  CREATE_POST: `
    INSERT INTO classroom.course_posts (course_id, member_id, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
  UPDATE_POST: `
    UPDATE classroom.course_posts
    SET content = $3
    WHERE id = $1 AND member_id = $2
    RETURNING *;
  `,
  DELETE_POST: `
    DELETE FROM classroom.course_posts
    WHERE id = $1 AND member_id = $2;
  `,
  CREATE_COMMENT: `
    INSERT INTO classroom.course_post_comments (post_id, member_id, content)
    VALUES ($1, $2, $3)
    RETURNING *;
  `,
  DELETE_COMMENT: `
    DELETE FROM classroom.course_post_comments
    WHERE id = $1 AND member_id = $2
  `,
  DOES_POST_EXIST: `
    SELECT id, member_id FROM classroom.course_posts WHERE id = $1
  `,
  DOES_COMMENT_EXIST: `
    SELECT id, member_id FROM classroom.course_post_comments WHERE id = $1
  `
}