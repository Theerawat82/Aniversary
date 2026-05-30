// ====== MUSIC CONTROLS ======
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
let isMusicPlaying = false;

// Pre-load audio to avoid delay
bgMusic.volume = 0.5;

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicIcon.textContent = '🎵';
        isMusicPlaying = false;
    } else {
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
        musicIcon.textContent = '🔊';
        isMusicPlaying = true;
    }
});

// ====== PAGE NAVIGATION ======
const btnNext = document.getElementById('nextBtn');
const btnBack = document.getElementById('backBtn');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');

btnNext.addEventListener('click', () => {
    createHeartBurst();
    page1.classList.remove('active');
    setTimeout(() => {
        page2.classList.add('active');
    }, 400); 
});

btnBack.addEventListener('click', () => {
    page2.classList.remove('active');
    setTimeout(() => {
        page1.classList.add('active');
        // Reset envelope for replayability
        envelope.classList.remove('open');
        letterContent.classList.remove('show');
        typedText.innerHTML = '';
        isTyping = false;
    }, 400);
});

// ====== ENVELOPE & TYPEWRITER ======
const envelope = document.getElementById('envelope');
const letterContent = document.getElementById('letterContent');
const typedText = document.getElementById('typedText');

const message = "เค้าอยากบอกว่าขอบคุณสำหรับทุกอย่างตลอด 1 ปีที่ผ่านมานะ เค้ามีความสุขมากๆ ที่ได้มีมุหมูอยู่ข้างๆ จะรักและดูแลอ้วนตลอดไปเลย จุ๊บๆ 😘💕";
let i = 0;
let isTyping = false;
let typeInterval;

envelope.addEventListener('click', () => {
    envelope.classList.add('open');
    setTimeout(() => {
        letterContent.classList.add('show');
        if (!isTyping) {
            isTyping = true;
            i = 0;
            typedText.innerHTML = '';
            typeWriter();
        }
    }, 500);
});

function typeWriter() {
    if (i < message.length) {
        typedText.innerHTML += message.charAt(i);
        i++;
        typeInterval = setTimeout(typeWriter, 50);
    }
}

// ====== CANVAS HEART ANIMATION ======
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const hearts = [];
const heartColors = ['#ff4d85', '#ff758c', '#ffb6c1', '#dda0dd', '#ffffff', '#ff9eba'];

class Heart {
    constructor(x, y, isBurst = false) {
        this.x = x !== undefined ? x : Math.random() * canvas.width;
        this.y = y !== undefined ? y : canvas.height + Math.random() * 100;
        this.size = Math.random() * (isBurst ? 18 : 12) + 5;
        this.speedY = Math.random() * (isBurst ? 6 : 2.5) + 1;
        this.speedX = (Math.random() - 0.5) * (isBurst ? 6 : 1.5);
        this.color = heartColors[Math.floor(Math.random() * heartColors.length)];
        this.opacity = Math.random() * 0.6 + 0.2;
        this.life = isBurst ? 120 : Infinity;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        ctx.bezierCurveTo(
            0, 0, 
            -this.size / 2, 0, 
            -this.size / 2, topCurveHeight
        );
        ctx.bezierCurveTo(
            -this.size / 2, (this.size + topCurveHeight) / 2, 
            0, (this.size + topCurveHeight) / 2, 
            0, this.size
        );
        ctx.bezierCurveTo(
            0, (this.size + topCurveHeight) / 2, 
            this.size / 2, (this.size + topCurveHeight) / 2, 
            this.size / 2, topCurveHeight
        );
        ctx.bezierCurveTo(
            this.size / 2, 0, 
            0, 0, 
            0, topCurveHeight
        );
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    update(index) {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.life !== Infinity) {
            this.life--;
            this.opacity -= 0.01;
            if (this.life <= 0 || this.opacity <= 0) {
                hearts.splice(index, 1);
            }
        } else {
            if (this.y < -this.size * 2) {
                this.y = canvas.height + this.size;
                this.x = Math.random() * canvas.width;
            }
        }
        this.draw();
    }
}

// Initial background hearts
for (let i = 0; i < 40; i++) {
    hearts.push(new Heart());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach((heart, index) => {
        heart.update(index);
    });
    requestAnimationFrame(animate);
}
animate();

// Click to burst hearts anywhere on screen
window.addEventListener('click', (e) => {
    // Only if not clicking a button
    if (e.target.tagName !== 'BUTTON' && !e.target.closest('button') && !e.target.closest('.envelope')) {
        for (let i = 0; i < 8; i++) {
            hearts.push(new Heart(e.clientX, e.clientY, true));
        }
    }
});

function createHeartBurst() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    for (let i = 0; i < 40; i++) {
        hearts.push(new Heart(centerX, centerY, true));
    }
}
