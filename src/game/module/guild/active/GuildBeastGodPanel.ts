/**
 * 仙盟神兽
 */
class GuildBeastGodPanel extends BaseTabPanel {
	private modelContainer: fairygui.GComponent;
	private bossModelPanel: BossModelPanel;
	private timeTxt: fairygui.GRichTextField;
	private foodTxt: fairygui.GRichTextField;
	private tipTxt: fairygui.GRichTextField;
	private itemList: List;
	private baseItem: BaseItem;
	private costTxt: fairygui.GTextField;
	private handInBtn: fairygui.GButton;

	private timeLimit: number;
	private cost: number;
	private foodCode: number;
	private startTime: number;
	private endTime: number;
	private cfg: any;
	private foodNum: number;

	public initOptUI(): void {
		this.modelContainer = this.getGObject("model_container").asCom;
		this.bossModelPanel = new BossModelPanel();
		this.modelContainer.addChild(this.bossModelPanel);
		this.timeTxt = this.getGObject("txt_time").asRichTextField;
		this.foodTxt = this.getGObject("txt_food").asRichTextField;
		this.tipTxt = this.getGObject("txt_tip").asRichTextField;
		this.costTxt = this.getGObject("txt_cost").asTextField;
		this.itemList = new List(this.getGObject("list_item").asList);
		this.baseItem = <BaseItem>this.getGObject("baseItem");
		this.handInBtn = this.getGObject("btn_handIn").asButton;
		this.handInBtn.addClickListener(this.clickHandIn, this);
		this.getGObject("btn_fight").addClickListener(this.clickFight, this);

		this.timeLimit = ConfigManager.const.getConstValue("GuildBeastGodOpenCountLimit");
		this.cost = ConfigManager.const.getConstValue("GuildBeastGodOpenNeedVal");
		this.foodCode = CacheManager.guild.beastFoodCode;
		this.startTime = ConfigManager.const.getConstValue("GuildBeastGodOpenTimeLimitLower");
		this.endTime = ConfigManager.const.getConstValue("GuildBeastGodOpenTimeLimitUpper");

		this.baseItem.itemData = new ItemData(this.foodCode);
		this.baseItem.showBind();
	}

	public updateAll(): void {
		EventManager.dispatch(LocalEventEnum.GuildBeastGodInfoGet);
		this.costTxt.text = this.cost.toString();
		this.tipTxt.text = `${this.startTime}:00-${this.endTime}:00<font color='#fea700'>可开启挑战</font>`;

		this.cfg = ConfigManager.guildBeastGod.getByLevel(CacheManager.role.worldLevel);
		if (this.cfg) {
			this.bossModelPanel.updateByBossCode(this.cfg.bossCode);
			this.itemList.data = TaskUtil.getRewardsByStr(this.cfg.showRewards);
		}

		this.updatePackFoodNum();
	}

	/**
	 * 更新挑战次数
	 */
	public updateTimes(): void {
		let info: any = CacheManager.guild.beastGodInfo;
		if (info.canOpenCount == 0) {
			this.timeTxt.text = `<font color='#DF140E'>${info.canOpenCount}</font>/${this.timeLimit}`;
		} else {
			this.timeTxt.text = `${info.canOpenCount}/${this.timeLimit}`;
		}
	}

	/**
	 * 更新兽粮库存
	 */
	public updateFood(): void {
		let info: any = CacheManager.guild.beastGodInfo;
		if (info.totalVal < this.cost) {
			this.foodTxt.text = `<font color='#DF140E'>${info.totalVal}/${this.cost}</font>`;
		} else {
			this.foodTxt.text = `${info.totalVal}/${this.cost}`;
		}
	}

	/**
	 * 点击上交
	 */
	private clickHandIn(): void {
		if (this.foodNum == 0) {
			Tip.showTip("背包中无可上交的兽粮");
			return;
		}
		EventManager.dispatch(LocalEventEnum.GuildBeastGodFoodDonate, this.foodNum);
		this.updatePackFoodNum(0);
	}

	/**
	 * 点击开始挑战
	 */
	private clickFight(): void {
		EventManager.dispatch(LocalEventEnum.GuildBeastGodOpen);
	}

	/**
	 * 更新背包中兽粮数量
	 */
	public updatePackFoodNum(num: number = -1): void {
		if (num == -1) {
			this.foodNum = CacheManager.guild.getBeastFoodNum();
		} else {
			this.foodNum = num;
		}

		if (this.foodNum == 0) {
			this.baseItem.numTxt.text = `<font color='#df140f'>${this.foodNum}</font>`;
		} else {
			this.baseItem.numTxt.text = App.MathUtils.formatNum(this.foodNum);
		}

		CommonUtils.setBtnTips(this.handInBtn, this.foodNum > 0);
	}
}