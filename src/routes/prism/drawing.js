export const drawBG = ({ ctx, w, h }) => {
	ctx.save();
	ctx.fillStyle = '#aaa';
	ctx.strokeStyle = '#999';
	ctx.fillRect(0, 0, w, h);
	ctx.beginPath();
	for (let i = 10; i < w + h; i += 10) {
		if (i < w)
			ctx.moveTo(i, 0);
		else
			ctx.moveTo(w, i - w);
		ctx.lineTo(0, i);
	}
	ctx.stroke();
	ctx.restore();
}
