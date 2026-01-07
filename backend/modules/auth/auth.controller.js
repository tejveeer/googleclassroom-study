import "dotenv/config";

import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { CREATE_USER } from "./auth.data-access.js";

export function createAuthController({ pool }) {
  const client = new OAuth2Client({
    clientSecret: process.env.AUTH_CLIENT_SECRET,
    clientId: process.env.AUTH_CLIENT_ID,
    redirectUri: process.env.AUTH_REDIRECT_URL
  });

  return {
    async googleAuth(_, res) {
      const url = client.generateAuthUrl({
        scope: ["openid", "profile", "email"],
      });

      res.redirect(url);
    },

    async googleCallback(req, res) {
      const { code } = req.query;
      const { tokens } = await client.getToken(code);

      const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.AUTH_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email, name, picture } = payload;

      const user = await findOrCreateUser(pool, {
        email,
        name,
        avatarUrl: picture,
      });

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token });
    },
  };
}

async function findOrCreateUser(pool, { email, name, avatarUrl }) {
  const { rows } = await pool.query(
    CREATE_USER,
    [email, name, avatarUrl]
  );
  return rows[0];
}
