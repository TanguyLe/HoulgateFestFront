// Fails the build when the files sent to a phone grow past their budget (gzipped sizes, as
// transferred): the JS bundle, the stylesheet and the font.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const web = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "web");
const KIB = 1024;
const BUDGETS = [
    { file: "houlgatefest.min.js", max: 300 * KIB, gzip: true },
    { file: "houlgatefest.min.css", max: 50 * KIB, gzip: true },
    // already compressed
    { file: "static/fonts/google-sans-flex-latin-wght.woff2", max: 60 * KIB, gzip: false },
];

let failed = false;
for (const { file, max, gzip } of BUDGETS) {
    const content = fs.readFileSync(path.join(web, file));
    const size = gzip ? zlib.gzipSync(content, { level: 9 }).length : content.length;
    const ok = size <= max;
    failed ||= !ok;
    console.log(
        `${ok ? "ok  " : "OVER"} ${file}: ${(size / KIB).toFixed(1)} KiB (budget ${max / KIB} KiB)`,
    );
}

if (failed) process.exit(1);
