/* 互动宠物：甘米米 & 呱噜噜（页面边缘、可拖动、轻动画、点击对话） */
(function () {
    if (document.getElementById('ip-pets')) return;
    var pets = [
        { id: 'pet-ganmimi', label: '甘米米 Ganmimi', src: 'assets/ip/pet-ganmimi-tight.png',
          lines: [
            ['甘工！出发！', 'Ganmi, let\'s go!'],
            ['欢迎来看海南的故事！', 'Welcome to Hainan\'s stories!'],
            ['要一起去文昌看火箭吗？', 'Wanna watch a rocket launch together?']
          ] },
        { id: 'pet-gualulu', label: '呱噜噜 Gualulu', src: 'assets/ip/pet-gualulu-tight.png',
          lines: [
            ['呱！有我在！', 'Ribbit! I\'m here!'],
            ['黎锦的花纹，我织给你看。', 'I\'ll weave the Li brocade for you.'],
            ['记得常回家看看呀！', 'Come home often, okay?']
          ] }
    ];
    var wrap = document.createElement('div');
    wrap.id = 'ip-pets';
    wrap.setAttribute('aria-hidden', 'false');
    document.body.appendChild(wrap);

    var saved = {};
    try { saved = JSON.parse(localStorage.getItem('ip-pets-pos') || '{}'); } catch (e) { saved = {}; }

    pets.forEach(function (p, idx) {
        var pet = document.createElement('div');
        pet.className = 'ip-pet ip-pet-' + idx;
        pet.id = p.id;
        pet.innerHTML =
            '<img src="' + p.src + '" alt="' + p.label + '" draggable="false">' +
            '<span class="pet-bubble"><span class="zh"></span><span class="en"></span></span>';
        wrap.appendChild(pet);

        // 默认位置：左下 / 右下
        var pos = saved[p.id] || { x: idx === 0 ? 18 : null, y: null };
        var applyPos = function () {
            // 越界保护：窗口变小或旧存档导致位置在屏幕外时，自动回默认位置
            var maxX = Math.max(0, window.innerWidth - 70);
            var maxY = Math.max(0, window.innerHeight - 80);
            if (pos.x == null || pos.y == null ||
                pos.x < 0 || pos.y < 0 || pos.x > maxX || pos.y > maxY) {
                pos = {};
            }
            if (pos.x != null && pos.y != null) {
                pet.style.left = Math.min(Math.max(0, pos.x), maxX) + 'px';
                pet.style.top = Math.min(Math.max(0, pos.y), maxY) + 'px';
                pet.style.right = 'auto';
                pet.style.bottom = 'auto';
            } else if (idx === 0) {
                pet.style.left = '18px';
                pet.style.bottom = '22px';
            } else {
                pet.style.right = '18px';
                pet.style.bottom = '22px';
            }
        };
        applyPos();
        window.addEventListener('resize', applyPos);

        // 拖动
        var dragging = false, moved = false, sx = 0, sy = 0, ox = 0, oy = 0;
        pet.addEventListener('pointerdown', function (e) {
            dragging = true; moved = false;
            sx = e.clientX; sy = e.clientY;
            var r = pet.getBoundingClientRect();
            ox = e.clientX - r.left; oy = e.clientY - r.top;
            pet.setPointerCapture && pet.setPointerCapture(e.pointerId);
            pet.classList.add('dragging');
        });
        pet.addEventListener('pointermove', function (e) {
            if (!dragging) return;
            var dx = e.clientX - sx, dy = e.clientY - sy;
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
            if (!moved) return;
            var nx = e.clientX - ox, ny = e.clientY - oy;
            nx = Math.max(0, Math.min(window.innerWidth - 70, nx));
            ny = Math.max(0, Math.min(window.innerHeight - 80, ny));
            pet.style.left = nx + 'px';
            pet.style.top = ny + 'px';
            pet.style.right = 'auto';
            pet.style.bottom = 'auto';
        });
        function endDrag(e) {
            if (!dragging) return;
            dragging = false;
            pet.classList.remove('dragging');
            if (moved) {
                var r = pet.getBoundingClientRect();
                saved[p.id] = { x: Math.round(r.left), y: Math.round(r.top) };
                try { localStorage.setItem('ip-pets-pos', JSON.stringify(saved)); } catch (err) {}
            } else {
                say();
            }
        }
        pet.addEventListener('pointerup', endDrag);
        pet.addEventListener('pointercancel', endDrag);

        // 对话气泡
        var bubble = pet.querySelector('.pet-bubble');
        var timer = null;
        function say() {
            var line = p.lines[Math.floor(Math.random() * p.lines.length)];
            bubble.querySelector('.zh').textContent = line[0];
            bubble.querySelector('.en').textContent = line[1];
            bubble.classList.add('show');
            pet.classList.add('talking');
            clearTimeout(timer);
            timer = setTimeout(function () {
                bubble.classList.remove('show');
                pet.classList.remove('talking');
            }, 3200);
        }
    });
})();
