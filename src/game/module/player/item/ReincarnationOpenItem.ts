class ReincarnationOpenItem extends ListRenderer {
	private c1:fairygui.Controller;
	private career_icon:GLoader;
	private loader_icon:GLoader;

	private moduleId:ModuleEnum;
	private param:string[];
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.career_icon = this.getChild("career_icon") as GLoader;
		this.loader_icon = this.getChild("loader_icon") as GLoader;
		this.addClickListener(this.onClickHandler,this);
	}

	public setData(data:any):void {
		this._data = data;
		this.param = data.open.split(",");
		this.moduleId = ModuleEnum[this.param[0]];
		let iconUrl:string = this.param[0] + "_" + this.param[2];
		if(this.moduleId == ModuleEnum.Boss) {
			this.c1.selectedIndex = 1;
			this.career_icon.load(URLManager.getPackResUrl(PackNameEnum.Reincarnation,"career_" + data.career));
		}
		else {
			this.c1.selectedIndex = 0;
		}
		this.loader_icon.load(URLManager.getPackResUrl(PackNameEnum.Reincarnation,iconUrl));
	}

	private onClickHandler():void {
		if(this.moduleId == ModuleEnum.Activity) {
			let type:ESpecialConditonType = Number(this.param[1]);
			HomeUtil.openActivityByType(type);
			CacheManager.activity.gotoActivityType = type;
		}
		else {
			let data:any = {tabType:PanelTabType[this.param[1]]};
			if(this.moduleId == ModuleEnum.VIP) {
				data.vipLevel = Number(this.param[2]);
			}
			EventManager.dispatch(UIEventEnum.ModuleOpen,this.moduleId,data,ViewIndex.Two);
		}
	}
}