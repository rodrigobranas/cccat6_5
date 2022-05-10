import ItemRepository from "../domain/repository/ItemRepository";
import Order from "../domain/entity/Order";
import OrderRepository from "../domain/repository/OrderRepository";
import CouponRepository from "../domain/repository/CouponRepository";
import FreightCalculator from "../domain/entity/FreightCalculator";

export default class PlaceOrder {

	constructor (readonly itemRepository: ItemRepository, readonly orderRepository: OrderRepository, readonly couponRepository: CouponRepository) {
	}

	async execute (input: Input): Promise<Output> {
		const sequence = await this.orderRepository.count() + 1;
		const order = new Order(input.cpf, input.date, sequence);
		let freight = 0;
		const freightCalculator = new FreightCalculator();
		for (const orderItem of input.orderItems) {
			const item = await this.itemRepository.get(orderItem.idItem);
			order.addItem(item, orderItem.quantity);
			freight += freightCalculator.calculate(item, orderItem.quantity);
		}
		if (input.coupon) {
			const coupon = await this.couponRepository.get(input.coupon);
			order.addCoupon(coupon);
		}
		// order.freight = (freight > 0 && freight < 10) ? 10 : freight;
		await this.orderRepository.save(order);
		const total = order.getTotal();
		return {
			code: order.code.value,
			total
		}
	}
}

type Input = {
	cpf: string,
	orderItems: { idItem: number, quantity: number}[],
	coupon?: string,
	date?: Date
}

type Output = {
	code: string,
	total: number
}
