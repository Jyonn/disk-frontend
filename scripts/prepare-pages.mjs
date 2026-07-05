import { copyFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outputDir = join(process.cwd(), "dist", "disk-frontend");
const indexPath = join(outputDir, "index.html");
const fallbackPath = join(outputDir, "404.html");
const noJekyllPath = join(outputDir, ".nojekyll");

await copyFile(indexPath, fallbackPath);
await writeFile(noJekyllPath, "", "utf8");

console.log("Prepared GitHub Pages artifact:");
console.log("- 404.html copied from index.html");
console.log("- .nojekyll created");
