<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let gl: WebGLRenderingContext | null = null;
	let frame = 0;

	let params = {
		timeScale: 1,
		noiseScale: 2.2,
		chroma: 0.65,
		intensity: 1.0
	};

	const vertex = `
	attribute vec2 position;
	varying vec2 vUv;
	void main() {
	  vUv = position * 0.5 + 0.5;
	  gl_Position = vec4(position, 0.0, 1.0);
	}`;

	const fragment = `
	precision highp float;
	varying vec2 vUv;
	uniform float uTime;
	uniform float uNoise;
	uniform float uChroma;
	uniform float uIntensity;

	float hash(vec2 p){return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123);}
	float noise(in vec2 p){
	    vec2 i = floor(p);
	    vec2 f = fract(p);
	    vec2 u = f*f*(3.0-2.0*f);
	    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
	               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
	}

	void main(){
	  vec2 uv = vUv;
	  vec2 p = uv * uNoise;
	  float t = uTime * 0.25;
	  float n = noise(p + t) + noise(p*2.3 - t*0.8) * 0.5 + noise(p*4.1 + t*1.4) * 0.25;
	  float wave = sin((uv.x + n)*12.0 + t*6.0) * 0.5 + 0.5;
	  float vignette = smoothstep(0.9, 0.35, length(uv-0.5));
	  vec3 base = mix(vec3(0.03,0.05,0.12), vec3(0.0,0.7,1.0), wave);
	  vec3 chroma = vec3(sin(n*6.0 + uChroma), sin(n*5.0), sin(n*4.0 - uChroma));
	  vec3 color = mix(base, chroma, uChroma) * uIntensity * vignette;
	  gl_FragColor = vec4(color, 1.0);
	}`;

	function createShader(type: number, source: string) {
		if (!gl) return null;
		const shader = gl.createShader(type);
		if (!shader) return null;
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		return shader;
	}

	onMount(() => {
		if (!browser) return;
		gl = canvas.getContext('webgl');
		if (!gl) return;

		const vShader = createShader(gl.VERTEX_SHADER, vertex);
		const fShader = createShader(gl.FRAGMENT_SHADER, fragment);
		if (!vShader || !fShader) return;

		const program = gl.createProgram();
		if (!program) return;
		gl.attachShader(program, vShader);
		gl.attachShader(program, fShader);
		gl.linkProgram(program);
		gl.useProgram(program);

		const position = gl.getAttribLocation(program, 'position');
		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
			gl.STATIC_DRAW
		);
		gl.enableVertexAttribArray(position);
		gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

		const uTime = gl.getUniformLocation(program, 'uTime');
		const uNoise = gl.getUniformLocation(program, 'uNoise');
		const uChroma = gl.getUniformLocation(program, 'uChroma');
		const uIntensity = gl.getUniformLocation(program, 'uIntensity');

		function render() {
			if (!gl) return;
			const { clientWidth, clientHeight } = canvas;
			gl.viewport(0, 0, clientWidth, clientHeight);
			gl.uniform1f(uTime, performance.now() * 0.001 * params.timeScale);
			gl.uniform1f(uNoise, params.noiseScale);
			gl.uniform1f(uChroma, params.chroma);
			gl.uniform1f(uIntensity, params.intensity);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
			frame = requestAnimationFrame(render);
		}

		render();

		return () => {
			cancelAnimationFrame(frame);
			gl?.getExtension('WEBGL_lose_context')?.loseContext();
		};
	});
</script>

<div class="playground">
	<div class="panel">
		<h3 class="title">Lab Playground</h3>
		<p class="copy">Tweak shader parameters; the canvas reacts instantly.</p>
		<div class="controls">
			<label>Time scale <input type="range" min="0.2" max="2" step="0.1" bind:value={params.timeScale} /></label>
			<label>Noise scale <input type="range" min="0.5" max="4" step="0.1" bind:value={params.noiseScale} /></label>
			<label>Chroma split <input type="range" min="0" max="1" step="0.05" bind:value={params.chroma} /></label>
			<label>Intensity <input type="range" min="0.4" max="2" step="0.05" bind:value={params.intensity} /></label>
		</div>
	</div>
	<canvas bind:this={canvas} class="canvas" width="1200" height="640"></canvas>
</div>

<style>
	.playground {
		position: relative;
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
		background: radial-gradient(circle at 15% 20%, rgba(124, 247, 255, 0.14), transparent 40%),
			radial-gradient(circle at 70% 70%, rgba(255, 70, 201, 0.12), transparent 35%),
			linear-gradient(135deg, rgba(6, 7, 13, 0.92), rgba(5, 6, 12, 0.98));
		border: 1px solid rgba(124, 247, 255, 0.16);
		border-radius: 1.2rem;
		padding: 1rem;
		box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
		overflow: hidden;
	}

	.panel {
		position: relative;
		z-index: 2;
		padding: 1rem;
		border-radius: 1rem;
		backdrop-filter: blur(6px);
		background: rgba(7, 9, 18, 0.7);
		border: 1px solid rgba(255, 255, 255, 0.06);
		color: #e5f8ff;
	}

	.controls {
		display: grid;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	label {
		display: flex;
		flex-direction: column;
		font-size: 0.85rem;
		gap: 0.25rem;
	}

	input[type='range'] {
		accent-color: #7cf7ff;
	}

	.canvas {
		width: 100%;
		height: min(420px, 60vh);
		border-radius: 1rem;
		filter: saturate(1.15) contrast(1.05);
	}
</style>
