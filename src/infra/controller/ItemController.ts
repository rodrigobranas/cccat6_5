import GetItems from "../../application/GetItems";
import ItemRepository from "../../domain/repository/ItemRepository";
import Http from "../http/Http";

export default class ItemController {

	constructor (readonly http: Http, readonly itemRepository: ItemRepository) {
		http.on("get", "/items", async function (params: any, body: any) {
			const getItems = new GetItems(itemRepository);
			const output = await getItems.execute();
			return output;
		});
	}
}
