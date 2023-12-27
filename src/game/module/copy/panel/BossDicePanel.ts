/**
 * 摇色子
 * @author zhh
 * @time 2018-06-26 11:34:57
 */
class BossDicePanel extends BaseContentView {
    private MAX_Life_SEC:number = 10; 
    private c1:fairygui.Controller;
    private btnClose:fairygui.GButton;
    private txtMypoint:fairygui.GTextField;
    private txtPlayername:fairygui.GRichTextField;
    private txtThierpoint:fairygui.GRichTextField;
    private btnDice:fairygui.GButton;
    private progressBar:UIProgressBar;
    private baseItem:BaseItem;

	public constructor() {
		super(PackNameEnum.Copy,"SecretBossDice");
        this.modal = false;
        this.isPopup = false;
	}

    public initUI():void{
		super.initUI();
		if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}
	}

	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.btnClose = this.getGObject("btn_close").asButton;
        this.txtMypoint = this.getGObject("txt_myPoint").asTextField;
        this.txtPlayername = this.getGObject("txt_playerName").asRichTextField;
        this.txtThierpoint = this.getGObject("txt_thierPoint").asRichTextField;
        this.btnDice = this.getGObject("btn_dice").asButton;
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.progressBar = <UIProgressBar>this.getGObject("progressBar");
        this.progressBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Common,"progressBar_4"),URLManager.getPackResUrl(PackNameEnum.Common,"bg_4"),385,30,0,2);
        this.progressBar.labelType = BarLabelType.None;
        this.progressBar.labelSize = 20;
        this.progressBar.textColor = 0xffffff;

        this.btnDice.addClickListener(this.onGUIBtnClick, this);
        this.btnClose.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.progressBar.setProgressText(`倒计时${this.MAX_Life_SEC}秒`);   

	}
	public updateAll(data?:any):void {
        let isExpire:boolean = CacheManager.bossNew.isDiceInfoExpire();
        if(isExpire) {
            this.hide();
            return;
        }
		let info:any = CacheManager.bossNew.diceInfo;
        // maxRandNum_I maxRandPlayer
        if(info.ownRandNum_I>0){ //已掷
            this.c1.setSelectedIndex(0);            
            this.setThier((info.maxRandPlayer?info.maxRandPlayer.name_S:null),info.maxRandNum_I);
            this.txtMypoint.text = ""+info.ownRandNum_I;
            this.onTimer();
        }else{ //未掷           
            this.setThier(null,0);
            this.c1.setSelectedIndex(1);
        }

        let giftInfo:any = ConfigManager.secretGiftConfig.getByPk(CacheManager.map.mapId);
        if(giftInfo){
            this.baseItem.itemData = new ItemData(giftInfo.itemCode);
        }            
        this.startTimer();
        
	}
    private setThier(name:string,maxRandNum:number):void{
        this.txtPlayername.text = name?name:"暂无玩家投掷";
        this.txtThierpoint.text = maxRandNum?" 掷出："+HtmlUtil.html(""+maxRandNum,"#0df14b"):"";
    }
    private timeHandler:number = 0;
    private startTimer():void{
        this.timeHandler = egret.setInterval(this.onTimer,this,1000);

        //App.TimerManager.doTimer(1000,0,this.onTimer,this);
    }
    private stopTimer():void{
        //App.TimerManager.remove(this.onTimer,this);
        egret.clearInterval(this.timeHandler);
    }
    private onTimer():void{
        let dt:number = CacheManager.bossNew.diceInfo.leftTimeDt;
		let sevt:number = CacheManager.serverTime.getServerTime();
		let sec:number = dt - sevt;
        this.progressBar.setValue(sec,this.MAX_Life_SEC);     
        this.progressBar.setProgressText(`倒计时${sec}秒`);   
        if(sec<=0){
            this.hide();
        }

    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnDice:
                EventManager.dispatch(LocalEventEnum.BossReqSecretRoundDice);
                break;
            case this.btnClose:
                this.hide();
                break;

        }
    }
    public hide(param: any = null, callBack: CallBack = null):void{        
        // EventManager.dispatch(LocalEventEnum.BossSecretHideDice);
        this.stopTimer();
        super.hide(param,callBack);
        this.progressBar.setValue(this.MAX_Life_SEC,this.MAX_Life_SEC);
        this.progressBar.setProgressText(`倒计时${this.MAX_Life_SEC}秒`);   
    }

}