import {Clock} from './Clock.js'
import {CPU} from './CPU.js'
import {Renderer} from './Renderer.js'
import {Keyboard} from './Keyboard.js'

import {CPUInstructionsList} from './CPUInstructions.js'

var fps = 120

var cpu
var renderer
var keyboard
var memory
var clock

var paused = false;

function init(){
    cpu = new CPU()

    clock = new Clock()
    renderer = new Renderer(10)
    keyboard = new Keyboard();
    memory = new Uint8Array(4096)

    cpu.SetDevices(renderer, keyboard, memory)

    loadRomInMemory('./Roms/pong.rom')

    window.addEventListener('keyup', OnKeyUp.bind(this), false)

    requestAnimationFrame(cycle)
}

function loadRomInMemory(path) {

    fetch(path)
    .then(r => r.blob())
    .then(blob => blob.arrayBuffer())
    .then(buffer => {
        let rom = new Uint8Array(buffer)
        for(let i=0; i<rom.length; i++){
            cpu._memory[0x200+i] = rom[i]
        }
    })
}

function cycle() {
    if(paused)
        return;

    var elapsedTime = clock.getElapsedTime()
    if(elapsedTime >= (1/fps)){
        clock.start(); //reset internal counter

        //Update delay timer
        if(cpu.DT > 0) cpu.DT -= 1;

        //Read current instrucitons in memory
        let opcode = (cpu._memory[cpu.PC] << 8) | cpu._memory[cpu.PC+1]

        //Log opcode details
        // cpu.GetOpcodeDetail(opcode)

        //Execute the instructions (Program Counter will be incremented by 2)
        cpu.ExecuteOpcode(opcode)
        //Render the display
        renderer.Render()
    }
    requestAnimationFrame(cycle)
}

/** Testing functions **/
function OnKeyUp(event) {
    if(event.which == 32) { paused = !paused }
}

function testDraw() {
    console.log("Testing Draw opcode");
    let addr = 0x0200

    cpu._memory[addr] = 0xFF
    cpu._memory[addr + 1] = 0xAA
    cpu._memory[addr + 2] = 0x55
    cpu._memory[addr + 3] = 0xAA
    cpu._memory[addr + 4] = 0x55
    cpu._memory[addr + 5] = 0xFF

    cpu.I = addr
    cpu.Registers[0x1] = -6
    cpu.Registers[0x2] = 0

    cpu.ExecuteOpcode(0xD126)
}

init()
