export class Wheel {
    constructor(canvasId, state) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.state = state;
        this.rotation = 0;
        this.isSpinning = false;
        this.spinVelocity = 0;
        this.friction = 0.985;
        // Rainbow Colors
        this.colors = [
            '#FF4136', // Red
            '#FF851B', // Orange
            '#FFDC00', // Yellow
            '#2ECC40', // Green
            '#0074D9', // Blue
            '#B10DC9', // Purple
            '#F012BE', // Magenta
        ];    // Subscribe to state changes to redraw
        this.state.subscribe(() => {
            this.draw();
        });

        this.onSpinEnd = null;

        // Audio Logic
        this.audioCtx = null;
        this.lastSegmentIndex = -1;

        // High DPI fix
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        // We keep internal width/height fixed for logic, but could be responsive.
        // For now, let's just stick to the canvas attributes or style.
        // Actually, drawing uses the canvas width/height.
        this.draw();
    }

    draw() {
        const participants = this.state.activeParticipants;
        const count = participants.length;

        // Clear
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (count === 0) return;

        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        // Reduce radius slightly to fit thick border
        const radius = Math.min(cx, cy) - 25;
        const arc = (Math.PI * 2) / count;

        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(this.rotation);

        // 1. Draw Outer Rim (Gold/Metallic Effect)
        const rimGradient = this.ctx.createLinearGradient(-radius, -radius, radius, radius);
        rimGradient.addColorStop(0, '#FFD700'); // Gold
        rimGradient.addColorStop(0.2, '#FDB931');
        rimGradient.addColorStop(0.5, '#FFFFFF'); // Shine
        rimGradient.addColorStop(0.8, '#FDB931');
        rimGradient.addColorStop(1, '#FFD700');

        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius + 15, 0, Math.PI * 2);
        this.ctx.fillStyle = rimGradient;
        this.ctx.shadowColor = 'rgba(0,0,0,0.5)';
        this.ctx.shadowBlur = 20;
        this.ctx.fill();
        this.ctx.shadowBlur = 0; // Reset shadow

        // 2. Draw Slices
        participants.forEach((p, i) => {
            const angle = i * arc;

            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, radius, angle, angle + arc);
            this.ctx.closePath();

            // Premium Slice Gradient
            const color = this.colors[i % this.colors.length];
            const sliceGrad = this.ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
            sliceGrad.addColorStop(0, this.lightenColor(color, 40)); // Inner light
            sliceGrad.addColorStop(1, color); // Outer distinct color

            this.ctx.fillStyle = sliceGrad;
            this.ctx.fill();

            // Slice Border
            this.ctx.strokeStyle = 'rgba(255,255,255,0.4)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // 3. Draw Text
            this.ctx.save();
            this.ctx.rotate(angle + arc / 2);
            this.ctx.textAlign = 'right';
            this.ctx.textBaseline = 'middle';
            this.ctx.font = 'bold 24px "Inter", sans-serif';

            // Text Shadow for readability
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
            this.ctx.shadowBlur = 4;
            this.ctx.fillText(p.name, radius - 30, 0);
            this.ctx.restore();
        });

        this.ctx.restore();

        // 4. Center Decor is handled by DOM Button, but we can add a glowing ring behind it
        // The DOM button is 80px w/h (radius 40). 
    }

    // Helper to lighten/darken hex color for gradients
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    spin() {
        if (this.isSpinning) return;
        const participants = this.state.activeParticipants;
        if (participants.length === 0) return;

        this.isSpinning = true;
        const duration = this.state.duration || 5;

        // Split time: 25% acceleration (max 1.5s), rest deceleration
        const accelTime = Math.min(duration * 0.25, 1.5);
        const decelTime = duration - accelTime;

        // Apply Speed Level Multiplier (default 0.9)
        const speedLevel = this.state.speedLevel || 0.9;
        const baseSpeedForward = 0.4 + (Math.random() * 0.4); // 0.4 - 0.8
        this.maxSpeed = baseSpeedForward * speedLevel;

        this.spinVelocity = 0; // Start from 0
        this.isAccelerating = true;

        // Calculate acceleration rate (linear)
        this.accelRate = this.maxSpeed / (accelTime * 60);

        // Calculate Friction for deceleration phase
        const decelFrames = decelTime * 60;
        this.friction = Math.pow(0.002 / this.maxSpeed, 1 / decelFrames);

        // Initialize Audio Context on user interaction (spin)
        this.initAudio();

        this.animate();
    }

    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    playTick() {
        if (!this.audioCtx) return;

        // Create oscillator and gain node
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.type = 'triangle';
        // Base frequency 600Hz, drop to 300Hz quickly
        oscillator.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, this.audioCtx.currentTime + 0.1);

        // Higher volume
        gainNode.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.1);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + 0.1);
    }

    animate() {
        if (!this.isSpinning) return;

        if (this.isAccelerating) {
            this.spinVelocity += this.accelRate;
            if (this.spinVelocity >= this.maxSpeed) {
                this.spinVelocity = this.maxSpeed;
                this.isAccelerating = false;
            }
        } else {
            this.spinVelocity *= this.friction;
        }

        this.rotation += this.spinVelocity;

        // Audio: Check Segment Crossing
        const participants = this.state.activeParticipants;
        const count = participants.length;
        if (count > 0 && this.spinVelocity > 0.002) {
            const arc = (Math.PI * 2) / count;
            // Current angle normalized (0 to 2PI)
            // Note: rotation increases indefinitely, so we just check floor(rotation / arc)
            // But we need to be careful. The pointer is fixed.
            // The segment passing the pointer changes when (rotation % arc) wraps,
            // or effectively when floor(rotation / arc) changes.
            // Let's deduce segment index relative to pointer.
            // Actually, simpler: just play sound every 'arc' radians of rotation.
            // But tracking index is robust.

            // Pointer is at 0 (3 o'clock).
            // Rotation rotates the wheel.
            // The segment under pointer is determined by (2PI - rotation % 2PI) logic.
            // But simpler for sound: just play when the wheel rotates past an edge.

            const currentTotalSegments = Math.floor(this.rotation / arc);
            if (this.lastSegmentIndex !== -1 && currentTotalSegments !== this.lastSegmentIndex) {
                this.playTick();
            }
            this.lastSegmentIndex = currentTotalSegments;
        }

        // Check if stopped
        if (this.spinVelocity < 0.002) {
            this.isSpinning = false;
            this.spinVelocity = 0;
            this.determineWinner();
        }

        this.draw();

        if (this.isSpinning) {
            requestAnimationFrame(() => this.animate());
        }
    }

    determineWinner() {
        const participants = this.state.activeParticipants;
        const count = participants.length;
        const arc = (Math.PI * 2) / count;

        // Normalize rotation
        const currentAngle = this.rotation % (Math.PI * 2);

        // The "Pointer" is at 0 degrees (Right) in standard canvas arc (0 to 2PI).
        // But we drew 0 at 3 o'clock.
        // However, the canvas rotated 'rotation'.
        // If the arrow is at 3 o'clock (0 rad), we check which segment is there.
        // The segment 'i' is from (i*arc) to ((i+1)*arc).
        // The point at 0 rad relative to the screen corresponds to:
        // (0 - rotation) in the wheel's local space.
        // So angle = (2PI - currentAngle) % 2PI.

        let angleAtPointer = (Math.PI * 2 - currentAngle) % (Math.PI * 2);
        if (angleAtPointer < 0) angleAtPointer += Math.PI * 2; // Be safe

        const index = Math.floor(angleAtPointer / arc);
        const winner = participants[index];

        if (this.onSpinEnd) {
            this.playWinSound(); // Celebration!
            this.onSpinEnd(winner);
        }
    }

    playWinSound() {
        if (!this.audioCtx) return;

        // C Major Fanfare: C4, E4, G4, C5
        const notes = [523.25, 659.25, 783.99, 1046.50];
        const startTimes = [0, 0.1, 0.2, 0.4];
        const durations = [0.4, 0.4, 0.4, 0.8]; // Longer last note

        notes.forEach((freq, i) => {
            const oscillator = this.audioCtx.createOscillator();
            const gainNode = this.audioCtx.createGain();

            const now = this.audioCtx.currentTime;
            const startTime = now + startTimes[i];

            oscillator.type = 'triangle'; // Brighter sound
            oscillator.frequency.value = freq;

            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05); // Attack
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durations[i]); // Decay

            oscillator.connect(gainNode);
            gainNode.connect(this.audioCtx.destination);

            oscillator.start(startTime);
            oscillator.stop(startTime + durations[i] + 0.1);
        });
    }
}
