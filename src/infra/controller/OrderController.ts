import GetOrder from "../../application/GetOrder";
import GetOrders from "../../application/GetOrders";
import RepositoryFactory from "../../domain/factory/RepositoryFactory";
import OrderRepository from "../../domain/repository/OrderRepository";
import Http from "../http/Http";

export default class OrderController {

	constructor (readonly http: Http, readonly repositoryFactory: RepositoryFactory) {
		http.on("get", "/orders", async function (params: any, body: any) {
			const getOrders = new GetOrders(repositoryFactory);
			const output = await getOrders.execute();
			return output;
		});

		http.on("get", "/orders/{code}", async function (params: any, body: any) {
			const getOrder = new GetOrder(repositoryFactory.createOrderRepository());
			const output = await getOrder.execute(params.code);
			return output;
		});
	}
}
