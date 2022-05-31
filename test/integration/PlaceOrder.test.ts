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
import GetStock from "../../src/application/GetStock";
import Queue from "../../src/infra/queue/Queue";
import MemoryQueueAdapter from "../../src/infra/queue/MemoryQueueAdapter";
import OrderPlaced from "../../src/domain/event/OrderPlaced";
import StockEntry from "../../src/domain/entity/StockEntry";
import StockEntryRepository from "../../src/domain/repository/StockEntryRepository";
import StockHandler from "../../src/application/handler/StockHandler";
import StockController from "../../src/infra/controller/StockController";
import RabbitMQAdapter from "../../src/infra/queue/RabbitMQAdapter";

let connection: Connection;
let orderRepository: OrderRepository;
let stockEntryRepository: StockEntryRepository;
let repositoryFactory: RepositoryFactory;
let queue: Queue;

beforeEach(async function () {
	connection = new PgPromiseConnectionAdapter();
	repositoryFactory = new DatabaseRepositoryFactory(connection);
	// repositoryFactory = new MemoryRepositoryFactory();
	orderRepository = repositoryFactory.createOrderRepository();
	await orderRepository.clear();
	stockEntryRepository = repositoryFactory.createStockEntryRepository();
	await stockEntryRepository.clear();
	// queue = new MemoryQueueAdapter();
	queue = new RabbitMQAdapter();
	await queue.connect();
});

test("Deve fazer um pedido", async function () {
	const placeOrder = new PlaceOrder(repositoryFactory, queue);
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
	const placeOrder = new PlaceOrder(repositoryFactory, queue);
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
	const placeOrder = new PlaceOrder(repositoryFactory, queue);
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

test.only("Deve fazer um pedido e lançar no estoque", async function () {
	new StockController(queue, repositoryFactory);
	const placeOrder = new PlaceOrder(repositoryFactory, queue);
	const input = {
		cpf: "935.411.347-80",
		orderItems: [
			{ idItem: 1, quantity: 1 },
			{ idItem: 2, quantity: 1 },
			{ idItem: 3, quantity: 3 }
		]
	};
	await placeOrder.execute(input); // delay 200ms
	// const getStock = new GetStock(repositoryFactory);
	// const output = await getStock.execute(3);
	// expect(output.total).toBe(-3);
});

afterEach(async function () {
	setTimeout(async function () {
		await queue.close();
		await connection.close();
	}, 1000);
});
