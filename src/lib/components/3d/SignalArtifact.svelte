<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';

	let host: HTMLDivElement;

	const vertexShader = `
		uniform float uTime;
		uniform vec2 uPointer;
		uniform float uScroll;

		varying vec3 vNormal;
		varying vec3 vPosition;
		varying float vSignal;

		float signal(vec3 p) {
			float a = sin(p.y * 4.2 + uTime * 0.72);
			float b = sin(p.x * 3.1 - uTime * 0.48);
			float c = sin((p.x + p.z) * 5.0 + uTime * 0.31);
			return (a + b + c) / 3.0;
		}

		void main() {
			vec3 p = position;
			float pulse = signal(p);
			float pointerWave = sin((p.y + uPointer.y * 1.8) * 3.0 + uTime) * uPointer.x;
			p += normal * (pulse * 0.13 + pointerWave * 0.035);
			p.y += sin(p.x * 2.0 + uTime * 0.35) * 0.035;
			p.z += uScroll * sin(p.y * 2.6) * 0.12;

			vec4 worldPosition = modelMatrix * vec4(p, 1.0);
			vNormal = normalize(normalMatrix * normal);
			vPosition = worldPosition.xyz;
			vSignal = pulse;
			gl_Position = projectionMatrix * viewMatrix * worldPosition;
		}
	`;

	const fragmentShader = `
		uniform float uTime;
		uniform float uScroll;

		varying vec3 vNormal;
		varying vec3 vPosition;
		varying float vSignal;

		void main() {
			vec3 viewDirection = normalize(cameraPosition - vPosition);
			float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vNormal)), 0.0), 2.35);
			float scan = smoothstep(0.44, 0.56, sin(vPosition.y * 18.0 - uTime * 1.15) * 0.5 + 0.5);
			float edge = smoothstep(0.08, 0.95, fresnel);

			vec3 ink = vec3(0.018, 0.019, 0.017);
			vec3 silver = vec3(0.62, 0.64, 0.59);
			vec3 signalColor = vec3(0.80, 1.0, 0.28);
			vec3 color = mix(ink, silver, fresnel * 0.58 + (vSignal + 1.0) * 0.035);
			color = mix(color, signalColor, edge * (0.34 + scan * 0.34));
			color += signalColor * scan * fresnel * 0.16;
			color *= 1.0 - uScroll * 0.22;

			gl_FragColor = vec4(color, 0.98);
		}
	`;

	onMount(() => {
		if (!host || !window.WebGLRenderingContext) return;

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const compact = window.matchMedia('(max-width: 700px)').matches;
		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: !compact,
			powerPreference: 'high-performance'
		});
		renderer.setClearColor(0x000000, 0);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.15 : 1.5));
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		host.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
		camera.position.set(0, 0, compact ? 11.2 : 9.2);

		const group = new THREE.Group();
		scene.add(group);

		const uniforms = {
			uTime: { value: 0 },
			uPointer: { value: new THREE.Vector2(0, 0) },
			uScroll: { value: 0 }
		};

		const detail = compact ? 4 : 5;
		const geometry = new THREE.IcosahedronGeometry(compact ? 2.08 : 2.42, detail);
		const material = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			uniforms,
			transparent: true
		});
		const artifact = new THREE.Mesh(geometry, material);
		artifact.rotation.set(-0.18, -0.5, 0.12);
		group.add(artifact);

		const wireMaterial = new THREE.MeshBasicMaterial({
			color: 0xc9ff51,
			wireframe: true,
			transparent: true,
			opacity: compact ? 0.055 : 0.075,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});
		const wire = new THREE.Mesh(geometry, wireMaterial);
		wire.scale.setScalar(1.012);
		artifact.add(wire);

		const particleCount = compact ? 480 : 980;
		const particlePositions = new Float32Array(particleCount * 3);
		for (let index = 0; index < particleCount; index += 1) {
			const radius = 3.25 + Math.random() * 3.6;
			const theta = Math.random() * Math.PI * 2;
			const phi = Math.acos(2 * Math.random() - 1);
			particlePositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
			particlePositions[index * 3 + 1] = radius * Math.cos(phi) * 0.72;
			particlePositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
		}
		const particleGeometry = new THREE.BufferGeometry();
		particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
		const particleMaterial = new THREE.PointsMaterial({
			color: 0xd9ff68,
			size: compact ? 0.014 : 0.018,
			transparent: true,
			opacity: 0.38,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});
		const particles = new THREE.Points(particleGeometry, particleMaterial);
		group.add(particles);

		const ringMaterial = new THREE.MeshBasicMaterial({
			color: 0xbadf56,
			transparent: true,
			opacity: 0.16,
			side: THREE.DoubleSide,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});
		const ring = new THREE.Mesh(new THREE.TorusGeometry(compact ? 2.9 : 3.45, 0.006, 4, 220), ringMaterial);
		ring.rotation.set(1.18, 0.25, 0.16);
		group.add(ring);

		const pointer = new THREE.Vector2(0, 0);
		const pointerTarget = new THREE.Vector2(0, 0);
		let scrollTarget = 0;
		let scrollCurrent = 0;
		let frame = 0;
		let visible = true;
		const clock = new THREE.Clock();

		const resize = () => {
			const width = host.clientWidth;
			const height = host.clientHeight;
			if (!width || !height) return;
			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		};

		const onPointerMove = (event: PointerEvent) => {
			pointerTarget.x = (event.clientX / window.innerWidth) * 2 - 1;
			pointerTarget.y = -(event.clientY / window.innerHeight) * 2 + 1;
		};

		const onScroll = () => {
			scrollTarget = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.2);
		};

		const onVisibility = () => {
			visible = !document.hidden;
			if (visible && !reduceMotion) {
				clock.getDelta();
				frame = requestAnimationFrame(render);
			}
		};

		const render = () => {
			if (!visible) return;
			const elapsed = clock.getElapsedTime();
			pointer.lerp(pointerTarget, 0.045);
			scrollCurrent += (scrollTarget - scrollCurrent) * 0.055;

			uniforms.uTime.value = elapsed;
			uniforms.uPointer.value.copy(pointer);
			uniforms.uScroll.value = scrollCurrent;

			group.rotation.y = elapsed * 0.055 + pointer.x * 0.2 + scrollCurrent * 0.46;
			group.rotation.x = pointer.y * 0.12 - scrollCurrent * 0.18;
			group.position.y = -scrollCurrent * 0.72;
			group.scale.setScalar(1 - scrollCurrent * 0.14);
			particles.rotation.y = -elapsed * 0.018;
			particles.rotation.z = elapsed * 0.01;
			ring.rotation.z = elapsed * 0.045;

			renderer.render(scene, camera);
			if (!reduceMotion) frame = requestAnimationFrame(render);
		};

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(host);
		window.addEventListener('pointermove', onPointerMove, { passive: true });
		window.addEventListener('scroll', onScroll, { passive: true });
		document.addEventListener('visibilitychange', onVisibility);
		resize();
		onScroll();
		render();

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('scroll', onScroll);
			document.removeEventListener('visibilitychange', onVisibility);
			geometry.dispose();
			material.dispose();
			wireMaterial.dispose();
			particleGeometry.dispose();
			particleMaterial.dispose();
			ring.geometry.dispose();
			ringMaterial.dispose();
			renderer.dispose();
			renderer.forceContextLoss();
			renderer.domElement.remove();
		};
	});
</script>

<div class="artifact" bind:this={host} aria-hidden="true"></div>

<style>
	.artifact {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.artifact :global(canvas) {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
