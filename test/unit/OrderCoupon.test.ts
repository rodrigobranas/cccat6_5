import Coupon from "../../src/domain/entity/Coupon";
import OrderCoupon from "../../src/domain/entity/OrderCoupon";

test("Deve criar um cupom", function () {
	const coupon = new Coupon("VALE20", 20);
	const orderCoupon = new OrderCoupon(coupon.code, coupon.percentage);
	expect(orderCoupon.calculateDiscount(1000)).toBe(200);
});
