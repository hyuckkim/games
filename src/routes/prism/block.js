import { GameObject } from '$lib/gameobject';

const coord = {
	p: (a, b) => {return {x: a.x + b.x, y: a.y + b.y}},
	m: (a, b) => {return {x: a.x - b.x, y: a.y - b.y}},
}
function rotatePoint({x, y}, theta, origin) {
	return {
		x: x * Math.cos(theta) - y * Math.sin(theta)
			+ (origin?.x ?? 0),
		y: x * Math.sin(theta) + y * Math.cos(theta)
			+ (origin?.y ?? 0)
	};
}
function distance({x: x1, y: y1}, {x: x2, y: y2}) {
	return (x1-x2)**2 + (y1-y2)**2;
}
function distanceThan(a, b, dist) {
	return distance(a, b) < dist**2;
}
function moveToDir({x, y, dir}, dist) {
	switch (dir) {
		case 0:
			return {x: x + dist, y};
		case 1:
			return {x, y: y + dist};
		case 2:
			return {x: x - dist, y};
		case 3:
			return {x, y: y - dist};
	}
	return {x, y};
}
function makeGradient(ctx, variant, colors) {
	if (variant === 1) {
		const g = ctx.createLinearGradient(
			0, -50, 0, 50
		);
		g.addColorStop(0.1, colors.start);
		g.addColorStop(0.9, colors.end);
		if (colors.center)
			g.addColorStop(0.5, colors.center)
		return g;
	} else {
		const g = ctx.createConicGradient(
			Math.PI / 2, 50, -50
		);
		g.addColorStop(0.025, colors.start);
		g.addColorStop(0.225, colors.end);
		if (colors.center)
			g.addColorStop(0.125, colors.center);
		return g;
	}
}
function setShadow(ctx, enabled) {
	ctx.shadowColor = '#111a';
	if (enabled) {
		ctx.shadowBlur = 8;
		ctx.shadowOffsetX = 10;
		ctx.shadowOffsetY = 10;
	} else {
		ctx.shadowBlur = 2;
		ctx.shadowOffsetX = 5;
		ctx.shadowOffsetY = 5;
	}
}
function sortBlock(a, b, arr) {
	const aa = rotatePoint(a.pos, arr);
	const bb = rotatePoint(b.pos, arr);
	return aa.x + aa.y - bb.x - bb.y;
}
function drawBlock(ctx, {
	variant,
	colors,
	pos,
	rotate
}, hasShadow) {
	ctx.save();
	ctx.translate(pos.x, pos.y);
	ctx.rotate(rotate / 2 * Math.PI);
	ctx.fillStyle = makeGradient(ctx, variant, colors);
	setShadow(ctx, hasShadow);
	ctx.fillRect(-50, -50, 100, 100);
	ctx.restore();
}

export class Block extends GameObject {
	constructor(pos, colors, rotate, variant) {
		const no = rotate => ({x: 0, y: 0, dir: rotate % 4});
		super({
			pos,
			rotate: 0,
			touches: [],
			blocks: [{ variant, colors, pos: {x: 0, y: 0}, rotate}],
			points: variant === 1
				? [
					{...moveToDir(no(rotate + 3), 50), 
					dir: (rotate + 3) % 4, color: colors.start},
					{...moveToDir(no(rotate + 1), 50), 
					dir: (rotate + 1) % 4, color: colors.end},
				]
				: [
					{...moveToDir(no(rotate), 50), 
					dir: (rotate) % 4, color: colors.start},
					{...moveToDir(no(rotate + 3), 50), 
					dir: (rotate + 3) % 4, color: colors.end},
				],
			draw: function (ctx) {
				for (const b of this.blocks.sort((a, b) => sortBlock(
					a, b, this.rotate))) {
					drawBlock(ctx, b, this.touches.length > 0);
				}
				for (const p of this.points) {
					ctx.fillStyle = p.color;
					ctx.fillRect(p.x - 5, p.y - 5, 10, 10);
				}
			},
			update: function (dt) {
				if (this.touches.lengt > 1 
				&& !this.touches[1].validate()) {
					this.touches.splice(1, 1);
				}
				if (this.touches.length > 0
				&& !this.touches[0].validate()) {
					this.touches.splice(0, 1);
				}
				if (this.pow > 0 && this.touches.length === 0) {
					this.pos.x += Math.cos(this.powd) * this.pow * dt;
					this.pos.y += Math.sin(this.powd) * this.pow * dt;
					this.pow = Math.max(0, this.pow - dt * 0.001);
				}
			},
			pow: 0,
			powd: 0,
		});
	}

	isCollide(pos) {
		for (const b of this.blocks) {
			const p = rotatePoint(b.pos, this.rotate, this.pos);
			if (distanceThan(pos, p, 70)) return true;
		}
		return false;
	}
	asAttached(other) {
		for (const i in this.points) {
			const m = this.points[i];
			const om = this.points[1 - i];
			const mp = rotatePoint(m, this.rotate, this.pos);
			for (const j in other.points) {
				const n = other.points[j];
				const np = rotatePoint(n, other.rotate, other.pos);
				if (m.color === n.color
				&& distanceThan(mp, np, 20)
				&& this.isAllowBlock(other, m, n)) {
					other.points[j] = this
						.asOthersBlock(other, om, m, n);
					return true;
				}
			}
		}
	}
	isAllowBlock(other, thisPoint, otherPoint) {
		const moving = p => coord.p(rotatePoint(
			coord.m(p, thisPoint),
			(otherPoint.dir + 2 - thisPoint.dir) * Math.PI / 2
		), otherPoint);
		for (const b of this.blocks) {
			const bp = moving(b.pos);
			for (const c of other.blocks) {
				if (distanceThan(bp, c.pos, 1)) return false;
			}
		}
		return true;
	}
	asOthersBlock(other, rp, thisPoint, otherPoint) {
		const moving = p => coord.p(rotatePoint(
			coord.m(p, thisPoint),
			(otherPoint.dir + 2 - thisPoint.dir) * Math.PI / 2
		), otherPoint);

		const nrp = moving(rp);
		for (const b of this.blocks) {
			other.blocks.push({...b,
				pos: moving(b.pos),
				rotate: (b.rotate + otherPoint.dir + 2 - thisPoint.dir) % 4,
			});
		}

		return {
			...rp,
			...nrp,
			dir: (rp.dir + otherPoint.dir + 2 - thisPoint.dir) % 4
		};
	}
	translate(x, y) {
		this.pos.x += x;
		this.pos.y += y;
	}
	rotation(t, axis) {
		const dth = (Math.atan2(t.y - axis.y, t.x - axis.x)
			- Math.atan2(t.ly - axis.y, t.x - axis.x));
		const nth = Math.atan2(
			this.pos.y - axis.y,
			this.pos.x - axis.x
		) + dth;
		const dst = Math.sqrt(
			(this.pos.x - axis.x) ** 2 +
			(this.pos.y - axis.y) ** 2
		);

		this.rotate += dth;
		this.pos.y = axis.y + Math.sin(nth) * dst;
		this.pos.x = axis.x + Math.cos(nth) * dst;
	}
}
