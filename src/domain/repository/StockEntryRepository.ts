import StockEntry from "../entity/StockEntry";

export default interface StockEntryRepository {
	save (stockEntry: StockEntry): Promise<void>;
	getStockEntries (idItem: number): Promise<StockEntry[]>;
	clear (): Promise<void>;
}
