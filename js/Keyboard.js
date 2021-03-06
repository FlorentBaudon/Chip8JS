export class Keyboard {
    constructor() {
        this.KeyMap = {
            49 : 0x1, // 1
            50 : 0x2, // 2
            51 : 0x3, // 3
            52 : 0xC, // 4
            65 : 0x4, // A
            90 : 0x5, // Z
            69 : 0x6, // E
            82 : 0xD, // R
            81 : 0x7, // Q
            83 : 0x8, // S
            68 : 0x9, // D
            70 : 0xE, // F
            87 : 0xA, // W
            88 : 0x0, // X
            67 : 0xB, // C
            86 : 0xF  // V

        }

        this._keyCode = 0
        window.addEventListener('keydown', this.OnKeyDown.bind(this), false)
        window.addEventListener('keyup', this.OnKeyUp.bind(this), false)
    }

    GetKey() {
        return this._keyCode
    }

    OnKeyDown (event) {
        this._keyCode = this.KeyMap[event.which]
    }

    OnKeyUp (event) {
        this._keyCode = 0
    }
}
