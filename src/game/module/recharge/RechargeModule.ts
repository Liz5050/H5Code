/**
 * 充值系统
 * @author zhh
 * @time 2018-07-05 15:14:09
 */
class RechargeModule extends BaseModule {
    private txtVip:fairygui.GTextField;
    private txtTip:fairygui.GTextField;
    private btnLookup:fairygui.GButton;
    private btnBack:fairygui.GButton;
    private listRecharge:List;
	private progressBar:fairygui.GProgressBar;
    private rechargeInfos:any[];
    private loaderBanner:GLoader;

	public constructor() {
		super(ModuleEnum.Recharge,PackNameEnum.Recharge,"Main",LayerManager.UI_Popup);
		
	}
	public initOptUI():void{
        //---- script make start ----
        this.txtVip = this.getGObject("txt_vip").asTextField;
        this.txtTip = this.getGObject("txt_tip").asTextField;
        this.btnLookup = this.getGObject("btn_lookup").asButton;
        this.btnBack = this.getGObject("btn_back").asButton;
        this.listRecharge = new List(this.getGObject("list_recharge").asList);
		this.progressBar = this.getGObject("progressBar").asProgress;
        this.loaderBanner = <GLoader>this.getGObject("loader_banner");

        this.btnLookup.addClickListener(this.onGUIBtnClick, this);
        this.btnBack.addClickListener(this.onGUIBtnClick, this);
        this.listRecharge.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
		this.isOpenRecharge = false;		
        this.loaderBanner.load(URLManager.getModuleImgUrl('banner.jpg',PackNameEnum.Recharge));
	}   

	public updateAll(data?:any):void{
		let curLevel:number = CacheManager.vip.vipLevel;
        this.txtVip.text = curLevel + ""; 
		let curData:any = ConfigManager.vip.getVipLevelInfo(curLevel);
		let nextData:any = ConfigManager.vip.getVipLevelInfo(curLevel+1);
		if(nextData){
			
            this.txtTip.text = App.StringUtils.substitude(LangVip.LANG4, nextData.growth-CacheManager.vip.growth, "VIP" + nextData.level);
		}else{
            nextData = curData; 
			this.txtTip.text = "VIP等级已满";
		}
        //this.listRecharge.setVirtual(this.rechargeInfos);
        let rcInfos:any[] = ConfigManager.mgRecharge.getByType(ERechargeType.RechargeGold);
        if (!CacheManager.welfare2.isPrivilegeCard) {
            rcInfos = ConfigManager.mgRecharge.getByType(ERechargeType.RechargePrivilegeCard).concat(rcInfos);
        }
        if (!CacheManager.welfare2.isGoldCard) {
            rcInfos = ConfigManager.mgRecharge.getByType(ERechargeType.RechargeGoldCard).concat(rcInfos);
        }
        this.listRecharge.data = rcInfos;
        this.progressBar.max = nextData.growth;
        this.progressBar.value = CacheManager.vip.growth;
	}

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnLookup:
                EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.VIP);
                break;
            case this.btnBack:
                EventManager.dispatch(UIEventEnum.ModuleClose, this.moduleId);
                break;                
        }
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
	    if(!CacheManager.recharge.checkCanRecharge()){
            return;
        }
        let item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            EventManager.dispatch(LocalEventEnum.RechargeReqSDK,item.getData().money,item.getData().productId);
        }

    }


}