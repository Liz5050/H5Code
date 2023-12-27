class WindowBossResult extends BaseResultRewardWin {

	private static NORMAL_CD:number = 10;
    private static CD:{[copyType:number]:number} = {
        [ECopyType.ECopyNewCrossBoss]: 5
    };

	private headImg:GLoader;
	private rewardList:List;
	private nameTxt:fairygui.GTextField;
	private rewardTxt:fairygui.GRichTextField;
	private timeTxt:fairygui.GRichTextField;

	private leftTime:number;
	private curTime:number;
	protected loaderBg:GLoader;
    private c1: fairygui.Controller;
    private c2: fairygui.Controller;
    private frameC2: fairygui.Controller;
	public constructor() {
		super(PackNameEnum.CopyResult,"WindowBOSSResult");
	}

	public initOptUI():void {
		this.c1 = this.getController('c1');
		this.c2 = this.getController('c2');
		this.headImg = this.getGObject("loader") as GLoader;
		this.rewardList = new List(this.getGObject("list_thing").asList,{isTxtNameStroke:false});
		this.nameTxt = this.getGObject("txt_name").asTextField;
		this.rewardTxt = this.getGObject("txt_reward").asRichTextField;
		this.timeTxt = this.getGObject("txt_tips").asRichTextField;		
		this.loaderBg = <GLoader>this.frame.getChild("loader_result_Bg");
		this.loaderBg.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));
        this.frameC2 = this.frame.getController("c2");
		this.closeObj.visible = true;
	}

	public updateAll(data?:any):void {
        this.c1.selectedIndex = data.type_I != ECrossBossRewardType.COLLECT_OWN ? 0 : 1;
		this.nameTxt.text = data.ownerMiniPlayer.name_S;
		let items:ItemData[] = [];
		let rewards:any[];
		let isAssist:boolean = data.coRewards && data.coRewards.data.length > 0;
		if(!isAssist) {
			rewards = data.rewards.data;
		}
		else {
			rewards = data.coRewards.data;
		}
		for(let i:number = 0; i < rewards.length; i++) {
			let str:string = rewards[i].type_I + "," + rewards[i].code_I + "," + Number(rewards[i].num_L64);
			let item:ItemData = RewardUtil.getReward(str);
			items.push(item);
		}
		items.sort(itemsSort);
		this.rewardList.data = items;
		if(items.length > 0) this.rewardList.scrollToView(0);
        if (!CacheManager.copy.isInCopyByType(ECopyType.ECopyNewCrossBoss)) {
            this.c2.selectedIndex = 0;
			if(isAssist) {
				this.rewardTxt.text = "协助奖励";
			}
			else {
				this.rewardTxt.text = EntityUtil.isMainPlayer(data.ownerMiniPlayer.entityId) ? "我的归属奖励" : "我的参与奖励";
			}
            this.rewardList.list.align = fairygui.AlignType.Center;
		} else {
			this.c2.selectedIndex = 1;
			if(data.playerRewardType_I == ENewCrossBossPlayerRewardType.ENewCrossBossPlayerRewardTypeCo && isAssist) {
				this.c2.selectedIndex = 2;
			}
            this.rewardList.list.align = fairygui.AlignType.Left;
            this.frameC2.selectedIndex = EntityUtil.isMainPlayer(data.ownerMiniPlayer.entityId) || isAssist ? 0 : 1;
        }

		this.headImg.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(data.ownerMiniPlayer.career_SH)));

		this.leftTime = this.getLeftTime();
		this.curTime = egret.getTimer();
		this.timeTxt.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green) + "后自动关闭)";
		if(!App.TimerManager.isExists(this.onTimeUpdate,this)){
			App.TimerManager.doTimer(1000,0,this.onTimeUpdate,this);
		}

		function itemsSort(item1:ItemData,item2:ItemData):number {
			if(item1.getCategory() == ECategory.ECategoryProp && item2.getCategory() != ECategory.ECategoryProp) return -1;
			if(item1.getCategory() != ECategory.ECategoryProp && item2.getCategory() == ECategory.ECategoryProp) return 1;
			if(item1.getCategory() == ECategory.ECategoryMaterial && item2.getCategory() != ECategory.ECategoryMaterial) return -1;
			if(item1.getCategory() != ECategory.ECategoryMaterial && item2.getCategory() == ECategory.ECategoryMaterial) return 1;
			if(item1.getColor() > item2.getColor()) return -1;
			if(item1.getColor() < item2.getColor()) return 1;
			if(item1.getLevel() > item2.getLevel()) return -1;
			if(item1.getLevel() < item2.getLevel()) return 1;
			return 0;
		}
	}

	private onTimeUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		if(this.leftTime < 0) {
			this.hide();
			return;
		}
		this.timeTxt.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green) + "后自动关闭)";
		this.curTime = time;
	}

	private getLeftTime():number {
        let copyInf:any = ConfigManager.copy.getByPk(CacheManager.copy.curCopyCode);
        // return copyInf && WindowBossResult.CD[copyInf.copyType] || WindowBossResult.NORMAL_CD;
        return copyInf && CopyUtils.getCopyResultSec(copyInf, true) || WindowBossResult.NORMAL_CD;
	}

	public hide():void {
		App.TimerManager.remove(this.onTimeUpdate,this);
		super.hide();
		let type:PanelTabType;
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewWorldBoss)){
			CacheManager.copy.isActiveLeft = true;
			CacheManager.task.gotoTaskFlag = false;
			EventManager.dispatch(LocalEventEnum.CopyReqExit);
			type = PanelTabType.WorldBoss;
		}
		else if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNewBossHome)) {
			EventManager.dispatch(LocalEventEnum.CopyReqExit);
			type = PanelTabType.BossHome;
		}
		else if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgBossLead)) {
			EventManager.dispatch(LocalEventEnum.CopyReqExit);
		}
		if(type && !UIManager.isOpenView()) {
			EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.Boss,{tabType:type});
		}
		if (CacheManager.copy.isInCopyByType(ECopyType.ECopyNewCrossBoss)) {
			let data:any = CacheManager.crossBoss.getLeftResult();
			if (data) {
				EventManager.dispatch(UIEventEnum.CrossBossResultOpen, data);
			}
		}
	}
}