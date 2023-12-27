class WindowCampBattleResult extends BaseWindow {
    private loader_result_Bg:GLoader;
    private loader_title:GLoader;
    private txt_exitTime:fairygui.GTextField;
    private txt_myRank:fairygui.GRichTextField;
    private txt_myScore:fairygui.GRichTextField;
    private list_item:List;
    private list_rank:List;

	private leftTime:number = 0;
	private curTime:number;
	public constructor() {
		super(PackNameEnum.CopyResult,"WindowCampBattleResult");
		this.isPopup = false;
	}

	public initOptUI():void{
        this.loader_result_Bg = <GLoader>this.getGObject("loader_result_Bg");
		this.loader_result_Bg.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));
        this.loader_title = <GLoader>this.getGObject("loader_title");
		this.loader_title.load(URLManager.getModuleImgUrl("title_campBattle.png",PackNameEnum.Copy));
        this.txt_exitTime = this.getGObject("txt_exitTime").asTextField;
        this.txt_myRank = this.getGObject("txt_myRank").asRichTextField;
        this.txt_myScore = this.getGObject("txt_myScore").asRichTextField;
        this.list_item = new List(this.getGObject("list_item").asList);
        this.list_rank = new List(this.getGObject("list_rank").asList);
		this.closeObj.visible = true;
	}

	public updateAll(data?:any):void{
		this.txt_myRank.text = "我的排名：" + HtmlUtil.html("" + data.myRank_I,Color.BASIC_COLOR_9);
		this.txt_myScore.text = "我的积分：" + HtmlUtil.html("" + data.myScore_I,Color.BASIC_COLOR_9);

		let items:ItemData[] = [];
		let rewards:any[] = data.rewards.data;
		for(let i:number = 0; i < rewards.length; i++) {
			let str:string = rewards[i].type_I + "," + rewards[i].code_I + "," + Number(rewards[i].num_L64);
			let item:ItemData = RewardUtil.getReward(str);
			items.push(item);
		}
		this.list_item.data = items;

		let rankInfos:any[] = data.scoreList.data;
		for(let i:number = 0; i < rankInfos.length; i++) {
			rankInfos[i].rank = i+1;
		}
		this.list_rank.setVirtual(rankInfos);

		App.TimerManager.remove(this.onTimerHandler,this);
		this.curTime = egret.getTimer();
		this.leftTime = 10;
		this.txt_exitTime.text = this.leftTime + "秒退出五洲";
		App.TimerManager.doTimer(1000,0,this.onTimerHandler,this);
	}

	private onTimerHandler():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		this.curTime = time;
		if(this.leftTime <= 0) {
			//倒计时结束不关界面，策划需求
			this.txt_exitTime.text = "";
			return;
		}
		this.txt_exitTime.text = this.leftTime + "秒退出五洲";
	}

	public hide():void {
		this.leftTime = 0;
		App.TimerManager.remove(this.onTimerHandler,this);
		super.hide();
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyBattleBich)) {
			EventManager.dispatch(LocalEventEnum.CopyReqExit);
		}
	}
}