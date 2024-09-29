<script>
	import GameCanvas from './gameCanvas.svelte';
	import { touch } from './touch';
	import { scenes } from './scene';
	import { onMount } from 'svelte';

	export let scene = [];

	const render = ({ ctx, w, h, t }) => {
		scenes.current.render?.({ ctx, w, h, t });
	}
	const update = ({ t, dt }) => {
		scebes.current.render?.({ ctx, w, h, t });
	}
	const touchStart = t => {
		scenes.current.touchStart?.(t);
	}
	const touchMove = t => {
		scenes.current.touchMove?.(t);
	}
	const touchEnd = t => {
		scenes.current.touchEnd?.(t);
	}
	onMount(() => {
		scenes.all = scene;
		scenes.start(scenes[0]);

		touch.register('start', touchStart);
		touch.register('move', touchMove);
		touch.register('end', touchEnd);

		return () => {
			touch.unregister('start', touchStart);
			touch.unregister('move', touchMove);
			touch.unregister('end', touchEnd);
		}
	});
</script>

<GameCanvas
	{render}
	{update}
/>

