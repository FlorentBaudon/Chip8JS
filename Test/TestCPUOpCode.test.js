// const CPU = require('./js/CPU.js');
import {CPU} from "../js/CPU.js"
import {Renderer} from '../js/Renderer.js'
import {Keyboard} from '../js/Keyboard.js'

var cpu = new CPU();
var renderer = new Renderer(10, true)
var keyboard = new Keyboard();
var memory = new Uint8Array(4096)

cpu.SetDevices(renderer, keyboard, memory)

test("00E0 - CLS - Clear the display", () => {
    renderer.TestRender()
    cpu.ExecuteOpcode(0x00E0)
    renderer.display.forEach((item) => {
        expect(item).toBe(0);
    });
})

test("00EE - RET - Return from a subroutine", () => {
    cpu.SP = 2;
    cpu.Stack = [0x0082, 0x0528, 0x0F11]

    cpu.ExecuteOpcode(0x00EE)

    expect(cpu.PC).toBe(0x0F11)
    expect(cpu.SP).toBe(1)
})

test("1nnn - JP - The interpreter sets the program counter to nnn", () => {
    cpu.ExecuteOpcode(0x1222)
    expect(cpu.PC).toBe(0x222)
})

test("2nnn - CALL - Call subroutine at nnn", () => {
    cpu.PC = 0x203
    cpu.SP = 2;
    cpu.Stack = [0x0082, 0x0528, 0x0F11]

    cpu.ExecuteOpcode(0x2AF2)

    expect(cpu.PC).toBe(0xAF2)
    expect(cpu.SP).toBe(3)
    expect(cpu.Stack[cpu.SP]).toBe(0x203 + 2) //PC increment by two when executing instruction
})

test("3xkk - SE Vx, byte - Skip next instruction if Vx = kk", () => {
    //If value is equal we skip next instruction
    cpu.PC = 0x200
    cpu.Registers[0x1] = 0x33

    cpu.ExecuteOpcode(0x3133)

    expect(cpu.PC).toBe(0x204)

    //If value is not equal we don't skip next instruction
    cpu.PC = 0x200
    cpu.Registers[0x1] = 0x33

    cpu.ExecuteOpcode(0x3131)

    expect(cpu.PC).toBe(0x202)
})

test("4xkk - SNE Vx, byte - Skip next instruction if Vx != kk", () => {
    //If value is equal we don't skip next instruction
    cpu.PC = 0x200
    cpu.Registers[0x1] = 0x33

    cpu.ExecuteOpcode(0x4133)

    expect(cpu.PC).toBe(0x202)

    //If value is not equal we skip next instruction
    cpu.PC = 0x200
    cpu.Registers[0x1] = 0x33

    cpu.ExecuteOpcode(0x4131)

    expect(cpu.PC).toBe(0x204)
})

test("5xy0 - SE Vx, Vy - Skip next instruction if Vx = Vy", () => {
    //If value is equal we don't skip next instruction
    cpu.PC = 0x200
    cpu.Registers[0x1] = 0x33
    cpu.Registers[0xA] = 0x33

    cpu.ExecuteOpcode(0x51A0)

    expect(cpu.PC).toBe(0x204)

    //If value is not equal we skip next instruction
    cpu.PC = 0x200
    cpu.Registers[0x3] = 0x31
    cpu.Registers[0xA] = 0x33

    cpu.ExecuteOpcode(0x53A0)

    expect(cpu.PC).toBe(0x202)
})

test("6xkk - LD Vx, byte - Set Vx = kk", () => {
    cpu.Registers[0xA] = 0x12

    cpu.ExecuteOpcode(0x6AFE)

    expect(cpu.Registers[0xA]).toBe(0xFE)
})

test("7xkk - ADD Vx, byte - Set Vx = Vx + kk", () => {
    cpu.Registers[0xB] = 0x12

    cpu.ExecuteOpcode(0x7B33)

    expect(cpu.Registers[0xB]).toBe(0x12 + 0x33)
})

test("8xy0 - LD Vx, Vy - Set Vx = Vy.", () => {
    cpu.Registers[0xB] = 0x12
    cpu.Registers[0x5] = 0x66

    cpu.ExecuteOpcode(0x8B50)

    expect(cpu.Registers[0xB]).toBe(0x66)
})

test("8xy1 - OR Vx, Vy - Set Vx = Vx OR Vy", () => {
    cpu.Registers[0x4] = 0b1010
    cpu.Registers[0x5] = 0b1100

    cpu.ExecuteOpcode(0x8451)

    expect(cpu.Registers[0x4]).toBe(0b1110)
})

test("8xy2 - AND Vx, Vy - Set Vx = Vx AND Vy", () => {
    cpu.Registers[0x4] = 0b1010
    cpu.Registers[0x5] = 0b1100

    cpu.ExecuteOpcode(0x8452)

    expect(cpu.Registers[0x4]).toBe(0b1000)
})

test("8xy3 - XOR Vx, Vy - Set Vx = Vx XOR Vy", () => {
    cpu.Registers[0x4] = 0b1010
    cpu.Registers[0x5] = 0b1100

    cpu.ExecuteOpcode(0x8453)

    expect(cpu.Registers[0x4]).toBe(0b0110)
})

test("8xy4 - ADD Vx, Vy - Set Vx = Vx + Vy, set VF = carry", () => {

    //Test with carry
    cpu.Registers[5] = 200
    cpu.Registers[0xB] = 58
    cpu.ExecuteOpcode(0x85B4)

    expect(cpu.Registers[5]).toBe(2)
    expect(cpu.Registers[0xF]).toBe(1)

    //Test without carry
    cpu.Registers[2] = 4
    cpu.Registers[3] = 6
    cpu.ExecuteOpcode(0x8234)
    expect(cpu.Registers[2]).toBe(10)
    expect(cpu.Registers[0xF]).toBe(0)
})

test("8xy5 - SUB Vx, Vy - Set Vx = Vx - Vy, set VF = NOT borrow", () => {

    //Test with NOT borrow
    cpu.Registers[5] = 20
    cpu.Registers[0xB] = 3
    cpu.ExecuteOpcode(0x85B5)

    expect(cpu.Registers[5]).toBe(17)
    expect(cpu.Registers[0xF]).toBe(1)

    //Test with borrow
    cpu.Registers[2] = 4
    cpu.Registers[3] = 6
    cpu.ExecuteOpcode(0x8235)
    expect(cpu.Registers[2]).toBe(254)
    expect(cpu.Registers[0xF]).toBe(0)
})

test("8xy6 - SHR Vx {, Vy} - Set Vx = Vx SHR 1", () => {

    //Test with even number
    cpu.Registers[0xA] = 20
    cpu.ExecuteOpcode(0x8A06)

    expect(cpu.Registers[0xA]).toBe(10)
    expect(cpu.Registers[0xF]).toBe(0)

    //Test with odd number
    cpu.Registers[0xA] = 31
    cpu.ExecuteOpcode(0x8A06)

    expect(cpu.Registers[0xA]).toBe(15)
    expect(cpu.Registers[0xF]).toBe(1)
})

test("8xy7 - SUBN Vx, Vy - Set Vx = Vy - Vx, set VF = NOT borrow", () => {

    //Test with NOT borrow
    cpu.Registers[5] = 20
    cpu.Registers[0xB] = 3
    cpu.ExecuteOpcode(0x85B7)

    expect(cpu.Registers[5]).toBe(239)
    expect(cpu.Registers[0xF]).toBe(0)

    //Test with borrow
    cpu.Registers[2] = 4
    cpu.Registers[3] = 6
    cpu.ExecuteOpcode(0x8237)
    expect(cpu.Registers[2]).toBe(2)
    expect(cpu.Registers[0xF]).toBe(1)
})

test("8xyE - SHL Vx {, Vy} - Set Vx = Vx SHL 1", () => {

    //Test with even number
    cpu.Registers[0xA] = 20
    cpu.ExecuteOpcode(0x8A0E)

    expect(cpu.Registers[0xA]).toBe(40)
    expect(cpu.Registers[0xF]).toBe(0)

    //Test with odd number
    cpu.Registers[0xA] = 0x98

    cpu.ExecuteOpcode(0x8A0E)

    expect(cpu.Registers[0xA]).toBe(48)
    expect(cpu.Registers[0xF]).toBe(1)
})

test("9xy0 - SNE Vx, Vy - Skip next instruction if Vx != Vy", () => {
    //If value is not equal we don't skip next instruction
    cpu.PC = 0x200
    cpu.Registers[0x1] = 0x33
    cpu.Registers[0xA] = 0x33

    cpu.ExecuteOpcode(0x91A0)

    expect(cpu.PC).toBe(0x202)

    //If value is not equal we skip next instruction
    cpu.PC = 0x200
    cpu.Registers[0x3] = 0x31
    cpu.Registers[0xA] = 0x33

    cpu.ExecuteOpcode(0x93A0)

    expect(cpu.PC).toBe(0x204)
})

test("Annn - LD I, addr - Set I = nnn", () => {
    cpu.I = 0

    cpu.ExecuteOpcode(0xA3F2)

    expect(cpu.I).toBe(0x3F2)
})

test("Bnnn - JP V0, addr - Jump to location nnn + V0", () => {
    cpu.PC = 0
    cpu.Registers[0] = 20

    cpu.ExecuteOpcode(0xB231) // addr == 561

    expect(cpu.PC).toBe(581)
})

test("Cxkk - RND Vx, byte - Set Vx = random byte AND kk", () => {
    cpu.Registers[0xA] = 0

    cpu.ExecuteOpcode(0xCA0F)

    expect(cpu.Registers[0xA]).not.toBe(0)
    expect(cpu.Registers[0xA]).toBeLessThanOrEqual(15)
})

test("Dxyn - DRW Vx, Vy, nibble - Display n-byte sprite starting at memory location I at (Vx, Vy), set VF = collision", () => {
    let addr = 0x0200
    let posX = 0
    let posY = 0

    cpu.Registers[0xF] = 0

    cpu._memory[addr] = 0xFF
    cpu._memory[addr + 1] = 0xFF
    cpu._memory[addr + 2] = 0xFF
    cpu._memory[addr + 3] = 0xFF
    cpu._memory[addr + 4] = 0xFF
    cpu._memory[addr + 5] = 0xFF

    cpu.I = addr
    cpu.Registers[0x1] = posX
    cpu.Registers[0x2] = posY

    cpu.ExecuteOpcode(0xD126)

    expect(cpu.Registers[0xF]).toBe(0)

    for(let x = posX; x < (posX+8); x++){
        for(let y = posY; y < (posY+6); y++){
            expect(cpu._renderer.GetPixel(x,y)).toBe(1)
        }
    }

    //Redraw to test xor
    cpu.ExecuteOpcode(0xD126)

    expect(cpu.Registers[0xF]).toBe(1)

    for(let x = posX; x < (posX+8); x++){
        for(let y = posY; y < (posY+6); y++){
            expect(cpu._renderer.GetPixel(x,y)).toBe(0)
        }
    }
})

test("Ex9E - SKP Vx - Skip next instruction if key with the value of Vx is pressed", () => {
    cpu.PC = 0x200
    cpu.Registers[0xC] = 2
    keyboard._keyCode = 2

    cpu.ExecuteOpcode(0xEC9E)
    expect(cpu.PC).toBe(0x204)

    cpu.PC = 0x200
    cpu.Registers[0xC] = 2
    keyboard._keyCode = 3

    cpu.ExecuteOpcode(0xEC9E)
    expect(cpu.PC).toBe(0x202)
})

test("ExA1 - SKNP Vx - Skip next instruction if key with the value of Vx is not pressed.", () => {
    cpu.PC = 0x200
    cpu.Registers[0xC] = 2
    keyboard._keyCode = 1

    cpu.ExecuteOpcode(0xECA1)
    expect(cpu.PC).toBe(0x204)

    cpu.PC = 0x200
    cpu.Registers[0xC] = 2
    keyboard._keyCode = 2

    cpu.ExecuteOpcode(0xECA1)
    expect(cpu.PC).toBe(0x202)
})

test("Fx07 - LD Vx, DT - Set Vx = delay timer value", () => {
    cpu.DT = 15
    cpu.Registers[0x8] = 0

    cpu.ExecuteOpcode(0xF807)

    expect(cpu.Registers[0x8]).toBe(15)
})

test("Fx0A - LD Vx, K - Wait for a key press, store the value of the key in Vx", () => {
    //a key is pressed
    keyboard._keyCode = 8
    cpu.Registers[0x6] = 0
    cpu.PC = 0x200

    cpu.ExecuteOpcode(0xF60A)

    expect(cpu.PC).toBe(0x202)
    expect(cpu.Registers[0x6]).toBe(keyboard._keyCode)

    //No Key pressed
    keyboard._keyCode = 0
    cpu.Registers[0x6] = 0
    cpu.PC = 0x200

    cpu.ExecuteOpcode(0xF60A)

    expect(cpu.PC).toBe(0x200)
    expect(cpu.Registers[0x6]).toBe(0)
})

test("Fx15 - LD DT, Vx - Set delay timer = Vx", () => {
    cpu.Registers[0x5] = 8

    cpu.ExecuteOpcode(0xF515)

    expect(cpu.DT).toBe(8)
})

test("Fx18 - LD ST, Vx - Set sound timer = Vx", () => {
    cpu.Registers[0xD] = 26

    cpu.ExecuteOpcode(0xFD18)

    expect(cpu.ST).toBe(26)
})

test("Fx1E - ADD I, Vx - Set I = I + Vx", () => {
    cpu.I = 512
    cpu.Registers[0xE] = 136

    cpu.ExecuteOpcode(0xFE1E)

    expect(cpu.I).toBe(648)
})

test("Fx29 - LD F, Vx - Set I = location of sprite for digit Vx", () => {
    cpu.I = 0x200
    cpu.Registers[0x3] = 3 //get 3th font stored on begin of memory

    cpu.ExecuteOpcode(0xF329)

    expect(cpu.I).toBe(3 * 5) //font sprite are 5 bytes long
})

test("Fx33 - LD B, Vx - Store BCD representation of Vx in memory locations I, I+1, and I+2", () => {
    cpu.I = 0x300
    cpu.Registers[0x2] = 123

    cpu.ExecuteOpcode(0xF233)

    expect(cpu._memory[0x300]).toBe(1)
    expect(cpu._memory[0x301]).toBe(2)
    expect(cpu._memory[0x302]).toBe(3)
})

test("Fx55 - LD [I], Vx - Store registers V0 through Vx in memory starting at location I", () => {
    cpu.I = 0x300
    cpu.Registers[0x0] = 6
    cpu.Registers[0x1] = 68
    cpu.Registers[0x2] = 213
    cpu.Registers[0x3] = 100
    cpu.Registers[0x4] = 128

    cpu.ExecuteOpcode(0xF455)

    expect(cpu.I).toBe(0x300 + 5)
    expect(cpu._memory[0x300]).toBe(6)
    expect(cpu._memory[0x301]).toBe(68)
    expect(cpu._memory[0x302]).toBe(213)
    expect(cpu._memory[0x303]).toBe(100)
    expect(cpu._memory[0x304]).toBe(128)
})

test("Fx65 - LD Vx, [I] - Read registers V0 through Vx from memory starting at location I.", () => {
    cpu.Registers[0x0] = 0
    cpu.Registers[0x1] = 0
    cpu.Registers[0x2] = 0
    cpu.Registers[0x3] = 0
    cpu.Registers[0x4] = 0

    cpu.I = 0x300
    cpu._memory[0x300] = 6
    cpu._memory[0x301] = 68
    cpu._memory[0x302] = 213
    cpu._memory[0x303] = 100
    cpu._memory[0x304] = 128

    cpu.ExecuteOpcode(0xF465)

    expect(cpu.I).toBe(0x300 + 5)
    expect(cpu.Registers[0x0]).toBe(6)
    expect(cpu.Registers[0x1]).toBe(68)
    expect(cpu.Registers[0x2]).toBe(213)
    expect(cpu.Registers[0x3]).toBe(100)
    expect(cpu.Registers[0x4]).toBe(128)
})
