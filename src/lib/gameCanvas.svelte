<script>
	import { Canvas, Layer } from 'svelte-canvas';
	import { TouchInfo, touch } from './touch';

	export let render;
	export let update = () => {};
	let time = 0;

	const touchStart = e => {
		e.preventDefault();
		try {
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
		}} catch (err) {
			alert(err);
		}
	}

	const touchMove = e => {
		e.preventDefault();
		try {
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
		}} catch (err) {
			alert(err);
		}
	}

	const touchEnd = e => {
		e.preventDefault();
		for (let i = 0; i < e.changedTouches.length; i++) {
			const t = e.changedTouches[i];
			try {
				for (const ev of touch.endEvents) {
					ev(t.identifier);
				}} catch (err) {
					alert(err);
				}
			finally {
				touch.all = touch.all.filter(
					o => t.identifier !== o.id
				);
			}
		}
	}
</script>

<Canvas
	autoplay
	on:touchstart={touchStart}
	on:touchmove={touchMove}
	on:touchend={touchEnd}
	on:touchcancel={touchEnd}
	>

	<Layer 
		render={({
		context: ctx,
		width: w,
		height: h,
		time: t
	 }) => {
	 try {
	 const dt = t - time;
	 ctx.save();
	 render({ ctx, w, h, t });
	 update({ t, dt });
	 ctx.restore();
	 time = t;
	 } catch (err) {
	 	alert(err);
	 }
	 }} />
</Canvas>
