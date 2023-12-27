class BossHomeTopItem extends ListRenderer {
    private c1:fairygui.Controller;
	private bgLoader:GLoader;
    private txtFloor:fairygui.GTextField;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.c1 = this.getController("c1");
		this.bgLoader = this.getChild("loader_bg") as GLoader;
        this.txtFloor = this.getChild("txt_floor").asTextField;
	}
	public setData(data:any):void{		
		this._data = data;
		this.txtFloor.text = "" + data.floor;
		this.bgLoader.load(URLManager.getModuleImgUrl("topItem_bg_" + data.floor + ".jpg",PackNameEnum.Boss));
	}

	public set floorSelected(value:boolean) {
		this.c1.selectedIndex = value ? 1 : 0;
	}
}