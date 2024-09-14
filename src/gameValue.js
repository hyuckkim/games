export class TouchInfo {
	constructor(x, y, id, time) {
		this.x = x;
		this.y = y;;
		this.id = id;
		this.time = time;
	}
	validate() {
		return touch.validate(this.id, this.t);
	}
	updatePos(x, y) {
		this.lx = this.x;
		this.ly = this.y;
		this.x = x;
		this.y = y;
	}
}

export const touch = {
	all: [],
	get: (id, t) => touch.all.filter(
			e => e.id === id
			&& (!t || e.t === t)
		)[0],

	validate: (id, t) => touch.all.filter(
			e => e.id === id
			&& (!t || e.t === t)
		).length !== 0,

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
