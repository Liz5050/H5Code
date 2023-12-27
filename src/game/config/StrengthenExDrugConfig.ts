/**
 * 新强化属性药配置
 */
class StrengthenExDrugConfig extends BaseConfig {
	public constructor() {
		super("t_mg_strengthen_ex_drug", "type");
	}

	/**
	 * 获取属性药
	 */
	public getDrugs(type: EStrengthenExType): Array<ItemData> {
		var itemDatas: Array<ItemData> = [];
		let cfg: any = this.getByPk(type);
		if (cfg != null) {
			for (let i = 0; i < 3; i++) {
				let itemData: ItemData = new ItemData(cfg['drug' + (i + 1) + 'ItemCode']);
				itemDatas.push(itemData);
			}
		}
		return itemDatas;
	}

	/**获取丹药ID */
	public static getDrugCodes(type: EStrengthenExType): Array<number>{
		let drugCfg: any = ConfigManager.strengthenExDrug.getByPk(type);
		let drugNum: number = 3;//目前配表最多是3个
		let drugCodes: Array<number> = [];
		for(let i = 0; i < drugNum; i++){
			if(drugCfg['drug' + (i+1) +'ItemCode']){
				drugCodes.push(drugCfg['drug' + (i+1) +'ItemCode']);
			}
		}
		return drugCodes;
	}

	/**
	 * 获取属性药使用上限
	 */
	public getDrugMaxDict(type: EStrengthenExType): { [key: number]: number } {
		var drugMaxDict: { [key: number]: number } = {};
		let cfg: any = this.getByPk(type);
		if (cfg != null) {
			let itemCode: number;
			for (let i = 0; i < 3; i++) {
				itemCode = cfg['drug' + (i + 1) + 'ItemCode'];
				drugMaxDict[itemCode] = cfg['drug' + (i + 1) + 'ItemMax'];
			}
		}
		return drugMaxDict;
	}
}