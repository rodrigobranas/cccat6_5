import RepositoryFactory from "../domain/factory/RepositoryFactory";
import StockEntryRepository from "../domain/repository/StockEntryRepository";
import StockCalculator from "../domain/service/StockCalculator";

export default class GetStock {
	stockEntryRepository: StockEntryRepository;

	constructor (readonly repositoryFactory: RepositoryFactory) {
		this.stockEntryRepository = repositoryFactory.createStockEntryRepository();
	}

	async execute (idItem: number): Promise<Output> {
		const stockEntries = await this.stockEntryRepository.getStockEntries(idItem);
		const total = StockCalculator.calculate(stockEntries);
		return {
			total
		};
	}
}

type Output = {
	total: number
}
