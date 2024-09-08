<script>
	import GameCanvas from '../../gameCanvas.svelte';
	import { touch } from '../../gameValue';
	import { onMount } from 'svelte';
	import { GameObject } from '../../component/gameobject';

	let gameStart = 0;
	const gameEnd = () => (gameStart - p.t + 60000) / 100
		< 0;
	const p = {
		t: 0,
		s: 0,
		a: undefined,
		b: undefined,
		c: undefined,
		lc: undefined,
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

	const angleText = [
		'북', '북북동', '북동', '동북동',
		'동', '동남동', '남동', '남남동', 
		'남', '남남서', '남서', '서남서',
		'서', '서북서', '북서', '북북서',
	];
	const draw = {
		arrow: function(ctx) {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = '#111';
			ctx.font = '12px Fira Sans';
			ctx.textAlign = 'left';
			ctx.moveTo(0, 2);
			ctx.lineTo(100, 2);
			ctx.lineTo(98, 4);
			ctx.lineTo(105, 0);
			ctx.lineTo(98, -4);
			ctx.lineTo(100, -2);
			ctx.lineTo(0, -2);
			ctx.fill();
			ctx.rotate(-this.rotate);
			ctx.fillText(normAngle(this.rotate)
				.toFixed(4), 
				50, -20
			),
			ctx.restore();
		},
		arr: function(ctx) {
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
			ctx.restore();
		},
		
	}
	const arrow = new GameObject({ draw: draw.arrow });
	const arrows = [];
	const normAngle = rad => {
		return (rad / Math.PI * 180 + 450) % 360
	}
	const toRad = ang => {
		return (ang - 90) / 180 * Math.PI;
	}
	const newEnemy = () => {
		const rotate = Math.floor(Math.random() * 16);
		return new GameObject({
			draw: (ctx) => {
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(150, 10);
				ctx.lineTo(150, -10);
				ctx.lineTo(158, 0);
				ctx.fill();
				ctx.restore();
			},
			rotate: toRad(rotate * 22.5),
			angle: rotate,
		});
	}
	let enemy = newEnemy();

	const onStart = f => {
		if (!gameStart) {
			gameStart = p.t;
			return;
		}
		if (gameEnd()) return;
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
		}
		if (p.b.id === f) {
			p.b = undefined;
		}
		if (p.c.id === f) {
			const a = new GameObject({
				draw: draw.arr, 
				update: function({ dt }) {
					const speed = 3;
					this.pos.x += Math.cos(this.rotate)*speed*dt;
					this.pos.y += Math.sin(this.rotate)*speed*dt;
					this.life -= dt;
				},
				pos: {x: p.c.x, y: p.c.y},
				rotate: p.d(),
				life: 300,
			});
			arrows.push(a);
			p.c = undefined;
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
		if (gameStart) {
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

			ctx.fillStyle = '#111';
			ctx.textAlign = 'left';
			ctx.font = '20px Fira Sans';
			ctx.fillText('Next target: ', 0, 20);
			ctx.font = '14px Fira Sans';
			ctx.fillText(`${angleText[enemy.angle]}`, 
				10, 40);
			// enemy.pos = p.c ?? p.lc ?? {x: w/2, y: h/2};
			// enemy.drawing(ctx);

			ctx.font = '22px Fira Sans';
			ctx.textAlign = 'center';
			ctx.fillText(Math.max(
				(gameStart - t + 60000) / 1000,
				0)
				.toFixed(0),	w / 2, 30);

			ctx.font = '20px Fira Sans';
			ctx.textAlign = 'right';
			ctx.fillText(`Score: ${p.s}`, w - 10, 20);
			ctx.restore();
		} else {
			ctx.save();
			ctx.fillStyle = '#273';
			ctx.fillRect(0, 0, w, h);
			ctx.fillStyle = '#fff';
			ctx.beginPath();
			ctx.moveTo(w / 2 - 94, h / 2 - 100);
			ctx.lineTo(w / 2 - 94, h / 2 + 100);
			ctx.lineTo(w / 2 + 94, h / 2);
			ctx.fill();

			ctx.restore();
		}
	}
	const update = ({ t, dt }) => {
		p.t = t;
		if (p.c) p.lc = p.c;
		for (const a of arrows) {
			a.update({ t, dt });
		}
		for (let i = 0; i < arrows.length; i++) {
			if (arrows[i].life < 0) {
					const angle = normAngle(arrows[i].rotate)
					if (angle > enemy.angle * 22.5 - 12 
						&& angle < enemy.angle * 22.5 + 12) {
						p.s++;
						enemy = newEnemy();
					}
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
