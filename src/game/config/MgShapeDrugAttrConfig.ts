/**
 * 外形属性药配置
 */
class MgShapeDrugAttrConfig extends BaseConfig {
	public constructor() {
		super("t_mg_shape_per_drug_attr", "shape");
	}

	/**获取丹药ID */
	public static getDrugCodes(eShape: EShape): Array<number>{
		let drugCfg: any = ConfigManager.mgShapeDrugAttr.getByPk(eShape);
		let drugNum: number = 3;//目前配表最多是3个
		let drugCodes: Array<number> = [];
		for(let i = 0; i < drugNum; i++){
			if(drugCfg['drug' + (i+1) +'ItemCode']){
				drugCodes.push(drugCfg['drug' + (i+1) +'ItemCode']);
			}
		}
		return drugCodes;
	}

	/**获取丹药属性 */
	public static getDrugAttr(eShape: EShape): any{
		let drugCfg: any = ConfigManager.mgShapeDrugAttr.getByPk(eShape);
		let drugNum: number = 3;//目前配表最多是3个
		let drugAttr: any = {};
	    let drugCode: number;
		let attrDict: any;
		let attrRate: number;

		if(!drugCfg) {
			return drugAttr;
		}

		for(let i = 0; i < drugNum; i++){
			drugCode = drugCfg['drug' + (i+1) +'ItemCode'];
			if(drugCode){
				attrDict = WeaponUtil.getAttrDict(drugCfg['drug' + (i+1) +'PerAttrList']);
				attrRate = drugCfg['drug' + (i+1) +'AttrRate'];
				if(attrRate){
					drugAttr[drugCode] = {"attrDict": attrDict, "attrRate": attrRate};
				}else{
					drugAttr[drugCode] = {"attrDict": attrDict};
				}
			}
		}
		return drugAttr;
	}
}