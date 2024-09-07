export const touch = {
	all: [],
	get: id => touch.all.filter(t => t.id === id)[0],

	register: (name, ev) => {
		switch(name) {
			case 'start':
				touch.startEvents = [...touch.startEvents, ev];
				break;
			case 'move':
				touch.moveEvents = [...touch.moveEvents, ev];
				break;
			case 'end':
				touch.endEvents = [...touch.endEvents, ev];
				break;
		}	
	},
	unregister: (name, ev) => {
		switch(name) {
			case 'start':
				touch.startEvents = touch.startEvents.filter(
					e => e !== ev
				);
				break;
			case 'move':
				touch.moveEvents = touch.moveEvents.filter(
					e => e !== ev
				);
				break;
			case 'end':
				touch.endEvents = touch.endEvents.filter(
					e => e !== ev
				);
				break;
		}	
	},
	startEvents: [],
	moveEvents: [],
	endEvents: [],
}

export const touchStart = e => {
	e.preventDefault();
	for (let i = 0; i < e.changedTouches.length; i++) {
		const t = e.changedTouches[i];
		touch.all = [...touch.all, {
			x: t.clientX,
			y: t.clientY,
			id: t.identifier
		}];
		for (const e of touch.startEvents) {
			e(t.identifier);
		}
	}
}

export const touchMove = e => {
	e.preventDefault();
	l: for (let i = 0; i < e.changedTouches.length; i++) {
		const t = e.changedTouches[i];
		for (const o of touch.all) {
			if (t.identifier === o.id) {
				o.x = t.clientX;
				o.y = t.clientY;
				for (const e of touch.moveEvents) {
					e(t.identifier);
				}
				continue l;
			}
		}
	}
}

export const touchEnd = e => {
	e.preventDefault();
	for (let i = 0; i < e.changedTouches.length; i++) {
		const t = e.changedTouches[i];
		touch.all = touch.all.filter(
			o => t.identifier !== o.id
		);
		for (const e of touch.endEvents) {
			e(t.identifier);
		}
	}
}
