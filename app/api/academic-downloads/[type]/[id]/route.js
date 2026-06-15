import archiver from "archiver";
import { Readable, PassThrough } from "stream";
import { NextResponse } from "next/server";
import { prisma } from "../../../../../libs/prisma";
import { normalizeDownloadFile } from "../../../../../libs/displayNames";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SUPPORTED_TYPES = new Set(["assignment", "resource"]);

const sanitizeFileName = (value, fallback) => {
  const sanitized = String(value || fallback)
    .replace(/[\u0000-\u001f<>:"/\\|?*]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/^\.+/, "")
    .trim();

  return (sanitized || fallback).slice(0, 180);
};

const createUniqueFileName = (name, usedNames, fallback) => {
  const safeName = sanitizeFileName(name, fallback);
  const extensionIndex = safeName.lastIndexOf(".");
  const hasExtension = extensionIndex > 0;
  const baseName = hasExtension ? safeName.slice(0, extensionIndex) : safeName;
  const extension = hasExtension ? safeName.slice(extensionIndex) : "";

  let uniqueName = safeName;
  let suffix = 2;
  while (usedNames.has(uniqueName.toLowerCase())) {
    uniqueName = `${baseName} (${suffix})${extension}`;
    suffix += 1;
  }

  usedNames.add(uniqueName.toLowerCase());
  return uniqueName;
};

const getDownloadFiles = (record, type) => {
  const rawFiles =
    type === "assignment"
      ? [
          ...(Array.isArray(record.assignmentFiles)
            ? record.assignmentFiles
            : []),
          ...(Array.isArray(record.attachments) ? record.attachments : []),
        ]
      : Array.isArray(record.files)
        ? record.files
        : [];

  return rawFiles
    .map((file, index) =>
      normalizeDownloadFile(
        file,
        `${type === "assignment" ? "assignment" : "resource"}-file-${index + 1}`
      )
    )
    .filter((file) => file?.url);
};

const findRecord = async (type, id) => {
  if (type === "assignment") {
    return prisma.assignment.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        assignmentFiles: true,
        attachments: true,
      },
    });
  }

  return prisma.resource.findFirst({
    where: { id, isActive: true },
    select: {
      id: true,
      title: true,
      files: true,
    },
  });
};

export async function GET(request, { params }) {
  const type = String(params.type || "").toLowerCase();
  const id = Number.parseInt(params.id, 10);

  if (!SUPPORTED_TYPES.has(type) || !Number.isInteger(id) || id <= 0) {
    return NextResponse.json(
      { success: false, error: "A valid download type and record ID are required" },
      { status: 400 }
    );
  }

  const record = await findRecord(type, id);
  if (!record) {
    return NextResponse.json(
      { success: false, error: `${type} not found` },
      { status: 404 }
    );
  }

  const files = getDownloadFiles(record, type);
  if (!files.length) {
    return NextResponse.json(
      { success: false, error: "No files are attached to this item" },
      { status: 404 }
    );
  }

  const archiveName = sanitizeFileName(
    `${record.title || type}-${type}-files.zip`,
    `${type}-files.zip`
  );
  const headerFileName = archiveName.replace(/[^\x20-\x7e]/g, "-");
  const output = new PassThrough();
  const archive = archiver("zip", { zlib: { level: 6 } });

  archive.on("warning", (error) => {
    console.warn(`Academic ${type} archive warning:`, error);
  });
  archive.on("error", (error) => {
    console.error(`Academic ${type} archive error:`, error);
    output.destroy(error);
  });
  archive.pipe(output);

  void (async () => {
    const usedNames = new Set();
    const unavailableFiles = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const fallbackName = `${type}-file-${index + 1}`;
      const fileName = createUniqueFileName(
        file.name,
        usedNames,
        fallbackName
      );

      try {
        const fileUrl = new URL(file.url, request.url);
        if (!["http:", "https:"].includes(fileUrl.protocol)) {
          throw new Error("Unsupported file URL");
        }

        const response = await fetch(fileUrl, { cache: "no-store" });
        if (!response.ok || !response.body) {
          throw new Error(`File request failed with status ${response.status}`);
        }

        archive.append(Readable.fromWeb(response.body), { name: fileName });
      } catch (error) {
        console.error(`Unable to add ${fileName} to academic archive:`, error);
        unavailableFiles.push(fileName);
      }
    }

    if (unavailableFiles.length) {
      archive.append(
        [
          "The following files could not be downloaded:",
          "",
          ...unavailableFiles.map((name) => `- ${name}`),
        ].join("\n"),
        { name: "download-errors.txt" }
      );
    }

    await archive.finalize();
  })().catch((error) => {
    console.error(`Failed to finalize academic ${type} archive:`, error);
    archive.abort();
    output.destroy(error);
  });

  return new Response(Readable.toWeb(output), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${headerFileName}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
