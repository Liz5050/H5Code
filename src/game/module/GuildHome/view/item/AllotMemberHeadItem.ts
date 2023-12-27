class AllotMemberHeadItem extends ListRenderer {
    private loader_head:GLoader;
    private txt_name:fairygui.GTextField;
    private txt_count:fairygui.GTextField;

	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.loader_head = <GLoader>this.getChild("loader_head");
        this.txt_name = this.getChild("txt_name").asTextField;
        this.txt_count = this.getChild("txt_count").asTextField;
	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.loader_head.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(data.player.career_SH)));
		this.txt_name.text = data.player.name_S;
		this.txt_count.text = data.count_I + "份";
	}
}