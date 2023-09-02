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
function createParticles(isMoving: boolean) {
  const particlesCount = isMoving ? 3 : 8;
  for (let i = 0; i < particlesCount; i++) {
    
    const currentHue: number = mousePos.x / canvas.width * 360;
    let currentSat: number = (mousePos.y / canvas.height) * 90;

    if(currentSat < 30) currentSat = 40;

    particlesArray.push(new Particles(painter, mousePos.x, mousePos.y, currentHue + (0.3 * i), currentSat));
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
let frequency: number = 65;
let amp: number = 1;

function calcProps() {

  // frq calculator
  // frq 996 == B5 to 124 == B2 note: B2 vanda alik agadi vaye B2 note edge ma pardein same for B5
  frequency = (mousePos.x / canvas.width) * 872;
  frequency += 104;

  // amp calculator
  amp = 1 - (mousePos.y / canvas.height);
}

// sound generator
function generateSound(): Sound {
  let musician: Sound = new Sound();
  musicians.push(musician);
  
  calcProps();
  musician.start(frequency);
  musician.gainNode.gain.value = amp;

  return musician;
}

function updateSound(musician: Sound) {
  
  calcProps();
  musician.gainNode.gain.value = amp;

  musician.frq = frequency;
  musician.update();
}





if (canvas != null) {
  // adjust canvas on resize
  window.addEventListener("resize", initCanvas);


  // mouse and touch events -----------------------

  canvas.addEventListener("mousedown", function (e) {
    mousePos.x = e.x;
    mousePos.y = e.y;
    createParticles(false);
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
        createParticles(true);
        updateSound(musician);
  
      }
  
    });
  });


  // touch start
  // canvas.addEventListener("touchstart", function (e) {
  //   console.log(e.targetTouches);
  //   const musician = generateSound();
    
  //   canvas.addEventListener("touchend", function () {
  //     musician.gainNode.gain.linearRampToValueAtTime(0.01, musician.audioCtx.currentTime + 2);
  //     setTimeout(function(){
  //       musician.stop(0);
  //       const musicanIdx: number = musicians.indexOf(musician);
  //       if (musicanIdx > -1){
  //         musicians.splice(musicanIdx, 1);
  //       }
  //     }, 2000);
  //   });
  
  //   // update if the touch moves while it is down
  //   canvas.addEventListener("touchmove", function (e) {
  //     e.preventDefault();
  //     // for all touch points get the position of touch
  
  //     for (let i = 0; i < e.changedTouches.length; i++) {
  //       mousePos.x = e.changedTouches[i].clientX;
  //       mousePos.y = e.changedTouches[i].clientY;
  //       createParticles();
  //     }
  
  
  //   });
  // });

  // animation loop
  function animater() {
    if (painter != null && canvas != null) {
      painter.clearRect(0, 0, canvas.width, canvas.height);
    }

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


