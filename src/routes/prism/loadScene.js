import { Scene, scenes } from '$lib/scene';
import menuScene from './menuScene';

import { drawBG } from './drawing';
import { Block } from './block';

const loadScene = new Scene({
	start: function() {
		this.b1 = new Block(
			{x: 100, y: 240},
			{start: "#f00", end: "#00f"},
			4, 2
		);
		this.b2 = new Block(
			{x: 230, y: 240},
			{start: "#f00", end: "#0f0"},
			3, 1
		);
	},
	render: function({ ctx, w, h, t }) {
		drawBG({ ctx, w, h });
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
	},

	touchEnd: function() {
		scenes.start(menuScene);
	},
});

export default loadScene;
