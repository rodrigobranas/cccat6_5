import RepositoryFactory from "../domain/factory/RepositoryFactory";
import ItemRepository from "../domain/repository/ItemRepository";
import OrderRepository from "../domain/repository/OrderRepository";

export default class GetOrders {
	orderRepository: OrderRepository;
	itemRepository: ItemRepository;

	constructor (readonly repositoryFactory: RepositoryFactory) {
		this.orderRepository = repositoryFactory.createOrderRepository();
		this.itemRepository = repositoryFactory.createItemRepository();
	}

	async execute (): Promise<Output[]> {
		const output: Output[] = [];
		const orders = await this.orderRepository.list();
		for (const order of orders) {
			const orderOutput: Output = { code: order.code.value, total: order.getTotal(), items: [] };
			for (const orderItem of order.orderItems) {
				const item = await this.itemRepository.get(orderItem.idItem);
				orderOutput.items.push({ description: item.description, price: orderItem.price });
			}
			output.push(orderOutput);
		}
		return output;
	}
}

type Output = {
	code: string,
	total: number,
	items: { description: string, price: number }[]
}
