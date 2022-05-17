import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";
import ItemRepositoryMemory from "../../src/infra/repository/memory/ItemRepositoryMemory";
import OrderRepositoryMemory from "../../src/infra/repository/memory/OrderRepositoryMemory";
import PlaceOrder from "../../src/application/PlaceOrder";
import CouponRepositoryMemory from "../../src/infra/repository/memory/CouponRepositoryMemory";
import Coupon from "../../src/domain/entity/Coupon";
import OrderRepositoryDatabase from "../../src/infra/repository/database/OrderRepositoryDatabase";
import PgPromiseConnectionAdapter from "../../src/infra/database/PgPromiseConnectionAdapter";
import Connection from "../../src/infra/database/Connection";
import OrderRepository from "../../src/domain/repository/OrderRepository";
import RepositoryFactory from "../../src/domain/factory/RepositoryFactory";
import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";
import MemoryRepositoryFactory from "../../src/infra/factory/MemoryRepositoryFactory";

let connection: Connection;
let orderRepository: OrderRepository;
let repositoryFactory: RepositoryFactory;

beforeEach(async function () {
	connection = new PgPromiseConnectionAdapter();
	repositoryFactory = new DatabaseRepositoryFactory(connection);
	// repositoryFactory = new MemoryRepositoryFactory();
	orderRepository = repositoryFactory.createOrderRepository();
	await orderRepository.clear();
});

test("Deve fazer um pedido", async function () {
	const placeOrder = new PlaceOrder(repositoryFactory);
	const input = {
		cpf: "935.411.347-80",
		orderItems: [
			{ idItem: 1, quantity: 1 },
			{ idItem: 2, quantity: 1 },
			{ idItem: 3, quantity: 3 }
		]
	};
	const output = await placeOrder.execute(input);
	expect(output.total).toBe(6350);
});

test("Deve fazer um pedido com desconto", async function () {
	const placeOrder = new PlaceOrder(repositoryFactory);
	const input = {
		cpf: "935.411.347-80",
		orderItems: [
			{ idItem: 1, quantity: 1 },
			{ idItem: 2, quantity: 1 },
			{ idItem: 3, quantity: 3 }
		],
		coupon: "VALE20",
		date: new Date("2021-03-01T10:00:00")
	};
	const output = await placeOrder.execute(input);
	expect(output.total).toBe(5132);
});

test("Deve fazer um pedido e gerar o código do pedido", async function () {
	const placeOrder = new PlaceOrder(repositoryFactory);
	const input = {
		cpf: "935.411.347-80",
		orderItems: [
			{ idItem: 1, quantity: 1 },
			{ idItem: 2, quantity: 1 },
			{ idItem: 3, quantity: 3 }
		],
		date: new Date("2021-03-01T10:00:00")
	};
	const output = await placeOrder.execute(input);
	expect(output.code).toBe("202100000001");
});

afterEach(async function () {
	await connection.close();
});
