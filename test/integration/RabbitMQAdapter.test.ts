import OrderItem from "../../src/domain/entity/OrderItem";
import OrderPlaced from "../../src/domain/event/OrderPlaced";
import RabbitMQAdapter from "../../src/infra/queue/RabbitMQAdapter";

test.skip("Deve publicar e consumir uma mensagem", async function () {
	const queue = new RabbitMQAdapter();
	await queue.connect();
	const orderItems = [
		new OrderItem(1, 1000, 3)
	];
	await queue.publish(new OrderPlaced("202100000001", orderItems));
	await queue.consume("orderPlaced", function (orderPlaced: OrderPlaced) {
		expect(orderPlaced.code).toBe("202100000001");
	});
	setTimeout(async function () {
		await queue.close();
	}, 500);
});