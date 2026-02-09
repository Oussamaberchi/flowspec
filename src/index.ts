#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import boxen from "boxen";
import { initCommand } from "./commands/init.js";
import { parseCommand } from "./commands/parse.js";
import { designCommand } from "./commands/design.js";
import { implementCommand } from "./commands/implement.js";
import { verifyCommand } from "./commands/verify.js";
import { secureCommand } from "./commands/secure.js";

const program = new Command();


console.log(
    boxen(chalk.blue.bold("SpecFlow CLI\n") + chalk.white("OpenCode Spec-Driven Development"), {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
    })
);

program
    .name("specflow")
    .description("Spec-Driven Development CLI for OpenCode Ecosystem")
    .version("0.1.0");

program.addCommand(initCommand);
program.addCommand(parseCommand);
program.addCommand(designCommand);
program.addCommand(implementCommand);
program.addCommand(verifyCommand);
program.addCommand(secureCommand);


program.command("dev")
    .description("Interactive development mode")
    .action(() => {
        console.log(chalk.yellow("Starting interactive dev mode... (Coming soon)"));
    });

program.parse(process.argv);
