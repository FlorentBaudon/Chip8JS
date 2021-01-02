// const CPU = require('./js/CPU.js');
import {CPU} from "../js/CPU.js"
import {Renderer} from '../js/Renderer.js'
import {Keyboard} from '../js/Keyboard.js'

var cpu = new CPU();
var renderer = new Renderer(10, true)
var keyboard = new Keyboard();
cpu.SetDevices(renderer, keyboard)

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

    cpu.Memory[addr] = 0xFF
    cpu.Memory[addr + 1] = 0xFF
    cpu.Memory[addr + 2] = 0xFF
    cpu.Memory[addr + 3] = 0xFF
    cpu.Memory[addr + 4] = 0xFF
    cpu.Memory[addr + 5] = 0xFF

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
