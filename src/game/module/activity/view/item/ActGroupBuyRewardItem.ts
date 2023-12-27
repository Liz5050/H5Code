/**
 * 首充团购奖励item
 * @author zhh
 * @time 2018-11-05 15:22:18
 */
class ActGroupBuyRewardItem extends ListRenderer {
    private txtDesc:fairygui.GRichTextField;
    private btnGo:fairygui.GButton;
    private listReward:List;
    private c1:fairygui.Controller;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.txtDesc = this.getChild("txt_desc").asRichTextField;
        this.btnGo = this.getChild("btn_go").asButton;
        this.listReward = new List(this.getChild("list_reward").asList);
        this.c1 = this.getController("c1");
        this.btnGo.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        this.txtDesc.text = this._data.desc;
        let rewards:ItemData[] = RewardUtil.getStandeRewards(this._data.reward);
        this.listReward.setVirtual(rewards);
        let idx:number = 0;
        let tips:boolean = false;
        if(CacheManager.recharge.isGroupBuyGet(this._data.id)){
            idx = 1;
        }else if(CacheManager.recharge.isGroupBuyCan(this._data)){
            this.btnGo.text = "领  取";
            tips = true;
        }else{
            this.btnGo.text = "前  往";
        }
        this.c1.setSelectedIndex(idx);
        CommonUtils.setBtnTips(this.btnGo,tips);
	}

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnGo:
                if(CacheManager.recharge.isGroupBuyCan(this._data)){
                    let info:ActivityInfo = CacheManager.activity.getActivityInfoByType(ESpecialConditonType.ESpecialConditionTypeRechargeGroup);
                    if(info && !info.isOverTime){
                        MoveMotionUtil.itemListMoveToBag(this.listReward.list._children,0,LayerManager.UI_Popup);
                        ProxyManager.activity.getGroupBuy(this._data.id);
                    }else{
                        Tip.showLeftTip("活动已结束");
                    }
                }else{
                    HomeUtil.openRecharge();
                }                
                break;

        }
    }


}