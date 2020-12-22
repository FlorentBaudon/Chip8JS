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
    clock = new Clock()
    cpu = new CPU()
    renderer = new Renderer(10)
    keyboard = new Keyboard();

    renderer.TestRender()

    requestAnimationFrame(cycle)
}

function cycle() {
    var elapsedTime = clock.getElapsedTime()
    if(elapsedTime >= (1/fps)){

        clock.start(); //reset internal counter
    }
    requestAnimationFrame(cycle)
}



init()
