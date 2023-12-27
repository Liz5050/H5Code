/**
 * 双生乐园活动副本
 * @author zhh
 * @time 2018-09-19 11:18:49
 */
class ActivityLostCopyPanel extends ActivityBaseTabPanel{
    private loaderBg:GLoader;
    private loaderIco:GLoader;
    private txtMoney:fairygui.GTextField;
    private txtNum:fairygui.GTextField;
    private txtStar:fairygui.GTextField;
    //private txtTime:fairygui.GRichTextField;
    private btnGo:fairygui.GButton;
    private moneyIco:MoneyIco;
    private curInfo:any;
	public constructor() {
		super();
        this.activityType = ESpecialConditonType.ESPecialConditionTypeParadiesLost;
        
	}

	public initOptUI():void{
        super.initOptUI();
        //---- script make start ----
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.txtMoney = this.getGObject("txt_money").asTextField;
        this.txtNum = this.getGObject("txt_num").asTextField;
        this.txtStar = this.getGObject("txt_star").asTextField;
        //this.txtTime = this.getGObject("txt_time").asRichTextField;
        this.btnGo = this.getGObject("btn_go").asButton;
        this.moneyIco = <MoneyIco>this.getGObject("money_ico");
        this.btnGo.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("lost_copy_bg.jpg",PackNameEnum.Activity));

	}

	public updateAll(data?:any):void{
        let num:number = CacheManager.copy.getTodayEnterNum(CopyEnum.CopyLost)+1;
        num = Math.min(num,ConfigManager.activitySeven.getLostMaxNum());
        let info:any = ConfigManager.activitySeven.getLostCopyInfoCfg(num); 
        this.curInfo = info; 
        this.txtStar.text = ""+info.sourceId;
        this.txtMoney.text = info.priceNum+"";
        let rewardItem:ItemData = RewardUtil.getReward(info.reward);
        this.txtNum.text = rewardItem.getItemAmount()+"";
        this.loaderIco.load(rewardItem.getIconRes());
        this.moneyIco.setIcoByUnit(info.priceUnit);
	}
    
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnGo:
                if(MoneyUtil.checkEnough(this.curInfo.priceUnit,this.curInfo.priceNum)){
                    EventManager.dispatch(LocalEventEnum.CopyReqEnter,CopyEnum.CopyLost);
                }                
                break;
        }
    }
 	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}