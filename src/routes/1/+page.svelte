<script>
	import {Canvas, Layer} from 'svelte-canvas';
</script>

<Canvas
	on:touchstart={(e) => {
		e.preventDefault();
	}}>
	<Layer render={({
		context: ctx,
		width: w,
		height: h,
		time: t
	}) => {
		ctx.fillStyle = 'black';
		ctx.fillRect(w/4, h/4, w/2, h/2);
	}} />
</Canvas>
