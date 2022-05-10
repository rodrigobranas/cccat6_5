import Item from "./Item";

export default class FreightCalculator {
	private total = 0;
	private DISTANCE = 1000;
	private FACTOR = 100;
	private MIN_FREIGHT = 10;

	calculate (item: Item, quantity: number) {
		const freight = item.getVolume() * this.DISTANCE * (item.getDensity()/this.FACTOR);
		return freight * quantity;
	}
}
