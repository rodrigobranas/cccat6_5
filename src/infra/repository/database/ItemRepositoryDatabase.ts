import Connection from "../../database/Connection";
import Item from "../../../domain/entity/Item";
import ItemRepository from "../../../domain/repository/ItemRepository";
import Dimension from "../../../domain/entity/Dimension";

export default class ItemRepositoryDatabase implements ItemRepository {

	constructor (readonly connection: Connection) {
	}

	async get(idItem: number): Promise<Item> {
		const [itemData] = await this.connection.query("select * from ccca.item where id_item = $1", [idItem]);
		if (!itemData) throw new Error("Item not found");
		const item = new Item(itemData.id_item, itemData.description, parseFloat(itemData.price), new Dimension(itemData.width, itemData.height, itemData.length), itemData.weight);
		return item;
	}

	save(item: Item): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async list(): Promise<Item[]> {
		const itemsData = await this.connection.query("select * from ccca.item", []);
		const items: Item[] = [];
		for (const itemData of itemsData) {
			items.push(new Item(itemData.id_item, itemData.description, parseFloat(itemData.price)));
		}
		return items;
	}
}