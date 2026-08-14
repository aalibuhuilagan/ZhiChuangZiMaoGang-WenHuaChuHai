/* 甘工鸟传说主线页动效：织线生长 + 章节节点点亮 + 引导语浮现 */
(function () {
    var journey = document.getElementById('legendJourney');
    if (!journey) return;

    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) {
                journey.classList.add('filled');
                io.disconnect();
            }
        });
    }, { threshold: 0.12 });
    io.observe(journey);

    var hint = document.querySelector('.page-scrollhint');
    if (hint) {
        setTimeout(function () { hint.classList.add('in'); }, 650);
    }
})();
