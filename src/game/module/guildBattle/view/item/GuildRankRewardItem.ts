class GuildRankRewardItem extends ListRenderer {
    private c1:fairygui.Controller;
    private loader_rankIcon:GLoader;
    private txt_rank:fairygui.GTextField;
    private list_item:List;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.loader_rankIcon = <GLoader>this.getChild("loader_rankIcon");
        this.txt_rank = this.getChild("txt_rank").asTextField;
        this.list_item = new List(this.getChild("list_item").asList);
	}

	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.c1.selectedIndex = index > 2 ? 1 : 0;
		this.loader_rankIcon.clear();		
		if(data.rankStart != data.rankEnd) {
			this.txt_rank.text = "第" + data.rankStart + "-" + data.rankEnd + "名"; 
		}
		else {
			this.txt_rank.text = "第" + data.rankStart + "名";
			if(data.rankStart <= 3) {
				this.loader_rankIcon.load(URLManager.getCommonIcon("rank" + data.rankStart));
			}
		}
		let rewardStr:string[] = data.rewardStr.split("#");
		let itemDatas:ItemData[] = [];
		for(let i:number = 0; i < rewardStr.length; i++) {
			if(rewardStr[i] == "") continue;
			itemDatas.push(RewardUtil.getReward(rewardStr[i]));
		}
		this.list_item.data = itemDatas;
	}
}