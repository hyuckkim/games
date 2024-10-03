<script>
	import SceneCanvas from '$lib/sceneCanvas.svelte';
	import menuScene from './menuScene';
	import loadScene from './loadScene';
</script>

<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/fonts-archive/SEOLEIMcool/SEOLEIMcool.css"
  type="text/css"
/>

<SceneCanvas
	scene={[
	loadScene,
	menuScene,
	]}
/>
