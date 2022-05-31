import ItemRepository from "../domain/repository/ItemRepository";
import Order from "../domain/entity/Order";
import OrderRepository from "../domain/repository/OrderRepository";
import CouponRepository from "../domain/repository/CouponRepository";
import FreightCalculator from "../domain/entity/FreightCalculator";
import RepositoryFactory from "../domain/factory/RepositoryFactory";
import StockEntryRepository from "../domain/repository/StockEntryRepository";
import StockEntry from "../domain/entity/StockEntry";
import OrderPlaced from "../domain/event/OrderPlaced";
import Queue from "../infra/queue/Queue";

export default class PlaceOrder {
	itemRepository: ItemRepository;
	orderRepository: OrderRepository;
	couponRepository: CouponRepository;
	stockEntryRepository: StockEntryRepository;

	constructor (readonly repositoryFactory: RepositoryFactory, readonly queue: Queue) {
		this.itemRepository = repositoryFactory.createItemRepository();
		this.orderRepository = repositoryFactory.createOrderRepository();
		this.couponRepository = repositoryFactory.createCouponRepository();
		this.stockEntryRepository = repositoryFactory.createStockEntryRepository();
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
		await this.orderRepository.save(order);
		const orderPlaced = new OrderPlaced(order.code.value, order.orderItems);
		await this.queue.publish(orderPlaced);
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
