import Coupon from "../src/Coupon";

test("Deve criar um cupom", function () {
	const coupon = new Coupon("VALE20", 20);
	expect(coupon.calculateDiscount(1000)).toBe(200);
});
