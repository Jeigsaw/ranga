import Particles from "./modules/particles";
import Sound from "./modules/sound";

// types
export interface mousePos {
  x: number;
  y: number;
}


// inits
let isTouch: boolean = false;

let mousePos: mousePos = {
  x: 0,
  y: 0
};

let hue: number = 0;



// main


const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const painter = canvas.getContext("2d") as CanvasRenderingContext2D;


// canvas adjustment
function initCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}



let particlesArray: Particles[] = [];

// particles creator
function createParticles() {
  for (let i = 0; i < 5; i++) {
    particlesArray.push(new Particles(painter, mousePos.x, mousePos.y, hue));
  }
}

function updateParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();

    // remove smaller particles from the collection
    if (particlesArray[i].size <= 0.2) {
      particlesArray.splice(i, 1);
      i--;
    }
  }
}

//init web audio
let musicians: Sound[] = [];
const musician = new Sound();

// sound generator
function generateSound(): Sound {
  // start the oscillator with the frequency derived from the x-touch coordinate
  const frequency = mousePos.x + 65;
  let musician: Sound = new Sound();
  musicians.push(musician);
  musician.start(frequency);

  return musician;
}

function updateSound(musician: Sound) {
  // frq 1975 == B6 to 65 == C2

  // frq calculator
  const frequency = mousePos.x + 65;

  musician.frq = frequency;
  musician.update();
}





if (canvas != null) {
  // adjust canvas on resize
  window.addEventListener("resize", initCanvas);


  // mouse and touch events -----------------------

  canvas.addEventListener("mousedown", function (e) {
    mousePos.x = e.x;
    const musician = generateSound();
    isTouch = true;

    canvas.addEventListener("mouseup", function () {
      isTouch = false;

      musician.gainNode.gain.linearRampToValueAtTime(0.01, musician.audioCtx.currentTime + 2);
      setTimeout(function(){
        musician.stop(0);
        const musicanIdx: number = musicians.indexOf(musician);
        if (musicanIdx > -1){
          musicians.splice(musicanIdx, 1);
        }
      }, 2000);
    });

    // update if the mouse moves while it is down
    canvas.addEventListener("mousemove", function (e) {
      if (isTouch) {
        mousePos.x = e.x;
        mousePos.y = e.y;
        createParticles();
        updateSound(musician);
  
      }
  
    });
  });


  // touch start
  canvas.addEventListener("touchstart", function (e) {
    console.log(e.targetTouches);
    generateSound();
    
    // mila: yo baaki xa
    canvas.addEventListener("touchend", function () {
    });
  
    // update if the touch moves while it is down
    canvas.addEventListener("touchmove", function (e) {
      e.preventDefault();
      // for all touch points get the position of touch
  
      for (let i = 0; i < e.changedTouches.length; i++) {
        mousePos.x = e.changedTouches[i].clientX;
        mousePos.y = e.changedTouches[i].clientY;
        createParticles();
      }
  
  
    });
  });

  // animation loop
  function animater() {
    if (painter != null && canvas != null) {
      painter.clearRect(0, 0, canvas.width, canvas.height);
    }

    hue++;
    updateParticles();
    requestAnimationFrame(animater);
  }

  animater();



} //if canvas


// information modal
const infoModal = document.getElementById("modal") as HTMLBaseElement;
if (infoModal != null) {
  infoModal.addEventListener("click", function () {
    this.style.display = "none";
    initCanvas();
    // autoplay policy
    if (musician.audioCtx.state === 'suspended') {
      musician.audioCtx.resume();
  }
  });
}


