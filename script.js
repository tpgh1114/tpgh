const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Player settings
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
  dx: 0,
  dy: 0
};

// Game settings
let kills = 0;
const gameDuration = 60; // in seconds
let startTime;

// Bullets
const bullets = [];
const bulletSpeed = 7;

// Enemy bullets
const enemyBullets = [];
const enemyBulletSpeed = 4;

// Enemies
const enemies = [];
const enemySpeed = 2;
const enemyWidth = 50;
const enemyHeight = 50;

// Draw player
function drawPlayer() {
  ctx.fillStyle = 'blue';
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
  bullets.forEach(bullet => {
    ctx.fillStyle = 'red';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Draw enemy bullets
function drawEnemyBullets() {
  enemyBullets.forEach(bullet => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Draw enemies
function drawEnemies() {
  enemies.forEach(enemy => {
    if (enemy.alive) {
      ctx.fillStyle = 'green';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
  });
}

// Draw game info
function drawGameInfo() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Kills: ${kills}`, 10, 20);
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const remainingTime = Math.max(gameDuration - elapsed, 0);
  ctx.fillText(`Time: ${remainingTime}s`, 10, 40);
}

// Move bullets
function moveBullets() {
  bullets.forEach(bullet => {
    bullet.y -= bulletSpeed;
  });
}

// Move enemy bullets
function moveEnemyBullets() {
  enemyBullets.forEach(bullet => {
    bullet.y += enemyBulletSpeed;
  });
}

// Move enemies
function moveEnemies() {
  enemies.forEach(enemy => {
    enemy.y += enemySpeed;
  });
}

// Add new bullet
function shoot() {
  const bullet = {
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 10
  };
  bullets.push(bullet);
}

// Enemy shoots
function enemyShoot(enemy) {
  if (enemy.alive) {
    const bullet = {
      x: enemy.x + enemy.width / 2 - 2.5,
      y: enemy.y + enemy.height,
      width: 5,
      height: 10
    };
    enemyBullets.push(bullet);
  }
}

// Create enemies
function createEnemy() {
  const x = Math.random() * (canvas.width - enemyWidth);
  const y = -enemyHeight;
  const enemy = { x, y, width: enemyWidth, height: enemyHeight, alive: true };
  enemies.push(enemy);

  // Make the enemy shoot every 3 seconds
  setInterval(() => {
    enemyShoot(enemy);
  }, 3000);
}

// Remove off-screen bullets
function removeBullets() {
  bullets.forEach((bullet, index) => {
    if (bullet.y + bullet.height < 0) {
      bullets.splice(index, 1);
    }
  });
}

// Remove off-screen enemy bullets
function removeEnemyBullets() {
  enemyBullets.forEach((bullet, index) => {
    if (bullet.y > canvas.height) {
      enemyBullets.splice(index, 1);
    }
  });
}

// Remove off-screen enemies
function removeEnemies() {
  enemies.forEach((enemy, index) => {
    if (enemy.y > canvas.height) {
      enemies.splice(index, 1);
    }
  });
}

// Detect collision between bullets and enemies
function detectCollision() {
  bullets.forEach((bullet, bIndex) => {
    enemies.forEach((enemy, eIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        bullets.splice(bIndex, 1);
        enemy.alive = false;
        kills++;
      }
    });
  });
}

// Detect collision between enemy bullets and player
function detectPlayerHit() {
  enemyBullets.forEach((bullet, bIndex) => {
    if (
      bullet.x < player.x + player.width &&
      bullet.x + bullet.width > player.x &&
      bullet.y < player.y + player.height &&
      bullet.y + bullet.height > player.y
    ) {
      // Player hit logic here
      enemyBullets.splice(bIndex, 1);
      alert("Game Over");
      document.location.reload();
    }
  });
}

// Clear canvas
function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Update game objects
function update() {
  clear();

  // Move player
  player.x += player.dx;
  player.y += player.dy;

  // Move and draw bullets
  moveBullets();
  removeBullets();
  drawBullets();

  // Move and draw enemy bullets
  moveEnemyBullets();
  removeEnemyBullets();
  drawEnemyBullets();

  // Move and draw enemies
  moveEnemies();
  removeEnemies();
  drawEnemies();

  // Detect collision
  detectCollision();
  detectPlayerHit();

  // Draw game info
  drawGameInfo();

  // Draw player
  drawPlayer();

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  if (elapsed >= gameDuration) {
    alert(`Time's up! You killed ${kills} enemies.`);
    document.location.reload();
  } else {
    requestAnimationFrame(update);
  }
}

// Keydown event
function keyDown(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right') {
    player.dx = player.speed;
  } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
    player.dx = -player.speed;
  }
}

// Keyup event
function keyUp(e) {
  if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowLeft' || e.key === 'Left') {
    player.dx = 0;
  }
}

// Shoot bullet on space key press
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') {
    shoot();
  }
});

// Keyboard events
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Create an enemy every 2 seconds
setInterval(createEnemy, 2000);

// Start the game
startTime = Date.now();
update();
