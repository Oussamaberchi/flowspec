import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { getAIModel, MockAI } from "../core/ai.js";

export const verifyCommand = new Command("verify")
    .description("Verify implementation against requirements using semantic analysis")
    .option("-r, --reqs <file>", "Requirements file", ".specflow/current/01-requirements.md")
    .option("-i, --impl <dir>", "Implementation directory", "src")
    .action(async (options) => {
        const reqsPath = path.resolve(process.cwd(), options.reqs);
        const implDir = path.resolve(process.cwd(), options.impl);

        if (!fs.existsSync(reqsPath)) {
            console.error(chalk.red(`Requirements file not found: ${reqsPath}`));
            return;
        }

        if (!fs.existsSync(implDir)) {
            console.error(chalk.red(`Implementation directory not found: ${implDir}`));
            return;
        }

        try {
            const requirements = await fs.readFile(reqsPath, "utf-8");

            const spinner = ora(chalk.blue("Connecting to Minimax M2.1 (Verification)...")).start();

            const ai = getAIModel("verify");
            const verification = await (ai as MockAI).generate(`Verify code in ${implDir} against: ${requirements}`); // Simplified prompt

            spinner.succeed(chalk.green(`Verification complete!`));

            console.log(chalk.cyan("\nVerification Results:"));
            console.log(chalk.gray(verification));

            // Simulate output with detailed results
            const resultPath = path.resolve(process.cwd(), ".specflow", "current", "04-validation.md");
            await fs.ensureFile(resultPath);
            await fs.writeFile(resultPath, verification);
            console.log(chalk.green(`\nSaved report to: ${resultPath}`));

        } catch (error) {
            console.error(chalk.red("Error during verification:"), error);
            process.exit(1);
        }
    });
