class MyBattleRankView extends BaseView {
	private controller:fairygui.Controller;
	private rankTxt:fairygui.GTextField;
	// private nameTxt:fairygui.GTextField;
	private winNumTxt:fairygui.GTextField;
	private stageIcon:KingBattleStageIconView;
	public constructor(view:fairygui.GComponent) {
		super(view);
	}

	public initOptUI():void {
		this.controller = this.getController("c1");
		this.rankTxt = this.getGObject("rankTxt").asTextField;
		// this.nameTxt = this.getGObject("nameTxt").asTextField;
		// this.nameTxt.text = CacheManager.role.entityInfo.name_S;
		this.winNumTxt = this.getGObject("winNumTxt").asTextField;
		this.stageIcon = new KingBattleStageIconView(this.getGObject("stageIcon").asCom);
	}

	public updateAll(type:number):void {
		let selfInfo:any = CacheManager.arena.selfBattleInfo;
		let rank:number;
		let winCount:number;
		let kingCfg:any;
		if(type == 0) {
			//本周
			rank = selfInfo.rank_I;
			winCount = selfInfo.winCount_I;
			kingCfg = ConfigManager.mgKingStife.getByPk(selfInfo.level_I);
			this.controller.setSelectedIndex(0);
		}
		else {
			//上周
			rank = selfInfo.lastRank_I;
			winCount = selfInfo.lastWinCount_I;
			kingCfg = ConfigManager.mgKingStife.getByPk(selfInfo.lastLevel_I);
			this.controller.setSelectedIndex(1);
		}
		this.rankTxt.text = rank && rank != -1 ? "排名：" + rank : "未上榜";
		this.winNumTxt.text = "净胜场：" + winCount + "场";
		// this.stageIcon.load(URLManager.getModuleImgUrl("kingBattle/stageIcon_" + kingCfg.stage + ".png",PackNameEnum.Arena));
		this.stageIcon.setLevel(kingCfg.level);
	}
}