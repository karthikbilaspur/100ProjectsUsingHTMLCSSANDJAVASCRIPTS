class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.speed = this.getSpeed(type);
        this.health = this.getHealth(type);
        this.maxHealth = this.health;
    }

    getSpeed(type) {
        switch (type) {
            case 'fast':
                return 3;
            case 'slow':
                return 1;
            default:
                return 2;
        }
    }

    getHealth(type) {
        switch (type) {
            case 'fast':
                return 5;
            case 'slow':
                return 10;
            default:
                return 7;
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, 20, 20);
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(this.type, this.x + 10, this.y + 20);
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y - 10, 20 * (this.health / this.maxHealth), 5);
    }

    update() {
        this.x += this.speed;
    }
}

export default Enemy;