import chalk from 'chalk'

/* eslint-disable no-console */
export class Logger {
    constructor(private readonly name: string) {}

    static log(message: string, meta = '') {
        console.log(chalk.cyan(`\nUniwind ${meta}- ${message}`))
    }

    static error(message: string, meta = '') {
        console.log(chalk.red(`\nUniwind Error ${meta}- ${message}`))
    }

    log(message: string) {
        Logger.log(message, `[${this.name} Processor] `)
    }

    error(message: string) {
        Logger.error(message, `[${this.name} Processor] `)
    }
}
