const CPUInstructionsList = [
    {
        mnemonic : '',
        mask : 0xFFFF,
        pattern : 0x0000,
        operation : (opcode, cpu) => {

        }
    },
    {
        mnemonic : 'CLS',
        mask : 0xFFFF,
        pattern : 0x00E0,
        operation : (opcode, cpu) => {
            cpu._renderer.Clear()
        }
    },
    {
        mnemonic : 'RET',
        mask : 0xFFFF,
        pattern : 0x00EE,
        operation : (opcode, cpu) => {
            cpu.PC = cpu.Stack[cpu.SP]
            cpu.SP -= 1
        }
    },
    {
        mnemonic : 'JP addr',
        mask : 0xF000,
        pattern : 0x1000,
        operation : (opcode, cpu) => {
            cpu.PC = (opcode & 0x0FFF)
        }
    },
    {
        mnemonic : 'CALL addr',
        mask : 0xF000,
        pattern : 0x2000,
        operation : (opcode, cpu) => {
            cpu.SP += 1;
            cpu.Stack[cpu.SP] = cpu.PC;
            cpu.PC = (opcode & 0x0FFF)}
    },
    {
        mnemonic : 'SE Vx, byte',
        mask : 0xF000,
        pattern : 0x3000,
        operation : (opcode, cpu) => {
            let r = (opcode & 0x0F00) >> 8
            let value = opcode & 0x00FF

            let jump = (cpu.Registers[r] == value) ? 2 : 0
            cpu.PC += jump
        }
    },

    {
        mnemonic : 'SNE Vx, byte',
        mask : 0xF000,
        pattern : 0x4000,
        operation : (opcode, cpu) => {
            let r = (opcode & 0x0F00) >> 8
            let value = opcode & 0x00FF

            let jump = (cpu.Registers[r] != value) ? 2 : 0
            cpu.PC += jump
        }
    },



    {
        mnemonic : 'ADD',
        mask : 0xF00F,
        pattern : 0x8004,
        operation : (opcode, cpu) => {
            let x = (opcode & 0x0F00) >> 8;
            let y = (opcode & 0x00F0) >> 4;
            cpu.Registers[0xF] = ((cpu.Registers[x] + cpu.Registers[y]) > 255) ? 1 : 0
            cpu.Registers[x] += cpu.Registers[y];
        }
    }
]

export {CPUInstructionsList}
