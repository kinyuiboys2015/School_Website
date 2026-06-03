-- Align student portal accounts with current uploaded student fields.
ALTER TABLE `student_portal_accounts`
  ADD COLUMN `gradeLevel` VARCHAR(50) NULL,
  ADD COLUMN `className` VARCHAR(100) NULL,
  ADD COLUMN `studentPhone` VARCHAR(20) NULL,
  ADD COLUMN `whatsappPhone` VARCHAR(20) NULL,
  ADD COLUMN `passwordSetAt` DATETIME(3) NULL;

ALTER TABLE `archived_student_portal_credentials`
  ADD COLUMN `gradeLevel` VARCHAR(50) NULL,
  ADD COLUMN `className` VARCHAR(100) NULL,
  ADD COLUMN `studentPhone` VARCHAR(20) NULL,
  ADD COLUMN `whatsappPhone` VARCHAR(20) NULL;
