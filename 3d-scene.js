(() => {
    const host = document.querySelector('#phoneScene');
    if (!host || !window.THREE) return;

    const THREE = window.THREE;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 7.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x77736a, 2.1));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(-3, 5, 6);
    scene.add(keyLight);
    const edgeLight = new THREE.PointLight(0xe98b60, 34, 12);
    edgeLight.position.set(3, 1, -2);
    scene.add(edgeLight);

    function roundedShape(width, height, radius) {
        const x = -width / 2;
        const y = -height / 2;
        const shape = new THREE.Shape();
        shape.moveTo(x + radius, y);
        shape.lineTo(x + width - radius, y);
        shape.quadraticCurveTo(x + width, y, x + width, y + radius);
        shape.lineTo(x + width, y + height - radius);
        shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        shape.lineTo(x + radius, y + height);
        shape.quadraticCurveTo(x, y + height, x, y + height - radius);
        shape.lineTo(x, y + radius);
        shape.quadraticCurveTo(x, y, x + radius, y);
        return shape;
    }

    function roundedBox(width, height, depth, radius, material, bevel = 0.025) {
        const geometry = new THREE.ExtrudeGeometry(roundedShape(width, height, radius), {
            depth,
            bevelEnabled: bevel > 0,
            bevelSegments: 3,
            steps: 1,
            bevelSize: bevel,
            bevelThickness: bevel,
            curveSegments: 8
        });
        geometry.translate(0, 0, -depth / 2);
        return new THREE.Mesh(geometry, material);
    }

    const phone = new THREE.Group();
    scene.add(phone);

    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0xb9b8b2,
        metalness: 0.88,
        roughness: 0.22
    });
    const backMaterial = new THREE.MeshStandardMaterial({
        color: 0xd4d3cd,
        metalness: 0.38,
        roughness: 0.29
    });
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x090d12,
        metalness: 0.12,
        roughness: 0.12,
        clearcoat: 1,
        clearcoatRoughness: 0.08
    });

    const chassis = roundedBox(1.72, 3.42, 0.16, 0.22, frameMaterial, 0.035);
    phone.add(chassis);

    const rearPanel = roundedBox(1.64, 3.34, 0.035, 0.2, backMaterial, 0.015);
    rearPanel.position.z = -0.07;
    phone.add(rearPanel);

    const screenFrame = roundedBox(1.57, 3.24, 0.045, 0.19, glassMaterial, 0.012);
    screenFrame.position.z = 0.094;
    phone.add(screenFrame);

    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const context = screenCanvas.getContext('2d');
    const wallpaper = context.createLinearGradient(0, 0, 512, 1024);
    wallpaper.addColorStop(0, '#f4c888');
    wallpaper.addColorStop(0.42, '#e8754f');
    wallpaper.addColorStop(1, '#253348');
    context.fillStyle = wallpaper;
    context.fillRect(0, 0, 512, 1024);
    context.globalAlpha = 0.45;
    context.fillStyle = '#f6e1bf';
    context.beginPath();
    context.ellipse(335, 330, 290, 230, -0.65, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 0.28;
    context.fillStyle = '#172334';
    context.beginPath();
    context.ellipse(120, 760, 340, 300, -0.45, 0, Math.PI * 2);
    context.fill();
    context.globalAlpha = 1;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(1.38, 2.97),
        new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false })
    );
    screen.position.z = 0.19;
    phone.add(screen);

    const sensorMaterial = new THREE.MeshStandardMaterial({ color: 0x080a0c, roughness: 0.18 });
    const island = roundedBox(0.48, 0.13, 0.018, 0.065, sensorMaterial, 0.005);
    island.position.set(0, 1.4, 0.19);
    phone.add(island);

    const cameraIsland = roundedBox(0.7, 0.88, 0.035, 0.15, frameMaterial, 0.012);
    cameraIsland.position.set(-0.4, 1.12, -0.105);
    phone.add(cameraIsland);

    const lensMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111722,
        metalness: 0.62,
        roughness: 0.12,
        clearcoat: 1
    });
    const lensRingMaterial = new THREE.MeshStandardMaterial({ color: 0x777872, metalness: 0.92, roughness: 0.2 });
    for (const [x, y] of [[-0.55, 1.39], [-0.27, 1.13], [-0.55, 0.87]]) {
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 0.035, 32), lensRingMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(x, y, -0.14);
        phone.add(ring);
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.04, 32), lensMaterial);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(x, y, -0.16);
        phone.add(lens);
    }

    const flash = new THREE.Mesh(
        new THREE.CircleGeometry(0.045, 24),
        new THREE.MeshBasicMaterial({ color: 0xffe6ad })
    );
    flash.position.set(-0.28, 1.43, -0.13);
    flash.rotation.y = Math.PI;
    phone.add(flash);

    const buttonMaterial = new THREE.MeshStandardMaterial({ color: 0x8c8d89, metalness: 0.82, roughness: 0.25 });
    const sideButton = (x, y, height = 0.42) => {
        const button = new THREE.Mesh(new THREE.BoxGeometry(0.055, height, 0.08), buttonMaterial);
        button.position.set(x, y, 0);
        phone.add(button);
    };
    sideButton(-0.88, 0.8, 0.34);
    sideButton(-0.88, 0.25, 0.5);
    sideButton(0.88, 0.62, 0.55);

    const floor = new THREE.Mesh(
        new THREE.CircleGeometry(1.4, 48),
        new THREE.MeshBasicMaterial({ color: 0x777166, transparent: true, opacity: 0.11 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.scale.set(1.2, 0.35, 1);
    floor.position.y = -1.92;
    scene.add(floor);

    let pointerDown = false;
    let previousX = 0;
    let previousY = 0;
    let velocityY = 0;
    let velocityX = 0;
    let manualRotationY = 0;
    let manualRotationX = 0;

    host.addEventListener('pointerdown', (event) => {
        pointerDown = true;
        previousX = event.clientX;
        previousY = event.clientY;
        host.setPointerCapture(event.pointerId);
    });
    host.addEventListener('pointermove', (event) => {
        if (!pointerDown) return;
        const deltaX = event.clientX - previousX;
        const deltaY = event.clientY - previousY;
        velocityY = deltaX * 0.008;
        velocityX = deltaY * 0.004;
        manualRotationY += velocityY;
        manualRotationX += velocityX;
        previousX = event.clientX;
        previousY = event.clientY;
    });
    const stopDragging = () => { pointerDown = false; };
    host.addEventListener('pointerup', stopDragging);
    host.addEventListener('pointercancel', stopDragging);

    const resizeObserver = new ResizeObserver(() => {
        const width = Math.max(host.clientWidth, 1);
        const height = Math.max(host.clientHeight, 1);
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = width < 500 ? 8.3 : 7.4;
        camera.updateProjectionMatrix();
    });
    resizeObserver.observe(host);

    const clock = new THREE.Clock();
    function animate() {
        const elapsed = clock.getElapsedTime();
        if (!pointerDown) {
            velocityY *= 0.94;
            velocityX *= 0.94;
            manualRotationY += velocityY;
            manualRotationX += velocityX;
            phone.position.y = Math.sin(elapsed * 1.2) * 0.065;
        }
        phone.rotation.y = -0.24 + Math.sin(elapsed * 0.42) * 0.22 + manualRotationY;
        phone.rotation.x = Math.sin(elapsed * 0.7) * 0.035 + manualRotationX;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();

    const fallback = host.querySelector('.scene-fallback');
    if (fallback) fallback.remove();
})();