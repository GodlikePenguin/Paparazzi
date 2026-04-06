#!/usr/bin/env node
import { execSync } from "child_process";
import { writeFileSync, readFileSync } from "fs";
import { join } from "path";

const helpOutput = execSync("node ./bin/run --help", { encoding: "utf8" });
const readmePath = join(process.cwd(), "README.md");
const readme = readFileSync(readmePath, "utf8");

const newUsage = `## Usage:
\`\`\`
${helpOutput.trim()}
\`\`\``;

const updatedReadme = readme.replace(/## Usage:[\s\S]*?```\n[\s\S]*?```/, newUsage);

writeFileSync(readmePath, updatedReadme);
console.log("README.md updated with latest help text");
