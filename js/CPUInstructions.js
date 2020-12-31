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
        mnemonic : 'SE Vx, Vy',
        mask : 0xF00F,
        pattern : 0x5000,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            let vy = (opcode & 0x00F0) >> 4

            let jump = (cpu.Registers[vx] == cpu.Registers[vy]) ? 2 : 0
            cpu.PC += jump
        }
    },
    {
        mnemonic : 'LD Vx, byte',
        mask : 0xF000,
        pattern : 0x6000,
        operation : (opcode, cpu) => {
            let value = (opcode & 0x00FF)
            let r = (opcode & 0x0F00) >> 8

            cpu.Registers[r] = value;
        }
    },
    {
        mnemonic : 'ADD Vx, byte',
        mask : 0xF000,
        pattern : 0x7000,
        operation : (opcode, cpu) => {
            let value = (opcode & 0x00FF)
            let r = (opcode & 0x0F00) >> 8

            cpu.Registers[r] += value;
        }
    },
    {
        mnemonic : 'LD Vx, Vy',
        mask : 0xF00F,
        pattern : 0x8000,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            let vy = (opcode & 0x00F0) >> 4

            cpu.Registers[vx] = cpu.Registers[vy];
        }
    },
    {
        mnemonic : 'OR Vx, Vy',
        mask : 0xF00F,
        pattern : 0x8001,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            let vy = (opcode & 0x00F0) >> 4

            cpu.Registers[vx] = cpu.Registers[vx] | cpu.Registers[vy];
        }
    },
    {
        mnemonic : 'AND Vx, Vy',
        mask : 0xF00F,
        pattern : 0x8002,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            let vy = (opcode & 0x00F0) >> 4

            cpu.Registers[vx] = cpu.Registers[vx] & cpu.Registers[vy];
        }
    },
    {
        mnemonic : 'XOR Vx, Vy',
        mask : 0xF00F,
        pattern : 0x8003,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            let vy = (opcode & 0x00F0) >> 4

            cpu.Registers[vx] = cpu.Registers[vx] ^ cpu.Registers[vy];
        }
    },
    {
        mnemonic : 'ADD Vx, Vy',
        mask : 0xF00F,
        pattern : 0x8004,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8;
            let vy = (opcode & 0x00F0) >> 4;
            cpu.Registers[0xF] = ((cpu.Registers[vx] + cpu.Registers[vy]) > 255) ? 1 : 0
            cpu.Registers[vx] += cpu.Registers[vy];
        }
    },
    {
        mnemonic : 'SUB Vx, Vy',
        mask : 0xF00F,
        pattern : 0x8005,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8;
            let vy = (opcode & 0x00F0) >> 4;
            cpu.Registers[0xF] = (cpu.Registers[vx] > cpu.Registers[vy]) ? 1 : 0
            cpu.Registers[vx] -= cpu.Registers[vy];
        }
    },
    {
        mnemonic : 'SHR Vx {, Vy}',
        mask : 0xF00F,
        pattern : 0x8006,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8;
            cpu.Registers[0xF] = cpu.Registers[vx] & 0x01 // get least significant bit and set it to VF register
            cpu.Registers[vx] = cpu.Registers[vx] >> 1
        }
    },
    {
        mnemonic : 'SUB Vx, Vy',
        mask : 0xF00F,
        pattern : 0x8007,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8;
            let vy = (opcode & 0x00F0) >> 4;
            cpu.Registers[0xF] = (cpu.Registers[vy] > cpu.Registers[vx]) ? 1 : 0
            cpu.Registers[vx] = cpu.Registers[vy] - cpu.Registers[vx];
        }
    },
    {
        mnemonic : 'SHL Vx {, Vy}',
        mask : 0xF00F,
        pattern : 0x800E,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8;
            cpu.Registers[0xF] = (cpu.Registers[vx] & 0x80) >> 7 // get least significant bit and set it to VF register
            cpu.Registers[vx] = cpu.Registers[vx] << 1
        }
    },

]

export {CPUInstructionsList}
