<script>
	import { Canvas, Layer } from 'svelte-canvas';
	import { TouchInfo, touch } from './touch';

	export let render;
	export let update = () => {};
	let time = 0;

	const touchStart = e => {
		e.preventDefault();
		for (let i = 0; i < e.changedTouches.length; i++) {
			const t = e.changedTouches[i];
			const newTouch = new TouchInfo(
				t.clientX,
				t.clientY,
				t.identifier,
				time
			);
			touch.all = [...touch.all, newTouch];
			for (const e of touch.startEvents) {
				e(t.identifier);
			}
		}
	}

	const touchMove = e => {
		e.preventDefault();
		l: for (let i = 0; i < e.changedTouches.length; i++) {
			const t = e.changedTouches[i];
			for (const o of touch.all) {
				if (t.identifier === o.id) {
					o.updatePos(t.clientX, t.clientY);
					for (const e of touch.moveEvents) {
						e(t.identifier);
					}
					continue l;
				}
			}
		}
	}

	const touchEnd = e => {
		e.preventDefault();
		for (let i = 0; i < e.changedTouches.length; i++) {
			const t = e.changedTouches[i];
			for (const e of touch.endEvents) {
				e(t.identifier);
			}
			touch.all = touch.all.filter(
				o => t.identifier !== o.id
			);
		}
	}
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
	 ctx.save();
	 render({ ctx, w, h, t });
	 update({ t, dt });
	 ctx.restore();
	 time = t;
	 }} />
</Canvas>
