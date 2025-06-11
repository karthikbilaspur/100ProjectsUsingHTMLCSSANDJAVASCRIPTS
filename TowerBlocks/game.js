
import Tower from './tower.js';
import Enemy from './enemy.js';
import Bullet from './bullet.js';

class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.score = 0;
        this.level = 1;
        this.health = 100;
        this.towers = [
            new Tower(100, 100, 'sniper'),
            new Tower(300, 300, 'machineGun'),
            new Tower(500, 100, 'splash')
        ];
        this.enemies = [];
        this.bullets = [];
        this.lastEnemySpawnTime = 0;
        this.enemySpawnInterval = 1000; // Spawn enemies every 1 second

        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }

    gameLoop(currentTime) {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Spawn new enemies
        if (currentTime - this.lastEnemySpawnTime >= this.enemySpawnInterval) {
            this.enemies.push(new Enemy(0, Math.random() * (this.canvas.height - 50), 'fast'));
            this.lastEnemySpawnTime = currentTime;
        }

        // Draw and update towers
        for (let tower of this.towers) {
            tower.draw(this.ctx);
            let bullet = tower.shoot(this.enemies, currentTime);
            if (bullet) {
                this.bullets.push(bullet);
            }
        }

        // Draw and update enemies
        for (let enemy of this.enemies) {
            enemy.draw(this.ctx);
            enemy.update();

            // Check if enemy is out of bounds
            if (enemy.x > this.canvas.width) {
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
                this.health -= 10;
            }

            // Check if enemy is hit by bullet
            for (let bullet of this.bullets) {
                let distance = Math.sqrt((bullet.x - enemy.x) ** 2 + (bullet.y - enemy.y) ** 2);
                if (distance < 10) {
                    enemy.health -= bullet.damage;
                    this.bullets.splice(this.bullets.indexOf(bullet), 1);
                    if (enemy.health <= 0) {
                        this.score += 10;
                        this.enemies.splice(this.enemies.indexOf(enemy), 1);
                    }
                }
            }
        }

        // Check if all enemies are defeated
        if (this.enemies.length === 0) {
            this.level++;
            // Increase enemy spawn rate
            this.enemySpawnInterval *= 0.9;
        }

        // Check if health is zero
        if (this.health <= 0) {
            // Game over
            alert('Game Over!');
            return;
        }

        // Draw and update bullets
        for (let bullet of this.bullets) {
            bullet.draw(this.ctx);
            bullet.update();

            // Check if bullet is out of bounds
            if (bullet.x < 0 || bullet.x > this.canvas.width || bullet.y < 0 || bullet.y > this.canvas.height) {
                this.bullets.splice(this.bullets.indexOf(bullet), 1);
            }
        }

        // Update score, health, and level display
        document.getElementById('score').textContent = `Score: ${this.score}`;
        document.getElementById('health').textContent = `Health: ${this.health}`;
        document.getElementById('level').textContent = `Level: ${this.level}`;

        requestAnimationFrame(this.gameLoop);
    }
}

export default Game;