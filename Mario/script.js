const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const scoreElement = document.getElementById('score')

let score = 0;
let alreadyPassedThisPipe = false;

const jump = () => {
    if (!mario.classList.contains('jumo')) {
         mario.classList.add('jump');
        setTimeout(() => {
            mario.classList.remove('jump');
        }, 500);
    }
};

const loop = setInterval(() => {

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');

    if (pipePosition <= 120 && pipePosition > -10 && marioPosition < 100) {

        pipe.style.animation = 'none';
        pipe.style.left = `${pipePosition}px`;

        mario.style.animation = 'none';
        mario.style.bottom = `${marioPosition}px`;

        mario.src = './game-over.png';
        mario.style.width = '75px'
        mario.style.marginleft = '50px'

        clearInterval(loop);
        return;
    }

    if (pipePosition < -50 && !alreadyPassedThisPipe) {
        score += 100;
        scoreElement.textContent = score;
        alreadyPassedThisPipe = true;
    }

    if (pipePosition > 300) {
        alreadyPassedThisPipe = false;
    }

}, 10);

document.addEventListener('keydown', jump);
document.addEventListener('touchstart', jump);