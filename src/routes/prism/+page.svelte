<script>
	import SceneCanvas from '$lib/sceneCanvas.svelte';
	import menuScene from './menuScene';
	import loadScene from './loadScene';
</script>

<SceneCanvas
	scene={[
	loadScene,
	menuScene,
	]}
/>
