class ActivityRankItem extends ListRenderer {
    private c1:fairygui.Controller;
    private txtName:fairygui.GTextField;
    private txtFight:fairygui.GTextField;
    private txtRank:fairygui.GTextField;
    private listItem:List;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.txtName = this.getChild("txt_name").asTextField;
        this.txtFight = this.getChild("txt_fight").asTextField;
        this.txtRank = this.getChild("txt_rank").asTextField;
        this.listItem = new List(this.getChild("list_item").asList);
	}

	public setData(data:any):void{		
		this._data = data;
        if(data.rank_I > 3) {
            this.c1.setSelectedIndex(0);
        }
        else {
            this.c1.setSelectedIndex(data.rank_I);
        }
        let propertys:string[] = CacheManager.rank.getRankPropertys(data);
        this.txtRank.text = "" + data.rank_I;
        this.txtName.text = propertys[0];
        this.txtFight.text = propertys[1] + "";
        if(data.toplistType_I == EToplistType.EToplistTypeRoleStateOpen) {
            if(Number(propertys[2]) >= 10000) {
                this.txtFight.text = HtmlUtil.colorSubstitude(LangActivity.L17,propertys[1],App.MathUtils.formatNum(Number(propertys[2])));
            }
            else {
                this.txtFight.text = HtmlUtil.colorSubstitude(LangActivity.L16,propertys[1]);
            }
        }
        let cfg:any = ConfigManager.toplistActiveDatail.getTopListDetailRewardCfg(data.toplistType_I,data.rank_I);
        if(cfg) {
            let rewardStr:string[] = cfg.rewardList.split("#");
            let itemDatas:ItemData[] = [];
            for(let i:number = 0; i < rewardStr.length; i++) {
                if(rewardStr[i] == "") continue;
                itemDatas.push(RewardUtil.getReward(rewardStr[i]));
            }
            this.listItem.data = itemDatas;
        }
        else {
            this.listItem.data = null;
        }
	}
}