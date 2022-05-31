import DomainEvent from "../../domain/event/DomainEvent";
import Queue from "./Queue";
import amqp from "amqplib";

export default class RabbitMQAdapter implements Queue {
	connection: amqp.Connection | undefined;

	constructor () {
	}

	async connect(): Promise<void> {
		this.connection = await amqp.connect("amqp://localhost");
	}

	async close(): Promise<void> {
		if (!this.connection) throw new Error();
		await this.connection.close();
	}

	async consume(eventName: string, callback: any): Promise<void> {
		if (!this.connection) throw new Error();
		const channel = await this.connection.createChannel();
		await channel.assertQueue(eventName, { durable: true });
		await channel.consume(eventName, async function (msg: any) {
			await callback(JSON.parse(msg.content.toString()));
		}, {
			noAck: true
		});
	}

	async publish(domainEvent: DomainEvent): Promise<void> {
		if (!this.connection) throw new Error();
		const channel = await this.connection.createChannel();
		await channel.assertQueue(domainEvent.name, { durable: true });
		channel.sendToQueue(domainEvent.name, Buffer.from(JSON.stringify(domainEvent)));
	}
}
