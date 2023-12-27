class KingBattleRewardWindow extends BaseWindow {
	private rankList:List;
	private itemList:List;
	public constructor() {
		super(PackNameEnum.KingBattle,"KingBattleRewardWindow");
	}

	public initOptUI():void {
		this.rankList = new List(this.getGObject("rank_list").asList);
		this.itemList = new List(this.getGObject("item_list").asList,{isSelectStatus:false});
		// this.itemList.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectItemChange,this);
		let stageRewards:ItemData[] = ConfigManager.kingStageReward.getStageRewards();
		this.itemList.data = stageRewards;
	}

	public updateAll():void {
		let rankInfos:any = CacheManager.arena.getRankInfo(1);
		let dataList:any[] = [];
		for(let i:number = 0; i < 5; i++) {
			if(rankInfos && i < rankInfos.data.length) {
				let cfg:any = ConfigManager.mgKingStife.getByPk(rankInfos.data[i].level_I);
				if(cfg.stage < 4) {
					//钻石以下段位没有排名奖励
					dataList.push(i + 1);	
				}
				else {
					dataList.push(rankInfos.data[i]);
				}
			}
			else {
				dataList.push(i + 1);
			}
		}
		this.rankList.data = dataList;
	}

	// private onSelectItemChange():void {
	// 	let index:number = this.itemList.selectedIndex;
	// 	this.itemList.selectedItem.selected = false;
	// }
}