import StockEntry from "../entity/StockEntry";

export default class StockCalculator {
	static calculate (stockEntries: StockEntry[]) {
		return stockEntries.reduce((total: number, stockEntry: StockEntry) => {
			if (stockEntry.operation === "in") total += stockEntry.quantity;
			if (stockEntry.operation === "out") total -= stockEntry.quantity;
			return total;
		}, 0);
	}
}
