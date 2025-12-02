// Starfield and Fireworks Canvas
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
});

class Star {
constructor() {
this.reset();
}


reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height - canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speed = Math.random() * 2 + 0.5;
}

update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
        this.reset();
    }
}

draw() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(this.x, this.y, this.size, this.size);
}


}

class Firework {
constructor() {
this.reset();
}


reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height;
    this.targetY = Math.random() * canvas.height * 0.5;
    this.exploded = false;
    this.particles = [];
    this.speed = 5;
    this.color = ['#ff1493', '#ff69b4', '#ffd700'][Math.floor(Math.random() * 3)];
}

update() {
    if (!this.exploded) {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
            this.explode();
        }
    } else {
        this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1;
            p.life--;
            if (p.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
        
        if (this.particles.length === 0) {
            this.reset();
        }
    }
}

explode() {
    this.exploded = true;
    // Create heart shape with more particles for better definition
    for (let i = 0; i < 50; i++) {
        const t = (i / 50) * Math.PI * 2;
        // Parametric heart equation
        const heartX = 16 * Math.pow(Math.sin(t), 3);
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        this.particles.push({
            x: this.x,
            y: this.y,
            vx: heartX * 0.25,
            vy: heartY * 0.25,
            life: 80,
            size: 4
        });
    }
}

draw() {
    if (!this.exploded) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - 2, this.y - 2, 4, 4);
    } else {
        this.particles.forEach(p => {
            ctx.fillStyle = this.color;
            ctx.globalAlpha = p.life / 80;
            ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        });
        ctx.globalAlpha = 1;
    }
}


}

const stars = Array(100).fill().map(() => new Star());
const fireworks = Array(3).fill().map(() => new Firework());

function animate() {
ctx.fillStyle = 'rgba(10, 10, 46, 0.1)';
ctx.fillRect(0, 0, canvas.width, canvas.height);


stars.forEach(star => {
    star.update();
    star.draw();
});

fireworks.forEach(firework => {
    firework.update();
    firework.draw();
});

requestAnimationFrame(animate);


}

animate();

// Countdown Timer - Set to 365 days from today (anniversary is tomorrow)
//function updateCountdown() {
//const now = new Date();
//const nextAnniversary = new Date(now);
//nextAnniversary.setDate(nextAnniversary.getDate() + 365);

function updateCountdown() {
    // Set your specific anniversary date (YYYY, MM-1, DD)
    // Note: Months are 0-indexed (0 = January, 11 = December)
    const nextAnniversary = new Date(2025, 11, 3); // December 3, 2025
    const now = new Date();


const diff = nextAnniversary - now;

const days = Math.floor(diff / (1000 * 60 * 60 * 24));
const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
const seconds = Math.floor((diff % (1000 * 60)) / 1000);

document.getElementById('days').textContent = String(days).padStart(3, '0');
document.getElementById('hours').textContent = String(hours).padStart(2, '0');
document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');


}

setInterval(updateCountdown, 1000);
updateCountdown();

// Mini Game - Catch the Hearts (with mobile touch support)
const gameCanvas = document.getElementById('gameCanvas');
const gameCtx = gameCanvas.getContext('2d');
let gameScore = 0;
let missedHearts = 0;
let gameHearts = [];
let gameRunning = true;

class GameHeart {
constructor() {
this.x = Math.random() * (gameCanvas.width - 30);
this.y = -30;
this.speed = 2 + Math.random() * 2;
this.size = 20;
this.caught = false;
}


update() {
    if (!this.caught) {
        this.y += this.speed;
    }
}

draw() {
    if (!this.caught) {
        gameCtx.fillStyle = '#ff1493';
        gameCtx.font = `${this.size}px Arial`;
        gameCtx.fillText('♥', this.x, this.y);
    }
}

isClicked(mx, my) {
    return mx >= this.x && mx <= this.x + this.size &&
           my >= this.y - this.size && my <= this.y;
}


}

function spawnHeart() {
if (gameRunning && gameHearts.length < 5) {
gameHearts.push(new GameHeart());
}
}

setInterval(spawnHeart, 1500);

function updateGame() {
if (!gameRunning) return;


gameCtx.fillStyle = '#0a0a2e';
gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

gameHearts.forEach((heart, index) => {
    heart.update();
    heart.draw();
    
    if (heart.y > gameCanvas.height && !heart.caught) {
        missedHearts++;
        gameHearts.splice(index, 1);
        
        if (missedHearts >= 3) {
            gameRunning = false;
            gameCtx.fillStyle = '#ff1493';
            gameCtx.font = '20px "Press Start 2P"';
            gameCtx.textAlign = 'center';
            gameCtx.fillText('GAME OVER!', gameCanvas.width / 2, gameCanvas.height / 2);
            gameCtx.font = '12px "Press Start 2P"';
            gameCtx.fillText('Refresh to play again', gameCanvas.width / 2, gameCanvas.height / 2 + 40);
        }
    }
});

requestAnimationFrame(updateGame);


}

// Handle both click and touch events
function handleInteraction(e) {
if (!gameRunning) return;


e.preventDefault();
const rect = gameCanvas.getBoundingClientRect();
let mx, my;

if (e.type.startsWith('touch')) {
    mx = e.touches[0].clientX - rect.left;
    my = e.touches[0].clientY - rect.top;
} else {
    mx = e.clientX - rect.left;
    my = e.clientY - rect.top;
}

// Scale coordinates if canvas is scaled
const scaleX = gameCanvas.width / rect.width;
const scaleY = gameCanvas.height / rect.height;
mx *= scaleX;
my *= scaleY;

gameHearts.forEach((heart, index) => {
    if (heart.isClicked(mx, my) && !heart.caught) {
        heart.caught = true;
        gameScore++;
        document.getElementById('score').textContent = gameScore;
        gameHearts.splice(index, 1);
    }
});


}

gameCanvas.addEventListener('click', handleInteraction);
gameCanvas.addEventListener('touchstart', handleInteraction, { passive: false });

updateGame();

// 8-bit Music Player
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let musicPlaying = false;
let musicInterval = null;

// Simple 8-bit love melody
const melody = [
{ freq: 523.25, duration: 200 }, // C
{ freq: 587.33, duration: 200 }, // D
{ freq: 659.25, duration: 200 }, // E
{ freq: 783.99, duration: 200 }, // G
{ freq: 659.25, duration: 200 }, // E
{ freq: 587.33, duration: 200 }, // D
{ freq: 523.25, duration: 400 }, // C
{ freq: 0, duration: 100 },
{ freq: 659.25, duration: 200 }, // E
{ freq: 783.99, duration: 200 }, // G
{ freq: 880.00, duration: 200 }, // A
{ freq: 783.99, duration: 200 }, // G
{ freq: 659.25, duration: 400 }, // E
{ freq: 0, duration: 100 },
{ freq: 783.99, duration: 200 }, // G
{ freq: 880.00, duration: 200 }, // A
{ freq: 987.77, duration: 200 }, // B
{ freq: 1046.50, duration: 400 }, // C
];

let currentNote = 0;

function playNote(frequency, duration) {
if (frequency === 0) return;


const oscillator = audioContext.createOscillator();
const gainNode = audioContext.createGain();

oscillator.connect(gainNode);
gainNode.connect(audioContext.destination);

oscillator.frequency.value = frequency;
oscillator.type = 'square'; // 8-bit sound

gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

oscillator.start(audioContext.currentTime);
oscillator.stop(audioContext.currentTime + duration / 1000);


}

function playMelody() {
if (!musicPlaying) return;


const note = melody[currentNote];
playNote(note.freq, note.duration);

currentNote = (currentNote + 1) % melody.length;

musicInterval = setTimeout(playMelody, note.duration + 50);


}

document.getElementById('musicToggle').addEventListener('click', () => {
musicPlaying = !musicPlaying;
const btn = document.getElementById('musicToggle');


if (musicPlaying) {
    btn.textContent = '♪ STOP';
    btn.style.background = '#ffd700';
    currentNote = 0;
    playMelody();
} else {
    btn.textContent = '♪ MUSIC';
    btn.style.background = '#ff1493';
    clearTimeout(musicInterval);
}


});

// Continue Button
document.getElementById('continueBtn').addEventListener('click', () => {
const secretMsg = document.getElementById('secretMessage');
secretMsg.classList.add('show');
document.getElementById('continueBtn').style.display = 'none';
});

// Easter Egg - Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
if (e.key === konamiCode[konamiIndex]) {
konamiIndex++;


    if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
    }
} else {
    konamiIndex = 0;
}


});

function activateEasterEgg() {
const notify = document.getElementById('easterEggNotify');
notify.classList.add('show');


// Make all hearts bigger and spin
const style = document.createElement('style');
style.innerHTML = `
    .heart-pixel {
        font-size: 2em !important;
        animation: spinHeart 2s infinite !important;
    }
    @keyframes spinHeart {
        0% { transform: rotate(0deg) scale(1); }
        50% { transform: rotate(180deg) scale(1.5); }
        100% { transform: rotate(360deg) scale(1); }
    }
`;
document.head.appendChild(style);

// Create heart explosion
for (let i = 0; i < 50; i++) {
    setTimeout(() => {
        const heart = document.createElement('div');
        heart.textContent = '♥';
        heart.style.position = 'fixed';
        heart.style.left = Math.random() * window.innerWidth + 'px';
        heart.style.top = '-50px';
        heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
        heart.style.color = ['#ff1493', '#ff69b4', '#ffd700'][Math.floor(Math.random() * 3)];
        heart.style.zIndex = '1500';
        heart.style.pointerEvents = 'none';
        heart.style.animation = 'fall 3s linear';
        
        const fallAnimation = document.createElement('style');
        fallAnimation.innerHTML = `
            @keyframes fall {
                to {
                    transform: translateY(${window.innerHeight + 100}px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(fallAnimation);
        
        document.body.appendChild(heart);
        
        setTimeout(() => heart.remove(), 3000);
    }, i * 100);
}

setTimeout(() => {
    notify.classList.remove('show');
}, 3000);


}