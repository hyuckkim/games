import { Scene, scenes } from '$lib/scene';
import menuScene from './menuScene';

import { drawBG } from './drawing';

const loadScene = new Scene({
	render: function({ ctx, w, h, t }) {
		drawBG({ ctx, w, h });
		ctx.fillStyle = '#fff';
		ctx.roundRect(30, 30, w - 60, h - 60, 5);	
		ctx.fill();
	},

	touchEnd: function() {
		scenes.start(menuScene);
	},
});

export default loadScene;
