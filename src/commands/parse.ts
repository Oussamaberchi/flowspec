import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { parseEARS } from "../core/ears.js";

export const parseCommand = new Command("parse")
    .description("Parse and validate requirement specs (EARS format)")
    .option("-i, --input <file>", "Input file path (default: .specflow/current/01-requirements.md)")
    .action(async (options) => {
        const inputPath = options.input || path.join(process.cwd(), ".specflow", "current", "01-requirements.md");

        if (!fs.existsSync(inputPath)) {
            console.error(chalk.red(`Input file not found: ${inputPath}`));
            return;
        }

        try {
            const content = await fs.readFile(inputPath, "utf-8");
            const lines = content.split("\n");
            let errorCount = 0;

            console.log(chalk.blue(`Parsing: ${inputPath}...\n`));

            lines.forEach((line, index) => {
                const result = parseEARS(line);
                if (!result.valid) {
                    console.group(chalk.yellow(`Warning at line ${index + 1}:`));
                    console.log(chalk.dim(`"${line.trim()}"`));
                    result.errors.forEach(err => console.log(chalk.red(`Error: ${err}`)));
                    result.suggestions.forEach(sugg => console.log(chalk.cyan(`Suggestion: ${sugg}`)));
                    console.groupEnd();
                    errorCount++;
                }
            });

            if (errorCount === 0) {
                console.log(chalk.green("✔ All requirements are valid EARS format."));
            } else {
                console.log(chalk.bold.red(`\nFound ${errorCount} issue(s) in requirements.`));
            }
        } catch (err) {
            console.error(chalk.red("Error reading/parsing file:"), err);
        }
    });
