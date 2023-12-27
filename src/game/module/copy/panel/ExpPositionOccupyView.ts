class ExpPositionOccupyView extends BaseCopyPanel {
	private c1:fairygui.Controller;
	private c2:fairygui.Controller;
	private btn_des:fairygui.GButton;
	private txtTime:fairygui.GRichTextField;
	private btnMyOccupy:fairygui.GButton;
	private iconArea:{[multiply:number]:ExpPositionItemView};
	private posIds:number[] = [];

	private list_rank:List;
	private txt_myRank:fairygui.GRichTextField;
	private txt_myExp:fairygui.GRichTextField;
	private btn_rank:fairygui.GButton;

	private leftTime:number;
	private curTime:number;
	private timeStr:string;
	private timeIndex:number = -1;

	private myOccupyInfo:any;
	private myOccupyView:MyOccupyInfoView;
	private playCfg:any;
	private rankWindow:ExpPositionRankWindow;
	// private curOccupyCfg:any;
	public constructor(copyInfo:any) {
		super(copyInfo,"ExpPositionOccupyView",PackNameEnum.Copy2);
		this.exitTips = "是否确定退出阵地争夺？\n退出后将损失大量经验且有30秒进入CD";
		this.thisParent = LayerManager.UI_Main;
		this.defParent = LayerManager.UI_Main;
	}

	public initOptUI():void {
		super.initOptUI();
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.txtTime = this.getGObject("txt_time").asRichTextField;
		this.btn_des = this.getGObject("btn_des").asButton;
		this.btn_des.addClickListener(this.onOpenCopyDes,this);

		this.posIds = [3,4,7,5,6];
		this.iconArea = {};
		for(let i:number = 0; i < this.posIds.length; i++) {
			let areaItem:ExpPositionItemView = this.getGObject("icon_area_" + i) as ExpPositionItemView;
			areaItem.setPosId(this.posIds[i]);
			this.iconArea[this.posIds[i]] = areaItem;
		}

		this.btnMyOccupy = this.getGObject("btn_self_area").asButton;
		this.btnMyOccupy.addClickListener(this.onOpenDesView,this);

		this.timeStr = HtmlUtil.html("倒计时：",Color.Color_7);

		this.list_rank = new List(this.getGObject("list_rank").asList);
		this.txt_myRank = this.getGObject("txt_myRank").asRichTextField;
		this.txt_myExp = this.getGObject("txt_myExp").asRichTextField;
		this.btn_rank = this.getGObject("btn_rank").asButton;
		this.btn_rank.addClickListener(this.onOpenRankHandler,this);
	}

	protected addListenerOnShow(): void {
		this.addListen1(NetEventEnum.ExpPositionRankListUpdate,this.onRankListUpdate,this);
    }

	public updateAll(data:any = null):void {
		this.leftTime = CacheManager.posOccupy.leftTime;
		if(this.timeIndex == -1) {
			this.curTime = egret.getTimer();
			this.txtTime.text = this.timeStr + App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false);
			// App.TimerManager.doTimer(1000,0,this.onTimerUpdate,this);
			this.timeIndex = egret.setInterval(this.onTimerUpdate,this,1000);
		}
		this.updateOccupyInfo();
		this.updateSelfOccupy();
		this.onRankListUpdate();
		this.c2.selectedIndex = 1;
	}

	/**
	 * 更新占领列表
	 */
	public updateOccupyInfo():void {
		let occupys:any[] = CacheManager.posOccupy.occupyInfos;
		if(!occupys) return;
		let updatePosId:number[] = [];
		for(let i:number = 0; i < occupys.length; i++) {
			let item:ExpPositionItemView = this.iconArea[occupys[i].posId_I]
			if(item) {
				item.updateOccupyInfo(occupys[i]);
				updatePosId.push(occupys[i].posId_I);
			}
		}

		for(let i:number = 0; i < this.posIds.length; i++) {
			if(updatePosId.indexOf(this.posIds[i]) == -1) {
				this.iconArea[this.posIds[i]].updateOccupyInfo(null);
			}
		}
	}

	/**
	 * 更新自己占领信息
	 */
	public updateSelfOccupy():void {
		this.myOccupyInfo = CacheManager.posOccupy.myOccupyInfo;
		if(!this.myOccupyInfo) return;
		let posCfg:any = ConfigManager.expPosition.getByPk(this.myOccupyInfo.posId_I);
		if(posCfg && posCfg.expTimes) {
			this.c1.selectedIndex = posCfg.expTimes;
			// if(!this.curOccupyCfg || this.curOccupyCfg.expTimes != posCfg.expTimes) {
			// 	//占领区域经验倍率发生改变
			// 	this.curOccupyCfg = posCfg;
			// 	if(posCfg.expTimes == 3 || posCfg.expTimes == 5) {
			// 		CacheManager.king.stopKingEntity(true);
			// 		AI.addAI(AIType.MoveToExpPos, {posCfg:posCfg});
			// 	}
			// }
		}
		else {
			this.c1.selectedIndex = 0;
		}
		if(this.myOccupyView && this.myOccupyView.isShow) {
			this.myOccupyView.updateAll(this.myOccupyInfo);
		}
		this.txt_myExp.text = CacheManager.posOccupy.myExp + "";
		if(this.rankWindow && this.rankWindow.isShow) {
			this.rankWindow.updateMyExp();
		}
	}

	private onTimerUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime) / 1000);
		this.curTime = time;
		if(this.leftTime < 0) {
			// App.TimerManager.remove(this.onTimerUpdate,this);
			if(this.timeIndex != -1) {
				egret.clearInterval(this.timeIndex);
				this.timeIndex = -1;
			}
			return;
		}
		this.txtTime.text = this.timeStr + App.DateUtils.getTimeStrBySeconds(this.leftTime,DateUtils.FORMAT_5,false);
	}

	/**排行榜更新 */
	private onRankListUpdate():void {
		let rankInfos:any[] = CacheManager.posOccupy.rankInfos;
		let list:any[] = [];
		for(let i:number = 0; i < 3; i++) {
			if(rankInfos && i < rankInfos.length) {
				list.push(rankInfos[i]);
			}
			else {
				list.push(null);
			}
		}
		this.list_rank.data = list;
		// let myRank:number = CacheManager.posOccupy.myRank;
		// let myRankStr:any = myRank > 0 ? myRank : LangArena.LANG36;
		this.txt_myRank.text = CacheManager.posOccupy.myRank + "";//App.StringUtils.substitude(LangArena.L39,myRankStr);
		//App.StringUtils.substitude(LangArena.L40,CacheManager.posOccupy.myExp);

		if(this.rankWindow && this.rankWindow.isShow) {
			this.rankWindow.onRankListUpdate();
		}
	}

	private onOpenDesView():void {
		if(!this.myOccupyView) {
			this.myOccupyView = new MyOccupyInfoView();
		}
		this.myOccupyView.show(this.myOccupyInfo);
	}

	/**查看排行榜 */
	private onOpenRankHandler():void {
		if(!this.rankWindow) {
			this.rankWindow = new ExpPositionRankWindow();
		}
		this.rankWindow.show();
	}

	/**
	 * 玩法说明
	 */
	private onOpenCopyDes():void {
		if(!this.playCfg) {
			this.playCfg = ConfigManager.gamePlay.getByPk(EActiveType.EActiveTypePosition);
		}
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:HtmlUtil.br(this.playCfg.desc)});
	}

	public hide():void {
		// App.TimerManager.remove(this.onTimerUpdate,this);
		if(this.timeIndex != -1) {
			egret.clearInterval(this.timeIndex);
			this.timeIndex = -1;
		}
		super.hide();
		if(this.myOccupyView && this.myOccupyView.isShow) {
			this.myOccupyView.hide();
		}
		if(this.rankWindow && this.rankWindow.isShow) {
			this.rankWindow.hide();
		}
	}
}