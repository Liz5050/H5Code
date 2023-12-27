class BloodCopyModelItem extends CopyModeBaseItem {
	private icoLoader:GLoader;
	private img_lock:fairygui.GImage;
	private txt_copyName:fairygui.GTextField;
	private txt_level:fairygui.GTextField;
	private txt_warm:fairygui.GTextField;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		var panel:fairygui.GComponent = this.panel;
		this.icoLoader = <GLoader>panel.getChild("loader_1");
		this.img_lock = panel.getChild("img_lock").asImage;
		this.txt_copyName = panel.getChild("txt_copyName").asTextField;
		this.txt_level = panel.getChild("txt_level").asTextField;
		this.txt_warm = panel.getChild("txt_warm").asTextField;
	}
	public initOptUI():void{

	}

	public setData(data:any,index:number):void{
		super.setData(data,index);		
		this.txt_copyName.text = this._data.name;		
		this.txt_level.text = "Lv."+this._data.enterMinLevel;
		this.icoLoader.load(URLManager.getIconUrl("copy_boss_"+this._data.code,URLManager.COPY_BLOOD_ICON));
	}
	protected setOpenStatu():void{
		this._isOpen = CopyUtils.isLvOk(this._data);		
		this.txt_warm.visible = !this._isOpen; 
		this.img_lock.visible = !this._isOpen;
		if (!this._isOpen) {
			this.icoLoader.filters = EFilters.GRAYS;
			this.txt_level.filters = EFilters.GRAYS;
		}else{
			this.icoLoader.filters = null;
			this.txt_level.filters = null;
		}
	}
}