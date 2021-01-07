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
    {
        mnemonic : 'SNE Vx, Vy',
        mask : 0xF00F,
        pattern : 0x9000,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            let vy = (opcode & 0x00F0) >> 4

            let jump = (cpu.Registers[vx] != cpu.Registers[vy]) ? 2 : 0
            cpu.PC += jump
        }
    },
    {
        mnemonic : 'LD I, nnn',
        mask : 0xF000,
        pattern : 0xA000,
        operation : (opcode, cpu) => {
            cpu.I = opcode & 0x0FFF
        }
    },
    {
        mnemonic : 'JP V0, addr',
        mask : 0xF000,
        pattern : 0xB000,
        operation : (opcode, cpu) => {
            cpu.PC = (opcode & 0x0FFF) + cpu.Registers[0]
        }
    },
    {
        mnemonic : 'RND Vx, byte',
        mask : 0xF000,
        pattern : 0xC000,
        operation : (opcode, cpu) => {
            let mask = (opcode & 0x00FF)
            let vx = (opcode & 0x0F00) >> 8
            cpu.Registers[vx] = (Math.random() * 0xFF) & mask
        }
    },
    {
        mnemonic : 'DRW Vx, Vy, nibble',
        mask : 0xF000,
        pattern : 0xD000,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            let vy = (opcode & 0x00F0) >> 4

            let x = cpu.Registers[vx]
            let y = cpu.Registers[vy]
            cpu.Registers[0xF] = 0

            let nBytes = (opcode & 0x000F)

            let pointer = cpu.I

            for (let i = 0; i < nBytes; i++) {

                let data = cpu._memory[pointer + i]

                for (let j = 0; j < 8; j++) {

                    let value = (data >> (7-j)) & 0x1

                    if(value != 0){
                        let xor = cpu._renderer.SetPixel(x + j, y + i);

                        if(xor == 1) cpu.Registers[0xF] = 1;
                    }

                }
            }
        }
    },
    {
        mnemonic : 'Ex9E - SKP Vx',
        mask : 0xF0FF,
        pattern : 0xE09E,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8

            let jump = (cpu.Registers[vx] == cpu._keyboard.GetKey()) ? 2 : 0
            cpu.PC += jump

        }
    },
    {
        mnemonic : 'ExA1 - SKNP Vx',
        mask : 0xF0FF,
        pattern : 0xE0A1,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8

            let jump = (cpu.Registers[vx] != cpu._keyboard.GetKey()) ? 2 : 0
            cpu.PC += jump

        }
    },
    {
        mnemonic : 'Fx07 - LD Vx, DT',
        mask : 0xF0FF,
        pattern : 0xF007,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            cpu.Registers[vx] = cpu.DT
        }
    },
    {
        mnemonic : 'Fx0A - LD Vx, K',
        mask : 0xF0FF,
        pattern : 0xF00A,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            let k = cpu._keyboard.GetKey()

            if(k != 0) {
                cpu.Registers[vx] = k;
            }else {
                cpu.Registers[vx] = 0
                cpu.PC -= 2
            }
        }
    },
    {
        mnemonic : 'Fx15 - LD DT, Vx',
        mask : 0xF0FF,
        pattern : 0xF015,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            cpu.DT = cpu.Registers[vx]
        }
    },
    {
        mnemonic : 'Fx18 - LD ST, Vx',
        mask : 0xF0FF,
        pattern : 0xF018,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            cpu.ST = cpu.Registers[vx]
        }
    },
    {
        mnemonic : 'Fx1E - ADD I, Vx',
        mask : 0xF0FF,
        pattern : 0xF01E,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            cpu.I += cpu.Registers[vx]
        }
    },
    {
        mnemonic : 'Fx29 - LD F, Vx',
        mask : 0xF0FF,
        pattern : 0xF029,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8
            cpu.I = cpu.Registers[vx] * 5
        }
    },
    {
        mnemonic : 'Fx33 - LD B, Vx',
        mask : 0xF0FF,
        pattern : 0xF033,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8

            cpu._memory[cpu.I] = parseInt(cpu.Registers[vx] / 100);

            cpu._memory[cpu.I+1] = parseInt((cpu.Registers[vx] % 100) / 10);

            cpu._memory[cpu.I+2] = parseInt(cpu.Registers[vx] % 10);
        }
    },
    {
        mnemonic : 'Fx55 - LD [I], Vx',
        mask : 0xF0FF,
        pattern : 0xF055,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8

            for (let i = 0; i <= vx; i++) {
                cpu._memory[cpu.I] = cpu.Registers[i]
                cpu.I++
            }
        }
    },
    {
        mnemonic : 'Fx65 - LD Vx, [I]',
        mask : 0xF0FF,
        pattern : 0xF065,
        operation : (opcode, cpu) => {
            let vx = (opcode & 0x0F00) >> 8

            for (let i = 0; i <= vx; i++) {
                cpu.Registers[i] = cpu._memory[cpu.I]
                cpu.I++
            }
        }
    },




]

export {CPUInstructionsList}
