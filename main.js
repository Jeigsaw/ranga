// global defintions
const canvas = document.querySelector("canvas");
const painter = canvas.getContext("2d");

let particlesArray = [];
let hue = 0;
let mousePos = {};
let musician;
let isTouch;

// information modal
const infoModal = document.getElementById("modal");
infoModal.addEventListener("click", function(){
    this.style.display="none";
    initCanvas();
})


// mouse and touch events -----------------------
canvas.addEventListener("mousedown", function(e){
    mousePos.x = e.x;
    generateSound();
    isTouch = true;
})
canvas.addEventListener("mouseup", function(){
    isTouch = false;
})

// update if the mouse moves while it is down
canvas.addEventListener("mousemove", function(e){
    if (isTouch){
        mousePos.x = e.x;
        mousePos.y = e.y;
        createParticles();
        updateSound();
        
    }
    
})

// touch start
canvas.addEventListener("touchstart", function(e){
    console.log(e.targetTouches);
    generateSound();
})
canvas.addEventListener("touchend", function(){
    // TODO: maybe some kind of fade out in gain for changedTouches
})

// update if the touch moves while it is down
canvas.addEventListener("touchmove", function(e){
    e.preventDefault();
    // for all touch points get the position of touch

    for (let i = 0; i < e.changedTouches.length; i++) {
        mousePos.x = e.changedTouches[i].clientX;
        mousePos.y = e.changedTouches[i].clientY;
        createParticles(); 
    }
    
    updateSound();
    
})


// particles creator
function createParticles () {
    for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particles(painter, mousePos.x, mousePos.y, hue));
    }
}

function updateParticles () {
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();

        // remove smaller particles from the collection
        if (particlesArray[i].size <=0.2) {
            particlesArray.splice(i, 1);
            i--;
        }
    }
}

// sound generator
function generateSound(){
    //init web audio
    musician = new Sound();
    
    // autoplay policy
    if (musician.audioCtx.state === 'suspended') {
        musician.audioCtx.resume();
    }

    // start the oscillator with the frequency derived from the x-touch coordinate
    const frequency = mousePos.x + 65;
    musician.start(frequency);
}

function updateSound(){
    // frq 1975 == B6 to 65 == C2

    // frq calculator
    const frequency = mousePos.x + 65;

    musician.frq = frequency; 
    musician.update();
}

// animation loop
function animater (){
    painter.clearRect(0,0,canvas.width, canvas.height);

    hue++;
    updateParticles();
    requestAnimationFrame(animater);
}

animater();


// canvas adjustment
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

}

// adjust canvas on resize
window.addEventListener("resize", initCanvas);

