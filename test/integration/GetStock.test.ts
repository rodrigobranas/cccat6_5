import GetStock from "../../src/application/GetStock";
import StockEntry from "../../src/domain/entity/StockEntry";
import PgPromiseConnectionAdapter from "../../src/infra/database/PgPromiseConnectionAdapter";
import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";

test.skip("Deve retornar o estoque de um item", async  function () {
	const connection = new PgPromiseConnectionAdapter();
	const repositoryFactory = new DatabaseRepositoryFactory(connection);
	const stockEntryRepository = repositoryFactory.createStockEntryRepository();
	await stockEntryRepository.clear();
	await stockEntryRepository.save(new StockEntry(1, "in", 10));
	await stockEntryRepository.save(new StockEntry(1, "in", 10));
	await stockEntryRepository.save(new StockEntry(1, "out", 5));
	await stockEntryRepository.save(new StockEntry(1, "out", 5));
	const getStock = new GetStock(repositoryFactory);
	const output = await getStock.execute(1);
	expect(output.total).toBe(10);
	await connection.close();
});
