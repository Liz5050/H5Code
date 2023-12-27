/**
 * 图鉴UI界面Item
 */
class TrainIllustrateSubTypeItem extends ListRenderer {
    
    private _selected_1:boolean;
	private _selectedBg:fairygui.GImage;
	private _loaderIcon:GLoader;

	private _hasTip:boolean = false;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		this._selectedBg = this.getChild("img_selectedbg").asImage;
		this._loaderIcon = this.getChild("loader_icon") as GLoader;
	}

	public setData(data:any,index:number):void {		
		this._data = data;

		this._loaderIcon.load(URLManager.getModuleImgUrl("illustrate/icon/subtype_" + data + ".png", PackNameEnum.Train));

		this._hasTip = CacheManager.cultivate.checkIllustrateSubtypeTips(data);
		CommonUtils.setBtnTips(this, this._hasTip, 74,7,false);
	}

	public set selected(value:boolean) {
		this._selected_1 = value;
		this._selectedBg.visible = value;
	}

	public get selected():boolean {
		return this._selected_1;
	}

	public get hasTip():boolean {
		return this._hasTip;
	}

}