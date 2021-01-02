export class Renderer {
    constructor (scale, headless = false) {
        this.headless = headless;
        this.cols = 64
        this.rows = 32

        if(!this.headless){
            this.scale = scale
            this.canvas = document.querySelector('canvas')
            this.ctx = this.canvas.getContext('2d')

            this.canvas.width = this.scale * this.cols
            this.canvas.height = this.scale * this.rows
        }

        this.display = new Array(this.cols * this.rows)
        //init array to 0
        for (var i = 0; i < this.display.length; i++) {
            this.display[i] = 0
        }
    }

    SetPixel(x, y, value) {
        x %= this.cols
        y %= this.rows

        let pixelIndex = x + (y * this.cols)

        let xor = this.display[pixelIndex]^value

        this.display[pixelIndex] ^= value

        return !this.display[pixelIndex]
    }

    //doesn't work, this.display contains only undefined values, don't know why...
    GetPixel(x, y) {

        x %= this.cols
        y %= this.rows

        let pixelIndex = x + (y * this.cols)

        return this.display[pixelIndex]
    }

    Clear() {
        this.display = new Array(this.cols * this.rows)
        for (var i = 0; i < this.display.length; i++) {
            this.display[i] = 0
        }
    }

    Render() {
        if(this.headless)
            return;

        // Clears the display every render cycle. Typical for a render loop.
         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
         console.log( " - " + this.GetPixel(0,0));

         // Loop through our display array
         for (let i = 0; i < this.cols * this.rows; i++) {
             // Grabs the x position of the pixel based off of `i`
             let x = (i % this.cols) * this.scale;

             // Grabs the y position of the pixel based off of `i`
             let y = Math.floor(i / this.cols) * this.scale;

             // Set the pixel color to black or white according value
             this.ctx.fillStyle = this.display[i] ? '#000' : '#FFF';

             // Place a pixel at position (x, y) with a width and height of scale
             this.ctx.fillRect(x, y, this.scale, this.scale);
         }
    }

    TestRender () {
        this.SetPixel(0,0);
        this.SetPixel(63,0);
        this.SetPixel(0,31);
        this.SetPixel(31,15);
        this.SetPixel(63,31);

        this.Render()
    }
}
