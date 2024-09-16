<script>
	import GameCanvas from './gameCanvas.svelte';
	import { touch } from './touch';
	import { scenes } from './scene';
	import { onMount } from 'svelte';

	export let scene = [];

	const render = ({ ctx, w, h, t }) => {
		for (const s of scenes.all.filter(s => s.enabled)) {
			s.render?.({ ctx, w, h, t });
		}
	}
	const update = ({ t, dt }) => {
		for (const s of scenes.all.filter(s => s.enabled)) {
			s.update?.({ t, dt });
		}
	}
	const touchStart = t => {
		for (const s of scenes.all
			.filter(s => s.enabled)
			.toReversed()) {
			if (s.touchStart?.(t)) return;
		}
	}
	const touchMove = t => {
		for (const s of scenes.all
			.filter(s => s.enabled)
			.toReversed()) {
			if (s.touchMove?.(t)) return;
		}
	}
	const touchEnd = t => {
		for (const s of scenes.all
			.filter(s => s.enabled)
			.toReversed()) {
			if (s.touchEnd?.(t)) return;
		}
	}
	onMount(() => {
		scene[0]?.enable();
		scenes.all = scene;

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

