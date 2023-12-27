class KingBattlePanel extends BaseTabView {
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private bgLoader:GLoader;
    // private stage_txtIcon:GLoader;
    private stageIcon:KingBattleStageIconView;
    private stageTxt:fairygui.GTextField;
    // private advanceTxt:fairygui.GTextField;
    private winIcon:fairygui.GImage;

    private stars:fairygui.GImage[];
    private starNulls:fairygui.GImage[];
    // private starGroup:fairygui.GGroup;

    private rankTxt:fairygui.GRichTextField;
    private winNumTxt:fairygui.GRichTextField;
    private openTimeTxt:fairygui.GTextField;

    // private rewardList:List;
    private rewardItem:BaseItem;
    
    private lastRankBtn:fairygui.GButton;
    private matchBtn:fairygui.GButton;
    private rankBtn:fairygui.GButton;
    private rewardBtn:fairygui.GButton;
    private buyCountBtn:fairygui.GButton;

    private leftCountTxt:fairygui.GRichTextField;
    private timeTxt:fairygui.GTextField;

    private leftTime:number = -1;
    private curTime:number;
    private hasTimer:boolean;

    private battleInfo:any;
    private curLvCfg:any;

	public constructor() {
		super();
	}

	public initOptUI():void{
        this.c1 = this.getController("c1");
        let startView:fairygui.GComponent = this.getGObject("start_view").asCom;
        this.c2 = startView.getController("c1");
        this.bgLoader = this.getGObject("bg_loader") as GLoader;
        this.bgLoader.load(URLManager.getModuleImgUrl("kingBattle/kingBattleBg.jpg",PackNameEnum.Arena));
        // this.stage_txtIcon = <GLoader>this.getChild("stage_txtIcon");
        this.stageIcon = new KingBattleStageIconView(this.getChild("stageIcon").asCom);

        this.stageTxt = this.getChild("txt_stage").asTextField;
        this.winIcon = this.getChild("winIcon").asImage;
        this.winIcon.visible = false;
        this.rewardItem = this.getChild("baseItem") as BaseItem;
        this.rewardItem.isSelectStatus = false;
        // this.starGroup = this.getChild("starGroup").asGroup;
        this.stars = [];
        this.starNulls = [];
        for(let i:number = 1; i < 6; i++) {
            this.stars.push(startView.getChild("star_" + i).asImage);
            this.starNulls.push(startView.getChild("star_null_" + i).asImage);
        }   

        this.rankTxt = this.getChild("rankTxt").asRichTextField;
        this.winNumTxt = this.getChild("winNumTxt").asRichTextField;
        this.leftCountTxt = this.getChild("leftCountTxt").asRichTextField;
        this.timeTxt = this.getChild("timeTxt").asTextField;
        this.openTimeTxt = this.getChild("openTimeTxt").asRichTextField;
        
        let startCfg:any = ConfigManager.const.getByPk("KingStifeStartDt");
		let endCfg:any = ConfigManager.const.getByPk("KingStifeEndDt");
        let closeCfg:any = ConfigManager.const.getByPk("KingStifeCloseHour");

        let startValue:string = startCfg.constValue != undefined ? startCfg.constValue : "00";
        let startEx:string = startCfg.constValueEx != undefined ? startCfg.constValueEx : "00";
		let endValue:string = endCfg.constValue != undefined ? endCfg.constValue : "00";
        let endEx:string = endCfg.constValueEx != undefined ? endCfg.constValueEx : "00";
        let closeValue:string = closeCfg.constValue != undefined ? closeCfg.constValue : "00";
        let closeEx:string = closeCfg.constValueEx != undefined ? closeCfg.constValueEx : "00";
        this.openTimeTxt.text = App.StringUtils.substitude(LangArena.LANG2,startValue + ":" + startEx,endValue + ":" + endEx,closeValue + ":" + closeEx);
        // this.openTimeTxt.text = "竞技时间：" + HtmlUtil.html("周一10:00",Color.Green2) + "——" + HtmlUtil.html("周日22：00",Color.Green2) + "（" + HtmlUtil.html("周日22：30",Color.Green2) + "结算）"
        
        this.lastRankBtn = this.getChild("lastRankBtn").asButton;
        this.lastRankBtn.addClickListener(this.onCheckLastRankHandler,this);
        this.rankBtn = this.getChild("rankBtn").asButton;
        this.rankBtn.addClickListener(this.openRankWindow,this);

        this.rewardBtn = this.getChild("rewardBtn").asButton;
        this.rewardBtn.addClickListener(this.openRewardWindow,this);

        this.matchBtn = this.getChild("matchBtn").asButton;
        this.matchBtn.addClickListener(this.onMatchHandler,this);

        this.buyCountBtn = this.getChild("buyCountBtn").asButton;
        this.buyCountBtn.addClickListener(this.onBuyCountHandler,this);
        (this.getGObject("btn_privilegeSet") as PrivilegeSetBtn).fromCode = CopyEnum.CopyKingBattle;

        GuideTargetManager.reg(GuideTargetName.KingBattlePanelMatchBtn, this.matchBtn);
	}

	public updateAll(data?:any):void {
        this.updateLevel();
        this.updateTimeCount();

        //黄金以下连胜场次 >= 2场 显示连胜图标
        if(this.battleInfo) {
            this.winIcon.visible = this.battleInfo.consecutiveWin_I > 2 && this.curLvCfg.stage <= 2;
            this.winNumTxt.text = "净胜场次：" + HtmlUtil.html(this.battleInfo.winCount_I + "",Color.Green2);
            let rankStr:string = !this.battleInfo || this.battleInfo.rank_I == -1 ? "未上榜" : HtmlUtil.html(this.battleInfo.rank_I + "",Color.Green2);
            this.rankTxt.text = "我的排名：" + rankStr;
        }
        
        this.updateOpenTime();
        if(!App.TimerManager.isExists(this.updateOpenTime,this)) {
            App.TimerManager.doTimer(60000,0,this.updateOpenTime,this);
        }
	}

    private updateOpenTime():void {
        if(CacheManager.arena.checkResultTime()) {
            this.c1.setSelectedIndex(1);
        }
        else {
            this.c1.setSelectedIndex(0);
        }
    }

    public updateLevel():void {
        this.battleInfo = CacheManager.arena.selfBattleInfo;
        if(!this.battleInfo) {
            Log.trace(Log.SERR,"王者争霸数据未初始化");
            return;
        }
        this.curLvCfg = ConfigManager.mgKingStife.getByPk(this.battleInfo.level_I);
        this.rewardItem.setData(CacheManager.arena.getCurStageReward());

        this.stageTxt.text = ConfigManager.mgKingStife.getStageStrByLevel(this.battleInfo.level_I);
        // this.stage_txtIcon.load(URLManager.getModuleImgUrl("kingBattle/stage_" + this.curLvCfg.stage + "_" + this.curLvCfg.advance + ".png",PackNameEnum.Arena));
        // this.stageIcon.load(URLManager.getModuleImgUrl("kingBattle/stageIcon_" + this.curLvCfg.stage + ".png",PackNameEnum.Arena));
        this.stageIcon.setLevel(this.battleInfo.level_I);
        // if(this.curLvCfg.stage >= 5) {
        //     this.stageIcon.viewCom.y = this.bgLoader.y + 95;//82 + offsetH;
        //     this.stageTxt.y = this.bgLoader.y + 236;//223 + offsetH;
        // }
        // else {
        //     this.stageIcon.viewCom.y = this.bgLoader.y + 75;//62 + offsetH;
        //     this.stageTxt.y = this.bgLoader.y + 203;//190 + offsetH;
        // }
        for(let i:number = 0; i < this.stars.length; i++) {
            this.stars[i].visible = this.curLvCfg.star && this.curLvCfg.star > i && this.curLvCfg.stage < 5;
            this.starNulls[i].visible = i < this.curLvCfg.tolStar && this.curLvCfg.stage < 5;
        }
        this.c2.selectedIndex = this.curLvCfg.tolStar - 1;
        
        // this.starGroup.x = 50 + 18*(5 - this.curLvCfg.tolStar) + (this.width - 720)/2;
        
    }

    public updateTimeCount():void {
        let copyInfo:any = CacheManager.copy.getPlayerCopyInf(CopyEnum.CopyKingBattle);
        if(copyInfo) {
            this.leftTime = copyInfo.enterSec_I - Math.round((egret.getTimer() - copyInfo.updateTime) / 1000);
        }
        if(this.leftTime > 0) {
            this.timeTxt.text = "（" + App.DateUtils.getFormatBySecond(this.leftTime) + "）恢复";
            if(!this.hasTimer){
                this.hasTimer = true;
                this.curTime = egret.getTimer();
                App.TimerManager.doTimer(1000,0,this.onTimerHandler,this);
            }
        }
        else {
            this.timeTxt.text = "（ 2小时恢复一次 ）";
        }
        this.updateCount();
    }

    private onTimerHandler():void {
        let time:number = egret.getTimer();
        this.leftTime -= Math.round((time - this.curTime) / 1000);
        this.curTime = time;
        if(this.leftTime <= 0) {
            this.removeTimer();
            EventManager.dispatch(LocalEventEnum.RefreshCopyCDTime);
            return; 
        }
        this.timeTxt.text = "（" + App.DateUtils.getFormatBySecond(this.leftTime) + "）恢复";
    }

    private updateCount():void {
        let copy:any = ConfigManager.copy.getByPk(CopyEnum.CopyKingBattle);
        let leftCount:number = 0;
        let total:number = 0;
        if(copy) {
            leftCount = CacheManager.copy.getEnterLeftNum(copy);
            total = copy.numByDay;
        }
        let color:number = leftCount > 0 ? Color.Green2 : Color.Red;
        this.leftCountTxt.text = "挑战次数：" + HtmlUtil.html(leftCount + "/" + total,color);
        this.buyCountBtn.visible = leftCount == 0;
        if(leftCount == total && this.hasTimer) {
            //挑战次数已满
            this.removeTimer();
        }
    }

    private removeTimer():void {
        App.TimerManager.remove(this.onTimerHandler,this);
        this.hasTimer = false;
        this.timeTxt.text = "（ 2小时恢复一次 ）";
    }
    
    /**开始匹配 */
    private onMatchHandler():void {
        if(CacheManager.copy.getEnterLeftNum(CopyEnum.CopyKingBattle) <= 0) {
			// Tip.showTip("挑战次数不足");
            this.onBuyCountHandler();
			return;
		}
        EventManager.dispatch(LocalEventEnum.KingBattleMatching);
    }

    /**购买次数 */
    private onBuyCountHandler():void {
        let copyCfg:any = ConfigManager.copy.getByPk(CopyEnum.CopyKingBattle);
        let key:string = copyCfg.copyType + ",0";// + CacheManager.vip.vipLevel;
        let addCfg:any = ConfigManager.copyAddNum.getByPk(key);
        let addInfo:any = CacheManager.copy.getAddNumInf(CopyEnum.CopyKingBattle);
        if(!addCfg) return;
        let tips:string = "确定花费" + HtmlUtil.html(addCfg.costNum + "元宝",Color.Color_5) + 
        "购买1次王者争霸挑战次数吗？\n今日已购买：" + HtmlUtil.html(addInfo.addNum + "/" + addCfg.maxAddNum,Color.Color_6) + "次";
        AlertII.show(tips,null,function(type:AlertType) {
            if(type == AlertType.YES) {
                if(MoneyUtil.checkEnough(addCfg.costUnit,addCfg.costNum)){
                    if(!CacheManager.copy.isAddNumLimit(copyCfg.code)) {
                        ProxyManager.copy.addCopyNum(copyCfg.copyType);
                    }
                    else {
                        Tip.showTip(LangCopyHall.L4);
                    }		
                }
            }
        },this);
    }

    /**打开排行榜 */
    private openRankWindow():void {
        EventManager.dispatch(UIEventEnum.OpenKingBattleRank,0);
    }

    /**上周排名 */
    private onCheckLastRankHandler():void {
        EventManager.dispatch(UIEventEnum.OpenKingBattleRank,1);
    }

    /**打开段位奖励 */
    private openRewardWindow():void {
        EventManager.dispatch(UIEventEnum.OpenKingBattleReward);
    }

    public hide():void {
        super.hide();
        this.removeTimer();
        App.TimerManager.remove(this.updateOpenTime,this);
    }
}