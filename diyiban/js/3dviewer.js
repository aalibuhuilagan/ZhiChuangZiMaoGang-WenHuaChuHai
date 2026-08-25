/* 3D 模型查看器：内嵌模型数据优先（file:// 可用），GLB 后备（HTTP）
 * 依赖：vendor/three.min.js + OrbitControls.js；model-*.js 提供 window.IP_MODELS
 * 用法：<div class="model-viewer" data-model="甘米米" data-glb="assets/models/甘米米.glb" data-label="甘米米"></div>
 */
(function () {
    var viewers = [];
    window.__v3d = window.__v3d || [];
    if (typeof THREE === 'undefined') return;

    function b64ToU8(s) {
        var bin = atob(s);
        var u8 = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        return u8;
    }

    function buildEmbeddedMesh(model) {
        var qpos = new Int16Array(b64ToU8(model.qpos).buffer);
        var qnrm = new Int8Array(b64ToU8(model.qnrm).buffer);
        var quv = new Uint16Array(b64ToU8(model.quv).buffer);
        var indices = new Uint32Array(b64ToU8(model.indices).buffer);
        var lo = new Float32Array(b64ToU8(model.lo).buffer);
        var span = new Float32Array(b64ToU8(model.span).buffer);
        var n = model.nVerts;
        var positions = new Float32Array(n * 3);
        for (var i = 0; i < n; i++) {
            positions[i * 3] = (qpos[i * 3] + 32767) / 65534 * span[0] + lo[0];
            positions[i * 3 + 1] = (qpos[i * 3 + 1] + 32767) / 65534 * span[1] + lo[1];
            positions[i * 3 + 2] = (qpos[i * 3 + 2] + 32767) / 65534 * span[2] + lo[2];
        }
        var normals = new Float32Array(n * 3);
        for (i = 0; i < n; i++) {
            var nx = qnrm[i * 3] / 127;
            var ny = qnrm[i * 3 + 1] / 127;
            var nz = qnrm[i * 3 + 2] / 127;
            var len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
            normals[i * 3] = nx / len;
            normals[i * 3 + 1] = ny / len;
            normals[i * 3 + 2] = nz / len;
        }
        var uvs = new Float32Array(n * 2);
        for (i = 0; i < n; i++) {
            uvs[i * 2] = quv[i * 2] / 65535;
            uvs[i * 2 + 1] = 1 - quv[i * 2 + 1] / 65535;
        }
        var geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        geo.setIndex(new THREE.BufferAttribute(indices, 1));

        var tex = new THREE.TextureLoader();
        var mat = new THREE.MeshStandardMaterial({
            map: tex.load(model.baseTex),
            normalMap: tex.load(model.normalTex),
            roughnessMap: tex.load(model.ormTex),
            metalnessMap: tex.load(model.ormTex)
        });
        return new THREE.Mesh(geo, mat);
    }

    function createViewer(container) {
        var key = container.dataset.model;
        var glb = container.dataset.glb;
        var label = container.dataset.label || '';
        var width = container.clientWidth || 360;
        var height = container.clientHeight || 360;

        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 200);
        camera.position.set(0, 0.3, 3.4);
        scene.add(new THREE.HemisphereLight(0xffffff, 0x8a9bb0, 0.7));
        var keyL = new THREE.DirectionalLight(0xffffff, 0.95);
        keyL.position.set(3, 5, 4);
        scene.add(keyL);
        var rim = new THREE.DirectionalLight(0xfff3e0, 0.4);
        rim.position.set(-4, 2, -3);
        scene.add(rim);

        var controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.minDistance = 2.0;
        controls.maxDistance = 9;
        controls.autoRotate = false;
        controls.autoRotateSpeed = 1.6;
        controls.target.set(0, 0, 0);
        controls.update();
        controls.saveState();

        var loading = document.createElement('div');
        loading.className = 'model-loading';
        loading.textContent = '加载 3D… / Loading…';
        container.appendChild(loading);

        function finish(model) {
            // 混元导出模型为"仰面"：Rx(90°) 转正；头朝向因模型而异（data-rot-y 校正）
            model.rotation.set(Math.PI / 2, (parseFloat(container.dataset.rotY || 0) || 0) * Math.PI / 180, 0);
            var box = new THREE.Box3().setFromObject(model);
            var size = new THREE.Vector3();
            box.getSize(size);
            var maxDim = Math.max(size.x, size.y, size.z);
            var scale = maxDim > 0 ? 1.65 / maxDim : 1;
            model.scale.setScalar(scale);
            var center = new THREE.Vector3();
            box.getCenter(center);
            model.position.sub(center.multiplyScalar(scale));
            scene.add(model);
            controls.target.set(0, 0, 0);
            controls.update();
            controls.saveState();
            if (loading.parentNode) loading.parentNode.removeChild(loading);
            container.classList.add('model-loaded');
        }

        var embedded = (typeof window.IP_MODELS !== 'undefined') && window.IP_MODELS[key];
        if (embedded) {
            setTimeout(function () { finish(buildEmbeddedMesh(embedded)); }, 30);
        } else if (glb && typeof THREE.GLTFLoader !== 'undefined') {
            var loader = new THREE.GLTFLoader();
            loader.load(glb, function (gltf) { finish(gltf.scene); }, undefined, function () {
                loading.textContent = '加载失败 / Failed';
            });
        } else {
            loading.textContent = '模型未就绪 / Model unavailable';
        }

        function resize() {
            var w = container.clientWidth || 360;
            var h = container.clientHeight || 360;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener('resize', resize);

        var labelEl = document.createElement('div');
        labelEl.className = 'model-label';
        labelEl.textContent = label;
        container.appendChild(labelEl);

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        window.__v3d.push({ camera: camera, controls: controls, scene: scene, container: container });
        return {
            el: container,
            reset: function () { controls.reset(); controls.autoRotate = false; },
            play: function () {
                if (this._spinTimer) {
                    clearTimeout(this._spinTimer);
                    this._spinTimer = null;
                    controls.autoRotate = false;
                    controls.autoRotateSpeed = 1.6;
                    return;
                }
                var speed = 3.5;
                controls.autoRotateSpeed = speed;
                controls.autoRotate = true;
                var self = this;
                // 完整一圈 ≈ 30s * (2 / speed)
                this._spinTimer = setTimeout(function () {
                    controls.autoRotate = false;
                    controls.autoRotateSpeed = 1.6;
                    self._spinTimer = null;
                    var b = container.querySelector('[data-play-viewer]');
                    if (b) b.classList.remove('active');
                }, 30000 * (2 / speed));
            }
        };
    }

    function initModelViewers(root) {
        (root || document).querySelectorAll('.model-viewer').forEach(function (el) {
            if (el.dataset.viewerReady) return;
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        io.unobserve(el);
                        viewers.push(createViewer(el));
                        el.dataset.viewerReady = '1';
                    }
                });
            }, { threshold: 0.12 });
            io.observe(el);
        });
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-reset-viewer]');
        if (!btn) return;
        var host = btn.closest('.model-viewer');
        if (!host || !host.dataset.viewerReady) return;
        for (var i = 0; i < viewers.length; i++) {
            if (viewers[i].el === host) { viewers[i].reset(); break; }
        }
    });
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-play-viewer]');
        if (!btn) return;
        var host = btn.closest('.model-viewer');
        if (!host || !host.dataset.viewerReady) return;
        for (var i = 0; i < viewers.length; i++) {
            if (viewers[i].el === host) {
                viewers[i].play();
                btn.classList.toggle('active');
                break;
            }
        }
    });
    window.initModelViewers = initModelViewers;
})();
