-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "price" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'Intermediate',
    "imageUrl" TEXT,
    "description" TEXT,
    "duration" TEXT NOT NULL DEFAULT '8 Weeks',
    "lessons" INTEGER NOT NULL DEFAULT 0,
    "students" INTEGER NOT NULL DEFAULT 0,
    "enrolledCount" INTEGER NOT NULL DEFAULT 0,
    "language" TEXT NOT NULL DEFAULT 'English',
    "certificate" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_courseId_userId_key" ON "Enrollment"("courseId", "userId");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
