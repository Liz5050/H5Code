/**
 * 经验副本多被经验item
 * @author zhh
 * @time 2018-05-28 19:09:30
 */
class ExpMultipleItem extends ListRenderer {
    private c1:fairygui.Controller;
    private txtExp:fairygui.GTextField;
    private txtCost2:fairygui.GTextField;
    private btnReceive:fairygui.GButton;
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
        this.txtExp = this.getChild("txt_exp").asTextField;
        this.txtCost2 = this.getChild("txt_cost").asTextField;
        this.btnReceive = this.getChild("btn_receive").asButton;
        this.effCnt = this.getChild("cnt").asCom;
        this.btnReceive.addClickListener(this.onGUIBtnClick, this);
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
        if(this._data.levelExp){
            this.txtExp.text = "经验："+App.MathUtils.formatNum2(this._data.exp)+HtmlUtil.brText+"修为："+App.MathUtils.formatNum2(this._data.levelExp);
        }else{
            this.txtExp.text = "经验："+App.MathUtils.formatNum2(this._data.exp);
        }
        if(this._data.multiple>1){
            let inf:any = ConfigManager.const.getByPk("ExperienceCopyGoldCost");
            if(inf){
                this.costGold = this._data.multiple==2?inf.constValue:inf.constValueEx; 
            }
            this.txtCost2.text = this.costGold+"";  
        }
	}


    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnReceive:
                if(this._data.multiple==1 && CacheManager.copy.isExpHasMutiple()){
                    let clr:string = "#c8b185";
                    let tips:string = HtmlUtil.html("是否领取",clr) + HtmlUtil.html("1",Color.RedCommon) + 
                    HtmlUtil.html("倍奖励，领取后你的等级和修为将会",clr) + HtmlUtil.html("落后一大截，强烈推荐",clr) +HtmlUtil.html("3",Color.RedCommon)+ HtmlUtil.html("倍领取",clr);
                    Alert.alert(tips,this.dealReceive,this);  
                }else{
                    this.dealReceive();
                }                 
                break;

        }
    }
    private dealReceive():void{
        if(MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,this.costGold,true)){
            let cx:number = this.btnReceive.x+this.btnReceive.width/2;
            let cy:number = this.btnReceive.y+this.btnReceive.height/2;
            EventManager.dispatch(UIEventEnum.CopyReqReceiveExpCopy,this._data.multiple);
            EventManager.dispatch(LocalEventEnum.CopyShowExpEffect,this.localToGlobal(cx,cy));
        }
    }

}