import { Scene } from '$lib/scene';
import { touch } from '$lib/touch';

import { Block } from './block';
import {drawBG} from './drawing';

const rnd = num => Math.floor(Math.random() * num);

function generateRandomBlock(pos) {
	const colors = [
		'#ff595e',
		'#ffca3a',
		'#8ac926',
		'#1982c4',
		'#6a4c93'
	];
	const startIdx = rnd(5);
	const start = colors[startIdx];
	colors.splice(startIdx, 1);

	const endIdx = rnd(4);
	const end = colors[endIdx];
	colors.splice(endIdx, 1);
	
	const centerIdx = rnd(3);
	const center = Math.random() < 0.3
		? colors[centerIdx]
		: undefined;

	return new Block(
		pos,
		{ start, end, center }, 
		rnd(4),
		rnd(2)
	);
}


const menuScene = new Scene({
	blocks: [],
	lastupdate: 0,
	render: function ({ ctx, w, h, t }) {
		drawBG({ ctx, w, h });
		for (const b of this.blocks) {
			b.drawing(ctx);
		}

		const longest = [...this.blocks].sort((a, b) =>
			b.blocks.length - a.blocks.length)[0].blocks.length;
		ctx.fillStyle = '#000';
		ctx.fillText(`가장 긴 연결: ${longest}`, 0, 10);
	},
	update: function ({ t, dt }) {
		for (const b of this.blocks) {
			b.update(dt);
		}
		this.lastupdate = t;
	},
	start: function () {
		for (let i = 0; i < 10; i++) {
			const newBlock = generateRandomBlock({
				x: 30,
				y: 30
			});
			newBlock.pow = 0.7;
			newBlock.powd = Math.random() * Math.PI / 2;
			this.blocks.push(newBlock);
		}
	},
	quit: function () {
	},
	touchStart: function (t) {
		const cur = touch.get(t);
		for (const b of this.blocks.toReversed()) {
			if (b.touches.length < 2
				&& b.isCollide(cur)
				&& b.touches.indexOf(cur) === -1) {
				b.touches.push(cur);
				cur.block = b;
				this.blocks.splice(this.blocks.indexOf(b), 1);
				this.blocks.push(b);
				return true;
			}
		}
		return false;
	},
	touchMove: function (t) {
		const cur = touch.get(t);
		if (cur.block) {
			if (cur.block.touches.length === 1) {
				cur.block.translate(
					cur.x - cur.lx,
					cur.y - cur.ly
				);
			} else {
				cur.block.rotation(
					cur,
					cur.block.touches[
						cur.block.touches[0] === cur ? 1 : 0
					]
				);
			}
		}
	},
	touchEnd: function (t) {
		const cur = touch.get(t);
		const blo = cur.block;
		if (blo) {
			blo.touches.splice(
				blo.touches.indexOf(cur), 1
			);
			delete cur.block;

			for (const b of this.blocks.filter(b =>
				b.touches.length > 0 && b !== blo)) {
				const result = blo.asAttached(b);
				if (result) {
					this.blocks.splice(this.blocks.indexOf(blo), 1);
					break;
				}
			}
		} else {
			if (this.lastupdate - cur.time < 100) {
			const newBlock = generateRandomBlock({
				x: 30,
				y: 30
			});
			newBlock.pow = 0.7;
			newBlock.powd = Math.random() * Math.PI / 2;
			this.blocks.push(newBlock);
			}
		}
	},
})
export default menuScene;
