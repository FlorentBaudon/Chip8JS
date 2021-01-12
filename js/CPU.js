import {CPUInstructionsList} from './CPUInstructions.js'

export class CPU {
    constructor (debug = false) {
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
        this._memory = null

        this._bDebug = debug
    }
    //Setting devices ref like renderer, keyboard, audio etc...
    SetDevices(renderer, keyboard, memory){
        this._renderer = renderer
        this._keyboard = keyboard
        this._memory = memory
    }

    GetOpcodeDetail(opcode) {
        let instruction = CPUInstructionsList.find( e =>  (opcode & e.mask) == e.pattern)

        console.log("addr: " + (this.PC-0x200).toString(16) + " - "+ opcode.toString(16) + " - " + instruction.mnemonic);
    }

    ExecuteOpcode (opcode) {
        this.PC += 2 // 16 bits jump

        //Find instruction in list according to opcode pattern
        let instruction = CPUInstructionsList.find( e =>  (opcode & e.mask) == e.pattern)
        //Execute instruction of finded opcode
        instruction.operation(opcode, this)
    }

    Cycle()
    {
        //Update delay timer
        if(this.DT > 0) this.DT -= 1;
        if(this.ST > 0) this.ST -= 1;

        //Read current instrucitons in memory
        let opcode = (this._memory[this.PC] << 8) | this._memory[this.PC+1]

        //Log opcode details
        if(this._bDebug)
            this.GetOpcodeDetail(opcode)

        //Execute the instructions (Program Counter will be incremented by 2)
        this.ExecuteOpcode(opcode)

    }
}
