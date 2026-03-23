import "dotenv/config";

import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { CREATE_USER, GET_USER, GET_USER_COURSE_MEMBER_ID } from "./auth.data-access.js";

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
      const { code, error } = req.query;
      const { tokens } = await client.getToken(code);

      if (error) {
        // User denied access or something went wrong on Google's side
        return res.redirect(`${process.env.AUTH_FINAL_REDIRECT_URL}?error=${error}`);
      }

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
        { expiresIn: "10h" }
      );

      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
      })
      res.redirect(process.env.AUTH_FINAL_REDIRECT_URL);
    },

    async getMe(req, res) {
      try {
        const { userId } = req.body;
        const user = await getUser(pool, userId);

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ user });
      } catch {
        return res.status(500).json({ error: "Internal server error" });
      }
    },

    async getUserCourseId(req, res) {
      try {
        const courseId = req.params.courseId;
        const { userId } = req.body;

        if (!userId || !courseId) {
          return res.status(404).json({ error: "Not enough information" });
        }

        const user = await getUserCourseId(pool, userId, courseId);
        return res.status(200).json({ user });
      } catch {
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}

async function findOrCreateUser(pool, { email, name, avatarUrl }) {
  const { rows } = await pool.query(
    CREATE_USER,
    [email, name, avatarUrl]
  );
  return rows[0];
}

async function getUser(pool, userId) {
  const { rows } = await pool.query(
    GET_USER,
    [userId]
  );
  return rows[0];
}

async function getUserCourseId(pool, userId, courseId) {
  const { rows } = await pool.query(
    GET_USER_COURSE_MEMBER_ID,
    [userId, courseId]
  );
  return rows[0];
}
