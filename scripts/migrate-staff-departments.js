require("dotenv").config();

const mysql = require("mysql2/promise");

const PATHWAYS = [
  {
    name: "STEM",
    type: "STEM",
    description: "Science, Technology, Engineering and Mathematics pathway.",
    displayOrder: 1,
  },
  {
    name: "Social Sciences",
    type: "SOCIAL_SCIENCES",
    description: "Languages, humanities and business-focused pathway.",
    displayOrder: 2,
  },
  {
    name: "Arts & Sports Science",
    type: "ARTS_SPORT_SCIENCE",
    description: "Creative arts, performance and sports science pathway.",
    displayOrder: 3,
  },
];

const DEPARTMENT_IMAGES = [
  {
    namePattern: "%Applied Science%",
    images: ["/departments/sciences.JPG"],
  },
  {
    namePattern: "%Languages%",
    images: [
      "/departments/languages.JPG",
      "/departments/languages 2.JPG",
    ],
  },
  {
    namePattern: "%Humanities%",
    images: [
      "/departments/humanities.JPG",
      "/departments/hunamities2.JPG",
    ],
  },
];

const hasColumn = async (connection, databaseName, columnName) => {
  const [rows] = await connection.execute(
    `SELECT COUNT(*) AS count
       FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'staff_departments'
        AND COLUMN_NAME = ?`,
    [databaseName, columnName]
  );
  return Number(rows[0]?.count || 0) > 0;
};

const migrateLeadership = async (connection, databaseName) => {
  if (!(await hasColumn(connection, databaseName, "pathwayHeadName"))) {
    await connection.query(
      "ALTER TABLE staff_departments ADD COLUMN pathwayHeadName VARCHAR(255) NULL AFTER headName"
    );
    console.log("Added staff_departments.pathwayHeadName");
  }

  if (await hasColumn(connection, databaseName, "assistantHeadName")) {
    await connection.query(`
      UPDATE staff_departments
         SET extra = JSON_SET(
           COALESCE(extra, JSON_OBJECT()),
           '$.legacyAssistantHeadName',
           assistantHeadName
         )
       WHERE assistantHeadName IS NOT NULL
         AND TRIM(assistantHeadName) <> ''
    `);
    await connection.query(
      "ALTER TABLE staff_departments DROP COLUMN assistantHeadName"
    );
    console.log("Archived and removed staff_departments.assistantHeadName");
  }

  await connection.query(
    "UPDATE staff_departments SET category = 'CBC' WHERE category = 'CBE'"
  );
  await connection.query(`
    UPDATE staff_departments
       SET pathwayHeadName = COALESCE(pathwayHeadName, headName),
           headName = NULL
     WHERE category = 'CBC'
  `);
};

const seedPathways = async (connection) => {
  for (const pathway of PATHWAYS) {
    await connection.execute(
      `INSERT INTO cbe_pathways
        (name, type, description, displayOrder, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, true, NOW(3), NOW(3))
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         description = VALUES(description),
         displayOrder = VALUES(displayOrder),
         isActive = true,
         updatedAt = NOW(3)`,
      [
        pathway.name,
        pathway.type,
        pathway.description,
        pathway.displayOrder,
      ]
    );
  }
  console.log("Seeded CBC pathways");
};

const attachDepartmentImages = async (connection) => {
  for (const mapping of DEPARTMENT_IMAGES) {
    const [departments] = await connection.execute(
      "SELECT id, name, image FROM staff_departments WHERE name LIKE ?",
      [mapping.namePattern]
    );

    for (const department of departments) {
      for (const [index, url] of mapping.images.entries()) {
        const [existingImages] = await connection.execute(
          `SELECT id
             FROM staff_department_images
            WHERE staffDepartmentId = ? AND url = ?
            LIMIT 1`,
          [department.id, url]
        );

        if (!existingImages.length) {
          await connection.execute(
            `INSERT INTO staff_department_images
              (staffDepartmentId, url, publicId, caption, altText, displayOrder, createdAt, updatedAt)
             VALUES (?, ?, NULL, ?, ?, ?, NOW(3), NOW(3))`,
            [
              department.id,
              url,
              `${department.name} image`,
              department.name,
              index,
            ]
          );
        }
      }

      if (!department.image && mapping.images[0]) {
        await connection.execute(
          "UPDATE staff_departments SET image = ? WHERE id = ?",
          [mapping.images[0], department.id]
        );
      }
    }
  }
  console.log("Attached matching local department images");
};

const main = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    const [[databaseRow]] = await connection.query(
      "SELECT DATABASE() AS databaseName"
    );
    const databaseName = databaseRow?.databaseName;
    if (!databaseName) throw new Error("Could not determine the active database");

    await connection.beginTransaction();
    await migrateLeadership(connection, databaseName);
    await seedPathways(connection);
    await attachDepartmentImages(connection);
    await connection.commit();
    console.log("Staff department migration completed");
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    await connection.end();
  }
};

main().catch((error) => {
  console.error("Staff department migration failed:", error);
  process.exitCode = 1;
});
