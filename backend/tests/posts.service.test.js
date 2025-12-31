// posts.service.int.test.js
import { beforeAll, afterAll, describe, it, expect } from "vitest";

import { startTestDb, stopTestDb } from "./test-db.js";
import { createCoursesService } from "../modules/courses/courses.service.js";
import { createPostsService } from "../modules/posts/posts.service.js";

async function createTestUser(pool, { email, name, avatarUrl = null }) {
  const { rows } = await pool.query(
    `
    INSERT INTO classroom.users (email, name, avatar_url)
    VALUES ($1, $2, $3)
    RETURNING *;
    `,
    [email, name, avatarUrl]
  );
  return rows[0];
}

async function getCourseMember(pool, { courseId, userId }) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM classroom.course_members
    WHERE course_id = $1 AND user_id = $2
    `,
    [courseId, userId]
  );
  return rows[0] ?? null;
}

describe("posts.service (integration)", () => {
  let container;
  let pool;

  let coursesService;
  let postsService;

  // Shared fixtures
  let aliceUser;
  let bobUser;

  let seededCourse;
  let seededCourseJoinId;

  let aliceMembership;
  let bobMembership;

  let aliceSeedPost;
  let bobSeedPost;

  let bobSeedComments; // 5 comments on aliceSeedPost

  beforeAll(async () => {
    ({ container, pool } = await startTestDb());

    coursesService = createCoursesService({ pool });
    postsService = createPostsService({ pool });

    // Users
    aliceUser = await createTestUser(pool, {
      email: "alice@test.local",
      name: "Alice",
    });

    bobUser = await createTestUser(pool, {
      email: "bob@test.local",
      name: "Bob",
    });

    // Course (created by Alice; CREATE_COURSE returns join_id)
    const createCourseResult = await coursesService.createCourse(
      aliceUser.id,
      "Seed Course",
      "Room 101",
      "#ff0000"
    );
    expect(createCourseResult.success).toBe(true);

    seededCourse = createCourseResult.data;
    seededCourseJoinId = seededCourse.join_id;

    // Join memberships (Alice may already be joined by createCourse; joinCourse may fail/duplicate depending on schema)
    await coursesService.joinCourse(aliceUser.id, seededCourseJoinId, "teacher").catch(
      () => {}
    );

    const bobJoinResult = await coursesService.joinCourse(
      bobUser.id,
      seededCourseJoinId,
      "student"
    );
    expect(bobJoinResult.success).toBe(true);

    // Fetch membership rows (service uses memberId)
    aliceMembership = await getCourseMember(pool, {
      courseId: seededCourse.id,
      userId: aliceUser.id,
    });
    bobMembership = await getCourseMember(pool, {
      courseId: seededCourse.id,
      userId: bobUser.id,
    });

    expect(aliceMembership).toBeTruthy();
    expect(bobMembership).toBeTruthy();

    // Seed listPosts fixture:
    // Alice creates P1
    const createAliceSeedPostResult = await postsService.createPost(
      aliceMembership.id,
      seededCourse.id,
      "P1 content"
    );
    expect(createAliceSeedPostResult.success).toBe(true);
    aliceSeedPost = createAliceSeedPostResult.data;

    // Bob adds 5 comments on P1
    bobSeedComments = [];
    for (let i = 1; i <= 5; i++) {
      const createCommentResult = await postsService.createComment(
        bobMembership.id,
        aliceSeedPost.id,
        `C${i} content`
      );
      expect(createCommentResult.success).toBe(true);
      bobSeedComments.push(createCommentResult.data);
    }

    // Bob creates P2
    const createBobSeedPostResult = await postsService.createPost(
      bobMembership.id,
      seededCourse.id,
      "P2 content"
    );
    expect(createBobSeedPostResult.success).toBe(true);
    bobSeedPost = createBobSeedPostResult.data;
  }, 30_000);

  afterAll(async () => {
    await stopTestDb(container, pool);
  }, 30_000);

  describe("listPosts", () => {
    it("returns posts with author info and aggregated comments", async () => {
      const result = await postsService.listPosts(seededCourse.id);

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBe(2);

      // Query orders posts by cp.created_at DESC; bobSeedPost was created after aliceSeedPost
      const [mostRecentPost, olderPost] = result.data;

      expect(mostRecentPost.id).toBe(bobSeedPost.id);
      expect(mostRecentPost.author_user_id).toBe(bobUser.id);

      expect(olderPost.id).toBe(aliceSeedPost.id);
      expect(olderPost.author_user_id).toBe(aliceUser.id);

      // Comments are aggregated for olderPost, ordered by cpc.created_at
      expect(Array.isArray(olderPost.comments)).toBe(true);
      expect(olderPost.comments).toHaveLength(5);

      expect(olderPost.comments[0]).toMatchObject({ content: "C1 content" });
      expect(olderPost.comments[4]).toMatchObject({ content: "C5 content" });
    });

    it("returns an empty list for an unknown course", async () => {
      // NOTE: With the current LIST_POSTS query alone, “course not found” is indistinguishable
      // from “course exists but has no posts”. This test matches query-only semantics.
      const result = await postsService.listPosts(99999999);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe("createPost", () => {
    it("allows a member to publish a post to their course", async () => {
      const result = await postsService.createPost(
        aliceMembership.id,
        seededCourse.id,
        "Hello from Alice"
      );

      expect(result.success).toBe(true);
      expect(result.data).toMatchObject({
        course_id: seededCourse.id,
        member_id: aliceMembership.id,
        content: "Hello from Alice",
      });
    });

    it("rejects publishing a post when the membership doesn't match the course", async () => {
      // Create a second course owned by Alice; DO NOT add Bob
      const createOtherCourseResult = await coursesService.createCourse(
        aliceUser.id,
        "Other Course",
        "Room 202",
        "#00ff00"
      );
      expect(createOtherCourseResult.success).toBe(true);

      const otherCourse = createOtherCourseResult.data;

      // Use Bob's membership from the seeded course to post into otherCourse
      const result = await postsService.createPost(
        bobMembership.id,
        otherCourse.id,
        "This should not be allowed"
      );

      expect(result.success).toBe(false);
      expect(result.reason).toBe("NOT_A_MEMBER");
    });
  });

  describe("updatePost", () => {
    it("allows the author to edit their post", async () => {
      const createPostResult = await postsService.createPost(
        aliceMembership.id,
        seededCourse.id,
        "Original content"
      );
      expect(createPostResult.success).toBe(true);

      const createdPost = createPostResult.data;

      const updateResult = await postsService.updatePost(
        aliceMembership.id,
        createdPost.id,
        "Updated content"
      );

      expect(updateResult.success).toBe(true);
      expect(updateResult.data).toMatchObject({
        id: createdPost.id,
        content: "Updated content",
      });
    });

    it("prevents a non-author from editing someone else's post", async () => {
      const createPostResult = await postsService.createPost(
        aliceMembership.id,
        seededCourse.id,
        "Alice's post"
      );
      expect(createPostResult.success).toBe(true);

      const alicesPost = createPostResult.data;

      const updateAttemptResult = await postsService.updatePost(
        bobMembership.id,
        alicesPost.id,
        "Unauthorized edit"
      );

      expect(updateAttemptResult.success).toBe(false);
      expect(updateAttemptResult.reason).toBe("FORBIDDEN");
    });
  });

  describe("deletePost", () => {
    it("allows the author to remove their post", async () => {
      const createPostResult = await postsService.createPost(
        aliceMembership.id,
        seededCourse.id,
        "Post to remove"
      );
      expect(createPostResult.success).toBe(true);

      const postToRemove = createPostResult.data;

      const deleteResult = await postsService.deletePost(
        aliceMembership.id,
        postToRemove.id
      );

      expect(deleteResult.success).toBe(true);

      // Optional: confirm row is gone
      const { rows } = await pool.query(
        `SELECT 1 FROM classroom.course_posts WHERE id = $1`,
        [postToRemove.id]
      );
      expect(rows.length).toBe(0);
    });

    it("prevents a non-author from removing someone else's post", async () => {
      const createPostResult = await postsService.createPost(
        aliceMembership.id,
        seededCourse.id,
        "Alice's post"
      );
      expect(createPostResult.success).toBe(true);

      const alicesPost = createPostResult.data;

      const deleteAttemptResult = await postsService.deletePost(
        bobMembership.id,
        alicesPost.id
      );

      expect(deleteAttemptResult.success).toBe(false);
      expect(deleteAttemptResult.reason).toBe("FORBIDDEN");
    });
  });

  describe("createComment", () => {
    it("allows a member to comment on an existing post", async () => {
      const createPostResult = await postsService.createPost(
        aliceMembership.id,
        seededCourse.id,
        "Post for comments"
      );
      expect(createPostResult.success).toBe(true);

      const postForComments = createPostResult.data;

      const createCommentResult = await postsService.createComment(
        bobMembership.id,
        postForComments.id,
        "Nice post!"
      );

      expect(createCommentResult.success).toBe(true);
      expect(createCommentResult.data).toMatchObject({
        post_id: postForComments.id,
        member_id: bobMembership.id,
        content: "Nice post!",
      });
    });
  });

  describe("deleteComment", () => {
    it("allows the author to remove their comment", async () => {
      const createPostResult = await postsService.createPost(
        aliceMembership.id,
        seededCourse.id,
        "Post for comment removal"
      );
      expect(createPostResult.success).toBe(true);

      const post = createPostResult.data;

      const createCommentResult = await postsService.createComment(
        bobMembership.id,
        post.id,
        "Temporary comment"
      );
      expect(createCommentResult.success).toBe(true);

      const comment = createCommentResult.data;

      const deleteCommentResult = await postsService.deleteComment(
        bobMembership.id,
        comment.id
      );

      expect(deleteCommentResult.success).toBe(true);
    });

    it("prevents a non-author from removing someone else's comment", async () => {
      const createPostResult = await postsService.createPost(
        aliceMembership.id,
        seededCourse.id,
        "Post"
      );
      expect(createPostResult.success).toBe(true);

      const post = createPostResult.data;

      const createCommentResult = await postsService.createComment(
        bobMembership.id,
        post.id,
        "Bob's comment"
      );
      expect(createCommentResult.success).toBe(true);

      const bobsComment = createCommentResult.data;

      const deleteAttemptResult = await postsService.deleteComment(
        aliceMembership.id,
        bobsComment.id
      );

      expect(deleteAttemptResult.success).toBe(false);
      expect(deleteAttemptResult.reason).toBe("FORBIDDEN");
    });
  });
});
