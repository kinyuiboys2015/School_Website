CREATE TABLE IF NOT EXISTS `alumni_governance_records` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `section` VARCHAR(50) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `position` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `image` TEXT NULL,
  `images` JSON NOT NULL,
  `displayOrder` INT NOT NULL DEFAULT 0,
  `isActive` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `alumni_governance_records_section_idx` (`section`),
  INDEX `alumni_governance_records_isActive_idx` (`isActive`),
  INDEX `alumni_governance_records_displayOrder_idx` (`displayOrder`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
