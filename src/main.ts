import ExpressAdapter from "./infra/http/ExpressAdapter";
import GetItems from "./application/GetItems";
import ItemRepositoryDatabase from "./infra/repository/database/ItemRepositoryDatabase";
import PgPromiseConnectionAdapter from "./infra/database/PgPromiseConnectionAdapter";
import ItemController from "./infra/controller/ItemController";
import OrderController from "./infra/controller/OrderController";
import OrderRepositoryDatabase from "./infra/repository/database/OrderRepositoryDatabase";
import HapiAdapter from "./infra/http/HapiAdapter";
import DatabaseRepositoryFactory from "./infra/factory/DatabaseRepositoryFactory";
import MemoryQueueAdapter from "./infra/queue/MemoryQueueAdapter";
import StockController from "./infra/controller/StockController";

const http = new ExpressAdapter();
// const http = new HapiAdapter();

const queue = new MemoryQueueAdapter();
const connection = new PgPromiseConnectionAdapter();
const itemRepository = new ItemRepositoryDatabase(connection);
const orderRepository = new OrderRepositoryDatabase(connection);
const repositoryFactory = new DatabaseRepositoryFactory(connection);
new ItemController(http, itemRepository);
new OrderController(http, repositoryFactory);
new StockController(queue, repositoryFactory);

http.listen(3000);
