/* 多语之声：主题曲极简播放器 + 欢迎语/问候竖排点击播放 */
(function () {
    function fmt(s) {
        if (!isFinite(s) || s < 0) return '0:00';
        var m = Math.floor(s / 60);
        var sec = Math.floor(s % 60);
        return m + ':' + (sec < 10 ? '0' : '') + sec;
    }

    /* 主题曲 */
    var theme = document.getElementById('theme-song');
    var playBtn = document.getElementById('themePlay');
    var track = document.getElementById('themeTrack');
    var timeEl = document.getElementById('themeTime');
    var durEl = document.getElementById('themeDur');
    if (theme && playBtn && track) {
        function fill() {
            if (theme.duration) {
                var pct = (theme.currentTime / theme.duration) * 100;
                track.value = theme.currentTime;
                track.style.setProperty('--fill', pct + '%');
                timeEl.textContent = fmt(theme.currentTime);
            }
        }
        playBtn.addEventListener('click', function () {
            // 与竖排列表互斥：播放主题曲时先停列表
            stopRowList && stopRowList();
            if (theme.paused) {
                theme.play().catch(function () {});
            } else {
                theme.pause();
            }
        });
        theme.addEventListener('play', function () { playBtn.classList.add('playing'); });
        theme.addEventListener('pause', function () { playBtn.classList.remove('playing'); });
        theme.addEventListener('ended', function () {
            playBtn.classList.remove('playing');
            timeEl.textContent = '0:00';
            track.value = 0;
            track.style.setProperty('--fill', '0%');
        });
        theme.addEventListener('timeupdate', fill);
        theme.addEventListener('loadedmetadata', function () {
            track.max = theme.duration;
            durEl.textContent = fmt(theme.duration);
            fill();
        });
        track.addEventListener('input', function () {
            theme.currentTime = parseFloat(track.value) || 0;
            fill();
        });
        // 三键切换主题曲语言后刷新进度上限
        window.addEventListener('langchange', function () {
            setTimeout(function () {
                if (theme.duration) {
                    track.max = theme.duration;
                    durEl.textContent = fmt(theme.duration);
                    fill();
                }
            }, 250);
        });
    }

    /* 竖排点击播放（欢迎语 + 多语问候共用同一播放器） */
    var rows = document.querySelectorAll('.voice-row');
    var stopRowList = null;
    if (rows.length) {
        var audio = new Audio();
        var current = null;
        function stopRow() {
            if (current) current.classList.remove('playing');
            audio.pause();
            audio.removeAttribute('src');
            audio.load();
            current = null;
        }
        stopRowList = stopRow;
        rows.forEach(function (row) {
            row.addEventListener('click', function () {
                // 与主题曲互斥：播放列表项时先停主题曲
                if (theme && !theme.paused) {
                    theme.pause();
                    playBtn.classList.remove('playing');
                }
                if (current === row && !audio.paused) {
                    stopRow();
                    return;
                }
                stopRow();
                current = row;
                audio.src = row.dataset.src;
                row.classList.add('playing');
                audio.play().catch(function () {
                    row.classList.remove('playing');
                    current = null;
                });
            });
        });
        audio.addEventListener('ended', function () {
            if (current) current.classList.remove('playing');
            current = null;
        });
    }

    /* 主题曲歌词（QQ 音乐式滚动高亮，按时长均分定位） */
    var lyricBox = document.getElementById('mpLyrics');
    var themeDisc = document.getElementById('theme-song');
    var playerBox = document.querySelector('.music-player');
    if (lyricBox && themeDisc) {
        var ZH = [
            '甘米米，甘米米，背上故事飞呀飞',
            '甘米米！甘米米！让我们一起出发',
            '呱噜噜，呱噜噜，守在家乡织月光',
            '甘米米！甘米米！让我们一起出发',
            '甘工！出发！La la la la la…'
        ];
        var EN = [
            'Ganmimi, Ganmimi, flying stories to the sea',
            'Ganmimi, Ganmimi, come and sing along with me',
            'La la la la, la la la la, Hainan is calling you',
            'Ganmimi! Ganmimi! Let\'s go, let\'s go, la la la!',
            'Ganmimi! Ganmimi! We\'ll sail the world, la la la!',
            'Gualulu, Gualulu, weaving moonlight back at home',
            'Gualulu, Gualulu, never feel alone',
            'La la la la, la la la la, our story travels far',
            'Ganmimi! Ganmimi! Let\'s go, let\'s go, la la la!',
            'Ganmimi! Ganmimi! We\'ll sail the world, la la la!',
            'Gan-gong! Let\'s go! La la la la la…',
            'Gan-gong! Let\'s go! La la la la la…'
        ];
        var lines = [];
        var active = -1;

        function render() {
            var lang = document.body.dataset.lang;
            lines = lang === 'zh' ? ZH : EN;
            lyricBox.innerHTML = lines.map(function (l, i) {
                return '<p data-i="' + i + '">' + l + '</p>';
            }).join('');
            active = -1;
            if (themeDisc.duration) {
                mark(themeDisc.currentTime || 0);
            } else {
                active = 0;
                Array.prototype.forEach.call(lyricBox.children, function (p, i) {
                    p.classList.toggle('on', i === 0);
                });
            }
        }

        function mark(t) {
            if (!themeDisc.duration || !lines.length) return;
            var share = themeDisc.duration / lines.length;
            var idx = Math.min(lines.length - 1, Math.floor(t / share));
            if (idx === active) return;
            active = idx;
            Array.prototype.forEach.call(lyricBox.children, function (p, i) {
                p.classList.toggle('on', i === idx);
            });
            var el = lyricBox.children[idx];
            if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

        function playing(on) {
            if (playerBox) playerBox.classList.toggle('playing', on);
        }

        render();
        window.addEventListener('langchange', render);
        themeDisc.addEventListener('timeupdate', function () { mark(themeDisc.currentTime); });
        themeDisc.addEventListener('loadedmetadata', function () { mark(0); });
        themeDisc.addEventListener('play', function () { playing(true); });
        themeDisc.addEventListener('pause', function () { playing(false); });
        themeDisc.addEventListener('ended', function () { playing(false); });
    }
})();
