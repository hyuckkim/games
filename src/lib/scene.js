export class Scene {
	constructor(args) {
		for (let key in args) {
			this[key] = args[key];
		}
	}
}

export const scenes = {
	all: [],
	start: (scene) => {
		if (scenes.current) {
			scenes.current.quit?.();
		}
		scenes.current = scene;
		scenes.current.start?.();
	}
}
