import OrderItem from "../../src/domain/entity/OrderItem";

test("Deve criar um item de pedido", function () {
	const orderItem = new OrderItem(1, 1000, 2);
	expect(orderItem.getTotal()).toBe(2000);
});

test("Deve lançar uma exception se a quantidade for negativa", function () {
	expect(() => new OrderItem(1, 1000, -2)).toThrow(new Error("Invalid quantity"));
});
