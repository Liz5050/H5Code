class AchievementModule extends BaseModule
{
	private controller:fairygui.Controller;
	private topPanel:AchievementTopPanel;
	private allItemList:List;
	private btnList:List;
	private rewardList:List;
	private allGetBtn:fairygui.GButton;

	private curSelectBtn:AchievementCategoryBtn;
	private curIndex:number = -1;

	private curList:any[];
	private isScrollTop:boolean = false;
	public constructor(moduleId:ModuleEnum) 
	{
		super(moduleId,PackNameEnum.Achievement);
	}

	public initOptUI():void {
		this.controller = this.getController("c1");
		this.topPanel = new AchievementTopPanel(this.getGObject("panel_sum").asCom);
		this.allItemList = new List(this.getGObject("list_AchievementSum").asList);
		this.allItemList.list.defaultItem = URLManager.getPackResUrl(PackNameEnum.Achievement,"AchievementPointItem");

		this.btnList = new List(this.getGObject("list_AchievementType").asList);
		this.btnList.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectBtnChange,this);
		this.btnList.data = ConfigManager.achievementName.getCategoryList();

		this.rewardList = new List(this.getGObject("list_reward").asList);
		this.rewardList.list.defaultItem = URLManager.getPackResUrl(PackNameEnum.Achievement,"AchievementReceiveItem");
		
		this.allGetBtn = this.getGObject("btn_allReceive").asButton;
		this.allGetBtn.addClickListener(this.onGetAllReward,this);
	}

	public updateAll(data?:any):void {
		let index:number = 0;
		if(data)
		{
			let config:any = ConfigManager.achievement.getByPk(Number(data.code));
			if(config)
			{
				index = this.btnList.data.indexOf(config.category);
			}
		}
		if(index == -1) index = 0;
		this.btnList.list.scrollToView(index);
		this.controller.selectedIndex = index == 0 ? 0 : 1;
		this.setIndex(index);
		this.updateBtnTipsIcon();
	}

	private setIndex(index:number):void
	{
		if(this.curIndex == index) return;
		if(this.curSelectBtn)
		{
			this.curSelectBtn.btnSelected = false;
		}
		this.curIndex = index;
		this.btnList.selectedIndex = index;
		this.curSelectBtn = this.btnList.selectedItem;
		this.curSelectBtn.btnSelected = true;
		let category:number = this.curSelectBtn.getData();
		if(index == 0)
		{
			this.controller.selectedIndex = 0;
			EventManager.dispatch(LocalEventEnum.GetAchievementAllInfo);
		}
		else
		{
			this.controller.selectedIndex = 1;
		}
		this.isScrollTop = true;
		EventManager.dispatch(LocalEventEnum.GetAchievementInfos,category,0);
	}

	public updateSelectList():void
	{
		this.curList = CacheManager.achievement.getAchievementInfos();
		if(this.controller.selectedIndex == 0) 
		{
			if(this.isScrollTop) this.allItemList.list.scrollToView(0);
			this.allItemList.setVirtual(this.curList);
		}
		else 
		{
			if(this.isScrollTop) this.rewardList.list.scrollToView(0);
			this.rewardList.setVirtual(this.curList);
		}
		this.isScrollTop = false;
	}

	public updateTopPanel():void
	{
		this.topPanel.updateAll();
	}

	/**
	//  * 更新成就奖励领取状态
	//  */
	// public updateRewardState(codes:number[]):void
	// {
	// 	let list:List = this.controller.selectedIndex == 0 ? this.allItemList : this.rewardList;
	// 	for(let i:number = 0; i < this.curList.length; i++)
	// 	{
	// 		let index:number = codes.indexOf(this.curList[i].code_I);
	// 		if(index != -1)
	// 		{
	// 			let item:AchievementPointItem | AchievementReceiveItem = <AchievementPointItem | AchievementReceiveItem>list.list.getChildAt(index);
	// 			item.status = EAchievementStatus.EAchievementStatusHadEnd;
	// 		}
	// 	}
	// }

	public updateBtnTipsIcon():void
	{
		let categorys:number[] = CacheManager.achievement.getCanGetRewardCategory();
		let allCategorys:number[] = this.btnList.data;
		let index:number = -1;
		for(let i:number = 0; i < allCategorys.length; i++)
		{
			let btn:AchievementCategoryBtn = this.btnList.list.getChildAt(i) as AchievementCategoryBtn;
			index = categorys.indexOf(allCategorys[i]);
			CommonUtils.setBtnTips(btn,index != -1);
		}
	}

	private onSelectBtnChange():void {
		let index:number = this.btnList.selectedIndex;
		this.setIndex(index);
	}

	/**领取当前页所有奖励 */
	private onGetAllReward():void {
		let codes:number[] = [];
		let rewardNum:number = 0;
		let leftCell:number = CacheManager.pack.backPackCache.capacity - CacheManager.pack.backPackCache.usedCapacity;
		if(leftCell <= 0)
		{
			AlertII.show("背包已满，请前往整理！",null,function() {
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Pack);
			},this,[AlertType.YES],["前往整理"]);
			return;
		}

		for(let i:number = 0; i < this.curList.length; i++)
		{
			if(this.curList[i].status_BY != EAchievementStatus.EAchievementStatusComplete)
			{
				//如果遍历到不可领的，说明后面的都不可领取，列表已经是排序过的，可领取的数据只会在最前面
				break;
			}
			let config:any = ConfigManager.achievement.getByPk(this.curList[i].code_I);
			let rewardStr:string[] = config.rewardStr.split("#");
			for(let k:number = 0; k < rewardStr.length; k++)
			{
				let reward:string[] = rewardStr[k].split(",");
				if(Number(reward[0]) != 2)
				{
					//类型2代表奖励直接发数值奖励，如铜钱，荣誉，积分
					rewardNum ++;
					if(leftCell < rewardNum) break;
				}
			}
			if(leftCell < rewardNum) break;
			codes.push(this.curList[i].code_I);
		}
		if(codes.length == 0 && rewardNum == 0)
		{
			Tip.showTip("暂无奖励可领");
			return;
		}
		if(leftCell < rewardNum)
		{
			AlertII.show("背包剩余空位不足，部分奖励无法领取，请前往整理背包！",null,function() {
				EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Pack);
			},this,[AlertType.YES],["前往整理"]);
			//不用return，codes中加入的就是可成功领取的列表
		}
		if(codes.length == 0) return;
		EventManager.dispatch(LocalEventEnum.AchievementRewardGetALL,codes);
		// CacheManager.pack.backPackCache.usedCapacity;
	}	

	public hide():void {
		this.curIndex = -1;
		if(this.curSelectBtn)
		{
			this.curSelectBtn.btnSelected = false;
			this.curSelectBtn = null;
		}
		super.hide();
	}
}