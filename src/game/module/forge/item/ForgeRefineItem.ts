class ForgeRefineItem extends ListRenderer {
	private controller:fairygui.Controller;
	private iconLoader: GLoader;
	private levelTxt: fairygui.GTextField;

	private _pos: EDressPos;
	private _level: number;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.controller = this.getController("c1");
		this.iconLoader = <GLoader>this.getChild("loader_icon");
		this.levelTxt = this.getChild("txt_level").asTextField;
	}

	public setData(data: any,index:number): void {
		this._data = data;
		this.itemIndex = index;
		if (data != null) {
			this._pos = data["pos"];
			this.iconLoader.load(URLManager.getPackResUrl(PackNameEnum.Forge, `img_equip_${data["type"]}`));
		}
	}

	public updateLevel(level:number):void {
		let itemLv:number = StrengthenExUtil.getItemStrengthenLevel(this.itemIndex,level,8);
		if(itemLv == 0) {
			this.levelTxt.text = "";
		}
		else {
			this.levelTxt.text = "+" + itemLv;
		}
	}

	public setItemSelected(value:boolean) {
		this.controller.selectedIndex = value ? 1 : 0;
	}
}