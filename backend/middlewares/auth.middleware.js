import jwt from 'jsonwebtoken';
import "dotenv/config";

export function requireAuth(req, res, next) {
  const auth = req.cookies.access_token;
  if (!auth) {
    return res.status(401).json({ error: "UNAUTHENTICATED" });
  }

  console.log("Req Auth", req.method);
  try {
    const payload = jwt.verify(auth, process.env.JWT_SECRET);

    // I know it's a very bad decision to add userId to body
    // But I only figured that out after I'd already designed all my controllers
    // alas, I have to go with this; otherwise I'd have to do a huge refactor
    // This is a toy project anyways so that doesn't matter a lot
    req.body = req.body ?? {};
    req.body.userId = payload.userId;

    return next();
  } catch {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}

export function requireCourseMember(pool) {
  return async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const userId = req.body.userId;

      console.log("Req Course Mem", req.method);
      const isMemberResult = await isCourseMember(pool, courseId, userId);
      if (isMemberResult.success) {
        req.body.memberId = isMemberResult.data;
        return next();
      } else {
        return res.status(403).json({ error: "NOT_COURSE_MEMBER" });
      }
    } catch (err) {
      return next(err);
    }
  };
}

export function requireTeacher(pool) {
  return async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const userId = req.body.userId;

      const isTeacherResult = await isTeacher(pool, courseId, userId);
      if (!isTeacherResult.success) {
        return res.status(403).json({ error: "NOT_A_TEACHER" });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  }
}

export function requireStudent(pool) {
  return async (req, res, next) => {
    try {
      const courseId = req.params.courseId;
      const userId = req.body.userId;

      const isStudentResult = await isStudent(pool, courseId, userId);
      if (!isStudentResult.success) {
        return res.status(403).json({ error: "NOT_A_STUDENT" });
      }

      return next();
    } catch (err) {
      return next(err);
    }
  }
}

// HELPERS
async function isCourseMember(pool, courseId, userId) {
  const res = await pool.query(`
    SELECT id
    FROM classroom.course_members
    WHERE course_id = $1 AND user_id = $2
  `, [courseId, userId]);

  if (res.rows.length !== 0) {
    return { success: true, data: res.rows[0].id };
  }

  return { success: false };
}

async function isTeacher(pool, courseId, userId) {
  const res = await pool.query(`
    SELECT 1
    FROM classroom.course_members
    WHERE course_id = $1 AND user_id = $2 AND role = 'teacher'
    LIMIT 1
  `, [courseId, userId]);

  if (res.rows.length !== 0) {
    return { success: true };
  }

  return { success: false };
}

async function isStudent(pool, courseId, userId) {
  const res = await pool.query(`
    SELECT 1
    FROM classroom.course_members
    WHERE course_id = $1 AND user_id = $2 AND role = 'student'
    LIMIT 1
  `, [courseId, userId]);

  if (res.rows.length !== 0) {
    return { success: true };
  }

  return { success: false };
}