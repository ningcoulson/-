class BlackHole3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.blackHole = null;
        this.accretionDisk = null;
        this.jets = null;
        this.particles = null;
        this.stars = null;
        this.time = 0;
               this.mouseX = 0;
        this.mouseY = 0;
        
        this.init();
        this.createScene();
        this.createBlackHole();
        this.createAccretionDisk();
        this.createJets();
        this.createParticles();
        this.createStars();
        this.setupControls();
        this.animate();
    }

    init() {
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // 创建相机
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 100;

        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('container').appendChild(this.renderer.domElement);

        // 鼠标交互
        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // 窗口大小调整
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 隐藏加载提示
        document.getElementById('loading').style.display = 'none';
    }

    createBlackHole() {
        // 黑洞核心 - 黑色球体
        const blackHoleGeometry = new THREE.SphereGeometry(8, 32, 32);
        const blackHoleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: 1
        });
        this.blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
        this.scene.add(this.blackHole);

        // 引力井效果 - 多层透明球体
        for (let i = 0; i < 5; i++) {
            const gravityGeometry = new THREE.SphereGeometry(12 + i * 8, 32, 32);
            const gravityMaterial = new THREE.MeshBasicMaterial({
                color: 0x404040,
                transparent: true,
                opacity: 0.1 - i * 0.02,
                side: THREE.BackSide
            });
            const gravityWell = new THREE.Mesh(gravityGeometry, gravityMaterial);
            this.scene.add(gravityWell);
        }
    }

    createAccretionDisk() {
        // 吸积盘 - 扁平圆环
        const diskGeometry = new THREE.RingGeometry(15, 80, 64);
        const diskMaterial = new THREE.MeshBasicMaterial({
            color: 0x4080ff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        this.accretionDisk = new THREE.Mesh(diskGeometry, diskMaterial);
        this.accretionDisk.rotation.x = Math.PI / 2;
        this.scene.add(this.accretionDisk);
    }

    createJets() {
        // 上方喷流
        const topJetGeometry = new THREE.CylinderGeometry(2, 8, 100, 8);
        const topJetMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.6
        });
        const topJet = new THREE.Mesh(topJetGeometry, topJetMaterial);
        topJet.position.y = 50;
        this.scene.add(topJet);

        // 下方喷流
        const bottomJetGeometry = new THREE.CylinderGeometry(2, 8, 100, 8);
        const bottomJetMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.6
        });
        const bottomJet = new THREE.Mesh(bottomJetGeometry, bottomJetMaterial);
        bottomJet.position.y = -50;
        bottomJet.rotation.z = Math.PI;
        this.scene.add(bottomJet);

        this.jets = { top: topJet, bottom: bottomJet };
    }

    createParticles() {
        const particleCount = 2000;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // 位置 - 在吸积盘范围内
            const angle = Math.random() * Math.PI * 2;
            const radius = 20 + Math.random() * 60;
            const height = (Math.random() - 0.5) * 10;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = height;
            positions[i3 + 2] = Math.sin(angle) * radius;
            
            // 颜色 - 白色和金黄色
            const isGold = Math.random() < 0.5;
            if (isGold) {
                colors[i3] = 1.0;     // R
                colors[i3 + 1] = 0.8; // G
                colors[i3 + 2] = 0.4; // B
            } else {
                colors[i3] = 1.0;     // R
                colors[i3 + 1] = 1.0; // G
                colors[i3 + 2] = 1.0; // B
            }
            
            // 大小
            sizes[i] = Math.random() * 2 + 0.5;
            
            // 初始速度
            velocities[i3] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.5;
            velocities[i3 + 2] = (Math.random() - 0.5) * 0.5;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }

    createStars() {
        const starCount = 1000;
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        const starSizes = new Float32Array(starCount);

        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // 随机位置
            starPositions[i3] = (Math.random() - 0.5) * 400;
            starPositions[i3 + 1] = (Math.random() - 0.5) * 400;
            starPositions[i3 + 2] = (Math.random() - 0.5) * 400;
            
            // 颜色 - 白色和金黄色
            const isGold = Math.random() < 0.3;
            if (isGold) {
                starColors[i3] = 1.0;
                starColors[i3 + 1] = 0.8;
                starColors[i3 + 2] = 0.4;
            } else {
                starColors[i3] = 1.0;
                starColors[i3 + 1] = 1.0;
                starColors[i3 + 2] = 1.0;
            }
            
            starSizes[i] = Math.random() * 2 + 0.5;
        }

        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

        const starMaterial = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    setupControls() {
        const controls = ['accretionSpeed', 'jetSpeed', 'particleCount', 'brightness', 'cameraDistance'];
        controls.forEach(controlId => {
            const control = document.getElementById(controlId);
            const valueDisplay = document.getElementById(controlId + 'Value');
            
            control.addEventListener('input', (e) => {
                valueDisplay.textContent = e.target.value;
                if (controlId === 'particleCount') {
                    this.createParticles();
                }
            });
        });
    }

    updateParticles() {
        const positions = this.particles.geometry.attributes.position.array;
        const velocities = this.particles.geometry.attributes.velocity.array;
        const accretionSpeed = parseFloat(document.getElementById('accretionSpeed').value);
        const jetSpeed = parseFloat(document.getElementById('jetSpeed').value);
        const brightness = parseFloat(document.getElementById('brightness').value);

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const y = positions[i + 1];
            const z = positions[i + 2];
            
            // 计算到黑洞中心的距离
            const distance = Math.sqrt(x * x + y * y + z * z);
            
            if (distance > 10) {
                // 向心力
                const force = 0.1 * accretionSpeed;
                const angle = Math.atan2(z, x);
                
                velocities[i] += -Math.cos(angle) * force;
                velocities[i + 2] += -Math.sin(angle) * force;
                
                // 切向力 - 产生旋转
                const perpendicular = angle + Math.PI / 2;
                const tangentialForce = 0.05 * accretionSpeed;
                
                velocities[i] += Math.cos(perpendicular) * tangentialForce;
                velocities[i + 2] += Math.sin(perpendicular) * tangentialForce;
                
                // 喷流效果
                if (Math.random() < 0.1) {
                    velocities[i + 1] += (Math.random() - 0.5) * 0.5 * jetSpeed;
                }
            }
            
            // 更新位置
            positions[i] += velocities[i];
            positions[i + 1] += velocities[i + 1];
            positions[i + 2] += velocities[i + 2];
            
            // 阻力
            velocities[i] *= 0.99;
            velocities[i + 1] *= 0.99;
            velocities[i + 2] *= 0.99;
            
            // 边界检查
            if (distance > 100 || Math.abs(y) > 50) {
                // 重置粒子
                const angle = Math.random() * Math.PI * 2;
                const radius = 20 + Math.random() * 60;
                const height = (Math.random() - 0.5) * 10;
                
                positions[i] = Math.cos(angle) * radius;
                positions[i + 1] = height;
                positions[i + 2] = Math.sin(angle) * radius;
                
                velocities[i] = (Math.random() - 0.5) * 0.5;
                velocities[i + 1] = (Math.random() - 0.5) * 0.5;
                velocities[i + 2] = (Math.random() - 0.5) * 0.5;
            }
        }
        
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.material.opacity = 0.8 * brightness;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // 更新粒子
        this.updateParticles();
        
        // 旋转吸积盘
        if (this.accretionDisk) {
            this.accretionDisk.rotation.z += 0.01 * parseFloat(document.getElementById('accretionSpeed').value);
        }
        
        // 旋转喷流
        if (this.jets) {
            this.jets.top.rotation.z += 0.02 * parseFloat(document.getElementById('jetSpeed').value);
            this.jets.bottom.rotation.z += 0.02 * parseFloat(document.getElementById('jetSpeed').value);
        }
        
        // 旋转星空
        if (this.stars) {
            this.stars.rotation.y += 0.001;
        }
        
        // 相机控制
        const cameraDistance = parseFloat(document.getElementById('cameraDistance').value);
        this.camera.position.x = Math.sin(this.time * 0.1) * cameraDistance * 0.1;
        this.camera.position.z = cameraDistance;
        this.camera.lookAt(0, 0, 0);
        
        // 渲染
        this.renderer.render(this.scene, this.camera);
    }
}

// 启动动画
window.addEventListener('load', () => {
    new BlackHole3D();
});
