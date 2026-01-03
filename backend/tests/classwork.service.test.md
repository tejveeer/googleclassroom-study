# What we need to test for every function
1. Assignments
  a. `listAssignment(courseId)`
    - Lists assignments
  b. `createAssignment(courseId)`
    - Creates assignment for existing courses
    - Creates assignment under a topic
  c. `deleteAssignment(assignmentId)`
    - Deletes assignment
    - Deletes assignment under a topic
2. Topics 
  a. `listTopics(courseId)`
    - Lists topics
  b. `createTopic(courseId, topic)`
    - Creates topic
  c. `deleteTopic(courseId, topic)`
    - Deletes topic
3. Grades
  a. `listAllAssignmentGrades(courseId)`
    - Returns a grid of student x assignments
  b. `listAssignmentGrades(assignmentId)`
    - Returns the assignment grades of all the students in the course for the assignmentId
4. Submissions
  a. `getAssignmentSubmissionStatus(courseId, assignmentId)`
    - Checks if assignment is accepting submissions
  b. `updateAssignmentSubmissionStatus(courseId, assignmentId)`
    - Updates the submission stauts of an assignment
      (false -> true, true -> false)
  c. `createStudentSubmission(assignmentId, studentMemberId, content)`
    - Creates student submission if before due date
    - Does not create student submission if after due date
  d. `updateStudentSubmissionMark(assignmentId, studentMemberId, mark, markerMemberId)`
    - Updates the mark of the student's submission

# What resources are required beforehand for those tests
BeforeEach:
  - Create a user
  - User creates a course (and they become a teacher)
  - Create two students
  - Create a topic
  - Create an assignment (A1)
  - Create another assignment (A2) under the topic
  - Have the two students submit work for A2
  - Have the teacher mark one student's work
After each:
 - Clean up the setup so we can start from scratch