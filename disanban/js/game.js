/* 出海小游戏：甘米米飞跃海洋，收集黎锦纹样，躲开乌云 */
(function () {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 900, H = 480;
    canvas.width = W;
    canvas.height = H;

    const player = { x: W / 2, y: H - 70, r: 22 };
    let motifs = [];
    let clouds = [];
    let score = 0;
    let time = 30;
    let running = false;
    let last = 0;
    let spawnT = 0;

    const overEl = document.getElementById('gameOver');
    const resultEl = document.getElementById('gameResult');
    const restartBtn = document.getElementById('gameRestart');

    function reset() {
        motifs.length = 0;
        clouds.length = 0;
        score = 0;
        time = 30;
        running = true;
        overEl.classList.add('hidden');
        last = performance.now();
        requestAnimationFrame(loop);
    }

    function spawn() {
        motifs.push({ x: 40 + Math.random() * (W - 80), y: -20, r: 13, vy: 2.2 + Math.random() });
        clouds.push({ x: 40 + Math.random() * (W - 80), y: -70, r: 26 + Math.random() * 16, vy: 1.1 + Math.random() * 0.5 });
    }

    function drawBird(x, y) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#F7F1E5';
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-18, -8);
        ctx.lineTo(-28, -18);
        ctx.moveTo(18, -8);
        ctx.lineTo(28, -18);
        ctx.stroke();
        ctx.fillStyle = '#3D2B1F';
        ctx.beginPath();
        ctx.arc(7, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#D47B6A';
        ctx.beginPath();
        ctx.moveTo(20, 3);
        ctx.lineTo(28, 6);
        ctx.lineTo(20, 9);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(212, 123, 106, 0.55)';
        ctx.beginPath();
        ctx.arc(-8, 8, 4, 0, Math.PI * 2);
        ctx.arc(8, 8, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawDiamond(x, y, r) {
        ctx.save();
        ctx.translate(x, y);
        ctx.fillStyle = '#D4AF37';
        ctx.beginPath();
        ctx.moveTo(0, -r);
        ctx.lineTo(r, 0);
        ctx.lineTo(0, r);
        ctx.lineTo(-r, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#8A6F3F';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
    }

    function drawCloud(x, y, r) {
        ctx.fillStyle = 'rgba(61, 43, 31, 0.38)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.arc(x + r * 0.8, y - r * 0.3, r * 0.7, 0, Math.PI * 2);
        ctx.arc(x - r * 0.8, y - r * 0.3, r * 0.7, 0, Math.PI * 2);
        ctx.fill();
    }

    function loop(now) {
        if (!running) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        spawnT += dt;
        if (spawnT > 0.9) { spawn(); spawnT = 0; }
        time -= dt;

        // 移动
        motifs.forEach(function (m) { m.y += m.vy; });
        clouds.forEach(function (c) { c.y += c.vy; });

        // 碰撞
        motifs = motifs.filter(function (m) {
            const d = Math.hypot(m.x - player.x, m.y - player.y);
            if (d < m.r + player.r) { score += 10; return false; }
            return m.y < H + 30;
        });
        clouds = clouds.filter(function (c) {
            const d = Math.hypot(c.x - player.x, c.y - player.y);
            if (d < c.r + player.r) { time -= 5; return false; }
            return c.y < H + 40;
        });

        // 绘制
        ctx.clearRect(0, 0, W, H);
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#CFE3EA');
        grad.addColorStop(0.55, '#A8C8D2');
        grad.addColorStop(1, '#7FB88C');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        clouds.forEach(function (c) { drawCloud(c.x, c.y, c.r); });
        motifs.forEach(function (m) { drawDiamond(m.x, m.y, m.r); });
        drawBird(player.x, player.y);

        // HUD
        const zh = document.body.dataset.lang !== 'en';
        ctx.fillStyle = '#3D2B1F';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText((zh ? '纹样 ' : 'Motifs ') + score, 16, 30);
        ctx.textAlign = 'right';
        ctx.fillText((zh ? '时间 ' : 'Time ') + Math.max(0, Math.ceil(time)) + 's', W - 16, 30);

        if (time <= 0) {
            running = false;
            resultEl.textContent = zh
                ? '🎉 甘米米到达！呱噜噜在等你！得分 ' + score
                : '🎉 Ganmimi made it! Gualulu is waiting! Score ' + score;
            overEl.classList.remove('hidden');
            return;
        }
        requestAnimationFrame(loop);
    }

    canvas.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        player.x = (e.clientX - rect.left) * (W / rect.width);
        player.y = (e.clientY - rect.top) * (H / rect.height);
    });
    canvas.addEventListener('touchmove', function (e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        player.x = (e.touches[0].clientX - rect.left) * (W / rect.width);
        player.y = (e.touches[0].clientY - rect.top) * (H / rect.height);
    }, { passive: false });
    window.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') player.x = Math.max(22, player.x - 22);
        if (e.key === 'ArrowRight') player.x = Math.min(W - 22, player.x + 22);
        if (e.key === 'ArrowUp') player.y = Math.max(22, player.y - 22);
        if (e.key === 'ArrowDown') player.y = Math.min(H - 22, player.y + 22);
    });

    restartBtn.addEventListener('click', reset);
    reset();
})();
