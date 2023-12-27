class BattleRankItem extends ListRenderer {

	private c1:fairygui.Controller;
	private c2:fairygui.Controller;
	private rankTxt:fairygui.GTextField;
	private nameTxt:fairygui.GTextField;
	private stageIcon:KingBattleStageIconView;
	private winNumTxt:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");

		this.rankTxt = this.getChild("rankTxt").asTextField;
		this.nameTxt = this.getChild("nameTxt").asTextField;
		this.winNumTxt = this.getChild("winNumTxt").asTextField;

		this.stageIcon = new KingBattleStageIconView(this.getChild("stageIcon").asCom);
	}

	// Message::Public::SEntityId entityId;
	// 		string name;
	// 		int level;
	// 		int winCount;
	// 		int rank;
	public setData(data:any,index:number):void {
		this._data = data;
		let cfg:any = ConfigManager.mgKingStife.getByPk(data.level_I);
		// this.stageIcon.load(URLManager.getModuleImgUrl("kingBattle/stageIcon_" + cfg.stage + ".png",PackNameEnum.Arena));
		this.stageIcon.setLevel(data.level_I);
		this.rankTxt.text = data.rank_I + "";
		this.nameTxt.text = data.name_S;
		this.winNumTxt.text = data.winCount_I + "场";
		this.c2.selectedIndex = index % 2;
		if(data.rank_I < 4) {
			this.c1.selectedIndex = data.rank_I;
		}
		else {
			this.c1.selectedIndex = 0;
		}
	}
}