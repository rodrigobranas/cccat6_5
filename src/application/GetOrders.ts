import OrderRepository from "../domain/repository/OrderRepository";

export default class GetOrders {

	constructor (readonly orderRepository: OrderRepository) {
	}

	async execute (): Promise<Output[]> {
		const output: Output[] = [];
		const orders = await this.orderRepository.list();
		for (const order of orders) {
			output.push({ code: order.code.value, total: order.getTotal() });
		}
		return output;
	}
}

type Output = {
	code: string,
	total: number
}
