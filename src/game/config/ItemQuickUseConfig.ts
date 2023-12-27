/**物品快速使用 */
class ItemQuickUseConfig extends BaseConfig {
	private fixedGiftBag:BaseConfig; //使用物品的礼包配置
	public constructor() {
		super("t_item_quick_use", "itemCode");
		this.fixedGiftBag = new BaseConfig("t_fixed_gift_bag","code");
	}
	/**获取礼包配置奖励 */
	public getGiftRewards(code:number):ItemData[]{
		let itemDatas:ItemData[] = [];
		let cfg:any =this.fixedGiftBag.getByPk(code);
		if(cfg && cfg.itemList){
			itemDatas = CommonUtils.configStrToArr(cfg.itemList,true);
		}
		return itemDatas;
	}

}