import chalk from 'chalk'
import { generateCSSForInsets } from './insets'
import { generateCSSForVariants } from './variants'

const variants = generateCSSForVariants()
const insets = generateCSSForInsets()
const uniwindCSS = Bun.file('uniwind.css')

uniwindCSS.write([
    variants,
    insets,
].join('\n'))

// eslint-disable-next-line no-console
console.log(chalk.green('CSS generated successfully'))
