document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const bgMusic = new Audio('MBR701 BGM.wav'); // Rename your file to this!
  bgMusic.loop = true;
  bgMusic.volume = 0.3;

  const shootSound = new Audio('shoot.wav');

  const ship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 30,
    speed: 5
  };

  const bullets = [];
  const enemies = [];
  const keys = {};

  let spawnTimer = 0;
  let score = 0;
  let level = 1;
  let lives = 3;

  // Input handling
  window.addEventListener('keydown', (e) => {
    keys[e.key] = true;

    if (e.key === ' ') {
      bullets.push({
        x: ship.x + ship.width / 2 - 2,
        y: ship.y,
        width: 4,
        height: 10,
        speed: 7
      });
      shootSound.currentTime = 0;
      shootSound.play();
    }

    // First interaction triggers music
    bgMusic.play().catch(() => {});
  });

  window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
  });

  function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move ship
    if (keys['ArrowLeft']) ship.x -= ship.speed;
    if (keys['ArrowRight']) ship.x += ship.speed;
    ship.x = Math.max(0, Math.min(canvas.width - ship.width, ship.x));

    // Draw ship
    ctx.fillStyle = 'white';
    ctx.fillRect(ship.x, ship.y, ship.width, ship.height);

    // Move and draw bullets
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.y -= b.speed;
      ctx.fillStyle = 'red';
      ctx.fillRect(b.x, b.y, b.width, b.height);

      if (b.y < 0) bullets.splice(i, 1);
    }

    // Move and draw enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      e.y += e.speed;

      ctx.fillStyle = 'lime';
      ctx.fillRect(e.x, e.y, e.width, e.height);

      // Check collision with bullets
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        const hit =
          b.x < e.x + e.width &&
          b.x + b.width > e.x &&
          b.y < e.y + e.height &&
          b.y + b.height > e.y;

        if (hit) {
          enemies.splice(i, 1);
          bullets.splice(j, 1);
          score += 10;
          break;
        }
      }

      if (e.y > canvas.height) {
        enemies.splice(i, 1);
        lives--;
        if (lives <= 0) {
          alert(`💀 Game Over!\nFinal Score: ${score}`);
          document.location.reload();
        }
      }
    }

    // Spawn enemies
    spawnTimer++;
    if (spawnTimer > 60 - level * 5) {
      enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -30,
        width: 40,
        height: 30,
        speed: 1 + level * 0.5
      });
      spawnTimer = 0;
    }

    // Leveling up
    level = Math.floor(score / 100) + 1;

    // Draw HUD
    ctx.fillStyle = 'white';
    ctx.font = '16px monospace';
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillText(`Lives: ${lives}`, 10, 40);
    ctx.fillText(`Level: ${level}`, 10, 60);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();
});
