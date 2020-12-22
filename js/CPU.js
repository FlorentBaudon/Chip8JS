export class CPU {
    constructor () {
        this.Memory = new Uint8Array(4096)
        this.PC = 0x200 //Program counter, range 0x000 to 0x1FF is reserved
        this.Register = new Uint8Array(16) // Chip 8 have 16  8bits registers (V0 to VF)
        this.I = 0 //16bit register used as memory address pointer
        this.Stack = new Uint16Array(16)
        this.SP = -1 //Stack pointer
        //Timer
        this.DT = 0 //Delay timer
        this.ST = 0 //Sound timer
    }

    ExecuteOpcode (opcode) {
        this.PC += 2 // 16 bits jump

        switch (opcode & 0xF000) {
            case 0x1000:
                this.PC = (opcode & 0x0FFF);
                return;
                break;
            default:

        }

        let x = (opcode & 0x0F00) >> 8
        let y = (opcode & 0x00F0) >> 4

        switch (opcode & 0xF00F) {

            case 0x8004:
                return (x+y);
                break;
            default:

        }
    }
}

// module.exports = CPU
