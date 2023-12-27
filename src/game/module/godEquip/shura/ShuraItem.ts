/**
 * 修罗装备合成升级界面物品项
 */
class ShuraItem extends ListRenderer {
	private iconLoader:GLoader;
	private nameTxt: fairygui.GTextField;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.nameTxt = this.getChild("txt_name").asTextField;
	}

	public setData(data: any):void{
		this._data = data;
		let itemData: ItemData = data.itemData;
		this.iconLoader.load(itemData.getIconRes());
		this.nameTxt.text = WeaponUtil.getEquipLevelText(itemData);
		CommonUtils.setBtnTips(this, CacheManager.shura.checkTipByType(CacheManager.shura.curIndex, itemData.getType()));
	}
}