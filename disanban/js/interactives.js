/* 互动模块：黎锦纹样生成器 / 愿望火箭 / 侨批明信片 */
(function () {
    /* ===== 黎锦纹样生成器 ===== */
    const pCanvas = document.getElementById('patternCanvas');
    if (pCanvas) {
        // V2.6：720 物理像素，导出更清晰
        pCanvas.width = 720;
        pCanvas.height = 720;
        const ctx = pCanvas.getContext('2d');
        ctx.scale(2, 2);
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
            ctx.fillStyle = color;
            ctx.lineWidth = 2.4;
            if (type === 'bird') {           // 甘工鸟：菱形 + 双翅 + 尾羽
                diamond(0, 0, r);
                ctx.globalAlpha = 0.32;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-r * 0.9, -r * 0.15); ctx.lineTo(-r * 1.55, -r * 0.75);
                ctx.moveTo(r * 0.9, -r * 0.15); ctx.lineTo(r * 1.55, -r * 0.75);
                ctx.moveTo(-r * 0.25, r * 0.55); ctx.lineTo(-r * 0.55, r * 1.1);
                ctx.moveTo(r * 0.25, r * 0.55); ctx.lineTo(r * 0.55, r * 1.1);
                ctx.stroke();
            } else if (type === 'person') {  // 人形纹：头 + 身体 + 手
                ctx.beginPath();
                ctx.arc(0, -r * 0.5, r * 0.24, 0, Math.PI * 2);
                ctx.globalAlpha = 0.32;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, -r * 0.2); ctx.lineTo(0, r * 0.6);
                ctx.moveTo(-r * 0.5, 0); ctx.lineTo(r * 0.5, 0);
                ctx.moveTo(-r * 0.5, 0); ctx.lineTo(-r * 0.85, r * 0.5);
                ctx.moveTo(r * 0.5, 0); ctx.lineTo(r * 0.85, r * 0.5);
                ctx.moveTo(0, r * 0.6); ctx.lineTo(-r * 0.4, r * 1.05);
                ctx.moveTo(0, r * 0.6); ctx.lineTo(r * 0.4, r * 1.05);
                ctx.stroke();
            } else {                          // 蛙纹：圆头 + 四肢
                ctx.beginPath();
                ctx.arc(0, -r * 0.42, r * 0.3, 0, Math.PI * 2);
                ctx.globalAlpha = 0.32;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(-r * 0.42, r * 0.15); ctx.lineTo(-r * 0.85, r * 0.5);
                ctx.moveTo(r * 0.42, r * 0.15); ctx.lineTo(r * 0.85, r * 0.5);
                ctx.moveTo(-r * 0.42, r * 0.15); ctx.lineTo(-r * 0.65, r * 0.75);
                ctx.moveTo(r * 0.42, r * 0.15); ctx.lineTo(r * 0.65, r * 0.75);
                ctx.stroke();
            }
            ctx.restore();
        }

        function draw() {
            const type = document.querySelector('input[name="motif"]:checked').value;
            ctx.clearRect(0, 0, 360, 360);

            // 纸感底色
            const paper = ctx.createLinearGradient(0, 0, 0, 360);
            paper.addColorStop(0, '#FBF5E8');
            paper.addColorStop(1, '#F1E5CC');
            ctx.fillStyle = paper;
            ctx.fillRect(0, 0, 360, 360);

            // 织物纹理：起伏经线 + 稀疏纬线 + 纤维噪点 + 布面光泽（V2.7 增强织物感）
            ctx.save();
            ctx.strokeStyle = 'rgba(61, 43, 31, 0.05)';
            ctx.lineWidth = 1;
            for (let y = 2; y < 360; y += 5) {
                ctx.beginPath();
                for (let x = 0; x <= 360; x += 6) {
                    const yy = y + Math.sin(x / 24 + y / 9) * 0.7;
                    if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
                }
                ctx.stroke();
            }
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.06)';
            for (let x = 3; x < 360; x += 8) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 360); ctx.stroke(); }
            // 布面光泽
            const sheen = ctx.createRadialGradient(130, 100, 10, 180, 180, 320);
            sheen.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
            sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = sheen;
            ctx.fillRect(0, 0, 360, 360);
            ctx.restore();

            // 实线金框 + 内细线 + 四角回纹（消除占位感）
            ctx.strokeStyle = '#A8843F';
            ctx.lineWidth = 4;
            ctx.strokeRect(9, 9, 342, 342);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(201, 163, 95, 0.55)';
            ctx.strokeRect(21, 21, 318, 318);
            // 刺绣虚线内框
            ctx.setLineDash([7, 5]);
            ctx.strokeStyle = 'rgba(201, 163, 95, 0.45)';
            ctx.lineWidth = 1.4;
            ctx.strokeRect(25, 25, 310, 310);
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(201, 163, 95, 0.55)';
            [[26, 26], [334, 26], [26, 334], [334, 334]].forEach(function (p) {
                diamond(p[0], p[1], 9);
                ctx.fill();
            });

            // 纹样网格：4×4，双层菱形 + 顶点圆点 + 主纹样
            const cell = 76;
            const xs = [66, 142, 218, 294];
            const ys = [56, 132, 208, 284];
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    const cx = xs[c];
                    const cy = ys[r];
                    // 外菱形淡填充
                    ctx.globalAlpha = 0.14;
                    ctx.fillStyle = color;
                    diamond(cx, cy, cell * 0.46);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    // 中层菱形描边
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 2;
                    diamond(cx, cy, cell * 0.34);
                    ctx.stroke();
                    // 顶点圆点
                    ctx.fillStyle = color;
                    [[cx, cy - cell * 0.34], [cx, cy + cell * 0.34], [cx - cell * 0.34, cy], [cx + cell * 0.34, cy]].forEach(function (pt) {
                        ctx.beginPath();
                        ctx.arc(pt[0], pt[1], 2.2, 0, Math.PI * 2);
                        ctx.fill();
                    });
                    // 主纹样
                    drawMotif(type, cx, cy, cell * 0.2);
                }
            }

            // 底部织带（一条连续的菱形花边，柔和融入）
            ctx.save();
            ctx.strokeStyle = 'rgba(138, 111, 63, 0.55)';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(30, 336);
            for (let x = 30; x <= 330; x += 30) {
                ctx.lineTo(x + 15, 340.5);
                ctx.lineTo(x + 30, 336);
            }
            ctx.stroke();
            ctx.fillStyle = 'rgba(138, 111, 63, 0.7)';
            for (let x = 30; x <= 330; x += 30) {
                diamond(x, 336, 5);
                ctx.fill();
            }
            ctx.restore();

            // 全局织物颗粒（盖在纹样上，让线条有织造感）
            ctx.save();
            ctx.fillStyle = 'rgba(61, 43, 31, 0.05)';
            let seed = 13;
            for (let i = 0; i < 1100; i++) {
                seed = (seed * 16807) % 2147483647;
                const nx = (seed / 2147483647) * 360;
                seed = (seed * 16807) % 2147483647;
                const ny = (seed / 2147483647) * 360;
                ctx.fillRect(nx, ny, 1.2, 1.2);
            }
            ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
            seed = 29;
            for (let i = 0; i < 700; i++) {
                seed = (seed * 16807) % 2147483647;
                const nx = (seed / 2147483647) * 360;
                seed = (seed * 16807) % 2147483647;
                const ny = (seed / 2147483647) * 360;
                ctx.fillRect(nx, ny, 1.2, 1.2);
            }
            ctx.restore();
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
        const W = pCanvas2.width, H = pCanvas2.height;
        const imgGanmimi = new Image();
        const imgGualulu = new Image();
        let imgsReady = false;
        let pendingText = '';

        // 内嵌透明小图（data URI）：保证 file:// 直开时 canvas 导出不被污染
        const PET_GANMIMI = 'data:image/png;base64,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';
        const PET_GUALUUU = 'data:image/png;base64,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';

        function roundRect(x, y, w, h, r) {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
        }

        function loadImgs(done) {
            let n = 0;
            const check = function () { n++; if (n === 2) { imgsReady = true; done && done(); } };
            imgGanmimi.onload = check;
            imgGualulu.onload = check;
            imgGanmimi.src = PET_GANMIMI;
            imgGualulu.src = PET_GUALUUU;
        }

        function wrapCenter(text, cx, cy, maxW, lh) {
            const size = text.length > 12 ? 20 : 24;
            ctx.font = 'italic ' + size + 'px "Noto Sans SC", "PingFang SC", sans-serif';
            const chars = text.split('');
            let line = '', lines = [], i = 0;
            while (i < chars.length) {
                const test = line + chars[i];
                if (ctx.measureText(test).width > maxW && line) {
                    lines.push(line);
                    line = chars[i];
                } else {
                    line = test;
                }
                i++;
            }
            if (line) lines.push(line);
            if (lines.length > 3) { lines = lines.slice(0, 3); lines[2] = lines[2].slice(0, 8) + '…'; }
            const startY = cy - ((lines.length - 1) * lh) / 2;
            ctx.textAlign = 'center';
            lines.forEach(function (ln, k) { ctx.fillText(ln, cx, startY + k * lh); });
        }

        function drawEnvelope(x, y, w, h) {
            ctx.fillStyle = '#F4E8CC';
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = '#C9A35F';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(x, y, w, h);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + w / 2, y + h / 2);
            ctx.lineTo(x + w, y);
            ctx.stroke();
        }

        function drawPostcard(text) {
            ctx.clearRect(0, 0, W, H);

            // 泛黄信纸底
            const paper = ctx.createLinearGradient(0, 0, 0, H);
            paper.addColorStop(0, '#F9F0DA');
            paper.addColorStop(1, '#EFDFC0');
            ctx.fillStyle = paper;
            ctx.fillRect(0, 0, W, H);

            // 双线金框
            ctx.strokeStyle = '#C9A35F';
            ctx.lineWidth = 3;
            ctx.strokeRect(10, 10, W - 20, H - 20);
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(201, 163, 95, 0.75)';
            ctx.strokeRect(18, 18, W - 36, H - 36);

            // 骑楼剪影（南洋记忆）
            ctx.fillStyle = 'rgba(138, 174, 181, 0.42)';
            for (let x = 26; x < 340; x += 54) {
                ctx.fillRect(x, 232, 38, 60);
                ctx.beginPath();
                ctx.arc(x + 19, 232, 19, Math.PI, 0);
                ctx.fill();
            }

            // 海面与落日
            const sea = ctx.createLinearGradient(0, 292, 0, H);
            sea.addColorStop(0, 'rgba(138, 174, 181, 0.55)');
            sea.addColorStop(1, 'rgba(93, 156, 111, 0.5)');
            ctx.fillStyle = sea;
            ctx.fillRect(0, 292, W, H - 292);
            ctx.fillStyle = 'rgba(212, 175, 55, 0.55)';
            ctx.beginPath();
            ctx.arc(330, 286, 18, 0, Math.PI * 2);
            ctx.fill();

            // 底部黎锦菱形纹样装饰
            ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
            ctx.lineWidth = 1.4;
            for (let x = 24; x < W - 20; x += 40) {
                ctx.beginPath();
                ctx.moveTo(x, 276); ctx.lineTo(x + 5, 282); ctx.lineTo(x, 288); ctx.lineTo(x - 5, 282);
                ctx.closePath();
                ctx.stroke();
            }

            // 邮票（呱噜噜 + 齿孔）
            ctx.fillStyle = '#fff';
            ctx.fillRect(390, 26, 70, 86);
            ctx.strokeStyle = '#5D9C6F';
            ctx.lineWidth = 2;
            ctx.strokeRect(390, 26, 70, 86);
            ctx.fillStyle = '#5D9C6F';
            for (let i = 0; i < 7; i++) {
                ctx.beginPath();
                ctx.arc(390 + (i + 0.5) * (70 / 7), 26, 2.4, 0, Math.PI * 2);
                ctx.arc(390 + (i + 0.5) * (70 / 7), 112, 2.4, 0, Math.PI * 2);
                ctx.arc(390, 26 + (i + 0.5) * (86 / 7), 2.4, 0, Math.PI * 2);
                ctx.arc(460, 26 + (i + 0.5) * (86 / 7), 2.4, 0, Math.PI * 2);
                ctx.fill();
            }
            if (imgsReady) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(398, 34, 54, 54);
                ctx.clip();
                ctx.drawImage(imgGualulu, 398, 34, 54, 54);
                ctx.restore();
            } else {
                ctx.fillStyle = '#7FB88C';
                ctx.beginPath();
                ctx.arc(425, 61, 18, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.font = '9px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#8a6f3f';
            ctx.fillText('HAINAN · 5FEN', 425, 104);

            // 甘米米衔信飞来（左）
            if (imgsReady) {
                ctx.save();
                ctx.translate(74, 178);
                ctx.rotate(-0.12);
                ctx.drawImage(imgGanmimi, -48, -48, 96, 96);
                ctx.restore();
            }
            drawEnvelope(128, 196, 48, 33);

            // 呱噜噜在右下角盖章
            if (imgsReady) {
                ctx.drawImage(imgGualulu, 322, 220, 56, 56);
            }

            // 邮戳（QIAOPI 侨批）
            ctx.save();
            ctx.translate(215, 188);
            ctx.rotate(-0.18);
            ctx.strokeStyle = '#A8843F';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.arc(0, 0, 40, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, 34, 0, Math.PI * 2);
            ctx.stroke();
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = 'rgba(168, 132, 63, 0.9)';
            ctx.fillText('HAINAN · 2026', 0, 2);
            ctx.font = '9px sans-serif';
            ctx.fillText('QIAOPI 侨批', 0, 15);
            ctx.restore();

            // 家书一句（写在信纸上）
            ctx.fillStyle = 'rgba(255, 253, 246, 0.72)';
            roundRect(42, 92, 258, 62, 10);
            ctx.fill();
            ctx.fillStyle = '#3D2B1F';
            wrapCenter(text || '家书抵万金 / A letter from home', 171, 126, 236, 26);

            // 落款
            ctx.font = '11px "Noto Sans SC", "PingFang SC", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#4A5F4E';
            ctx.fillText('寄往世界的一封家书 · A letter home', 240, 309);
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
        // ===== V2.3：成品明信片底图 + 家书文字叠加（覆盖上方旧绘制逻辑） =====
        const artImg = new Image();
        let artLoaded = false;
        function drawPostcard(text) {
            ctx.clearRect(0, 0, W, H);
            if (artLoaded) {
                ctx.drawImage(artImg, 0, 0, W, H);
            } else {
                // 兜底：底图未就绪时先画纸面，避免空白
                const paper = ctx.createLinearGradient(0, 0, 0, H);
                paper.addColorStop(0, '#F9F0DA');
                paper.addColorStop(1, '#EFDFC0');
                ctx.fillStyle = paper;
                ctx.fillRect(0, 0, W, H);
                ctx.strokeStyle = '#C9A35F';
                ctx.lineWidth = 3;
                ctx.strokeRect(10, 10, W - 20, H - 20);
            }
            // 家书文字落在设计稿书写区（1200×800 设计稿按 0.4 缩放到 480×320）
            ctx.fillStyle = '#3D2B1F';
            const size = (text && text.length > 10) ? 16 : 22;
            ctx.font = 'italic ' + size + 'px "Noto Sans SC", "PingFang SC", sans-serif';
            ctx.textAlign = 'center';
            // 默认提示不带斜杠，避免与标题"家书抵万金"重复
            const hint = (document.body.dataset.lang === 'en') ? 'Write a line home' : '写下一句家书';
            wrapCenter(text || hint, 149, 138, 230, size + 4);
        }
        artImg.onload = function () {
            artLoaded = true;
            drawPostcard(pendingText);
        };
        if (window.POSTCARD_ART) artImg.src = window.POSTCARD_ART;
        pendingText = '';
        drawPostcard('');
    }
})();
