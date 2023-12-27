class ActivityRankGetWayItem extends ListRenderer {
	private loader_icon:GLoader;

	private moduleId:ModuleEnum;
	private param:string[];
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.loader_icon = this.getChild("loader_icon") as GLoader;
		this.addClickListener(this.onClickHandler,this);
	}

	public setData(data:any):void {
		this._data = data;
		this.param = data.split(",");
		this.moduleId = ModuleEnum[this.param[0]];
		let iconUrl:string;
		if(this.moduleId == ModuleEnum.Activity ||
			this.moduleId == ModuleEnum.VIP) {
			iconUrl = this.param[0] + "_" + this.param[1]
		}
		else {
			iconUrl = this.param[0];
		}
		this.loader_icon.load(URLManager.getPackResUrl(PackNameEnum.ActivityRank,iconUrl));
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