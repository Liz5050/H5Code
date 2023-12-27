/**
 * 捐献item
 * @author zhh
 * @time 2018-07-19 10:21:28
 */
class GuildNewDonateItem extends ListRenderer {
    private baseItem:BaseItem;
    private txtMoney:fairygui.GTextField;
    private txtAdd:fairygui.GTextField;
    private txtNum:fairygui.GRichTextField;
    private btnDonate:fairygui.GButton;
    private option:number;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.baseItem = <BaseItem>this.getChild("baseItem");
        this.baseItem.isShowName = false;
        this.txtMoney = this.getChild("txt_money").asTextField;
        this.txtAdd = this.getChild("txt_add").asTextField;
        this.txtNum = this.getChild("txt_num").asRichTextField;
        this.btnDonate = this.getChild("btn_donate").asButton;

        this.btnDonate.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let costUnit:number = ObjectUtil.getConfigVal(this._data,"costUnit",0);
        let itemData:ItemData = RewardUtil.fmtReward(ETaskRewardType.Money,costUnit,1);
        this.baseItem.itemData = itemData;
        this.txtMoney.text = App.StringUtils.substitude(LangGuildNew.L8,this._data.costNum,MoneyUtil.getMoneyName(this._data.costUnit));
        let clr:string = "#0df14b";
        this.txtAdd.text = App.StringUtils.substitude(LangGuildNew.L9,this._data.addContribution,this._data.addGuildMoney);

        let totalDonateTimes:number = ObjectUtil.getConfigVal(this._data,"donateTimes",0);        
        let isFull:boolean = false;
        if(totalDonateTimes>0){
            let curTime:number = CacheManager.guildNew.getDonateTimes(this._data.costUnit);
            isFull = curTime>=totalDonateTimes; 
             isFull ?clr = "#ec422e":null;
            this.txtNum.text = HtmlUtil.html(curTime+"/"+totalDonateTimes,clr);    
        }else{
            this.txtNum.text = HtmlUtil.html("无限制",clr);    
        }
        App.DisplayUtils.grayButton(this.btnDonate,isFull,isFull);
        switch(this._data.costUnit){
            case EPriceUnit.EPriceUnitCoinBind:
                this.option = EOperOption.EOperOptionMoney;
                break;
            case EPriceUnit.EPriceUnitGold:
                this.option = EOperOption.EOperOptionMoneyEx;
                break;
        }
        CommonUtils.setBtnTips(this.btnDonate,this._data.costUnit == EPriceUnit.EPriceUnitCoinBind && !isFull && MoneyUtil.checkEnough(this._data.costUnit,this._data.costNum,false));
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnDonate:
                if(MoneyUtil.checkEnough(this._data.costUnit,this._data.costNum)){
                    EventManager.dispatch(LocalEventEnum.GuildNewReqDonate,this.option,this._data.costNum);
                }                
                break;

        }
    }


}