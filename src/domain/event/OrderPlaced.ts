import OrderItem from "../entity/OrderItem";
import DomainEvent from "./DomainEvent";

export default class OrderPlaced implements DomainEvent {
	name = "orderPlaced";

	constructor (readonly code: string, readonly orderItems: OrderItem[]) {
	}
}
