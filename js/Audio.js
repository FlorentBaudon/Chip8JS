export class Audio {
	constructor() {
		this.audioCtx = new AudioContext()
        this.gain = this.audioCtx.createGain()
        this.oscillator

		let finish = this.audioCtx.destination
		this.gain.connect(finish)
    }

    play(freq=440) {
        if (!this.oscillator) {
            this.oscillator = this.audioCtx.createOscillator()


            this.oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime)
            this.oscillator.type = 'square'
            this.oscillator.connect(this.gain)

            this.oscillator.start()
        }
    }

    stop() {
        if (this.oscillator) {
            this.oscillator.stop()
            this.oscillator.disconnect()
            this.oscillator = null
        }
    }
}
