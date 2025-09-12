import { Color } from './color'
import { CSS } from './css'
import { Functions } from './functions'
import { MQ } from './mq'
import { RN } from './rn'
import { Units } from './units'
import { Var } from './var'

export class ProcessorBuilder {
    CSS = new CSS(this)
    RN = new RN(this)
    Var = new Var(this)
    MQ = new MQ(this)
    Color = new Color(this)
    Units = new Units(this)
    Functions = new Functions(this)
}

export const Processor = new ProcessorBuilder()
