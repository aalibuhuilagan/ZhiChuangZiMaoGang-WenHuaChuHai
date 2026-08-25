/* 互动模块：黎锦纹样生成器 / 愿望火箭 / 侨批明信片 */
(function () {
    /* ===== 黎锦纹样生成器 ===== */
    const pCanvas = document.getElementById('patternCanvas');
    if (pCanvas) {
        const ctx = pCanvas.getContext('2d');
        let color = '#D47B6A';

        document.querySelectorAll('.swatch').forEach(function (s) {
            s.addEventListener('click', function () {
                document.querySelectorAll('.swatch').forEach(function (x) { x.classList.remove('active'); });
                s.classList.add('active');
                color = s.dataset.color;
                draw();
            });
        });
        document.querySelectorAll('input[name="motif"]').forEach(function (r) {
            r.addEventListener('change', draw);
        });

        function diamond(cx, cy, r) {
            ctx.beginPath();
            ctx.moveTo(cx, cy - r);
            ctx.lineTo(cx + r, cy);
            ctx.lineTo(cx, cy + r);
            ctx.lineTo(cx - r, cy);
            ctx.closePath();
        }

        function drawMotif(type, cx, cy, r) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            if (type === 'bird') {           // 甘工鸟：菱形 + 双翅
                diamond(0, 0, r);
                ctx.beginPath();
                ctx.moveTo(-r, -r * 0.2); ctx.lineTo(-r * 1.7, -r * 0.8);
                ctx.moveTo(r, -r * 0.2); ctx.lineTo(r * 1.7, -r * 0.8);
                ctx.stroke();
            } else if (type === 'person') {  // 人形纹：头 + 身体 + 手
                ctx.beginPath();
                ctx.arc(0, -r * 0.45, r * 0.22, 0, Math.PI * 2);
                ctx.moveTo(0, -r * 0.2); ctx.lineTo(0, r * 0.55);
                ctx.moveTo(-r * 0.45, 0); ctx.lineTo(r * 0.45, 0);
                ctx.stroke();
            } else {                          // 蛙纹：圆头 + 四肢
                ctx.beginPath();
                ctx.arc(0, -r * 0.35, r * 0.28, 0, Math.PI * 2);
                ctx.moveTo(-r * 0.4, r * 0.2); ctx.lineTo(-r * 0.75, r * 0.55);
                ctx.moveTo(r * 0.4, r * 0.2); ctx.lineTo(r * 0.75, r * 0.55);
                ctx.stroke();
            }
            ctx.restore();
        }

        function draw() {
            const type = document.querySelector('input[name="motif"]:checked').value;
            ctx.clearRect(0, 0, 360, 360);
            ctx.fillStyle = '#FDFBF7';
            ctx.fillRect(0, 0, 360, 360);
            const cell = 90;
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    const cx = c * cell + cell / 2;
                    const cy = r * cell + cell / 2;
                    ctx.globalAlpha = 0.14;
                    ctx.fillStyle = color;
                    diamond(cx, cy, cell * 0.48);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2.5;
                    diamond(cx, cy, cell * 0.34);
                    ctx.stroke();
                    drawMotif(type, cx, cy, cell * 0.2);
                }
            }
            ctx.strokeStyle = '#D4AF37';
            ctx.lineWidth = 3;
            ctx.strokeRect(8, 8, 344, 344);
        }

        document.getElementById('patternGen').addEventListener('click', draw);
        document.getElementById('patternDl').addEventListener('click', function () {
            const a = document.createElement('a');
            a.download = 'liforce-pattern.png';
            a.href = pCanvas.toDataURL('image/png');
            a.click();
        });
        draw();
    }

    /* ===== 愿望火箭 ===== */
    const wishBtn = document.getElementById('wishLaunch');
    if (wishBtn) {
        const input = document.getElementById('wishInput');
        const rocket = document.getElementById('wishRocket');
        const msg = document.getElementById('wishMsg');
        wishBtn.addEventListener('click', function () {
            const wish = input.value.trim() || '愿望 / My Wish';
            const zh = document.body.dataset.lang !== 'en';
            msg.textContent = zh
                ? '✨ ' + wish + ' 正在飞向星辰…'
                : '✨ ' + wish + ' is flying to the stars…';
            rocket.classList.remove('launched');
            void rocket.offsetWidth;
            rocket.classList.add('launched');
        });
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') wishBtn.click();
        });
    }

    /* ===== 侨批明信片 ===== */
    const pCanvas2 = document.getElementById('postcardCanvas');
    if (pCanvas2) {
        const ctx = pCanvas2.getContext('2d');

        function drawPostcard(text) {
            ctx.clearRect(0, 0, 420, 300);
            ctx.fillStyle = '#F4E9D2';
            ctx.fillRect(0, 0, 420, 300);
            ctx.strokeStyle = '#C9A35F';
            ctx.lineWidth = 3;
            ctx.strokeRect(10, 10, 400, 280);
            ctx.lineWidth = 1;
            ctx.strokeRect(18, 18, 384, 264);

            // 骑楼剪影
            ctx.fillStyle = 'rgba(138, 174, 181, 0.5)';
            for (let x = 20; x < 300; x += 52) {
                ctx.fillRect(x, 210, 36, 80);
                ctx.beginPath();
                ctx.arc(x + 18, 210, 18, Math.PI, 0);
                ctx.fill();
            }
            // 海与太阳
            ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
            ctx.beginPath();
            ctx.arc(350, 60, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(138, 174, 181, 0.45)';
            ctx.fillRect(0, 262, 420, 38);

            // 邮票（呱噜噜简笔）
            ctx.fillStyle = '#fff';
            ctx.fillRect(318, 28, 64, 76);
            ctx.strokeStyle = '#5D9C6F';
            ctx.lineWidth = 2;
            ctx.strokeRect(318, 28, 64, 76);
            ctx.fillStyle = '#7FB88C';
            ctx.beginPath();
            ctx.arc(350, 58, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(345, 54, 3, 0, Math.PI * 2);
            ctx.arc(355, 54, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#5D9C6F';
            ctx.beginPath();
            ctx.arc(350, 38, 8, 0, Math.PI * 2);
            ctx.fill();

            // 邮戳
            ctx.strokeStyle = '#C9A35F';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(180, 180, 34, 0, Math.PI * 2);
            ctx.stroke();
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#8a6f3f';
            ctx.fillText('HAINAN · 2026', 180, 186);

            // 家书
            ctx.fillStyle = '#3D2B1F';
            ctx.font = 'italic 22px "Noto Serif SC", "Kaiti SC", serif';
            ctx.textAlign = 'left';
            ctx.fillText(text || '家书抵万金 / A letter from home', 42, 130);
        }

        document.getElementById('postcardMake').addEventListener('click', function () {
            const t = document.getElementById('postcardInput').value.trim() || '家书抵万金 / A letter from home';
            drawPostcard(t);
        });
        document.getElementById('postcardDl').addEventListener('click', function () {
            const a = document.createElement('a');
            a.download = 'qiaopi-postcard.png';
            a.href = pCanvas2.toDataURL('image/png');
            a.click();
        });
        drawPostcard('');
    }
})();
