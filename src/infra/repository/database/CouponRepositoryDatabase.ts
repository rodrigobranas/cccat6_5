import Coupon from "../../../domain/entity/Coupon";
import CouponRepository from "../../../domain/repository/CouponRepository";
import Connection from "../../database/Connection";

export default class CouponRepositoryDatabase implements CouponRepository {

	constructor (readonly connection: Connection) {
	}

	async get(code: string): Promise<Coupon> {
		const [couponData] = await this.connection.query("select * from ccca.coupon where code = $1", [code]);
		if (!couponData) throw new Error("Coupon not found");
		return new Coupon(couponData.code, couponData.percentage, new Date(couponData.expire_date));
	}

	save(coupon: Coupon): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
