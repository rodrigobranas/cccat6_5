import StockHandler from "../../application/handler/StockHandler";
import OrderPlaced from "../../domain/event/OrderPlaced";
import RepositoryFactory from "../../domain/factory/RepositoryFactory";
import Queue from "../queue/Queue";

export default class StockController {

	constructor (readonly queue: Queue, readonly repositoryFactory: RepositoryFactory) {
		queue.consume("orderPlaced", async function (msg: any) {
			const stockHandler = new StockHandler(repositoryFactory);
			const orderPlaced = new OrderPlaced(msg.code, msg.orderItems);
			await stockHandler.handle(orderPlaced);
		});
	}
}