import { Color } from './color'
import { CSS } from './css'
import { Functions } from './functions'
import { MQ } from './mq'
import { RN } from './rn'
import { Units } from './units'
import { Var } from './var'

export class ProcessorBuilder {
    stylesheets = {} as Record<string, Array<any>>
    vars = {} as Record<string, any>
    CSS = new CSS(this)
    RN = new RN(this)
    Var = new Var(this)
    MQ = new MQ(this)
    Color = new Color(this)
    Units = new Units(this)
    Functions = new Functions(this)
}
