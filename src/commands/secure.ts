import { Command } from "commander";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { getAIModel, MockAI } from "../core/ai.js";

export const secureCommand = new Command("secure")
    .description("Scan codebase for security vulnerabilities")
    .option("-m, --mode <mode>", "Scan mode: quick (Kimi K2.5) or full (Gemini 3 Pro)", "quick")
    .option("-t, --target <dir>", "Target directory to scan", ".")
    .action(async (options) => {
        const mode = options.mode === "full" ? "full" : "quick";
        const targetDir = path.resolve(process.cwd(), options.target);

        if (!fs.existsSync(targetDir)) {
            console.error(chalk.red(`Target directory not found: ${targetDir}`));
            return;
        }

        const aiModelName = mode === "full" ? "Gemini 3 Pro" : "Kimi K2.5";
        const spinner = ora(chalk.blue(`Initiating ${mode} security scan with ${aiModelName}...`)).start();

        try {
            const ai = getAIModel("secure"); // In reality, swap this based on mode
            const result = await (ai as MockAI).generate(`Security scan mode: ${mode} on directory: ${targetDir}`);

            spinner.succeed(chalk.green("Security scan completed!"));

            console.log(chalk.cyan("\nSecurity Report:"));
            console.log(chalk.gray(result));

            if (mode === "full") {
                const reportPath = path.join(process.cwd(), ".specflow", "security-report.md");
                await fs.ensureDir(path.dirname(reportPath));
                await fs.writeFile(reportPath, result);
                console.log(chalk.green(`\nReport saved to: ${reportPath}`));
            } else {
                console.log(chalk.yellow("\nNote: Use --mode full for comprehensive analysis."));
            }

        } catch (error) {
            console.error(chalk.red("Security scan failed:"), error);
            process.exit(1);
        }
    });
