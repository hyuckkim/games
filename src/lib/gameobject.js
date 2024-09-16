export class GameObject {
	constructor(args) {	
		this.pos = {x: 0, y: 0};
		this.rotate = 0;
		this.draw = () => {};

		for (let key in args) {
			this[key] = args[key];
		}
	}

	drawing(ctx) {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(this.rotate);
		this.draw(ctx);
		ctx.restore();
	}
}
