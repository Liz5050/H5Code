class CrossStairRewardItem extends ListRenderer {
	private txt_value:fairygui.GTextField;
	private list_item:List;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.txt_value = this.getChild("txt_value").asTextField;
		this.list_item = new List(this.getChild("list_item").asList);
	}

	public setData(data:any,index:number):void {		
		this._data = data;
		if(data.isFloor) {
			//闯关奖励
			this.txt_value.text = App.StringUtils.substitude(LangArena.L44,data.floor);
			this.list_item.data = RewardUtil.getStandeRewards(data.rewards);
		}
		else {
			//排名奖励
			let rank:string;
			if(data.minRank == data.maxRank) {
				rank = data.minRank + "";
			}
			else if(data.maxRank >= 100) {
				rank = "";
			}
			else {
				rank = data.minRank + "-" + data.maxRank;
			}
			if(rank != "") {
				this.txt_value.text = App.StringUtils.substitude(LangArena.L45,rank);
			}
			else {
				this.txt_value.text = LangArena.L50;
			}
			this.list_item.data = RewardUtil.getStandeRewards(data.reward);
		}
	}
}