class MyOccupyInfoView extends BaseContentView {
	private txt_area:fairygui.GTextField;
	private txt_efficiency:fairygui.GTextField;
	private txt_exp:fairygui.GTextField;
	public constructor() {
		super(PackNameEnum.Copy2,"MyOccupyInfoView");
		this.isCenter = true;
		this.isPopup = true;
		this.modal = true;
	}

	public initOptUI():void {
		this.txt_area = this.getGObject("txt_area").asTextField;
		this.txt_efficiency = this.getGObject("txt_efficiency").asTextField;
		this.txt_exp = this.getGObject("txt_exp").asTextField;
	}

	public updateAll(data?:any):void {
		if(data) {
			let color:number = CacheManager.posOccupy.expColor;
			let posCfg:any = ConfigManager.expPosition.getByPk(data.posId_I);
			let expCfg:any = ConfigManager.exp.getByPk(CacheManager.role.getRoleLevel());
			this.txt_area.text = posCfg.expTimes + "倍区域";
			this.txt_efficiency.text = "经验值" + (expCfg.positionExp * posCfg.expTimes) + "/10秒";
			this.txt_exp.text = "经验" + Number(data.totalExp_L64);
			this.txt_area.color = this.txt_efficiency.color = this.txt_exp.color = color;
		}
	}
}