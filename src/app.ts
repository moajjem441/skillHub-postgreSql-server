import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { createRemoteJWKSet, jwtVerify } from 'jose-cjs';

const app: Application = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 🔐 JWT Verification Middleware
const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
);

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Invalid token format" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS);
    (req as any).user = payload;
    next();
  } catch (error: any) {
    console.error("JWT Verification Error:", error);
    if (error.code === "ERR_JWT_EXPIRED") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

// -------------------------------------------------------------
// 📌 Public Routes
// -------------------------------------------------------------

// ১. Get all courses
app.get("/courses", async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// ২. Get top 4 courses
app.get("/courses/data", async (req: Request, res: Response) => {
  try {
    const result = await prisma.course.findMany({
      take: 4,
    });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch top courses" });
  }
});

// ৩. Get single course by ID
app.get("/courses/:id", async (req: Request, res: Response) => {
  try {
   const id = req.params.id as string;
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch course details" });
  }
});

// -------------------------------------------------------------
// 📌 Protected Routes (Admin)
// -------------------------------------------------------------

// ৪. Create a new course
app.post("/admin/course", verifyToken, async (req: Request, res: Response) => {
  try {
    const {
      title,
      instructor,
      rating,
      price,
      category,
      level,
      imageUrl,
      description,
      duration,
      lessons,
      language,
      certificate,
      featured,
    } = req.body;

    if (!title || !instructor || !price || !category) {
      return res.status(400).json({ error: "Required fields missing." });
    }

    const course = await prisma.course.create({
      data: {
        title,
        instructor,
        price: parseFloat(price),
        category,
        rating: rating ? parseFloat(rating) : 4.5,
        level,
        imageUrl,
        description,
        duration,
        lessons: lessons ? parseInt(lessons) : 0,
        language,
        certificate: Boolean(certificate),
        featured: Boolean(featured),
      },
    });

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      course,
    });
  } catch (error) {
    console.error("Error adding course:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add course. Please try again.",
    });
  }
});

// ৫. Delete course
app.delete("/admin/course/:id", verifyToken, async (req: Request, res: Response) => {
  try {
   const id = req.params.id as string;

    await prisma.course.delete({
      where: { id },
    });

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course or Course not found" });
  }
});

// -------------------------------------------------------------
// 📌 Enrollment Routes
// -------------------------------------------------------------

// ৬. Enroll in a course (Transaction ব্যবহার করে নিরাপদ আপডেট)
app.post("/enroll", async (req: Request, res: Response) => {
  try {
    const { courseId, userId } = req.body;
    if (!courseId || !userId) {
      return res.status(400).json({ error: "Required fields missing." });
    }

    // আগের থেকে এনরোল করা আছে কিনা চেক
    const existing = await prisma.enrollment.findUnique({
      where: {
        courseId_userId: { courseId, userId },
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }

    // Transaction: একসাথে Enrollment তৈরি করবে এবং Course-এর enrolledCount বাড়াবে
    const [enrollment] = await prisma.$transaction([
      prisma.enrollment.create({
        data: { courseId, userId },
      }),
      prisma.course.update({
        where: { id: courseId },
        data: { enrolledCount: { increment: 1 } },
      }),
    ]);

    res.status(201).json({
      success: true,
      message: "Enrollment added successfully",
      enrollment,
    });
  } catch (error) {
    console.error("Error adding enrollment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add enrollment. Please try again.",
    });
  }
});

// ৭. Check Enrollment
app.get("/check-enrollment", async (req: Request, res: Response) => {
  try {
    const { courseId, userId } = req.query;
    if (!courseId || !userId) {
      return res.status(400).json({ error: "courseId and userId are required." });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        courseId_userId: {
          courseId: courseId as string,
          userId: userId as string,
        },
      },
    });

    res.status(200).json({
      success: true,
      enrolled: !!enrollment,
      enrollment: enrollment || null,
    });
  } catch (error) {
    console.error("Error checking enrollment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check enrollment status.",
    });
  }
});

// ৮. Get user enrolled courses
app.get("/my-courses", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Relationship-এর সুবিধা নিয়ে এক লাইনে কোর্স ডিটেইলস সহ ফেচ করা
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: userId as string },
      orderBy: { enrolledAt: "desc" },
      include: {
        course: true, // Prisma Relation include
      },
    });

    const result = enrollments.map((e) => ({
      enrollmentId: e.id,
      enrolledAt: e.enrolledAt,
      status: e.status,
      course: e.course,
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("My Courses error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch enrolled courses.",
    });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("SkillHub Server Running with Prisma & PostgreSQL!");
});

export default app;