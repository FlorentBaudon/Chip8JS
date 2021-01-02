import {Clock} from './Clock.js'
import {CPU} from './CPU.js'
import {Renderer} from './Renderer.js'
import {Keyboard} from './Keyboard.js'

var fps = 60

var cpu
var renderer
var keyboard
var clock

function init(){
    cpu = new CPU()

    clock = new Clock()
    renderer = new Renderer(10)
    keyboard = new Keyboard();

    cpu.SetDevices(renderer, keyboard)

    // renderer.TestRender()
    // testDraw()
    document.querySelector('#opcodeTest').addEventListener('click', testDraw)
    requestAnimationFrame(cycle)
}

function cycle() {
    var elapsedTime = clock.getElapsedTime()
    if(elapsedTime >= (1/fps)){
        clock.start(); //reset internal counter
        renderer.Render()
    }
    requestAnimationFrame(cycle)
}

function testDraw() {
    console.log("Testing Draw opcode");
    let addr = 0x0200

    cpu.Memory[addr] = 0xFF
    cpu.Memory[addr + 1] = 0xAA
    cpu.Memory[addr + 2] = 0x55
    cpu.Memory[addr + 3] = 0xAA
    cpu.Memory[addr + 4] = 0x55
    cpu.Memory[addr + 5] = 0xFF

    cpu.I = addr
    cpu.Registers[0x1] = -6
    cpu.Registers[0x2] = 0

    cpu.ExecuteOpcode(0xD126)
}



init()
