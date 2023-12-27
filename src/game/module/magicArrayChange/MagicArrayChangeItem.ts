class MagicArrayChangeItem extends ListRenderer{
	private iconLoader: GLoader;
	private levelTxt: fairygui.GTextField;
	private controller: fairygui.Controller;
	private _changeData: any;
	
	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.iconLoader = this.getChild("loader_icon") as GLoader;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.controller = this.getController("c1");
	}

	public setData(changeData:any):void{
		this._changeData = changeData;
		this.iconLoader.load(URLManager.getIconUrl(changeData.change, URLManager.Shape_Change_Icon));
		this.levelTxt.text = `${changeData.level}`;
		this.levelTxt.visible = changeData.isActived;
		if(changeData.isActived){
			this.controller.selectedIndex = 1;
		}else{
			this.controller.selectedIndex = 0;
		}
		if(this.changeData.shape == EShape.EShapeLaw) {
			CommonUtils.setBtnTips(this, CacheManager.magicArrayChange.checkTipsByChangeData(changeData.change, changeData,changeData.roleIndex));
		}
		if(this.changeData.shape == EShape.EShapeBattle) {
			CommonUtils.setBtnTips(this, CacheManager.battleArrayChange.checkTipsByChangeData(changeData.change, changeData,changeData.roleIndex));
		}
	}

	public get changeData(): any{
		return this._changeData;
	}

	public getIconRes(icon: number):string{
		if(icon){
			return `resource/assets/icon/item/${icon}.png`;
		}
		return "";
	}
}