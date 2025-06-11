class Bullet {
    constructor(x, y, targetX, targetY, speed, damage) {
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = speed;
        this.damage = damage;
        this.trail = [];
    }

    draw(ctx) {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, 5, 5);
        for (let i = 0; i < this.trail.length; i++) {
            ctx.fillStyle = `rgba(0, 255, 0, ${1 - i / this.trail.length})`;
            ctx.fillRect(this.trail[i].x, this.trail[i].y, 5, 5);
        }
    }

    update() {
        let dx = this.targetX - this.x;
        let dy = this.targetY - this.y;
        let angle = Math.atan2(dy, dx);
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 10) {
            this.trail.shift();
        }
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }
}

export default Bullet;