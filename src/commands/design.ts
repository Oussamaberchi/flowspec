import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { getAIModel, MockAI } from "../core/ai.js";

export const designCommand = new Command("design")
    .description("Generate design specs from requirements using AI")
    .option("-i, --input <file>", "Input requirements file", ".specflow/current/01-requirements.md")
    .option("-o, --output <file>", "Output design file", ".specflow/current/02-design.md")
    .action(async (options) => {
        const inputPath = path.resolve(process.cwd(), options.input);
        const outputPath = path.resolve(process.cwd(), options.output);

        if (!fs.existsSync(inputPath)) {
            console.error(chalk.red(`Requirements file not found: ${inputPath}`));
            return;
        }

        try {
            const requirements = await fs.readFile(inputPath, "utf-8");
            if (!requirements.trim()) {
                console.error(chalk.yellow("Requirements file is empty."));
                return;
            }

            const spinner = ora(chalk.blue("Routing to Kimi K2.5 (Design Expert)...")).start();

            const ai = getAIModel("design");
            const designSpec = await (ai as MockAI).generate(`Generate technical design for: ${requirements}`); // Assume mock for now

            spinner.succeed(chalk.green(`Design generated successfully!`));

            console.log(chalk.cyan("\nPreview:"));
            console.log(chalk.gray(designSpec));

            await fs.writeFile(outputPath, designSpec);
            console.log(chalk.green(`\nSaved to: ${outputPath}`));

        } catch (error) {
            console.error(chalk.red("Error generating design:"), error);
        }
    });
