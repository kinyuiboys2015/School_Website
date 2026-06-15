-- Teacher profiles are standalone and no longer map to department records.
UPDATE `Staff`
SET
  `department` = NULL,
  `departmentId` = NULL,
  `mainDepartmentId` = NULL,
  `subDepartmentId` = NULL
WHERE LOWER(COALESCE(`role`, '')) = 'teacher'
   OR LOWER(COALESCE(`staffType`, '')) = 'teacher';

-- Stored counts now include mapped non-teacher staff only.
UPDATE `staff_departments` AS department
SET `staffCount` = (
  SELECT COUNT(*)
  FROM `Staff` AS staff
  WHERE LOWER(COALESCE(staff.`role`, '')) <> 'teacher'
    AND LOWER(COALESCE(staff.`staffType`, '')) <> 'teacher'
    AND (
      (
        department.`departmentType` = 'SUB'
        AND (
          staff.`subDepartmentId` = department.`id`
          OR (
            staff.`subDepartmentId` IS NULL
            AND staff.`departmentId` = department.`id`
          )
        )
      )
      OR (
        department.`departmentType` = 'MAIN'
        AND (
          staff.`mainDepartmentId` = department.`id`
          OR (
            staff.`mainDepartmentId` IS NULL
            AND staff.`subDepartmentId` IS NULL
            AND staff.`departmentId` = department.`id`
          )
        )
      )
    )
);
