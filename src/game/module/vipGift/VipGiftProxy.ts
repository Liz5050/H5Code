/**
 * VIP礼包
 */
class VipGiftProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 购买礼包
	 */
	public buyVipGiftPackage(id:number):void{
		this.send("ECmdGameActiveBuyVipGiftPackage", {id:id});
	}
	
	

}