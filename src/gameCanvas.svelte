<script>
	import {Canvas, Layer} from 'svelte-canvas';
	import {
		touchStart, 
		touchMove, 
		touchEnd
	} from './gameValue';

	export let render;
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
	 render({ ctx, w, h, t });	
	 }} />
</Canvas>
