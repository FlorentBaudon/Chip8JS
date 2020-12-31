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






test("8xy4 - ADD Vx, Vy - Set Vx = Vx + Vy, set VF = carry", () => {

    //Test with carry
    cpu.Registers[5] = 200
    cpu.Registers[0xB] = 58
    cpu.ExecuteOpcode(0x85B4)
    console.log(cpu.Registers[5]);

    expect(cpu.Registers[5]).toBe(2)
    expect(cpu.Registers[0xF]).toBe(1)

    //Test without carry
    cpu.Registers[2] = 4
    cpu.Registers[3] = 6
    cpu.ExecuteOpcode(0x8234)
    expect(cpu.Registers[2]).toBe(10)
    expect(cpu.Registers[0xF]).toBe(0)
})
