class MaterialsActivityGetItem extends fairygui.GComponent {
	private loader_icon: GLoader;

	private thisParent: fairygui.GComponent;

	private moduleId: ModuleEnum;
	private param: string[];

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.loader_icon = this.getChild("loader_icon") as GLoader;
		this.addClickListener(this.onClickHandler,this);
	}

	public setParent(thisParent: fairygui.GComponent, x: number, y: number): void{
		this.thisParent = thisParent;
		this.x = x;
		this.y = y;
		this.addRelation(this.thisParent, fairygui.RelationType.Center_Center);
		this.addRelation(this.thisParent, fairygui.RelationType.Bottom_Bottom);
	}

	/**先屏蔽处理 */
	public setData(code: number): void {
		// let data: any = ConfigManager.materialActiveLink.getByPk(code);
		// this.param = [];
		// if(data != null){
		// 	let activityTypeArr: Array<string> = data.activeType.split("#");
		// 	let linkArr:Array<string> = data.link.split("#");
		// 	for(let i = 0; i < activityTypeArr.length; i++){
		// 		if(CacheManager.activity.checkActivityHasItem(Number(activityTypeArr[i]), code)){
		// 			this.param = linkArr[i].split(",");
		// 			break;
		// 		}
		// 	}
		// }

		// if(this.param.length > 0){
		// 	this.moduleId = ModuleEnum[this.param[0]];
		// 	if (this.moduleId == ModuleEnum.Activity) {
		// 		this.loader_icon.load(URLManager.getModuleImgUrl("icon/" + this.param[1] + ".png", PackNameEnum.Activity));
		// 	}
		// 	this.thisParent.addChild(this);
		// }else{
		// 	this.thisParent.removeChild(this);
		// }
	}

	private onClickHandler(): void {
		if (this.moduleId == ModuleEnum.Activity) {
			let type: ESpecialConditonType = Number(this.param[1]);
			HomeUtil.openActivityByType(type);
		}
		else {
			let data: any = { tabType: PanelTabType[this.param[1]] };
			if (this.moduleId == ModuleEnum.VIP) {
				data.vipLevel = Number(this.param[2]);
			}
			EventManager.dispatch(UIEventEnum.ModuleOpen, this.moduleId, data, ViewIndex.Two);
		}
	}
}