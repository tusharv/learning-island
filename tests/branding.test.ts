import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { inflateSync } from "node:zlib";
import {
  BRAND_ASSETS,
  BRAND_COLORS,
  BRAND_NAME,
  buildOpenGraphImage,
} from "../lib/branding.ts";

const PNG_SIGNATURE = "89504e470d0a1a0a";

function readPngInfo(path: string) {
  const buffer = readFileSync(path);
  assert.equal(buffer.subarray(0, 8).toString("hex"), PNG_SIGNATURE);
  assert.equal(buffer.subarray(12, 16).toString("ascii"), "IHDR");

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bitDepth: buffer[24],
    colorType: buffer[25],
    interlace: buffer[28],
    topLeftAlpha: readTopLeftAlpha(buffer),
  };
}

function readTopLeftAlpha(buffer: Buffer) {
  const idatChunks: Buffer[] = [];
  let offset = 8;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const dataStart = offset + 8;

    if (type === "IDAT") {
      idatChunks.push(buffer.subarray(dataStart, dataStart + length));
    }

    offset = dataStart + length + 4;
    if (type === "IEND") {
      break;
    }
  }

  const imageData = inflateSync(Buffer.concat(idatChunks));
  return imageData[4];
}

test("exposes the Learning Island logo assets for favicon, page logo, and Open Graph", () => {
  assert.equal(BRAND_NAME, "Learning Island");
  assert.equal(BRAND_ASSETS.logoPath, "/learning-island-logo.png");
  assert.equal(
    BRAND_ASSETS.landscapeLogoPath,
    "/learning-island-logo-landscape.png",
  );
  assert.equal(BRAND_ASSETS.markPath, "/learning-island-mark.png");
  assert.equal(BRAND_ASSETS.faviconPath, "/learning-island-mark.png");
  assert.equal(BRAND_ASSETS.openGraphPath, "/learning-island-logo-landscape.png");

  assert.deepEqual(buildOpenGraphImage(), {
    url: "/learning-island-logo-landscape.png",
    width: 1800,
    height: 620,
    alt: "Learning Island logo",
  });
});

test("uses the textless mark for the visible app chrome logo", () => {
  const appChromeSource = readFileSync("components/AppChrome.tsx", "utf8");

  assert.match(appChromeSource, /src=\{BRAND_ASSETS\.markPath\}/);
  assert.doesNotMatch(appChromeSource, /src=\{BRAND_ASSETS\.logoPath\}/);
});

test("defines a refreshing kid-friendly color palette for the app", () => {
  assert.deepEqual(BRAND_COLORS, {
    ocean: "#0ea5e9",
    deepOcean: "#0757b4",
    palm: "#52b51f",
    sunshine: "#ffc928",
    coral: "#ff5a44",
    warmPanel: "#fffdf0",
  });
});

test("uses real transparent PNG logo assets", () => {
  const logo = readPngInfo("public/learning-island-logo.png");
  assert.equal(logo.width, 1254);
  assert.equal(logo.height, 1254);
  assert.equal(logo.bitDepth, 8);
  assert.equal(logo.colorType, 6);
  assert.equal(logo.interlace, 0);
  assert.equal(logo.topLeftAlpha, 0);

  const appIcon = readPngInfo("app/icon.png");
  assert.equal(appIcon.width, 1024);
  assert.equal(appIcon.height, 1024);
  assert.equal(appIcon.bitDepth, 8);
  assert.equal(appIcon.colorType, 6);
  assert.equal(appIcon.interlace, 0);
  assert.equal(appIcon.topLeftAlpha, 0);
});

test("provides transparent landscape and mark logo variants", () => {
  const landscape = readPngInfo("public/learning-island-logo-landscape.png");
  assert.equal(landscape.width, 1800);
  assert.equal(landscape.height, 620);
  assert.equal(landscape.bitDepth, 8);
  assert.equal(landscape.colorType, 6);
  assert.equal(landscape.interlace, 0);
  assert.equal(landscape.topLeftAlpha, 0);

  const mark = readPngInfo("public/learning-island-mark.png");
  assert.equal(mark.width, 1024);
  assert.equal(mark.height, 1024);
  assert.equal(mark.bitDepth, 8);
  assert.equal(mark.colorType, 6);
  assert.equal(mark.interlace, 0);
  assert.equal(mark.topLeftAlpha, 0);
});
