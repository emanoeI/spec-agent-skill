const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { validateSkill } = require("./validate-skill");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "skill");
const outputDir = path.join(root, "dist", "spec");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

const failures = validateSkill(sourceDir);
if (failures.length > 0) {
  throw new Error(`Cannot pack an invalid skill:\n${failures.join("\n")}`);
}

fs.rmSync(outputDir, { recursive: true, force: true });
copyDirectory(sourceDir, outputDir);

const files = listFiles(outputDir)
  .filter((file) => file !== "manifest.json")
  .map((file) => ({ path: file, sha256: checksum(path.join(outputDir, file)) }));

const manifest = {
  name: "spec",
  version: packageJson.version,
  files
};

fs.writeFileSync(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Skill bundle created: ${outputDir} (${files.length} files)`);

function copyDirectory(source, destination) {
  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

function listFiles(directory, base = directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath, base) : path.relative(base, entryPath).replace(/\\/g, "/");
  }).sort();
}

function checksum(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}
