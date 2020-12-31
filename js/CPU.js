import {CPUInstructionsList} from './CPUInstructions.js'

export class CPU {
    constructor () {
        this.Memory = new Uint8Array(4096)
        this.PC = 0x200 //Program counter, range 0x000 to 0x1FF is reserved
        this.Registers = new Uint8Array(16) // Chip 8 have 16  8bits registers (V0 to VF)
        this.I = 0 //16bit register used as memory address pointer
        this.Stack = new Uint16Array(16)
        this.SP = -1 //Stack pointer
        //Timer
        this.DT = 0 //Delay timer
        this.ST = 0 //Sound timer

        /** Devices **/
        this._renderer = null
        this._keyboard = null
    }
    //Setting devices ref like renderer, keyboard, audio etc...
    SetDevices(renderer, keyboard){
        this._renderer = renderer
        this._keyboard = keyboard
    }
    ExecuteOpcode (opcode) {
        this.PC += 2 // 16 bits jump

        //Find instruction in list according to opcode pattern
        let instruction = CPUInstructionsList.find( e =>  (opcode & e.mask) == e.pattern)

        //Execute instruction of finded opcode
        instruction.operation(opcode, this)
    }
}
