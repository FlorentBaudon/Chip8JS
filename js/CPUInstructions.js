const CPUInstructionsList = [
    {
        mnemonic : 'JUMP',
        mask : 0xF000,
        pattern : 0x1000,
        operation : (opcode, cpu) => { cpu.PC = (opcode & 0x0FFF); return;}
    },

    {
        mnemonic : 'ADD',
        mask : 0xF00F,
        pattern : 0x8004,
        operation : (opcode, cpu) => {let x = (opcode & 0x0F00) >> 8; let y = (opcode & 0x00F0) >> 4; return (x+y);} //implementation not correct, just for testing now
    }
]

export CPUInstructionsList
