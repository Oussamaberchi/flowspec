import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs-extra";
import path from "path";
import os from "os";

export const initCommand = new Command("init")
    .description("Initialize a new SpecFlow project")
    .argument("[name]", "Project name")
    .option("-f, --force", "Force initialization even if directory exists")
    .action(async (name, options) => {
        const cwd = process.cwd();
        const configPath = path.join(os.homedir(), ".specflow", "config.json");

        // Check global config
        if (!fs.existsSync(configPath)) {
            console.log(chalk.yellow("Global config not found. Creating default..."));
            await fs.ensureDir(path.dirname(configPath));
            await fs.writeJson(configPath, { theme: "default", aiModel: "gemini-3-pro" }, { spaces: 2 });
        }

        const projectRoot = name ? path.join(cwd, name) : cwd;
        const specDir = path.join(projectRoot, ".specflow");
        const currentSpec = path.join(specDir, "current");

        if (fs.existsSync(specDir) && !options.force) {
            console.log(chalk.red("SpecFlow project already initialized. Use --force to overwrite."));
            return;
        }

        // Interactive prompt if name not provided
        let projectName = name;
        if (!projectName) {
            const answers = await inquirer.prompt([
                {
                    type: "input",
                    name: "projectName",
                    message: "What is the name of your project?",
                    default: path.basename(cwd),
                },
                {
                    type: "list",
                    name: "complexity",
                    message: "Project complexity (for AI routing)?",
                    choices: ["Simple", "Medium", "Complex"],
                }
            ]);
            projectName = answers.projectName;
        }

        console.log(chalk.blue(`Initializing SpecFlow project: ${projectName}...`));

        try {
            await fs.ensureDir(currentSpec);

            // Create core spec files
            await fs.writeFile(path.join(currentSpec, "00-meta.md"), `# Project: ${projectName}\n\nMetadata...`);
            await fs.writeFile(path.join(currentSpec, "01-requirements.md"), `# Requirements (EARS Format)\n\nAdd your requirements here...`);
            await fs.writeFile(path.join(currentSpec, "02-design.md"), `# Design Specification\n\nDesign details...`);
            await fs.writeFile(path.join(currentSpec, "03-tasks.md"), `# Implementation Tasks\n\n- [ ] Task 1`);

            // setup active tracking
            // TODO: git init inside .specflow/current if needed, or just ensure .specflow is checked in.

            console.log(chalk.green("✔ Project initialized successfully!"));
            console.log(chalk.dim(`Active specs located in: ${currentSpec}`));
        } catch (error) {
            console.error(chalk.red("Error initializing project:"), error);
        }
    });
