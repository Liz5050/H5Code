class BossHeadItem extends ListRenderer {
	private txt_level:fairygui.GTextField;
	private txt_name:fairygui.GTextField;
	private ico_loader:GLoader;
	private c1:fairygui.Controller;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.txt_level = this.getChild("txt_level").asTextField;
		this.txt_name = this.getChild("txt_name").asTextField;
		this.ico_loader = <GLoader>this.getChild("loader");
		this.c1 = this.getController("c1");
		
	}

	public setData(data:any):void{
		this._data = data;
		var bossId:number = this._data.bossCode;
		var bossInf:any = ConfigManager.boss.getByPk(bossId);
		this.txt_name.text = bossInf.name;
		this.txt_level.text = "Lv."+bossInf.level+"";
		var url:string = URLManager.getIconUrl(bossInf.avatarId+"",URLManager.AVATAR_ICON);
		this.ico_loader.load(url);
		this.updateFllow();
	}

	public updateFllow():void{
		var isFollow:boolean = CacheManager.boss.isFollowBoss(this._data.bossCode);
		this.c1.selectedIndex = isFollow?1:0;
	}
	
}