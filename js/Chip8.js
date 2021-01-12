import {Clock} from './Clock.js'
import {CPU} from './CPU.js'
import {Renderer} from './Renderer.js'
import {Keyboard} from './Keyboard.js'
import {Audio} from './Audio.js'

import {CPUInstructionsList} from './CPUInstructions.js'


export class Chip8 {

    constructor() {

        this.fps = 60

        this.cpu = new CPU()

        this.clock = new Clock()
        this.renderer = new Renderer(10)
        this.keyboard = new Keyboard()
        this.memory = new Uint8Array(4096)
        this.audio = new Audio()

        this.paused = false;

        this.cpu.SetDevices(this.renderer, this.keyboard, this.memory)

        this.LoadFonts()
    }

    Start(){

        this.LoadRomInMemory('./Roms/pong.rom')

        window.addEventListener('keyup', this.OnKeyUp.bind(this), false)

        requestAnimationFrame(this.Cycle.bind(this))
    }

    LoadFonts() {
        var fonts = [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ]

        for(let i=0; i<fonts.length; i++){
            this.memory[i] = fonts[i]
        }
    }


    LoadRomInMemory(path) {

        fetch(path)
        .then(r => r.blob())
        .then(blob => blob.arrayBuffer())
        .then(buffer => {
            let rom = new Uint8Array(buffer)
            for(let i=0; i<rom.length; i++){
                this.cpu._memory[0x200+i] = rom[i]
            }
        })
    }

    Cycle() {
        if(this.paused)
            return;

        var elapsedTime = this.clock.getElapsedTime()
        if(elapsedTime >= (1/this.fps)){

            this.clock.start() //reset internal counter

            this.cpu.Cycle()
            //Render the display
            this.renderer.Render()

            if(this.cpu.ST > 0) {
                this.audio.Play()
            }else {
                this.audio.Stop()
            }
        }
        requestAnimationFrame(this.Cycle.bind(this))
    }

    /** Testing functions **/
    OnKeyUp(event) {
        if(event.which == 32) {
            this.paused = !this.paused
        }
    }
}
