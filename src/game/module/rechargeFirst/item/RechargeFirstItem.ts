/**
 * 首充Item
 * @author zhh
 * @time 2018-07-06 22:01:07
 */
class RechargeFirstItem extends ListRenderer {
    private c1:fairygui.Controller;
    private cBtn:fairygui.Controller;
    private txtGold:fairygui.GTextField;
    private btnRecharge:fairygui.GButton;
    private mc:UIMovieClip;
    private labelImg: fairygui.GImage;
    private cnt:fairygui.GComponent;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----        
        this.txtGold = this.getChild("txt_gold").asTextField;
        this.btnRecharge = this.getChild("btn_recharge").asButton;
        this.c1 = this.getController("c1");
        this.labelImg = this.getChild("img_label").asImage;
        this.btnRecharge.addClickListener(this.onGUIBtnClick, this);
        this.cnt = this.btnRecharge.getChild("cnt").asCom;
        this.cBtn = this.btnRecharge.getController("c1");;
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		this.btnRecharge.text = "充值"+data.money + "元";
		let douDouVal:number = ConfigManager.mgRecharge.getDouDoubleValue(this._data);
		this.txtGold.text = douDouVal+"";//HtmlUtil.html(douDouVal+"","#eee43f"); 
        let isLast:boolean = index==3;
		let idx:number = isLast?1:0;
		this.c1.setSelectedIndex(idx);
        this.addEff(isLast); //
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnRecharge:
				EventManager.dispatch(LocalEventEnum.RechargeReqSDK,this._data.money,this._data.productId);
                break;
        }
    }

    private addEff(isAdd:boolean):void{        
        if(isAdd){
            let tx:number = 0;
            let ty:number = 0;
            if(this.mc){
                this.mc.x = tx;
                this.mc.y = ty;
            }else{
                this.mc = UIMovieManager.get(PackNameEnum.MCRcgBtn2,tx,ty);
            }            
            this.cnt.addChild(this.mc);
            this.cBtn.setSelectedIndex(1);
        }else{
            UIMovieManager.push(this.mc);
            this.cBtn.setSelectedIndex(0);
        }
        
    }


}