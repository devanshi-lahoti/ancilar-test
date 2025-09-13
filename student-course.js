const express = require("express");
const app = express();
app.use(express.json());

let students = {};
let courses = {};
let enrollments = {}; 

let studentId = 1;
let courseId = 1;

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

app.post("/students", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email || !isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid student data" });
  }

  const newStudent = { id: studentId++, name, email };
  students[newStudent.id] = newStudent;
  enrollments[newStudent.id] = new Set();

  res.status(201).json(newStudent);
});

app.post("/courses", (req, res) => {
  const { title, capacity } = req.body;
  if (!title || typeof capacity !== "number" || capacity <= 0) {
    return res.status(400).json({ message: "Invalid course data" });
  }

  const newCourse = {
    id: courseId++,
    title,
    capacity,
    enrolledCount: 0,
  };
  courses[newCourse.id] = newCourse;

  res.status(201).json(newCourse);
});

app.post("/enroll", (req, res) => {
  const { studentId, courseId } = req.body;

  const student = students[studentId];
  const course = courses[courseId];

  if (!student || !course) {
    return res.status(404).json({ message: "Student or Course not found" });
  }

  if (course.enrolledCount >= course.capacity) {
    return res.status(400).json({ message: "Course capacity full" });
  }

  if (enrollments[studentId].has(courseId)) {
    return res.status(400).json({ message: "Already enrolled" });
  }

  enrollments[studentId].add(courseId);
  course.enrolledCount++;

  res.json({ message: "Enrolled successfully" });
});

app.get("/students/:id/courses", (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = students[studentId];
  if (!student) return res.status(404).json({ message: "Student not found" });

  const enrolledCourseIds = Array.from(enrollments[studentId]);
  const enrolledCourses = enrolledCourseIds.map((cid) => courses[cid]);

  res.json(enrolledCourses);
});

app.get("/courses/:id/students", (req, res) => {
  const courseId = parseInt(req.params.id);
  const course = courses[courseId];
  if (!course) return res.status(404).json({ message: "Course not found" });

  const enrolledStudents = Object.values(students).filter((s) =>
    enrollments[s.id].has(courseId)
  );

  res.json(enrolledStudents);
});

app.delete("/unenroll", (req, res) => {
  const { studentId, courseId } = req.body;

  const student = students[studentId];
  const course = courses[courseId];

  if (!student || !course) {
    return res.status(404).json({ message: "Student or Course not found" });
  }

  if (!enrollments[studentId].has(courseId)) {
    return res.status(400).json({ message: "Not enrolled in this course" });
  }

  enrollments[studentId].delete(courseId);
  course.enrolledCount--;

  res.json({ message: "Unenrolled successfully" });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
