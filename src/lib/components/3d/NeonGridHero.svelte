<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { pointer, viewport } from '$lib/stores/interaction';
	import { get } from 'svelte/store';
	import { experienceStore } from '$services/experience';

	let container: HTMLDivElement | null = null;
	let renderer: THREE.WebGLRenderer | null = null;
	let scene: THREE.Scene | null = null;
	let camera: THREE.PerspectiveCamera;
	let clock: THREE.Clock;
	let mesh: THREE.InstancedMesh | null = null;
	let raf = 0;
	let animationActive = true;

	// Theme variables
	let isLightMode = false;

	const dummy = new THREE.Object3D();
	
	// Configuration
	const COUNT = 800;
	const RANGE = 30;

	function cleanup() {
		cancelAnimationFrame(raf);
		
		if (scene) {
			scene.traverse((object) => {
				if (object instanceof THREE.Mesh) {
					if (object.geometry) object.geometry.dispose();
					if (object.material) {
						if (Array.isArray(object.material)) {
							object.material.forEach((m) => m.dispose());
						} else {
							object.material.dispose();
						}
					}
				}
			});
			scene = null;
		}

		if (renderer) {
			renderer.dispose();
			renderer.forceContextLoss();
			renderer.domElement?.remove();
			renderer = null;
		}
		
		if (mesh) {
			mesh.geometry.dispose();
			(mesh.material as THREE.Material).dispose();
			mesh = null;
		}
	}

	function init() {
		if (!container) return;

		// Cleanup previous instance if exists
		cleanup();

		// 1. Setup Renderer
		renderer = new THREE.WebGLRenderer({ 
			antialias: true, 
			alpha: true,
			powerPreference: "high-performance"
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.setSize(container.clientWidth, container.clientHeight);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.2;
		container.appendChild(renderer.domElement);

		// 2. Setup Scene
		scene = new THREE.Scene();
		// Subtle fog for depth
		scene.fog = new THREE.FogExp2(isLightMode ? '#F8FAFC' : '#0B1120', 0.02);

		// 3. Setup Camera
		camera = new THREE.PerspectiveCamera(
			50,
			container.clientWidth / container.clientHeight,
			0.1,
			100
		);
		camera.position.set(0, 0, 20);

		// 4. Lights (Crucial for Glass/Metal look)
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
		scene.add(ambientLight);

		const dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.position.set(10, 20, 10);
		scene.add(dirLight);

		const pointLight1 = new THREE.PointLight(0x6366F1, 2, 50); // Primary Brand Color
		pointLight1.position.set(-5, 5, 5);
		scene.add(pointLight1);

		const pointLight2 = new THREE.PointLight(0xF471B5, 2, 50); // Accent Pink
		pointLight2.position.set(5, -5, 5);
		scene.add(pointLight2);

		// 5. Geometry & Material (Instanced)
		// Using an Icosahedron for a "jewel" like look
		const geometry = new THREE.IcosahedronGeometry(0.4, 0);
		
		const material = new THREE.MeshPhysicalMaterial({
			color: isLightMode ? 0xffffff : 0x88ccff,
			metalness: 0.1,
			roughness: 0.1,
			transmission: 0.6, // Glass-like
			thickness: 1.0,
			clearcoat: 1.0,
			clearcoatRoughness: 0.1,
		});

		mesh = new THREE.InstancedMesh(geometry, material, COUNT);
		
		// Initialize positions randomly
		for (let i = 0; i < COUNT; i++) {
			dummy.position.set(
				(Math.random() - 0.5) * RANGE,
				(Math.random() - 0.5) * RANGE,
				(Math.random() - 0.5) * RANGE
			);
			dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		}
		
		scene.add(mesh);
		clock = new THREE.Clock();
	}

	function animate() {
		if (!mesh || !renderer || !scene || !camera) return;
		
		const time = clock.getElapsedTime();
		const { normalized } = get(pointer); // Mouse position (-1 to 1)

		// Gently rotate the whole cluster
		mesh.rotation.y = time * 0.05;
		mesh.rotation.x = normalized.y * 0.1;
		mesh.rotation.z = normalized.x * 0.1;

		// Update individual instances for "breathing" effect
		for (let i = 0; i < COUNT; i++) {
			mesh.getMatrixAt(i, dummy.matrix);
			dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);

			// Calculate a noise-like movement based on position and time
			const t = time * 0.5;
			const offset = i * 0.02; // distinct offset per particle
			
			// Gentle float
			dummy.position.y += Math.sin(t + offset) * 0.005;
			dummy.position.x += Math.cos(t + offset * 0.5) * 0.005;

			// Mouse repulsion (simple version)
			// Converting normalized mouse to world coords roughly at z=0
			const mouseX = normalized.x * 10;
			const mouseY = normalized.y * 10;
			const dist = Math.sqrt((dummy.position.x - mouseX) ** 2 + (dummy.position.y - mouseY) ** 2);
			
			if (dist < 5) {
				const angle = Math.atan2(dummy.position.y - mouseY, dummy.position.x - mouseX);
				const force = (5 - dist) * 0.02;
				dummy.position.x += Math.cos(angle) * force;
				dummy.position.y += Math.sin(angle) * force;
			}

			// Constant slow rotation
			dummy.rotation.x += 0.002;
			dummy.rotation.y += 0.002;

			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		}
		mesh.instanceMatrix.needsUpdate = true;

		// Camera drift
		camera.position.x += (normalized.x * 2 - camera.position.x) * 0.05;
		camera.position.y += (normalized.y * 2 - camera.position.y) * 0.05;
		camera.lookAt(0, 0, 0);

		renderer.render(scene, camera);
		raf = requestAnimationFrame(animate);
	}

	function resize() {
		if (!renderer || !container || !camera) return;
		const w = container.clientWidth;
		const h = container.clientHeight;
		renderer.setSize(w, h);
		camera.aspect = w / h;
		camera.updateProjectionMatrix();
	}

	onMount(() => {
		if (!browser) return;

		const unsubExperience = experienceStore.subscribe(state => {
			const newIsLight = state.theme === 'day';
			
			// Re-init if theme changed significantly or performance mode toggled
			if (newIsLight !== isLightMode || state.isPerformanceMode !== !animationActive) {
				isLightMode = newIsLight;
				
				if (state.isPerformanceMode) {
					animationActive = false;
					cleanup();
				} else {
					animationActive = true;
					init();
					animate();
				}
			}
		});

		// Initial start if not blocked by performance mode store (though store subscription handles it too)
		// We rely on the subscription to trigger init() initially to avoid race conditions

		const unsubViewport = viewport.subscribe(() => resize());

		return () => {
			unsubViewport();
			unsubExperience();
			cleanup();
		};
	});
</script>

{#if animationActive}
<div class="hero-canvas" bind:this={container} aria-hidden="true"></div>
{/if}

<style>
	.hero-canvas {
		position: absolute;
		inset: 0;
		/* Background is transparent to layer over FluidBackground */
		background: transparent;
		overflow: hidden;
		z-index: 0; 
		pointer-events: none; /* Let clicks pass through to buttons */
	}
</style>
