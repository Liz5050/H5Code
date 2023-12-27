/**
 * 登陆奖励
 */
class LoginRewardPanel extends BaseTabView {
	private tipLoader: GLoader;
	private rewardList: List;
	private rewardDetailList: fairygui.GList;
	private loginDaysTxt: fairygui.GTextField;
	private rewardDayTxt: fairygui.GTextField;
	private getRewardBtn: fairygui.GButton;
	private btnTitle: fairygui.GTextField;
	private mc: UIMovieClip;

	private getRewardDay: number = 0;
	private configData: any[];
	private selectedReward: any;
	private days: Array<number> = [3, 5, 10];

	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.tipLoader = this.getGObject("loader_tip") as GLoader;
		this.rewardList = new List(this.getGObject("list_reward").asList);
		this.rewardDetailList = this.getGObject("list_rewardDetail").asList;
		this.loginDaysTxt = this.getGObject("txt_loginDays").asTextField;
		this.rewardDayTxt = this.getGObject("txt_rewardDay").asTextField;
		this.getRewardBtn = this.getGObject("btn_getReward").asButton;
		this.btnTitle = this.getGObject("btn_title").asTextField;

		this.rewardList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.getRewardBtn.addClickListener(this.clickGetRewardBtn, this);
		this.configData = ConfigManager.sevenDays.select({});
	}

	public updateAll(): void {
		this.updateList();
		this.updateLoginDay();
		this.onClickItem();
		this.updateTip();
	}

	private onClickItem(): void {
		this.selectedReward = this.rewardList.selectedData;
		this.updateRewardDetail();
	}

	private clickGetRewardBtn(): void {
		if (this.getRewardDay != 0) {
			ProxyManager.welfare2.getReward(this.getRewardDay);

			//掉落背包
			let point: egret.Point;
			let baseItem: BaseItem;
			for (let item of this.rewardDetailList._children) {
				baseItem = item as BaseItem;
				point = baseItem.localToGlobal(0, 0, RpgGameUtils.point);
				MoveMotionUtil.itemMoveToBag([baseItem.itemData.getCode()], 0, LayerManager.UI_Cultivate, point.x, point.y);
			}
		}

	}

	/**更新登陆奖励 */
	public updateList(): void {
		this.rewardList.data = this.configData; //不用虚拟列表，否则滚动到某个位置的函数会出问题
		this.rewardList.selectedIndex = this.getSelectItem();
		this.rewardList.scrollToView(this.rewardList.selectedIndex);
	}

	private getSelectItem(): number {
		for (let data of this.configData) {
			if (!CacheManager.welfare2.isLoginRewardGot(data.day)) {
				return data.day - 1;
			}
		}
		return 0;
	}

	public updateLoginDay(): void {
		this.loginDaysTxt.text = `登陆天数：${CacheManager.welfare2.onlineDays}`;
	}

	private updateRewardDetail(): void {
		let rewardDatas: Array<ItemData> = RewardUtil.getStandeRewards(this.selectedReward.rewardStr);
		if (this.selectedReward.day == 14 && this.selectedReward.continueLoginReward != null) {//处理特殊奖励
			let continueReward: Array<ItemData> = RewardUtil.getStandeRewards(this.selectedReward.continueLoginReward);
			rewardDatas = continueReward.concat(rewardDatas);
		}
		this.rewardDetailList.removeChildrenToPool();
		for (let itemData of rewardDatas) {
			let baseItem: BaseItem = <BaseItem>this.rewardDetailList.addItemFromPool();
			baseItem.itemData = itemData;
		}
		this.rewardDayTxt.text = `第${GameDef.NumberName[this.selectedReward.day]}天奖励详情`;
		this.getRewardDay = this.selectedReward.day;
		this.updateStatus();
	}

	private updateStatus(): void {
		let isCanGetReward: boolean = true;
		this.getRewardBtn.visible = true;
		this.loginDaysTxt.visible = true;
		if (CacheManager.welfare2.isLoginRewardGot(this.getRewardDay)) {
			this.getRewardBtn.visible = false;
			this.loginDaysTxt.visible = false;
			isCanGetReward = false;
		} else if (!CacheManager.welfare2.checkOnline(this.getRewardDay)) {
			this.getRewardBtn.visible = false;
			this.loginDaysTxt.visible = true;
			isCanGetReward = false;
		}
		this.btnTitle.visible = this.getRewardBtn.visible;
		//特效和红点更新
		if (isCanGetReward) {
			if (this.mc == null) {
				this.mc = UIMovieManager.get(PackNameEnum.MCRcgBtn2, -8, -9, 0.92, 1);
				this.mc.playing = true;
				this.mc.frame = 0;
			}
			this.getRewardBtn.addChild(this.mc);
		} else {
			if (this.mc != null) {
				UIMovieManager.push(this.mc);
				this.mc = null;
			}
		}
		let redPoint: fairygui.GObject;
		CommonUtils.setBtnTips(this.getRewardBtn, isCanGetReward, 190, 8, false);
		redPoint = this.getRewardBtn.getChild(CommonUtils.redPointName);
		if (redPoint) {
			this.getRewardBtn.setChildIndex(redPoint, this.numChildren - 1);
		}
		App.DisplayUtils.grayButton(this.getRewardBtn, !isCanGetReward, !isCanGetReward);
	}

	private updateTip(): void {
		let iconId: number = 1;
		if (CacheManager.welfare2.isLoginRewardGot(3)) {
			for (let day of this.days) {
				if (CacheManager.welfare2.isLoginRewardGot(day)) {
					iconId = day;
				}
			}
		} else {
			iconId = 1;
		}
		this.tipLoader.load(URLManager.getModuleImgUrl(`tip_${iconId}.png`, PackNameEnum.Welfare2));
	}
}