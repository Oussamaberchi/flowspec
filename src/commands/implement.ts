import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { getAIModel, MockAI } from "../core/ai.js";

export const implementCommand = new Command("implement")
    .description("Generate implementation code from design specs")
    .option("-i, --input <file>", "Input design file", ".specflow/current/02-design.md")
    .option("-o, --output <dir>", "Output directory for implementation", "src")
    .action(async (options) => {
        const inputPath = path.resolve(process.cwd(), options.input);
        const outputDir = path.resolve(process.cwd(), options.output);

        if (!fs.existsSync(inputPath)) {
            console.error(chalk.red(`Design file not found: ${inputPath}`));
            return;
        }

        try {
            const designSpec = await fs.readFile(inputPath, "utf-8");
            if (!designSpec.trim()) {
                console.error(chalk.yellow("Design file is empty."));
                return;
            }

            const spinner = ora(chalk.blue("Routing implementation tasks (Smart Routing)...")).start();

            const ai = getAIModel("implement");
            const implementationPlan = await (ai as MockAI).generate(`Generate implementation code for: ${designSpec}`);

            spinner.succeed(chalk.green(`Implementation plan generated!`));

            console.log(chalk.cyan("\nImplementation Plan Preview:"));
            console.log(chalk.gray(implementationPlan));

            // In a real implementation, this would write files. For now, simulate it.
            await fs.ensureDir(outputDir);
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
            const dummyFile = path.join(outputDir, `impl-${timestamp}.ts`);

            await fs.writeFile(dummyFile, "// Generated implementation\n" + implementationPlan);
            console.log(chalk.green(`\nGenerated code in: ${dummyFile}`));

        } catch (error) {
            console.error(chalk.red("Error generating implementation:"), error);
            process.exit(1);
        }
    });
