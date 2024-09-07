<script>
	import GameCanvas from '../../gameCanvas.svelte';
	import { touch } from '../../gameValue';
	import { onMount } from 'svelte';
	import { GameObject } from '../../component/gameobject';

	const p = {
		a: undefined,
		b: undefined,
		c: undefined,
		d: () => {
			if (!(p.a && p.b && p.c)) return undefined;
			const d = {
				x: (p.a.x + p.b.x) / 2,
				y: (p.a.y + p.b.y) / 2
			};
			return Math.atan2(d.y - p.c.y, d.x - p.c.x);
		},
		p: () => {
			if (!(p.a && p.b && p.c)) return undefined;
			const d = {
				x: (p.a.x + p.b.x) / 2,
				y: (p.a.y + p.b.y) / 2
			};
			const dir = Math.atan2(d.y - p.c.y, d.x - p.c.x);
			return {
				x: p.c.x + Math.cos(dir) * 100,
				y: p.c.y + Math.sin(dir) * 100
			}
		}
	};

	const draw = {
		arrow: function(ctx) {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = '#111';
			ctx.moveTo(0, 2);
			ctx.lineTo(100, 2);
			ctx.lineTo(98, 4);
			ctx.lineTo(105, 0);
			ctx.lineTo(98, -4);
			ctx.lineTo(100, -2);
			ctx.lineTo(0, -2);
			ctx.fill();
			ctx.rotate(-this.rotate);
			ctx.fillText(
				((this.rotate / Math.PI * 180 + 450) % 360)
				.toFixed(6), 
				50, -20
			);
			ctx.restore();
		},
	}
	const arrow = new GameObject({ draw: draw.arrow });
	const arrows = [];

	const onStart = f => {
		if (p.a === undefined) {
			p.a = touch.get(f);
			return;
		}
		if (p.b === undefined) {
			p.b = touch.get(f);
			return;
		}
		if (p.c === undefined) {
			if (distanceToLineSegment(
				p.a,
				p.b,
				touch.get(f)
			) < 50) {
				p.c = touch.get(f);
			}
			return;
		}
	};
	const onEnd = f => {
		if (p.a.id === f) {
			p.a = undefined;
			return;
		}
		if (p.b.id === f) {
			p.b = undefined;
			return;
		}
		if (p.c.id === f) {
			const a = new GameObject({
				draw: draw.arrow, 
				update: function({ dt }) {
					const speed = 3;
					this.pos.x += Math.cos(this.rotate)*speed*dt;
					this.pos.y += Math.sin(this.rotate)*speed*dt;
					this.life -= dt;
				},
				pos: {x: p.c.x, y: p.c.y},
				rotate: p.d(),
				life: 2000,
			});
			arrows.push(a);
			p.c = undefined;
			return;
		}
	};
	onMount(() => {
		touch.register('start', onStart);
		touch.register('end', onEnd);

	return () => {
		touch.unregister('start', onStart);
		touch.unregister('end', onEnd);
	};
	});

	const render = ({ ctx, w, h, t }) => {
		ctx.save();
		ctx.fillStyle = '#273';
		ctx.fillRect(0, 0, w, h);

		for (const a of arrows) {
			a.drawing(ctx);
		}

		if (p.a && p.b) {
			ctx.beginPath();
			ctx.strokeStyle = '#eee';
			ctx.lineWidth = 1;
			ctx.moveTo(p.a.x, p.a.y);
			if (p.c) {
				ctx.lineTo(p.c.x, p.c.y);
			}
			ctx.lineTo(p.b.x, p.b.y);
			ctx.stroke();
		}

		if (p.a && p.b && p.c) {
			arrow.pos = p.c;
			arrow.rotate = p.d();
			arrow.drawing(ctx);
		}
		ctx.restore();
	}
	const update = ({ t, dt }) => {
		for (const a of arrows) {
			a.update({ t, dt });
		}
		for (let i = 0; i < arrows.length; i++) {
			if (arrows[i].life < 0) {
				arrows.splice(i, 1);
				i--;
			}
		}
	}

	function distanceToLineSegment(p1, p2, p) {
		const segmentLength = Math.sqrt(
			(p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2
		);

    if (segmentLength === 0) {
			return Math.sqrt(
				(p.x - p1.x) ** 2 + (p.y - p1.y) ** 2
			);
    }

		const t = Math.max(0, Math.min(1, 
			((p.x - p1.x) * (p2.x - p1.x) 
			+ (p.y - p1.y) * (p2.y - p1.y))
			/ segmentLength ** 2));
    const projectionX = p1.x + t * (p2.x - p1.x);
    const projectionY = p1.y + t * (p2.y - p1.y);

		return Math.sqrt(
			(p.x - projectionX) ** 2 + (p.y - projectionY) ** 2
		);
}
</script>

<GameCanvas {render} {update} />
