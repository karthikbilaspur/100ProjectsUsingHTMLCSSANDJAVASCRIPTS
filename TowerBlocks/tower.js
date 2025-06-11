class Tower {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.range = this.getRange(type);
        this.damage = this.getDamage(type);
        this.bulletSpeed = this.getBulletSpeed(type);
        this.firingRate = this.getFiringRate(type);
        this.lastFired = 0;
        this.level = 1;
    }

    getRange(type) {
        switch (type) {
            case 'sniper':
                return 150;
            case 'machineGun':
                return 50;
            case 'splash':
                return 100;
            default:
                return 100;
        }
    }

    getDamage(type) {
        switch (type) {
            case 'sniper':
                return 5;
            case 'machineGun':
                return 1;
            case 'splash':
                return 3;
            default:
                return 2;
        }
    }

    getBulletSpeed(type) {
        switch (type) {
            case 'sniper':
                return 10;
            case 'machineGun':
                return 5;
            case 'splash':
                return 7;
            default:
                return 7;
        }
    }

    getFiringRate(type) {
        switch (type) {
            case 'sniper':
                return 1000;
            case 'machineGun':
                return 100;
            case 'splash':
                return 500;
            default:
                return 500;
        }
    }

    upgrade() {
        this.level++;
        this.damage *= 1.1;
        this.range *= 1.1;
        this.bulletSpeed *= 1.1;
        this.firingRate *= 0.9;
    }

    draw(ctx) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x, this.y, 20, 20);
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(this.type, this.x + 10, this.y + 20);
        ctx.fillText(`Level: ${this.level}`, this.x + 10, this.y + 40);
    }

    shoot(enemies, currentTime) {
        if (currentTime - this.lastFired >= this.firingRate) {
            for (let enemy of enemies) {
                let distance = Math.sqrt((this.x - enemy.x) ** 2 + (this.y - enemy.y) ** 2);
                if (distance <= this.range) {
                    let Bullet = require('./bullet.js').default;
                    let bullet = new Bullet(this.x, this.y, enemy.x, enemy.y, this.bulletSpeed, this.damage);
                    this.lastFired = currentTime;
                    return bullet;
                }
            }
        }
        return null;
    }
}

export default Tower;