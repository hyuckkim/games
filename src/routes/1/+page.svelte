<script>
	import GameCanvas from '../../gameCanvas.svelte';
	import { touches } from '../../gameValue';

	const render = ({ ctx, w, h, t }) => {
		ctx.save();
		for (const t of touches) {
			ctx.fillRect(t.x - 100, t.y - 100, 200, 200);
		}
		ctx.restore();
	}
</script>

<GameCanvas {render} />
