import OrderRepository from "../domain/repository/OrderRepository";

export default class GetOrder {

	constructor (readonly orderRepository: OrderRepository) {
	}

	async execute (code: string): Promise<Output> {
		const order = await this.orderRepository.get(code);
		return { 
			code: order.code.value, 
			total: order.getTotal() 
		};
	}
}

type Output = {
	code: string,
	total: number
}
