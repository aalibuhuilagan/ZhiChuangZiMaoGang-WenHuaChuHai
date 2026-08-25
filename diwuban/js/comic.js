/* IP 漫画：分镜拼图堆叠 + 翻书播放（V2.4）
 * 拼图态不显示旁白；播放时当前分镜的旁白在底部流式输出，
 * 暂停冻结打字与翻页进度，播完还原拼图并隐藏旁白。
 */
(function () {
    const data = window.COMIC_SUBTITLES || {};

    function flipSound() {
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return;
            const ctx = window.__flipCtx || (window.__flipCtx = new AC());
            if (ctx.state === 'suspended') ctx.resume();
            const dur = 0.16;
            const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
            const ch = buf.getChannelData(0);
            for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / ch.length);
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const bp = ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.Q.value = 1.4;
            bp.frequency.setValueAtTime(480, ctx.currentTime);
            bp.frequency.exponentialRampToValueAtTime(1500, ctx.currentTime + dur);
            const g = ctx.createGain();
            g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
            src.connect(bp);
            bp.connect(g);
            g.connect(ctx.destination);
            src.start();
        } catch (e) { /* 音效失败不影响播放 */ }
    }

    document.querySelectorAll('.comic-deck[data-story]').forEach(function (deck) {
        const story = deck.dataset.story;
        const list = data[story] || [];
        if (!list.length) return;
        const stage = deck.closest('.comic-stage');
        const playBtn = stage ? stage.querySelector('.cp-play') : null;
        const pauseBtn = stage ? stage.querySelector('.cp-pause') : null;

        // 底部旁白栏（播放时才显示）
        const bar = document.createElement('div');
        bar.className = 'comic-caption-bar';
        const zhLine = document.createElement('span');
        zhLine.className = 'zh';
        const enLine = document.createElement('span');
        enLine.className = 'en';
        bar.appendChild(zhLine);
        bar.appendChild(enLine);
        if (stage) stage.appendChild(bar);

        // 播放进度指示：第 X / N 格 + 圆点进度（V2.6：让翻书语义一眼就懂）
        const progress = document.createElement('div');
        progress.className = 'comic-progress';
        progress.innerHTML =
            '<span class="cp-count"><span class="zh"></span><span class="en"></span></span>' +
            '<span class="cp-dots"></span>';
        if (stage) stage.appendChild(progress);
        const zhCount = progress.querySelector('.cp-count .zh');
        const enCount = progress.querySelector('.cp-count .en');
        const dots = progress.querySelector('.cp-dots');

        // 分镜卡（只含图，旁白走底部栏）
        list.forEach(function (item, i) {
            const fig = document.createElement('figure');
            fig.className = 'comic-panel';
            fig.dataset.i = i;
            const img = document.createElement('img');
            img.src = 'assets/' + story + '/panel-' + item.panel + '.webp';
            img.alt = '漫画第' + item.panel + '格 / Comic panel ' + item.panel;
            fig.appendChild(img);
            deck.appendChild(fig);
        });

        const panels = Array.prototype.slice.call(deck.querySelectorAll('.comic-panel'));
        // V5 手机适配：发牌错位量改为 CSS 变量控制，窄屏自动收敛，避免横向溢出
        const spreadX = parseFloat(getComputedStyle(deck).getPropertyValue('--deck-spread-x')) || 9;
        const spreadY = parseFloat(getComputedStyle(deck).getPropertyValue('--deck-spread-y')) || 12;
        const perMs = (parseFloat(deck.dataset.duration) || 3.8) * 1000;
        const typeMs = 52;
        let idx = 0;
        let timer = null;
        let typing = null;
        let typed = 0;
        let playing = false;

        function updateProgress() {
            const n = panels.length;
            zhCount.textContent = '第 ' + (idx + 1) + ' / ' + n + ' 格';
            enCount.textContent = 'Panel ' + (idx + 1) + ' / ' + n;
            dots.innerHTML = '';
            for (let i = 0; i < n; i++) {
                const d = document.createElement('i');
                if (i < idx) d.className = 'done';
                else if (i === idx) d.className = 'on';
                dots.appendChild(d);
            }
        }

        function currentCaption() {
            const item = list[idx];
            return item ? { zh: item.zh, en: item.en } : null;
        }

        function setBarFull() {
            const cap = currentCaption();
            if (!cap) return;
            zhLine.textContent = cap.zh;
            enLine.textContent = cap.en;
            bar.classList.add('show');
        }

        function stopTyping() {
            if (typing) { clearInterval(typing); typing = null; }
        }

        function typeCaption() {
            const cap = currentCaption();
            if (!cap) return;
            bar.classList.add('show');
            stopTyping();
            typed = 0;
            typing = setInterval(function () {
                typed++;
                zhLine.textContent = cap.zh.slice(0, typed) + (typed < cap.zh.length ? '|' : '');
                enLine.textContent = cap.en.slice(0, typed) + (typed < cap.en.length ? '|' : '');
                if (typed >= Math.max(cap.zh.length, cap.en.length)) {
                    zhLine.textContent = cap.zh;
                    enLine.textContent = cap.en;
                    stopTyping();
                }
            }, typeMs);
        }

        function resumeTyping() {
            const cap = currentCaption();
            if (!cap) return;
            bar.classList.add('show');
            stopTyping();
            typing = setInterval(function () {
                typed++;
                zhLine.textContent = cap.zh.slice(0, typed) + (typed < cap.zh.length ? '|' : '');
                enLine.textContent = cap.en.slice(0, typed) + (typed < cap.en.length ? '|' : '');
                if (typed >= Math.max(cap.zh.length, cap.en.length)) {
                    zhLine.textContent = cap.zh;
                    enLine.textContent = cap.en;
                    stopTyping();
                }
            }, typeMs);
        }

        function place() {
            panels.forEach(function (p, i) {
                if (p.classList.contains('turning')) return;
                p.classList.remove('active', 'flipped');
                if (i === idx) {
                    p.classList.add('active');
                    p.style.transform = 'none';
                    p.style.zIndex = 200;
                } else if (i < idx) {
                    p.classList.add('flipped');
                    p.style.zIndex = 10 + i;
                } else {
                    const d = Math.min(i - idx, 6);
                    p.style.transform = 'translate(' + (d * spreadX) + 'px,' + (d * spreadY) + 'px) rotate(' + (d % 2 ? 0.7 : -0.6) + 'deg)';
                    p.style.zIndex = 100 - i;
                }
            });
            updateProgress();
        }

        function next() {
            if (idx >= panels.length - 1) {
                finish();
                return;
            }
            const cur = panels[idx];
            cur.classList.remove('active');
            cur.classList.add('turning');
            flipSound();
            idx++;
            place();
            typeCaption();
            cur.addEventListener('animationend', function h() {
                cur.removeEventListener('animationend', h);
                cur.classList.remove('turning');
                cur.classList.add('flipped');
            });
            timer = setTimeout(next, perMs);
        }

        function start() {
            if (playing) return;
            if (idx >= panels.length - 1) {
                idx = 0;
                place();
            }
            playing = true;
            place();
            if (playBtn) playBtn.classList.add('active');
            if (typed > 0 && typed < Math.max((list[idx] && list[idx].zh.length) || 0, (list[idx] && list[idx].en.length) || 0)) {
                resumeTyping();
            } else {
                typeCaption();
            }
            timer = setTimeout(next, perMs);
        }

        function pause() {
            playing = false;
            clearTimeout(timer);
            stopTyping();
            if (playBtn) playBtn.classList.remove('active');
        }

        function finish() {
            playing = false;
            clearTimeout(timer);
            stopTyping();
            if (playBtn) playBtn.classList.remove('active');
            setTimeout(function () {
                idx = 0;
                place();
                bar.classList.remove('show');
                zhLine.textContent = '';
                enLine.textContent = '';
                typed = 0;
            }, 750);
        }

        if (playBtn) playBtn.addEventListener('click', start);
        if (pauseBtn) pauseBtn.addEventListener('click', pause);
        window.addEventListener('langchange', function () {
            if (playing || bar.classList.contains('show')) setBarFull();
        });

        function size() {
            let h = 0;
            panels.forEach(function (p) { h = Math.max(h, p.offsetHeight); });
            if (h) deck.style.minHeight = (h + 26) + 'px';
        }
        const firstImg = panels[0].querySelector('img');
        if (firstImg && firstImg.complete) size();
        else if (firstImg) firstImg.addEventListener('load', size);
        window.addEventListener('load', size);
        setTimeout(size, 300);
        window.addEventListener('resize', size);
        place();
    });
})();
