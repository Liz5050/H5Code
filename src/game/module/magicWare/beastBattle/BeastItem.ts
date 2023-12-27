/**
 * 神兽
 */
class BeastItem extends ListRenderer {
	private beastLoader: GLoader;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.beastLoader = <GLoader>this.getChild("loader_beast");
	}

	public setData(data: any, index: number): void {
		this._data = data;
		this.beastLoader.load(URLManager.getModuleImgUrl(`icon/${data.icon}.png`, PackNameEnum.BeastBattle));
		this.beastLoader.grayed = !CacheManager.beastBattle.isBeckonByCode(data.code);
		CommonUtils.setBtnTips(this, CacheManager.beastBattle.checkTipsByCode(data.code));
	}
}