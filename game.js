// Het canvas element selecteren en de context ophalen
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Speler object
const player = {
  x: 50,
  y: canvas.height / 2,
  width: 20,
  height: 20,
  color: "blue",
  speed: 5,
  score: 0,
  level: 1,
  health: 100,
  experience: 0,
  requiredExperience: 100,
};

// Vijanden array
const enemies = [];

// Power-up object
const powerUp = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: 10,
  height: 10,
  color: "green",
};

// Toetsenbordtoetsen
const keys = {};

// Event listeners voor toetsindrukken
document.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
  delete keys[event.key];
});

// Update de spelstatus
function update() {
  movePlayer();
  moveEnemies();
  checkCollision();

  // Clear het canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Teken de speler
  drawRect(player.x, player.y, player.width, player.height, player.color);

  // Teken de vijanden
  enemies.forEach((enemy) => {
    drawRect(enemy.x, enemy.y, enemy.width, enemy.height, enemy.color);
  });

  // Teken de power-up
  drawRect(powerUp.x, powerUp.y, powerUp.width, powerUp.height, powerUp.color);

  // Teken de scores, level en gezondheid
  drawText(`Score: ${player.score}`, 10, 20);
  drawText(`Level: ${player.level}`, 10, 40);
  drawText(`Health: ${player.health}`, 10, 60);

  // Herhaal de update functie
  requestAnimationFrame(update);
}

// Beweeg de speler op basis van toetsindrukken
function movePlayer() {
  if (keys["ArrowUp"] && player.y > 0) {
    player.y -= player.speed;
  }

  if (keys["ArrowDown"] && player.y < canvas.height - player.height) {
    player.y += player.speed;
  }

  if (keys["ArrowLeft"] && player.x > 0) {
    player.x -= player.speed;
  }

  if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
}

// Beweeg de vijanden
function moveEnemies() {
  enemies.forEach((enemy) => {
    if (enemy.y + enemy.height / 2 < player.y + player.height / 2) {
      enemy.y += enemy.speed;
    }

    if (enemy.y + enemy.height / 2 > player.y + player.height / 2) {
      enemy.y -= enemy.speed;
    }

    if (enemy.x + enemy.width / 2 < player.x + player.width / 2) {
      enemy.x += enemy.speed;
    }

    if (enemy.x + enemy.width / 2 > player.x + player.width / 2) {
      enemy.x -= enemy.speed;
    }
  });
}

// Detecteer botsing tussen speler, vijanden en power-up
function checkCollision() {
  // Speler en power-up botsing
  if (
    player.x < powerUp.x + powerUp.width &&
    player.x + player.width > powerUp.x &&
    player.y < powerUp.y + powerUp.height &&
    player.y + player.height > powerUp.y
  ) {
    player.score += 10;
    player.health += 10;
    player.experience += 20;
    powerUp.x = Math.random() * (canvas.width - powerUp.width);
    powerUp.y = Math.random() * (canvas.height - powerUp.height);
  }

  // Speler en vijanden botsing
  enemies.forEach((enemy, index) => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      player.health -= 10;
      enemies.splice(index, 1);
    }
  });

  // Level-up bij het behalen van vereiste ervaring
  if (player.experience >= player.requiredExperience) {
    player.level++;
    player.requiredExperience *= 2;
    player.experience = 0;
    player.health = 100;
    spawnEnemies(player.level * 5);
  }

  // Controleer op game over
  if (player.health <= 0) {
    alert("Game over!");
    reset();
  }
}

// Spawn vijanden op basis van het level
function spawnEnemies(count) {
  for (let i = 0; i < count; i++) {
    const enemy = {
      x: Math.random() * (canvas.width - 20),
      y: Math.random() * (canvas.height - 20),
      width: 20,
      height: 20,
      color: "red",
      speed: Math.random() * 2 + player.level * 0.5,
    };
    enemies.push(enemy);
  }
}

// Teken een rechthoek
function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

// Teken tekst
function drawText(text, x, y) {
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(text, x, y);
}

// Reset het spel
function reset() {
  player.x = 50;
  player.y = canvas.height / 2;
  player.score = 0;
  player.level = 1;
  player.health = 100;
  player.experience = 0;
  player.requiredExperience = 100;
  enemies.length = 0;
  spawnEnemies(player.level * 5);
}

// Start het spel
