/**
 * 创建仙盟界面
 * @author zhh
 * @time 2018-07-17 11:52:53
 */
class GuildNewCreateWin extends BaseWindow {
    private txtInput:fairygui.GTextField;
    private btnCreate:fairygui.GButton;
    private listCreate:List;

    private infos:any[];

	public constructor() {
		super(PackNameEnum.GuildNewCreate,"GuildNewCreateWin");
	}

	public initOptUI():void{
        //---- script make start ----
        this.txtInput = this.getGObject("txt_input").asTextField;
        this.btnCreate = this.getGObject("btn_create").asButton;
        this.listCreate = new List(this.getGObject("list_create").asList);

        this.btnCreate.addClickListener(this.onGUIBtnClick, this);
        this.listCreate.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----

        this.infos = [];
        let cfgCreateGV1:any = ConfigManager.const.getByPk("GuildCreateOptionGVNeedMoney");
        let cfgCreateGV2:any = ConfigManager.const.getByPk("GuildCreateOptionGVExNeedMoney");
        let vipCfg1:any = ConfigManager.const.getByPk("GuildCreateOptionGVVipLimit"); 
        let vipCfg2:any = ConfigManager.const.getByPk("GuildCreateOptionGVExVipLimit"); 
        let cfg:any = ConfigManager.const.getByPk("GuildCreateOptionGVExContributionReward");
        /**非vip创建消耗 */
        let noVipCfg: any = ConfigManager.const.getByPk("GuildCreateNeedMoney");
        this.infos.push(this.getInfo(1,vipCfg1.constValue,0,cfgCreateGV1.constValue,cfgCreateGV1.constValueEx, noVipCfg.constValue, noVipCfg.constValueEx));
        this.infos.push(this.getInfo(2,vipCfg2.constValue,cfg.constValue,cfgCreateGV2.constValue,cfgCreateGV2.constValueEx));
	}

    private getInfo(guildLv:number,vipLv:number,contrNum:number,costGold:number,unit:EPriceUnit, costGold2: number = 0, costUnit2 = 1):any{
        let info:any = ConfigManager.guild.getByPk(guildLv);        
        return {guildLv:guildLv,vipLv:vipLv,memberNum:info.maxNum,contrNum:contrNum,costGold:costGold,unit:unit, costGold2: costGold2, costUnit2: costUnit2};
    }

	public updateAll(data?:any):void{
        this.txtInput.text = "";
		this.listCreate.setVirtual(this.infos);
        this.listCreate.selectedIndex = 0;
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnCreate:
                this.dealCreate();
                break;

        }
    }
    private dealCreate():void{
        let tips:string = "";
        if(this.txtInput.text.length>0){
            let opt:number = this.listCreate.selectedIndex==0?EOperOption.EOperOptionGoldAndVip:EOperOption.EOperOptionGoldAndVipEx;
            let data:any = this.listCreate.selectedData;                    
            let flag:boolean = true;
            let isFirst: boolean = this.listCreate.selectedIndex == 0;
            let costGold: number = data.costGold;
            let costUnit: number = data.unit;
            if(!isFirst && !CacheManager.vip.checkVipLevel(data.vipLv)){
                flag=false;
                tips = LangGuildNew.L5;
            }
            if (isFirst && !CacheManager.vip.checkVipLevel(data.vipLv)) {//第一个创建项且不符合vip要求
                costGold = data.costGold2;
                costUnit = data.costUnit2;
                opt = EOperOption.EOperOptionMoney;
            }
            if(flag && !MoneyUtil.checkEnough(costUnit, costGold,true,false,{rechargeFirstIdx:ViewIndex.One})){
                flag=false;
            }           
            if(flag && ConfigManager.chatFilter.isHasSensitive(this.txtInput.text)){
                flag=false;
                tips = LangGuildNew.L13;
            }
            if(flag){
                tips = App.StringUtils.substitude(LangGuildNew.L6,HtmlUtil.html(costGold.toString(), Color.GreenCommon),data.guildLv, HtmlUtil.html(this.txtInput.text, Color.GreenCommon));
                Alert.alert(tips,()=>{
                    EventManager.dispatch(LocalEventEnum.GuildNewReqCreate,{name:this.txtInput.text,option:opt,flag:0});
                },this);
                tips = "";
            }                    
        } else{
            tips = LangGuildNew.L7;
        }  
        if(tips!=""){
            Tip.showLeftTip(tips);
        }
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }
        
        var list: any = e.target;
        switch (list) {
            case this.listCreate.list:
                break;

        }
               
    }


}