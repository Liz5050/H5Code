class ForgeStrengthenItem extends ListRenderer {
	private iconLoader: GLoader;
	private levelTxt: fairygui.GTextField;

	private _pos: EDressPos;
	private _level: number;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = <GLoader>this.getChild("loader_icon")
		this.levelTxt = this.getChild("txt_level").asTextField;
	}

	public setData(data: any, index: number): void {
		this._data = data;
		this.itemIndex = index;
		if (data != null) {
			this._pos = data["pos"];
			this.iconLoader.load(URLManager.getPackResUrl(PackNameEnum.Forge, `img_equip_${data["type"]}`));
		}
	}

	public set level(level: number) {
		this._level = level;
		this.levelTxt.text = "+" + level;
	}

	public get level(): number {
		return this._level;
	}

	public get pos(): EDressPos {
		return this._pos;
	}
}