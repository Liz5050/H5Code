/**
 * 经验副本多倍领取item
 * @author zhh
 * @time 2019-03-14 10:11:29
 */
class ExpReceiveWinItem extends ListRenderer {
    private c1:fairygui.Controller;
    private loaderLvExp:GLoader;
    private loaderExp:GLoader;
    private txtCost:fairygui.GTextField;
    private txtExp:fairygui.GTextField;
    private txtLvExp:fairygui.GTextField;
    private btnGet:fairygui.GButton;
    private btnGetMutile:fairygui.GButton;

    private costGold:number = 0;
    private mc:UIMovieClip;
    private effCnt:fairygui.GComponent;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderLvExp = <GLoader>this.getChild("loader_lvExp");
        this.loaderExp = <GLoader>this.getChild("loader_exp");
        this.txtCost = this.getChild("txt_cost").asTextField;
        this.txtExp = this.getChild("txt_exp").asTextField;
        this.txtLvExp = this.getChild("txt_lvExp").asTextField;
        this.btnGet = this.getChild("btn_get").asButton;
        this.btnGetMutile = this.getChild("btn_getMutile").asButton;
        this.effCnt = this.getChild("cnt").asCom;
        this.btnGet.addClickListener(this.onGUIBtnClick, this);
        this.btnGetMutile.addClickListener(this.onGUIBtnClick, this);
        this.loaderExp.addClickListener(this.onGUIBtnClick, this);
        this.loaderLvExp.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        this.c1.setSelectedIndex(this._data.multiple-1);
        let fn:number = CacheManager.copy.getFinishNum(CopyEnum.CopyExpNew);
        let isBtnEff:boolean = this._data.multiple==3 || fn==1;   
        this.effCnt.visible = isBtnEff;
        if(!this.mc && isBtnEff){
            this.mc = UIMovieManager.get(PackNameEnum.MCOneKey);
            this.effCnt.addChild(this.mc);            
        }
        if(this.mc){
            this.mc.visible = this.mc.playing = isBtnEff;
        }        
        this.txtExp.text = App.MathUtils.formatNum2(this._data.exp)
        let itemCfg:any = ConfigManager.item.getByPk(ItemCodeConst.Exp);
        this.loaderExp.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
        if(this._data.levelExp){
            this.txtLvExp.text = App.MathUtils.formatNum2(this._data.levelExp);
            let itemCfg:any = ConfigManager.item.getByPk(ItemCodeConst.LevelExp);
            this.loaderLvExp.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
        }else{
            this.loaderLvExp.clear();
            this.txtLvExp.text = "";
        }
        if(this._data.multiple>1){
            let inf:any = ConfigManager.const.getByPk("ExperienceCopyGoldCost");
            if(inf){
                this.costGold = this._data.multiple==2?inf.constValue:inf.constValueEx; 
            }
            this.txtCost.text = this.costGold+"";
        }
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnGetMutile:
            case this.btnGet:
                if(this._data.multiple==1 && CacheManager.copy.isExpHasMutiple()){
                    let clr:string = "#c8b185";
                    let tips:string = HtmlUtil.html("是否领取",clr) + HtmlUtil.html("1",Color.RedCommon) + 
                    HtmlUtil.html("倍奖励，领取后你的等级和修为将会",clr) + HtmlUtil.html("落后一大截，强烈推荐",clr) +HtmlUtil.html("3",Color.RedCommon)+ HtmlUtil.html("倍领取",clr);
                    Alert.alert(tips,this.dealReceive,this);  
                }else{
                    this.dealReceive();
                } 
                break;
            case this.loaderExp:
                ToolTipManager.showByCode(ItemCodeConst.Exp);
                break;
            case this.loaderLvExp:
                ToolTipManager.showByCode(ItemCodeConst.LevelExp);
                break;
            

        }
    }
    private dealReceive():void{
        if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,this.costGold,true)){
            let cx:number = this.btnGet.x+this.btnGet.width/2;
            let cy:number = this.btnGet.y+this.btnGet.height/2;
            EventManager.dispatch(UIEventEnum.CopyReqReceiveExpCopy,this._data.multiple);
            EventManager.dispatch(LocalEventEnum.CopyShowExpEffect,this.localToGlobal(cx,cy));
            EventManager.dispatch(LocalEventEnum.copyHideExpReward);
        }        
    }

}