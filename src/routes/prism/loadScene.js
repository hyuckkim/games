import { Scene, scenes } from '$lib/scene';
import menuScene from './menuScene';
import { touch } from '$lib/touch';

import { drawBG } from './drawing';
import { Block } from './block';
import { colors } from './colors';

function drawGradientCircle(ctx, x, y, idx) {
	const r = 25;
	const gradient = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
	gradient.addColorStop(0.1, colors.all[idx][0]);
	gradient.addColorStop(0.9, colors.all[idx][1]);
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fillStyle = gradient;
	ctx.fill();
}
function isAdjestPos(p, t) {
	const r = 25;
	return (t.x - p.x) < r && (p.x - t.x) < r && (t.y - p.y) < r && (p.y - t.y) < r; 
}
const loadScene = new Scene({
	start: function() {
		this.b1 = new Block(
			{x: 100, y: 240},
			{start: colors.all[0][0], end: colors.all[0][1]},
			4, 2
		);
		this.b2 = new Block(
			{x: 230, y: 240},
			{start: colors.all[0][0], end: colors.all[0][2]},
			3, 1
		);
	},
	render: function({ ctx, w, h, t }) {
		drawBG({ ctx, w, h });
		ctx.beginPath();
		ctx.fillStyle = '#fff';
		ctx.roundRect(30, 30, w - 60, h - 60, 5);	
		ctx.fill();

		ctx.textAlign = 'start';
		ctx.fillStyle = '#08d';
		ctx.font = '72px SEOLEIM cool';
		ctx.fillText('프리즘', 50, 110);

		this.b1.drawing(ctx);
		this.b2.drawing(ctx);
		
		ctx.fillStyle = '#000';
		ctx.font = '16px SEOLEIM cool';
		ctx.fillText('1. 두 블럭을 들어올리고 홈을 맞추세요.',  50, 320);
		ctx.fillText('2. 블럭을 최대한 길게 연결해보세요.', 50, 345);
		ctx.fillText('3. 블럭이 부족하면 빈 공간을 터치해보세요.', 50, 370);

		ctx.textAlign = 'center';
		ctx.fillText(' - 아무 곳이나 눌러 시작하세요 - ', w / 2, h-40);

		for (const i in colors.all) {
			drawGradientCircle(ctx, 80 + 55 * i, 440, i);
		}
	},

	touchEnd: function(t) {
		for (const i in colors.all) {
			const tou = touch.get(t);
			if (isAdjestPos(tou, {x: 80 + 55 * i, y: 440})) {
				colors.idx = i;
				this.b1.blocks[0].colors.start = colors.get()[0];
				this.b1.points[0].color = colors.get()[0];
				this.b1.blocks[0].colors.end = colors.get()[1];
				this.b1.points[1].color = colors.get()[1];
				this.b2.blocks[0].colors.start = colors.get()[0];
				this.b2.points[0].color = colors.get()[0];
				this.b2.blocks[0].colors.end= colors.get()[2];
				this.b2.points[1].color = colors.get()[2];
				return;
			}
		}
		scenes.start(menuScene);
	},
});

export default loadScene;
