export default class Coupon {

	constructor (readonly code: string, readonly percentage: number, readonly expireDate: Date = new Date()) {
	}

	isExpired (today: Date) {
		return today.getTime() > this.expireDate.getTime();
	}
}
