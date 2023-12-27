/**
 * 时装配置
 */
class MgFashionConfig extends BaseConfig{
	private _fashionData:any;
	public constructor() {
		super("t_mg_fashion", "code");
		this._fashionData = {};
	}

	/**
	 * 根据类型获取时装数据
	 * @param type 1服装 2武器
	 */
	public getFashionByType(type:number):any[]{
		if(!this._fashionData[type]){
			this._fashionData[type] = this.select({"type": type});
			this._fashionData[type].sort((a: any, b:any): number => {
				return a.showIndex - b.showIndex;
			});
		}
		return this._fashionData[type];
	}

	/**
	 * 根据道具code获取时装
	 */
	public getFashionByItemCode(code:number):any {
		let itemCfg:any = ConfigManager.item.getByPk(code);
		if(!itemCfg || !itemCfg.type || itemCfg.type != EProp.EPropFashion) {
			return null;
		}
		let dict:any = this.getDict();
		for(let fashionCode in dict) {
			if(dict[fashionCode].propCode == code || dict[fashionCode].propCode == itemCfg.codeUnbind) {
				return dict[fashionCode];
			}
		}
		return null;
	}
}