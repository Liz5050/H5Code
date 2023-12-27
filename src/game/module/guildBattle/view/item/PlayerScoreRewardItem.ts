class PlayerScoreRewardItem extends ListRenderer {
    private baseItem:BaseItem;
    private txt_score:fairygui.GTextField;
	public constructor() {
		super();
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.baseItem = <BaseItem>this.getChild("baseItem");
        this.txt_score = this.getChild("txt_score").asTextField;
	}

	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.txt_score.text = data.score + "积分";
		this.baseItem.itemData = RewardUtil.getReward(data.rewardStr);
	}
}