export default class Particles {
    x: number;
    y: number;
    ctx: CanvasRenderingContext2D;
    size: number;
    speedX: number;
    speedY: number;
    color: string;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, hue: number, sat: number = 70){
        this.x = x;
        this.y = y;
        this.ctx = ctx;
        this.size = Math.random()*6 + 1;
        this.speedX = Math.random()*2 - 1;
        this.speedY = Math.random()*2 -1;
        this.color = 'hsl('+ hue +',65%,'+ sat +'%)';
    }

    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }

    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        this.ctx.fill();
    }
}
