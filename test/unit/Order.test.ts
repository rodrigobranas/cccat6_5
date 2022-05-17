import Coupon from "../../src/domain/entity/Coupon";
import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";
import Order from "../../src/domain/entity/Order";

test("Não deve criar um pedido com CPF inválido", function () {
	expect(() => new Order("111.111.111-11")).toThrow(new Error("CPF Inválido"));
});

test("Deve criar um pedido com 3 itens (com descrição, preço e quantidade)", function () {
	const order = new Order("935.411.347-80");
	order.addItem(new Item(1, "Guitarra", 1000), 1);
	order.addItem(new Item(2, "Amplificador", 5000), 1);
	order.addItem(new Item(3, "Cabo", 30), 3);
	const total = order.getTotal();
	expect(total).toBe(6090);
});

test("Deve criar um pedido com cupom de desconto", function () {
	const order = new Order("935.411.347-80");
	order.addItem(new Item(1, "Guitarra", 1000), 1);
	order.addItem(new Item(2, "Amplificador", 5000), 1);
	order.addItem(new Item(3, "Cabo", 30), 3);
	order.addCoupon(new Coupon("VALE20", 20));
	const total = order.getTotal();
	expect(total).toBe(4872);
});

test("Deve criar um pedido com cupom de desconto expirado", function () {
	const order = new Order("935.411.347-80", new Date("2021-03-10T10:00:00"));
	order.addItem(new Item(1, "Guitarra", 1000), 1);
	order.addItem(new Item(2, "Amplificador", 5000), 1);
	order.addItem(new Item(3, "Cabo", 30), 3);
	order.addCoupon(new Coupon("VALE20", 20, new Date("2021-03-01T10:00:00")));
	const total = order.getTotal();
	expect(total).toBe(6090);
});

test("Deve criar um pedido com 3 itens e calcular o frete", function () {
	const order = new Order("935.411.347-80");
	order.addItem(new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3), 1);
	order.addItem(new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20), 1);
	order.addItem(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1), 3);
	const freight = order.getFreight();
	const total = order.getTotal();

	// volume 100/100 * 30/100 * 10/100 = 0,03
	// density 3/0,03 = 100
	// freight 0,03 * 1000 * (100/100) = 30

	// volume 50/100 * 50/100 * 50/100 = 0,125
	// density 20/0,125 = 160
	// freight 0,125 * 1000 * (160/100) = 200

	// volume 10/100 * 10/100 * 10/100 = 0.001
	// density 1/0.001 = 1000
	// freight 0.001 * 1000 * (1000/100) = 10

	expect(freight).toBe(260);
	expect(total).toBe(6350);
});

test("Deve criar um pedido com 3 itens e gerar um código seguindo o padrão AAAAPPPPPPPP", function () {
	const order = new Order("935.411.347-80", new Date("2021-03-01T10:00:00"));
	expect(order.code.value).toBe("202100000001");
});

test("Deve lançar uma exception se o item for adicionado mais de uma vez", function () {
	const order = new Order("935.411.347-80");
	order.addItem(new Item(1, "Guitarra", 1000), 1);
	expect(() => order.addItem(new Item(1, "Guitarra", 1000), 1)).toThrow(new Error("Duplicated item"));
});
