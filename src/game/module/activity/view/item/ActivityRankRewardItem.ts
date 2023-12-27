class ActivityRankRewardItem extends fairygui.GComponent {
	// private c1:fairygui.Controller;
	private list_item:List;
	private txt_rank:fairygui.GTextField;
	// private txt_name:fairygui.GTextField;
	// private txt_fight:fairygui.GTextField;
	// private txt_other:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.list_item = new List(this.getChild("list_item").asList,{isShowName:false});
		this.txt_rank = this.getChild("txt_rank").asTextField;
		// this.c1 = this.getController("c1");
		// this.txt_name = this.getChild("txt_name").asTextField;
		// this.txt_fight = this.getChild("txt_fight").asTextField;
		// this.txt_other = this.getChild("txt_other").asTextField;
	}

	public setData(data:any):void {
		// if(data.idx > 3) {
		// 	this.c1.setSelectedIndex(1);
		// }
		// else {
		// 	this.c1.setSelectedIndex(0);
		// }

		let rewards:string[] = data.rewardList.split("#");
		let items:ItemData[] = [];
		for(let i:number = 0; i < rewards.length; i++) {
			if(rewards[i] == "") continue;
			items.push(RewardUtil.getReward(rewards[i]));
		}
		this.list_item.data = items;
		if(data.rankStart == data.rankEnd) {
			this.txt_rank.text = "第 " + data.rankStart + " 名";
		}
		else {
			this.txt_rank.text = "第" + data.rankStart + "-" + data.rankEnd + "名"; 
		}
		// this.txt_name.text = "虚位以待";
		// this.txt_fight.text = "";
	}

	// public updateRankInfo(rankInfo:any):void {
	// 	if(!rankInfo) {
	// 		this.txt_name.text = "虚位以待";
	// 		this.txt_fight.text = "";
	// 		this.txt_name.verticalAlign = fairygui.VertAlignType.Middle;
	// 	}
	// 	else {
	// 		let propertys:string[] = CacheManager.rank.getRankPropertys(rankInfo);
	// 		this.txt_name.text = propertys[0];
	// 		this.txt_fight.text = propertys[1] + "";
	// 		if(rankInfo.toplistType_I == EToplistType.EToplistTypeRoleStateOpen) {
	// 			if(Number(propertys[2]) >= 10000) {
	// 				this.txt_fight.text = HtmlUtil.colorSubstitude(LangActivity.L17,propertys[1],App.MathUtils.formatNum(Number(propertys[2])));
	// 			}
	// 			else {
	// 				this.txt_fight.text = HtmlUtil.colorSubstitude(LangActivity.L16,propertys[1]);
	// 			}
	// 		}
	// 		this.txt_name.verticalAlign = fairygui.VertAlignType.Top;
	// 	}
	// }
}