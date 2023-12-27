/**
 * 七天法宝融合
 */
class MagicWeaponFuseItem extends ListRenderer {
	private iconLoader:GLoader;
	private nameTxt: fairygui.GTextField;
	private condTxt: fairygui.GTextField;
	// private statusController: fairygui.Controller;
	// private curIndex: number;

	// private endTime: number;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.nameTxt = this.getChild("txt_name").asTextField;
		// this.statusController = this.getController("c1");
	}

	public setData(data:any):void {
		this._data = data;
		this.iconLoader.load(URLManager.getModuleImgUrl(`icon/${data.code}.png`, PackNameEnum.SevenDayMagicWeapon));
		this.nameTxt.text = data.name;
	}
}