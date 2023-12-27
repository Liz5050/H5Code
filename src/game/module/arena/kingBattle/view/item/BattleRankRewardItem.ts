class BattleRankRewardItem extends ListRenderer{
	private c1:fairygui.Controller;
	private c2:fairygui.Controller;
	private stageIcon:KingBattleStageIconView;
	private rankTxt:fairygui.GTextField;
	private nameTxt:fairygui.GTextField;
	private winNumTxt:fairygui.GTextField;
	private baseItem:BaseItem;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.stageIcon = new KingBattleStageIconView(this.getChild("stageIcon").asCom);
		this.rankTxt = this.getChild("rankTxt").asTextField;
		this.nameTxt = this.getChild("nameTxt").asTextField;
		this.winNumTxt = this.getChild("winNumTxt").asTextField;
		this.baseItem = this.getChild("baseItem") as BaseItem;
	}

	public setData(data:any,index:number):void {
		this._data = data;
		let rank:number = index + 1;
		this.rankTxt.text = "" + rank;
		if(typeof(data) == "number") {
			this.nameTxt.text = "虚位以待";
			this.winNumTxt.text = "";
			this.stageIcon.clear();
		}
		else {
			this.nameTxt.text = data.name_S;
			this.winNumTxt.text = data.winCount_I + "场";
			let stageCfg:any = ConfigManager.mgKingStife.getByPk(data.level_I);
			// this.stageIcon.load(URLManager.getModuleImgUrl("kingBattle/stageIcon_" + stageCfg.stage + ".png",PackNameEnum.Arena));
			this.stageIcon.setLevel(data.level_I);
		}
		this.c2.setSelectedIndex(index % 2);
		if(rank > 3) {
			this.c1.setSelectedIndex(0);
		}
		else {
			this.c1.setSelectedIndex(rank);
		}
		
		let cfg:any = ConfigManager.kingRankReward.getByPk(rank);
		if(cfg) {
			let rewardStr:string = cfg.rewards.split("#")[0];
			let itemData:ItemData;
			if(rewardStr != "") {
				let arr:string[] = rewardStr.split(",");
				itemData = new ItemData(Number(arr[1]));
				itemData.itemAmount = Number(arr[2]);
			}
			if(itemData) {
				this.baseItem.setData(itemData);
			}
		}
	}
}