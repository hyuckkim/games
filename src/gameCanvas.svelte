<script>
	import {Canvas, Layer} from 'svelte-canvas';
	import {
		touchStart, 
		touchMove, 
		touchEnd
	} from './gameValue';

	export let render;
	export let update = () => {};
	let time = 0;
</script>

<Canvas
	autoplay
	on:touchstart={touchStart}
	on:touchmove={touchMove}
	on:touchend={touchEnd}
	>

	<Layer 
		render={({
		context: ctx,
		width: w,
		height: h,
		time: t
	 }) => {
	 const dt = t - time;
	 render({ ctx, w, h, t });
	 update({ t, dt });
	 time = t;
	 }} />
</Canvas>
