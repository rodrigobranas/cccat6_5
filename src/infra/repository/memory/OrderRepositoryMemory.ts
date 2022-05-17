import Order from "../../../domain/entity/Order";
import OrderRepository from "../../../domain/repository/OrderRepository";

export default class OrderRepositoryMemory implements OrderRepository {
	orders: Order[];

	constructor () {
		this.orders = [];
	}

	async save(order: Order): Promise<void> {
		this.orders.push(order);
	}

	async count(): Promise<number> {
		return this.orders.length;
	}

	async list(): Promise<Order[]> {
		return this.orders;
	}

	async get(code: string): Promise<Order> {
		throw new Error("Method not implemented.");
	}

	async clear(): Promise<void> {
		this.orders = [];
	}
}
