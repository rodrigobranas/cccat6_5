import Item from "./Item";

export default class Freight {
	total = 0;
	private DISTANCE = 1000;
	private FACTOR = 100;
	private MIN_FREIGHT = 10;

	addItem (item: Item, quantity: number) {
		const freight = item.getVolume() * this.DISTANCE * (item.getDensity()/this.FACTOR);
		this.total += freight * quantity;
	}

	getTotal () {
		return (this.total > 0 && this.total < this.MIN_FREIGHT) ? this.MIN_FREIGHT : this.total;
	}
}
