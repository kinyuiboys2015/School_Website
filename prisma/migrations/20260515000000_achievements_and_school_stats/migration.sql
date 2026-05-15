-- CreateTable
CREATE TABLE `Achievement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(100) NOT NULL,
    `year` INTEGER NOT NULL,
    `images` JSON NOT NULL,
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `awardingBody` VARCHAR(255) NULL,
    `recipients` JSON NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `createdByName` VARCHAR(255) NULL,
    `updatedBy` VARCHAR(191) NULL,
    `updatedByName` VARCHAR(255) NULL,
    `achievedDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Achievement_category_idx`(`category`),
    INDEX `Achievement_year_idx`(`year`),
    INDEX `Achievement_featured_idx`(`featured`),
    INDEX `Achievement_isActive_idx`(`isActive`),
    INDEX `Achievement_achievedDate_idx`(`achievedDate`),
    INDEX `Achievement_createdBy_idx`(`createdBy`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SchoolStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `meanScore` DOUBLE NULL,
    `lastYearMean` DOUBLE NULL,
    `targetMean` DOUBLE NULL,
    `slogan` TEXT NULL,
    `sloganDescription` TEXT NULL,
    `sloganAuthor` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
