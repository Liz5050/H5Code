/**
 * 法宝副本入口界面
 * @author zhh
 * @time 2018-09-12 20:01:36
 */
class MagicWeaponCopyPanel extends BaseTabView{
    private loaderBg:GLoader;
    private loaderIco:GLoader;
    private txtReward:fairygui.GTextField;
    private txtTimes:fairygui.GRichTextField;
    private txtTimes2:fairygui.GRichTextField;
    private btnGo:fairygui.GButton;
    private listMultiple:List;
    private c1:fairygui.Controller;
    private mutiples:any[];

	public constructor() {
		super();
	}

	protected initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.loaderIco = <GLoader>this.getGObject("loader_ico");
        this.txtReward = this.getGObject("txt_reward").asTextField;
        this.txtTimes = this.getGObject("txt_times").asRichTextField;
        this.txtTimes2 = this.getGObject("txt_times2").asRichTextField;
        this.btnGo = this.getGObject("btn_go").asButton;
        this.listMultiple = new List(this.getGObject("list_multiple").asList);

        this.btnGo.addClickListener(this.onGUIBtnClick, this);
        this.loaderIco.addClickListener(this.onGUIBtnClick, this);
        //this.listMultiple.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("bg1.jpg",PackNameEnum.MagicWeaponStrengthen));
        this.mutiples = [];
        for(let i:number=0;i<3;i++){
            this.mutiples.push({mutiple:i+1});
        }

	}

	public updateAll(data?:any):void{
        let t:number = CacheManager.copy.getEnterLeftNum(CopyEnum.CopySpirit);
        this.btnGo.visible = !(t==0 && CacheManager.welfare2.isPrivilegeCard);
        let ts:string = LangCopyHall.L32 + t;
        this.txtTimes.text = ts;
        this.txtTimes2.text = ts;
        let rewardItem:ItemData = ConfigManager.const.getSpiritCopyReward();
        this.txtReward.text = rewardItem.getItemAmount()+"";
        this.loaderIco.load(rewardItem.getIconRes());
        let idx:number = 0;
        if(CacheManager.copy.isSpiritNumOK() && (CacheManager.copy.isSpiritReward || CacheManager.welfare2.isPrivilegeCard)){
            this.listMultiple.setVirtual(this.mutiples);
            idx = 1;
        }
        this.c1.setSelectedIndex(idx);  
        this.setBtnTips();
	}
    public setBtnTips():void{
        //CommonUtils.setBtnTips(this.btnGo,CacheManager.copy.isSpiritNumOK()); //副本次数更新需要执行
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnGo:
                if(!CacheManager.copy.isSpiritNumOK()){
                    Tip.showTip(LangCopyHall.L31);
                    return;
                }
                if(CacheManager.welfare2.isPrivilegeCard){
                    //扫荡
                    ProxyManager.copy.delegateSpirit(CopyEnum.CopySpirit,0);
                }else{
                    //进入副本
                    EventManager.dispatch(LocalEventEnum.CopyReqEnter,CopyEnum.CopySpirit);
                }
                break;
            case this.loaderIco:
                let rewardItem:ItemData = ConfigManager.const.getSpiritCopyReward();
                ToolTipManager.showByCode(rewardItem.getCode());
                break;

        }
    }

    /*
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listMultiple.list:
                break;
        }
               
    }
    */
    
 
	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

}