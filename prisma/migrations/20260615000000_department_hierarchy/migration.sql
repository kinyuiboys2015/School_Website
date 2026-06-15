-- Add hierarchical department fields.
ALTER TABLE `staff_departments`
    ADD COLUMN `departmentType` VARCHAR(20) NOT NULL DEFAULT 'MAIN',
    ADD COLUMN `parentDepartmentId` INTEGER NULL,
    ADD COLUMN `departmentHeadId` INTEGER NULL;

-- Add explicit main and sub-department assignments while retaining departmentId.
ALTER TABLE `Staff`
    ADD COLUMN `mainDepartmentId` INTEGER NULL,
    ADD COLUMN `subDepartmentId` INTEGER NULL;

-- Existing flat departments become main departments and existing staff links are preserved.
UPDATE `staff_departments`
SET `departmentType` = 'MAIN'
WHERE `departmentType` IS NULL OR `departmentType` = '';

UPDATE `Staff`
SET `mainDepartmentId` = `departmentId`
WHERE `departmentId` IS NOT NULL AND `mainDepartmentId` IS NULL;

CREATE INDEX `staff_departments_departmentType_idx`
    ON `staff_departments`(`departmentType`);
CREATE INDEX `staff_departments_parentDepartmentId_idx`
    ON `staff_departments`(`parentDepartmentId`);
CREATE INDEX `staff_departments_departmentHeadId_idx`
    ON `staff_departments`(`departmentHeadId`);
CREATE INDEX `Staff_mainDepartmentId_idx`
    ON `Staff`(`mainDepartmentId`);
CREATE INDEX `Staff_subDepartmentId_idx`
    ON `Staff`(`subDepartmentId`);

ALTER TABLE `staff_departments`
    ADD CONSTRAINT `staff_departments_parentDepartmentId_fkey`
    FOREIGN KEY (`parentDepartmentId`) REFERENCES `staff_departments`(`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE `staff_departments`
    ADD CONSTRAINT `staff_departments_departmentHeadId_fkey`
    FOREIGN KEY (`departmentHeadId`) REFERENCES `Staff`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Staff`
    ADD CONSTRAINT `Staff_mainDepartmentId_fkey`
    FOREIGN KEY (`mainDepartmentId`) REFERENCES `staff_departments`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `Staff`
    ADD CONSTRAINT `Staff_subDepartmentId_fkey`
    FOREIGN KEY (`subDepartmentId`) REFERENCES `staff_departments`(`id`)
    ON DELETE SET NULL ON UPDATE CASCADE;
