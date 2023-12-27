class BossTips extends ToolTipBase {
	private bossNameTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private mapTxt: fairygui.GTextField;
	private bossItem: BossItem;

	public constructor() {
		super(PackNameEnum.Common, "BossTips");
	}

	public initUI(): void {
		super.initUI();
		this.bossNameTxt = this.getChild("txt_bossName").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.mapTxt = this.getChild("txt_map").asTextField;
		this.bossItem = <BossItem>this.getChild("BossItem");
		this.bossItem.touchable = false;
	}

	public setToolTipData(toolTipData: ToolTipData){
		super.setToolTipData(toolTipData);
		let data: any = toolTipData.data;
		let bossData: any = ConfigManager.boss.getByPk(data["code"]);
		this.bossItem.setData(data);
		// this.mapTxt.text = data["map"];
		this.bossNameTxt.text = bossData.name;
		this.levelTxt.text = bossData.level;
		let mapInfo: MapInfo = ConfigManager.map.getMapInfo(data["map"]);
		this.mapTxt.text = mapInfo.getByKey("name");
	}

	public center():void{
		let optListWidth:number = 0;
		let centerX:number = (fairygui.GRoot.inst.width - this.width + optListWidth)/2;
		let centerY:number = (fairygui.GRoot.inst.height - this.height)/2;
		this.setXY(centerX, centerY);
	}
}