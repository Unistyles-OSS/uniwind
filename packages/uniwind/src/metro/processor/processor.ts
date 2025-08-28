import { Color } from './color'
import { CSS } from './css'
import { MQ } from './mq'
import { RN } from './rn'
import { Shadow } from './shadow'
import { Units } from './units'
import { Var } from './var'

export class ProcessorBuilder {
    CSS = new CSS(this)
    RN = new RN(this)
    Shadow = new Shadow(this)
    Var = new Var(this)
    MQ = new MQ(this)
    Color = new Color(this)
    Units = new Units(this)
}

export const Processor = new ProcessorBuilder()
