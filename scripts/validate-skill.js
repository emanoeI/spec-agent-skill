const fs = require("fs");
const path = require("path");

if (require.main === module) {
  const skillDir = path.resolve(process.argv[2] || path.join(__dirname, "..", "skill"));
  const failures = validateSkill(skillDir);

  if (failures.length > 0) {
    console.error("Skill validation failed:\n");
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log(`Skill validation passed: ${skillDir}`);
}

function validateSkill(directory) {
  const errors = [];
  const skillPath = path.join(directory, "SKILL.md");

  if (!fs.existsSync(skillPath)) {
    return ["Missing SKILL.md."];
  }

  const skill = normalize(fs.readFileSync(skillPath, "utf8"));
  const frontmatter = parseFrontmatter(skill, errors);

  validateMetadata(frontmatter, errors);
  validateBody(skill, directory, errors);
  validateOpenAiMetadata(directory, errors);

  return errors;
}

function parseFrontmatter(content, errors) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) {
    errors.push("SKILL.md must begin with YAML frontmatter.");
    return {};
  }

  const metadata = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 1) {
      errors.push(`Invalid frontmatter line: ${line}`);
      continue;
    }
    const key = line.slice(0, separator).trim();
    metadata[key] = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
  }
  return metadata;
}

function validateMetadata(metadata, errors) {
  const allowedFields = new Set(["name", "description", "metadata"]);
  for (const key of Object.keys(metadata)) {
    if (!allowedFields.has(key)) {
      errors.push(`Unsupported frontmatter field: ${key}`);
    }
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.name || "")) {
    errors.push("Skill name must use lowercase kebab-case.");
  }
  if ((metadata.name || "").length > 64) {
    errors.push("Skill name must not exceed 64 characters.");
  }
  if (!metadata.description || metadata.description.length < 20) {
    errors.push("Skill description must explain what the skill does and when to use it.");
  }
}

function validateBody(content, directory, errors) {
  if (content.split("\n").length > 500) {
    errors.push("SKILL.md must stay under 500 lines; move conditional detail to supporting files.");
  }
  if (/\b(?:TODO|TBD|FIXME)\b|\[Add (?:instructions|examples|guidelines)/i.test(content)) {
    errors.push("SKILL.md contains unfinished placeholders.");
  }

  const links = [...content.matchAll(/\]\((\.\.?\/[^)#]+)(?:#[^)]+)?\)/g)].map((match) => match[1]);
  for (const link of links) {
    const target = path.resolve(directory, link);
    if (!fs.existsSync(target)) {
      errors.push(`Broken local reference: ${link}`);
    }
  }
}

function validateOpenAiMetadata(directory, errors) {
  const metadataPath = path.join(directory, "agents", "openai.yaml");
  if (!fs.existsSync(metadataPath)) {
    return;
  }

  const metadata = fs.readFileSync(metadataPath, "utf8");
  for (const field of ["display_name", "short_description", "default_prompt"]) {
    if (!new RegExp(`^\\s*${field}:\\s*.+$`, "m").test(metadata)) {
      errors.push(`agents/openai.yaml is missing ${field}.`);
    }
  }
}

function normalize(text) {
  return text.replace(/\r\n/g, "\n");
}

module.exports = { validateSkill };
