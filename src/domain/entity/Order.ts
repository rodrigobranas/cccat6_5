import Coupon from "./Coupon";
import Cpf from "./Cpf";
import Freight from "./Freight";
import Item from "./Item";
import OrderCode from "./OrderCode";
import OrderCoupon from "./OrderCoupon";
import OrderItem from "./OrderItem";

export default class Order {
	cpf: Cpf;
	orderItems: OrderItem[];
	coupon?: OrderCoupon;
	freight = new Freight();
	code: OrderCode;

	constructor (cpf: string, readonly date: Date = new Date(), readonly sequence: number = 1) {
		this.cpf = new Cpf(cpf);
		this.orderItems = [];
		this.code = new OrderCode(date, sequence);
	}

	isDuplicated (item: Item) {
		return this.orderItems.some(orderItem => orderItem.idItem === item.idItem);
	}

	addItem (item: Item, quantity: number) {
		if (this.isDuplicated(item)) throw new Error("Duplicated item");
		this.freight.addItem(item, quantity);
		this.orderItems.push(new OrderItem(item.idItem, item.price, quantity));
	}

	addCoupon (coupon: Coupon) {
		if (!coupon.isExpired(this.date)) {
			this.coupon = new OrderCoupon(coupon.code, coupon.percentage);
		}
	}

	getFreight () {
		return this.freight.getTotal();
	}

	getTotal () {
		let total = this.orderItems.reduce((total, orderItem) => {
			total += orderItem.getTotal();
			return total;
		}, 0);
		if (this.coupon) total -= this.coupon.calculateDiscount(total);
		total += this.freight.getTotal();
		return total;
	}
}
