export let touches = [];

export const touchStart = e => {
	e.preventDefault();
	for (let i = 0; i < e.changedTouches.length; i++) {
		const t = e.changedTouches[i];
		touches = [...touches, {
			x: t.clientX,
			y: t.clientY,
			id: t.identifier
		}];
	}
}

export const touchMove = e => {
	e.preventDefault();
	l: for (let i = 0; i < e.changedTouches.length; i++) {
		const t = e.changedTouches[i];
		for (const o of touches) {
			if (t.identifier === o.id) {
				o.x = t.clientX;
				o.y = t.clientY;
				continue l;
			}
		}
	}
}

export const touchEnd = e => {
	e.preventDefault();
	for (let i = 0; i < e.changedTouches.length; i++) {
		const t = e.changedTouches[i];
		touches = touches.filter(
			o => t.identifier !== o.id
		);
	}
}
