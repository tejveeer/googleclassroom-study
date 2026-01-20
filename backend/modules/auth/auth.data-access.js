export const CREATE_USER = `
  INSERT INTO classroom.users (email, name, avatar_url)
  VALUES ($1, $2, $3)
  ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, avatar_url = EXCLUDED.avatar_url
  RETURNING id, email, name, avatar_url;
`;
export const GET_USER = `
  SELECT name, avatar_url
  FROM classroom.users
  WHERE id = $1
`