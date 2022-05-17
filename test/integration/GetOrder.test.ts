import GetOrder from "../../src/application/GetOrder";
import GetOrders from "../../src/application/GetOrders";
import PlaceOrder from "../../src/application/PlaceOrder";
import Coupon from "../../src/domain/entity/Coupon";
import Dimension from "../../src/domain/entity/Dimension";
import Item from "../../src/domain/entity/Item";
import RepositoryFactory from "../../src/domain/factory/RepositoryFactory";
import OrderRepository from "../../src/domain/repository/OrderRepository";
import Connection from "../../src/infra/database/Connection";
import PgPromiseConnectionAdapter from "../../src/infra/database/PgPromiseConnectionAdapter";
import DatabaseRepositoryFactory from "../../src/infra/factory/DatabaseRepositoryFactory";
import OrderRepositoryDatabase from "../../src/infra/repository/database/OrderRepositoryDatabase";
import CouponRepositoryMemory from "../../src/infra/repository/memory/CouponRepositoryMemory";
import ItemRepositoryMemory from "../../src/infra/repository/memory/ItemRepositoryMemory";

let connection: Connection;
let orderRepository: OrderRepository;
let repositoryFactory: RepositoryFactory;

beforeEach(async function () {
	connection = new PgPromiseConnectionAdapter();
	repositoryFactory = new DatabaseRepositoryFactory(connection);
	orderRepository = repositoryFactory.createOrderRepository();
	await orderRepository.clear();
});

test("Deve obter um pedido pelo código", async function () {
	const itemRepository = new ItemRepositoryMemory();
	itemRepository.save(new Item(1, "Guitarra", 1000, new Dimension(100, 30, 10), 3));
	itemRepository.save(new Item(2, "Amplificador", 5000, new Dimension(50, 50, 50), 20));
	itemRepository.save(new Item(3, "Cabo", 30, new Dimension(10, 10, 10), 1));
	const couponRepository = new CouponRepositoryMemory();
	couponRepository.save(new Coupon("VALE20", 20, new Date("2021-03-10T10:00:00")));
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
	await placeOrder.execute(input);
	const getOrder = new GetOrder(orderRepository);
	const output = await getOrder.execute("202100000001");
	expect(output.code).toBe("202100000001");
	expect(output.total).toBe(5132);
});

afterEach(async function () {
	await connection.close();
});
