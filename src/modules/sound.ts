let audioContext = window.AudioContext;

export default class Sound{
    amp: number;
    frq: number;
    audioCtx: AudioContext;
    oscillator: OscillatorNode;
    gainNode: GainNode;

    constructor(){
        this.amp = 0;
        this.frq = 0;
        this.audioCtx = new audioContext();
        this.oscillator = this.audioCtx.createOscillator();
        this.gainNode = this.audioCtx.createGain();
        this.oscillator.type = "sine";
    }

    start(freq: number){
        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
        this.gainNode.gain.value = 1;
        this.oscillator.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
        this.oscillator.start();
    }

    stop(interval: number){
        this.oscillator.stop(this.audioCtx.currentTime + interval);
    }

    setup(){
        // seems redundant as of now
    }

    update(){
        this.oscillator.frequency.setValueAtTime(this.frq, this.audioCtx.currentTime +0.1);
    }

    disconnect(){
        this.oscillator.disconnect(this.audioCtx.destination);
    }
}