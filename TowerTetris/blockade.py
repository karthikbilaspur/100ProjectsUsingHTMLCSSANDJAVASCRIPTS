import pygame
import random

# Initialize Pygame
pygame.init()

# Define some colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)

# Define some constants
GRID_WIDTH = 10
GRID_HEIGHT = 20
BLOCK_SIZE = 30

# Define some fonts
FONT = pygame.font.SysFont("Arial", 24)

class BlockadeGame:
    def __init__(self):
        self.screen = pygame.display.set_mode((GRID_WIDTH * BLOCK_SIZE + 200, GRID_HEIGHT * BLOCK_SIZE))
        self.clock = pygame.time.Clock()
        self.grid = [[0 for _ in range(GRID_WIDTH)] for _ in range(GRID_HEIGHT)]
        self.blockade_line = 0
        self.current_block = self.generate_block()
        self.next_block = self.generate_block()
        self.hold_block = None
        self.block_x = GRID_WIDTH // 2
        self.block_y = 0
        self.score = 0
        self.level = 1
        self.lines_cleared = 0
        self.game_over = False
        self.speed = 500
        self.last_move = pygame.time.get_ticks()
        self.high_scores = self.load_high_scores()

    def generate_block(self):
        shapes = [
            [[1, 1],
             [1, 1]],
            [[1, 1, 1, 1]],
            [[1, 1, 0],
             [0, 1, 1]],
            [[0, 1, 1],
             [1, 1, 0]],
            [[1, 0, 0],
             [1, 1, 1]],
            [[0, 0, 1],
             [1, 1, 1]],
            [[1, 1, 1],
             [0, 1, 0]]
        ]
        return random.choice(shapes)

    def check_collision(self, block, x, y):
        for block_y, row in enumerate(block):
            for block_x, val in enumerate(row):
                if val == 1:
                    if block_x + x < 0 or block_x + x >= GRID_WIDTH:
                        return True
                    if block_y + y < 0 or block_y + y >= GRID_HEIGHT:
                        return True
                    if self.grid[block_y + y][block_x + x] == 1:
                        return True
        return False

    def update(self):
        if not self.game_over:
            current_time = pygame.time.get_ticks()
            if current_time - self.last_move > self.speed:
                self.last_move = current_time
                if not self.check_collision(self.current_block, self.block_x, self.block_y + 1):
                    self.block_y += 1
                else:
                    self.lock_block()
            self.check_line_clears()

    def lock_block(self):
        for y, row in enumerate(self.current_block):
            for x, val in enumerate(row):
                if val == 1:
                    self.grid[self.block_y + y][self.block_x + x] = 1
        self.current_block = self.next_block
        self.next_block = self.generate_block()
        self.block_x = GRID_WIDTH // 2
        self.block_y = 0
        if self.check_game_over():
            self.game_over = True
            self.save_high_score()

    def check_line_clears(self):
        lines_cleared = 0
        for y, row in enumerate(self.grid):
            if all(row):
                del self.grid[y]
                self.grid.insert(0, [0 for _ in range(GRID_WIDTH)])
                lines_cleared += 1
        if lines_cleared > 0:
            self.score += lines_cleared * 100
            self.lines_cleared += lines_cleared
            self.level += lines_cleared // 10
            self.speed -= 50

    def check_game_over(self):
        for x in range(GRID_WIDTH):
            if self.grid[0][x] == 1:
                return True
        return False

    def load_high_scores(self):
        try:
            with open("high_scores.txt", "r") as file:
                return [int(line.strip()) for line in file.readlines()]
        except FileNotFoundError:
            return []

    def save_high_score(self):
        if self.score > 0:
            self.high_scores.append(self.score)
            self.high_scores.sort(reverse=True)
            self.high_scores = self.high_scores[:10]
            with open("high_scores.txt", "w") as file:
                for score in self.high_scores:
                    file.write(str(score) + "\n")
                    

    def draw(self):
        self.screen.fill(BLACK)
        for y, row in enumerate(self.grid):
            for x, val in enumerate(row):
                if val == 1:
                    pygame.draw.rect(self.screen, WHITE, (x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE))
        for y, row in enumerate(self.current_block):
            for x, val in enumerate(row):
                if val == 1:
                    pygame.draw.rect(self.screen, WHITE, ((self.block_x + x) * BLOCK_SIZE, (self.block_y + y) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE))
        pygame.draw.rect(self.screen, (50, 50, 50), (GRID_WIDTH * BLOCK_SIZE + 10, 10, 4 * BLOCK_SIZE, 4 * BLOCK_SIZE))
        for y, row in enumerate(self.next_block):
            for x, val in enumerate(row):
                if val == 1:
                    pygame.draw.rect(self.screen, WHITE, ((GRID_WIDTH * BLOCK_SIZE + 10 + x * BLOCK_SIZE), (10 + y * BLOCK_SIZE), BLOCK_SIZE, BLOCK_SIZE))
        if self.hold_block:
            pygame.draw.rect(self.screen, (50, 50, 50), (GRID_WIDTH * BLOCK_SIZE + 10, 150, 4 * BLOCK_SIZE, 4 * BLOCK_SIZE))
            for y, row in enumerate(self.hold_block):
                for x, val in enumerate(row):
                    if val == 1:
                        pygame.draw.rect(self.screen, WHITE, ((GRID_WIDTH * BLOCK_SIZE + 10 + x * BLOCK_SIZE), (150 + y * BLOCK_SIZE), BLOCK_SIZE, BLOCK_SIZE))
        score_text = FONT.render(f"Score: {self.score}", True, WHITE)
        self.screen.blit(score_text, (GRID_WIDTH * BLOCK_SIZE + 10, 300))
        level_text = FONT.render(f"Level: {self.level}", True, WHITE)
        self.screen.blit(level_text, (GRID_WIDTH * BLOCK_SIZE + 10, 350))
        lines_cleared_text = FONT.render(f"Lines Cleared: {self.lines_cleared}", True, WHITE)
        self.screen.blit(lines_cleared_text, (GRID_WIDTH * BLOCK_SIZE + 10, 400))
        high_score_text = FONT.render("High Scores:", True, WHITE)
        self.screen.blit(high_score_text, (GRID_WIDTH * BLOCK_SIZE + 10, 450))
        for i, score in enumerate(self.high_scores):
            score_text = FONT.render(str(score), True, WHITE)
            self.screen.blit(score_text, (GRID_WIDTH * BLOCK_SIZE + 10, 480 + i * 30))
        if self.game_over:
            game_over_text = FONT.render("Game Over!", True, WHITE)
            self.screen.blit(game_over_text, (GRID_WIDTH * BLOCK_SIZE // 2 - 50, GRID_HEIGHT * BLOCK_SIZE // 2 - 12))
        pygame.display.flip()

    def run(self):
        running = True
        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_LEFT:
                        if not self.check_collision(self.current_block, self.block_x - 1, self.block_y):
                            self.block_x -= 1
                    elif event.key == pygame.K_RIGHT:
                        if not self.check_collision(self.current_block, self.block_x + 1, self.block_y):
                            self.block_x += 1
                    elif event.key == pygame.K_DOWN:
                        if not self.check_collision(self.current_block, self.block_x, self.block_y + 1):
                            self.block_y += 1
                    elif event.key == pygame.K_UP:
                        rotated_block = [list(reversed(x)) for x in zip(*self.current_block)]
                        if not self.check_collision(rotated_block, self.block_x, self.block_y):
                            self.current_block = rotated_block
                    elif event.key == pygame.K_c:
                        if not self.hold_block:
                            self.hold_block = self.current_block
                            self.current_block = self.next_block
                            self.next_block = self.generate_block()
                            self.block_x = GRID_WIDTH // 2
                            self.block_y = 0
                        else:
                            temp_block = self.current_block
                            self.current_block = self.hold_block
                            self.hold_block = temp_block
                            self.block_x = GRID_WIDTH // 2
                            self.block_y = 0
            self.update()
            self.draw()
            self.clock.tick(60)
        pygame.quit()

if __name__ == "__main__":
    game = BlockadeGame()
    game.run()
