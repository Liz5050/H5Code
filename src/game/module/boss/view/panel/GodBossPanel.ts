class GodBossPanel extends BaseTabView {
	private bgLoader:GLoader;
    private txt_times:fairygui.GRichTextField;
    private txt_countdown:fairygui.GRichTextField;
    private txt_set:fairygui.GRichTextField;
    // private btn_des:fairygui.GButton;
    private list_boss:List;
    // private tween_group:fairygui.GGroup;

    private hasTimer:boolean;
    private leftTime:number;
    private curTime:number;

    // private explainText:string;

    protected copyType:ECopyType;
    protected copyCode:number;
	public constructor() {
		super();
        this.copyType = ECopyType.ECopyMgNewWorldBoss;
        this.copyCode = CopyEnum.CopyGodBoss;
        this.isDestroyOnHide = false;
	}

	public initOptUI():void{
        this.bgLoader = this.getGObject("loader_bg") as GLoader;
        this.bgLoader.load(URLManager.getModuleImgUrl("worldBossBg.png",PackNameEnum.Boss));
        this.txt_times = this.getGObject("txt_times").asRichTextField;
        this.txt_countdown = this.getGObject("txt_countdown").asRichTextField;
        this.txt_set = this.getGObject("txt_set").asRichTextField;
        this.txt_set.text = HtmlUtil.html("提醒设置",null,false,22,"0",true);
        this.txt_set.addEventListener(egret.TextEvent.LINK,this.onOpenBossSetWindow,this);
        // this.btn_des = this.getGObject("btn_des").asButton;
        this.list_boss = new List(this.getGObject("list_boss").asList);
        (this.getGObject("btn_privilegeSet") as PrivilegeSetBtn).fromCode = CopyEnum.CopyGodBoss;
        // this.tween_group = this.getGObject("tween_group").asGroup;

        // this.explainText = "1、达到对应等级可解锁挑战野外BOSS" + 
		// "\n2、野外BOSS有几率掉落" + HtmlUtil.html("神装","#ff7610") + "和" + HtmlUtil.html("神装碎片","#ff7610") + 
		// "\n3、参与挑战野外BOSS可以获得" + HtmlUtil.html("精炼石","#ff7610") + 
		// "\n4、挑战次数每小时回复1点，最多存储12点";

        // this.btn_des.addClickListener(this.onShowDesHandler, this);
	}

	public updateAll(data?:any):void {
        this.updateGodBossList();
        this.updateTimeCount();

        if(!App.TimerManager.isExists(this.reqServerData,this)) {
            App.TimerManager.doTimer(3000,0,this.reqServerData,this);
        }
	}

    public updateTimeCount():void {
        let copyInfo:any = CacheManager.copy.getPlayerCopyInf(this.copyCode);
		if(!copyInfo) return;
        this.leftTime = copyInfo.enterSec_I - Math.round((egret.getTimer() - copyInfo.updateTime) / 1000);
        if(this.leftTime > 0) {
            this.txt_countdown.text = "(" + App.DateUtils.getFormatBySecond(this.leftTime) + ")恢复";
            if(!this.hasTimer){
                this.hasTimer = true;
                this.curTime = egret.getTimer();
                App.TimerManager.doTimer(1000,0,this.onTimerHandler,this);
            }
        }
        else {
            this.txt_countdown.text = "";
        }
		let copy:any = ConfigManager.copy.getByPk(this.copyCode);
		let leftCount:number = CacheManager.copy.getEnterLeftNum(this.copyCode);
        let color:number = leftCount > 0 ? Color.Green2 : Color.Red;
		let vipAddCfg:any = ConfigManager.vip.getVipAddDict(EVipAddType.EVipAddNewWorldBossCopyNum);
        let totalNum:number = copy.numByDay + vipAddCfg[CacheManager.vip.vipLevel];
		this.txt_times.text = "挑战次数：" + HtmlUtil.html(leftCount + "/" + totalNum,color);
		// if(leftCount <= 0 && CacheManager.vip.vipLevel <= 0) {
        //     this.addTipsTween();
        // }
        // else {
        //     this.removeTipsTween();
        // }
    }

    private reqServerData():void {
        ProxyManager.boss.reqBossList();
    }

    public updateGodBossList():void {
        let bossList: any[] = CacheManager.bossNew.getGodBossList();
        this.list_boss.setVirtual(bossList);
    }

    private onTimerHandler():void {
        let time:number = egret.getTimer();
        this.leftTime -= Math.round((time - this.curTime) / 1000);
        this.curTime = time;
        if(this.leftTime <= 0) {
            this.removeTimer();
            return; 
        }
        this.txt_countdown.text = "(" + App.DateUtils.getFormatBySecond(this.leftTime) + ")恢复";
    }

    private removeTimer():void {
        App.TimerManager.remove(this.onTimerHandler,this);
        this.hasTimer = false;
        this.txt_countdown.text = "";
    }
    
    // private onShowDesHandler(e:egret.TouchEvent):void {
	// 	EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:this.explainText});
    // }

    /**
     * 打开boss设置界面
     */
    private onOpenBossSetWindow():void {
        EventManager.dispatch(UIEventEnum.BossSetOpen,this.copyCode);
    }

    // private addTipsTween():void {
    //     this.tween_group.visible = true;
    //     this.tween_group.alpha = 1;
    //     egret.Tween.get(this.tween_group,{loop:true}).wait(500).to({alpha:0},1500).to({alpha:1},1500);
    // }

    // private removeTipsTween():void {
    //     if(this.tween_group.visible) {
    //         this.tween_group.visible = false;
    //         egret.Tween.removeTweens(this.tween_group);
    //     }
    // }

    public hide():void {
        super.hide();
        // this.removeTipsTween();
        //列表中每个item存在计时器，关闭需要清掉
        this.list_boss.list.numItems = 0;
        this.removeTimer();
        App.TimerManager.remove(this.reqServerData,this);
    }
}