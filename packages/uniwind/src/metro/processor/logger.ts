import chalk from 'chalk'

/* eslint-disable no-console */
export class Logger {
    constructor(private readonly name: string) {}

    log(message: string) {
        console.log(chalk.cyan(`\nUniwind [${this.name} Processor] - ${message}`))
    }

    error(message: string) {
        console.log(chalk.red(`\nUniwind [${this.name} Processor] Error - ${message}`))
    }
}
