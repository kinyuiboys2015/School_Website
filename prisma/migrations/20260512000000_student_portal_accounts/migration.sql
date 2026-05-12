CREATE TABLE `student_portal_accounts` (
    `id` VARCHAR(191) NOT NULL,
    `admissionNumber` VARCHAR(50) NOT NULL,
    `username` VARCHAR(100) NULL,
    `passwordHash` VARCHAR(255) NULL,
    `passwordCreatedAt` DATETIME(3) NULL,
    `lastLoginAt` DATETIME(3) NULL,
    `failedLoginCount` INTEGER NOT NULL DEFAULT 0,
    `lockedUntil` DATETIME(3) NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `student_portal_accounts_admissionNumber_key`(`admissionNumber`),
    UNIQUE INDEX `student_portal_accounts_username_key`(`username`),
    INDEX `student_portal_accounts_admissionNumber_idx`(`admissionNumber`),
    INDEX `student_portal_accounts_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
