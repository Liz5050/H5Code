class AchievementReceiveItem extends ListRenderer {
	private controller:fairygui.Controller;
	private pointTxt:fairygui.GTextField;
	private nameTxt:fairygui.GTextField;
	private processTxt:fairygui.GRichTextField;
	private rewardList:List;
	private getBtn:fairygui.GButton;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void
	{
		super.constructFromXML(xml);
		this.controller = this.getController("c1");
		this.pointTxt = this.getChild("txt_points").asTextField;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.processTxt = this.getChild("txt_desc").asRichTextField;
		this.rewardList = new List(this.getChild("list_reward").asList);
		this.getBtn = this.getChild("btn_receive").asButton;
		this.getBtn.addClickListener(this.onGetRewardHandler,this);
	}

	// int code;		// 成就编码
	// byte status;	// 状态
	// int process;	// 当前进度
	public setData(data:any):void {
		this._data = data;
		let config:any = ConfigManager.achievement.getByPk(data.code_I);
		let rewardList:string[] = config.rewardStr.split("#");
		let itemDatas:ItemData[] = [];
		for(let i:number = 0; i < rewardList.length; i++)
		{
			let reward:string[] = rewardList[i].split(",");
			let itemCode:number;
			if(Number(reward[0]) == 2)
			{
				//类型2代表奖励直接发数值奖励，如铜钱，荣誉，积分
				itemCode = MoneyUtil.getMoneyItemCodeByType(Number(reward[1]));
			}
			else 
			{
				itemCode = Number(reward[1]);
			}
			let itemData:ItemData = new ItemData({itemCode_I : itemCode, itemAmount_I : Number(reward[2])});
			itemDatas.push(itemData);
		}
		this.rewardList.data = itemDatas;
		this.nameTxt.text = config.name;
		this.pointTxt.text = config.point;
		let processStr:string = config.desc;
		if(config.showProcess)
		{
			let targetValue:number = Number(config.conditionContent.split(",")[0]);
			let curValue:number = Math.min(data.process_I,targetValue);
			let color:number = Color.Yellow;
			if(data.status_BY != EAchievementStatus.EAchievementStatusNotComplete)
			{
				curValue = targetValue;
				color = Color.Green;
			}
			processStr += HtmlUtil.html("(" + curValue + "/" + targetValue + ")",color);
		}
		this.processTxt.text = HtmlUtil.br(processStr);
		this.controller.selectedIndex = data.status_BY - 1;
	}

	public set status(value:EAchievementStatus)
	{
		this.controller.selectedIndex = value - 1;
	}

	/**领取成就奖励 */
	private onGetRewardHandler():void {
		EventManager.dispatch(LocalEventEnum.AchievementRewardGet,this._data.code_I);
		this.controller.selectedIndex = 2;
	}
}