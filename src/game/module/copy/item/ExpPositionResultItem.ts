class ExpPositionResultItem extends ListRenderer {
    private txtName:fairygui.GRichTextField;
    private txtRank:fairygui.GTextField;
    private txtGuild:fairygui.GTextField;
    private txtExp:fairygui.GTextField;
    private baseItem:BaseItem;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.txtName = this.getChild("txt_name").asRichTextField;
        this.txtRank = this.getChild("txt_rank").asTextField;
        this.txtGuild = this.getChild("txt_guild").asTextField;
        this.txtExp = this.getChild("txt_exp").asTextField;
        this.baseItem = this.getChild("baseItem") as BaseItem;
        this.baseItem.isShowName = false;
	}

	public setData(data:any,index:number):void {		
		this._data = data;
		this.itemIndex = index;
        let rank:number = index + 1;
        this.txtRank.text = "" + rank;
        let rewardCfg:any = ConfigManager.expPosition.getRankReward(rank);
        if(rewardCfg) {
            this.baseItem.setData(RewardUtil.getStandeRewards(rewardCfg.reward)[0]);
        }
        let nameStr:string = data.name_S;
        if(EntityUtil.isCrossPlayer(data.entityId)) {
            nameStr = data.name_S + "\n" +  EntityUtil.getServerNameStr(data.entityId.typeEx_SH);
        }
        this.txtName.text = nameStr;
        this.txtGuild.text = data.guildName_S;
        this.txtExp.text = App.MathUtils.formatNum64(data.exp_L64,false);
	}
}