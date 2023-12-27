class WorldBossNewPanel extends BaseTabView {
    private bgLoader:GLoader;
    private txt_num:fairygui.GTextField;
    private txt_times:fairygui.GRichTextField;
    private txt_countdown:fairygui.GRichTextField;
    private txt_set:fairygui.GRichTextField;
    // private btn_des:fairygui.GButton;
    private btn_buy:fairygui.GButton;
    private list_boss:List;
    private ticketsIcon:GLoader;
    private tween_group:fairygui.GGroup;

    private hasTimer:boolean;
    private leftTime:number;
    private curTime:number;
    private ticketCode:number;

    protected copyType:ECopyType;
    protected copyCode:number;
	public constructor() {
		super();
        this.isDestroyOnHide = false;
	}

	public initOptUI():void{
        this.copyType = ECopyType.ECopyMgNewWorldBoss;
        this.copyCode = CopyEnum.CopyWorldBoss;
        
        this.bgLoader = this.getGObject("loader_bg") as GLoader;
        this.bgLoader.load(URLManager.getModuleImgUrl("worldBossBg.png",PackNameEnum.Boss));
        this.txt_num = this.getGObject("txt_num").asTextField;
        this.txt_times = this.getGObject("txt_times").asRichTextField;
        this.txt_countdown = this.getGObject("txt_countdown").asRichTextField;
        this.txt_set = this.getGObject("txt_set").asRichTextField;
        this.txt_set.text = HtmlUtil.html("提醒设置",null,false,22,"0",true);
        this.txt_set.addEventListener(egret.TextEvent.LINK,this.onOpenBossSetWindow,this);
        // this.btn_des = this.getGObject("btn_des").asButton;
        this.btn_buy = this.getGObject("btn_buy").asButton;
        this.list_boss = new List(this.getGObject("list_boss").asList);
        this.tween_group = this.getGObject("tween_group").asGroup;

        this.ticketCode = 419906001;
        let itemCfg:any = ConfigManager.item.getByPk(this.ticketCode);
        this.ticketsIcon = this.getGObject("loader") as GLoader;
        this.ticketsIcon.load(URLManager.getIconUrl(itemCfg.icon,URLManager.ITEM_ICON));

        (this.getGObject("btn_privilegeSet") as PrivilegeSetBtn).fromCode = CopyEnum.CopyWorldBoss;
        // this.explainText = "1、达到对应等级可解锁挑战野外BOSS" + 
		// "\n2、野外BOSS有几率掉落" + HtmlUtil.html("神装","#ff7610") + "和" + HtmlUtil.html("神装碎片","#ff7610") + 
		// "\n3、参与挑战野外BOSS可以获得" + HtmlUtil.html("精炼石","#ff7610") + 
		// "\n4、挑战次数每小时回复1点，最多存储12点";

        this.ticketsIcon.addClickListener(this.onClickHandler,this);
        // this.btn_des.addClickListener(this.onGUIBtnClick, this);
        this.btn_buy.addClickListener(this.onGUIBtnClick, this);

	}

	public updateAll(data?:any):void {
        this.updateWorldBossList();
        this.updateTimeCount();
        this.updateTickets();

        if(!App.TimerManager.isExists(this.reqServerData,this)) {
            App.TimerManager.doTimer(3000,0,this.reqServerData,this);
        }
        this.list_boss.scrollToView(0);
	}

    public updateTimeCount():void {
        let copyInfo:any = CacheManager.copy.getPlayerCopyInf(this.copyCode);
        if(!copyInfo) {
            return;
        }
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
    }

    private reqServerData():void {
        ProxyManager.boss.reqBossList();
    }

    public updateWorldBossList():void {
        let isShowGuideBoss: boolean = !CacheManager.task.isGuideWorldBossTaskComplete;
        let bossList: any[] = CacheManager.bossNew.getWorldBossList(isShowGuideBoss);
        this.list_boss.setVirtual(bossList);
        if (isShowGuideBoss && bossList.length > 0) {
            GuideTargetManager.reg(GuideTargetName.WorldBossNewPanelChallengeBtn, this.list_boss.list._children[0]["btn_challenge"]);
        }
    }

    /**更新挑战券数量 */
    public updateTickets():void {
        let copy:any = ConfigManager.copy.getByPk(this.copyCode);
        let leftCount:number = CacheManager.copy.getEnterLeftNum(this.copyCode);
        let color:number = leftCount > 0 ? Color.Green2 : Color.Red;
        let vipAddCfg:any = ConfigManager.vip.getVipAddDict(EVipAddType.EVipAddNewWorldBossCopyNum);
        let totalNum:number = copy.numByDay + vipAddCfg[CacheManager.vip.vipLevel];
        this.txt_times.text = "挑战次数：" + HtmlUtil.html(leftCount + "/" + totalNum,color);
        if(leftCount <= 0 && CacheManager.vip.vipLevel <= 0) {
            this.addTipsTween();
        }
        else {
            this.removeTipsTween();
        }
        this.btn_buy.visible = leftCount == 0;
        if(leftCount == totalNum && this.hasTimer) {
            //挑战次数已满
            this.removeTimer();
        }

        let count:number = CacheManager.pack.propCache.getItemCountByCode(this.ticketCode);
        this.txt_num.text = "(" + count + ")";
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
    
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        let btn: any = e.target;
        switch (btn) {
            case this.btn_buy:
                let copy:any = ConfigManager.copy.getByPk(this.copyCode);
                if(copy.numByDay <= CacheManager.copy.getEnterLeftNum(this.copyCode)) {
                    Tip.showTip("挑战次数已满");
                    return;
                }
                let itemData:ItemData = CacheManager.pack.propCache.getItemByCode(this.ticketCode);
                if(itemData) {
                    EventManager.dispatch(UIEventEnum.PackUseOpen, itemData);
                    // EventManager.dispatch(LocalEventEnum.PackUseByCode,itemData,1);
                }
                else {
                    Tip.showTip("道具数量不足");
                }
                break;
        }
    }

    private onClickHandler():void {
        ToolTipManager.showByCode(this.ticketCode);
    }

    /**
     * 打开boss设置界面
     */
    private onOpenBossSetWindow():void {
        EventManager.dispatch(UIEventEnum.BossSetOpen,this.copyCode);
    }

    private addTipsTween():void {
        this.tween_group.visible = true;
        this.tween_group.alpha = 1;
        egret.Tween.get(this.tween_group,{loop:true}).wait(500).to({alpha:0},1500).to({alpha:1},1500);
    }

    private removeTipsTween():void {
        if(this.tween_group.visible) {
            this.tween_group.visible = false;
            egret.Tween.removeTweens(this.tween_group);
        }
    }

    public hide():void {
        super.hide();
        this.removeTipsTween();
        // //列表中每个item存在计时器，关闭需要清掉
        let itemNum:number = this.list_boss.list.numChildren;
        for(let i:number = 0; i < itemNum; i++) {
            let item:WorldBossItem = this.list_boss.list.getChildAt(i) as WorldBossItem;
            item.removeTimer();
        }
        this.removeTimer();
        App.TimerManager.remove(this.reqServerData,this);
    }
}