export class Scene {
	constructor(args) {
		this.enabled = false;
		
		for (let key in args) {
			this[key] = args[key];
		}
	}

	enable() {
		this.enabled = true;
		this.start?.();
	}
	disable() {
		this.enabled = false;
		this.quit?.();
	}
}

export const scenes = {
	all: [],
}
