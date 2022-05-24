import Connection from "../../infra/database/Connection";

export default class GetOrdersQuery {

	constructor (readonly connection: Connection) {
	}

	execute () {
		return this.connection.query("select code, total, (select array_agg(json_build_object('description', i.description, 'price', oi.price)) from ccca.order_item oi join ccca.item i using (id_item) where oi.id_order = o.id_order) as items from ccca.order o", []);
	}
}