import Dimension from "./Dimension";

export default class Item {
	constructor (readonly idItem: number, readonly description: string, readonly price: number, readonly dimension?: Dimension, readonly weight?: number) {
		if (weight && weight < 0) throw new Error("Invalid weight");
	}

	getVolume () {
		if (this.dimension) {
			return this.dimension.getVolume();
		} else {
			return 0;
		}
	}

	getDensity () {
		if (this.dimension && this.weight) {
			return this.weight/this.dimension.getVolume();
		} else {
			return 0;
		}
	}
}
