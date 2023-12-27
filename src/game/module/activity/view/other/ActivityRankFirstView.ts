class ActivityRankFirstView extends fairygui.GComponent {
	private mc_container:fairygui.GComponent;
	private list_item:List;
	private txt_name:fairygui.GRichTextField;
	// private txt_fight:fairygui.GTextField;

	// private mcTitle:MovieClip;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.mc_container = this.getChild("mc_container").asCom;
		this.list_item = new List(this.getChild("list_item").asList);
		this.txt_name = this.getChild("txt_name").asRichTextField;
		// this.txt_fight = this.getChild("txt_fight").asTextField;
	}

	public setData(data:any):void {
		let rewards:string[] = data.rewardList.split("#");
		let items:ItemData[] = [];
		for(let i:number = 0; i < rewards.length; i++) {
			if(rewards[i] == "") continue;
			let itemData:ItemData = RewardUtil.getReward(rewards[i]);
			items.push(itemData);
			// if(itemData.getType() == EProp.EPropTitle) {
			// 	if(!this.mcTitle) {
			// 		this.mcTitle = ObjectPool.pop("MovieClip");
			// 		this.mcTitle.x = 0;
			// 		this.mcTitle.y = 0;
			// 		this.mcTitle.playFile(ResourcePathUtils.getRPGGame() + "title/" + itemData.getItemInfo().effect,-1, ELoaderPriority.UI_EFFECT);
			// 		(this.mc_container.displayObject as egret.DisplayObjectContainer).addChild(this.mcTitle);
			// 	}
			// }
		}
		this.list_item.data = items;
		// this.txt_fight.text = "";
		this.txt_name.text = "虚位以待";
	}

	public updateRankInfo(data:any):void {
		if(!data){
			this.txt_name.text = "虚位以待";
			// this.txt_fight.text = "";
		}
		else {
			let propertys:string[] = CacheManager.rank.getRankPropertys(data);
			if(data.toplistType_I == EToplistType.EToplistTypeRoleStateOpen) {
				if(Number(propertys[2]) > 10000) {
					this.txt_name.text = propertys[0] + "    " + HtmlUtil.colorSubstitude(LangActivity.L17,propertys[1],App.MathUtils.formatNum(Number(propertys[2])));
				}
				else {
					this.txt_name.text = propertys[0] + "    " + HtmlUtil.colorSubstitude(LangActivity.L16,propertys[1]);
				}
			}
			else {
				this.txt_name.text = propertys[0] + "    " + HtmlUtil.html(propertys[1],Color.Color_2);
			}
		}
	}

	public hide():void {
		// if(this.mcTitle) {
		// 	this.mcTitle.destroy();
		// 	this.mcTitle = null;
		// }
	}
}