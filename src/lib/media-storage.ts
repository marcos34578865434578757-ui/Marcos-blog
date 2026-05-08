import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { slugify } from "@/lib/content-admin";

export type UploadKind = "posts" | "projects" | "shared";
export type UploadTarget = "cover" | "content";

const acceptedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
  "image/bmp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/apng",
]);

const acceptedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
  ".bmp",
  ".ico",
  ".apng",
]);

const rejectedExtensions = new Set([".psd", ".heic", ".heif", ".tif", ".tiff"]);

const localUploadsDirectory = path.join(process.cwd(), ".uploads");
const legacyPublicUploadsDirectory = path.join(process.cwd(), "public", "uploads");
const netlifyBlobStoreName = "blog-media";

const mimeByExtension: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".bmp": "image/bmp",
  ".ico": "image/x-icon",
  ".apng": "image/apng",
};

function getBlobStore() {
  return getStore({ name: netlifyBlobStoreName, consistency: "strong" });
}

function isNetlifyRuntime() {
  return process.env.NETLIFY === "true";
}

function inferContentType(fileName: string, fallback?: string) {
  const extension = path.extname(fileName).toLowerCase();
  return mimeByExtension[extension] ?? fallback ?? "application/octet-stream";
}

export function isBrowserDisplayableImage(file: File) {
  const extension = path.extname(file.name).toLowerCase();

  if (rejectedExtensions.has(extension)) {
    return false;
  }

  if (acceptedExtensions.has(extension)) {
    return true;
  }

  return acceptedMimeTypes.has(file.type);
}

export function buildMediaKey(kind: UploadKind, fileName: string) {
  return `${kind}/${fileName}`;
}

export function buildMediaUrl(key: string) {
  return `/media/${key}`;
}

export function normalizeLegacyMediaPath(value: string) {
  return value.replace(/\/uploads\/(posts|projects|shared)\//g, "/media/$1/");
}

export function normalizeLegacyMediaContent(content: string) {
  return content.replace(/\/uploads\/(posts|projects|shared)\//g, "/media/$1/");
}

async function saveToLocalStore(key: string, bytes: Buffer) {
  const outputPath = path.join(localUploadsDirectory, key);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, bytes);
}

async function saveToBlobStore(key: string, bytes: Buffer, contentType: string) {
  const store = getBlobStore();
  const arrayBuffer = Uint8Array.from(bytes).buffer;

  await store.set(key, arrayBuffer, {
    metadata: {
      contentType,
      uploadedAt: new Date().toISOString(),
    },
  });
}

async function importLegacyPublicUpload(key: string) {
  const legacyPath = path.join(legacyPublicUploadsDirectory, key);

  try {
    const bytes = await fs.readFile(legacyPath);
    const contentType = inferContentType(legacyPath);

    if (isNetlifyRuntime()) {
      await saveToBlobStore(key, bytes, contentType);
    } else {
      await saveToLocalStore(key, bytes);
    }

    return true;
  } catch {
    return false;
  }
}

async function readFromLocalStore(key: string) {
  const filePath = path.join(localUploadsDirectory, key);

  try {
    const bytes = await fs.readFile(filePath);
    return {
      bytes,
      contentType: inferContentType(filePath),
    };
  } catch {
    return null;
  }
}

async function readFromBlobStore(key: string) {
  const store = getBlobStore();
  const [bytes, metadata] = await Promise.all([
    store.get(key, { type: "arrayBuffer" }),
    store.getMetadata(key),
  ]);

  if (!bytes) {
    return null;
  }

  return {
    bytes: Buffer.from(bytes),
    contentType:
      typeof metadata?.metadata?.contentType === "string"
        ? metadata.metadata.contentType
        : inferContentType(key),
  };
}

export async function saveImage(kind: UploadKind, file: File) {
  const extension = path.extname(file.name) || ".png";
  const safeBaseName = slugify(path.basename(file.name, extension)) || "image";
  const fileName = `${Date.now()}-${safeBaseName}-${randomUUID().slice(0, 8)}${extension.toLowerCase()}`;
  const key = buildMediaKey(kind, fileName);
  const bytes = Buffer.from(await file.arrayBuffer());
  const contentType = inferContentType(file.name, file.type);

  if (isNetlifyRuntime()) {
    await saveToBlobStore(key, bytes, contentType);
  } else {
    await saveToLocalStore(key, bytes);
  }

  return {
    key,
    fileName,
    url: buildMediaUrl(key),
    markdown: `![image](${buildMediaUrl(key)})`,
    contentType,
  };
}

export async function readImage(key: string) {
  const normalizedKey = key.replace(/^\/+/, "");

  const primary = isNetlifyRuntime()
    ? await readFromBlobStore(normalizedKey)
    : await readFromLocalStore(normalizedKey);

  if (primary) {
    return primary;
  }

  const imported = await importLegacyPublicUpload(normalizedKey);
  if (!imported) {
    return null;
  }

  return isNetlifyRuntime()
    ? readFromBlobStore(normalizedKey)
    : readFromLocalStore(normalizedKey);
}
