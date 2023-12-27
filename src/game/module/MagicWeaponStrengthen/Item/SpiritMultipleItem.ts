/**
 * 法宝副本奖励item
 * @author zhh
 * @time 2018-09-12 20:03:23
 */
class SpiritMultipleItem extends ListRenderer {
    private c1:fairygui.Controller;
    private loaderIco:GLoader;
    private txtReward:fairygui.GTextField;
    private txtMoney:fairygui.GTextField;
    private btnGo:fairygui.GButton;
    private mc:UIMovieClip;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.txtReward = this.getChild("txt_reward").asTextField;
        this.txtMoney = this.getChild("txt_money").asTextField;
        this.btnGo = this.getChild("btn_go").asButton;
        //---- script make end ----
        this.btnGo.addClickListener(this.onClick,this);

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let rewardItem:ItemData = ConfigManager.const.getSpiritCopyReward();
        let m:number = ConfigManager.const.getSpiritCopyCost(this._data.mutiple);
        this.txtMoney.text = ""+(m==0?"免费":m);        
        this.txtReward.text = rewardItem.getItemAmount()*this._data.mutiple+"";
        this.loaderIco.load(rewardItem.getIconRes());
        if(CacheManager.welfare2.isPrivilegeCard){
            this.btnGo.text = "快速扫荡";
        }else{
            this.btnGo.text = "领  取";
        }
        this.c1.setSelectedIndex(this._data.mutiple-1);
        let isBtnEff:boolean = this._data.mutiple == 3;   
        if(isBtnEff){
            if (!this.mc) {
                this.mc = UIMovieManager.get(PackNameEnum.MCOneKey, -118, 24, 0.86, 0.86);
            }
            this.mc.playing = true;
            this.addChild(this.mc);            
        } else {
            if(this.mc){
                this.mc.playing = false;
                this.mc.removeFromParent();
            } 
        }
	}

    private onClick():void{
        if(CacheManager.welfare2.isPrivilegeCard){
            //快速扫荡
            ProxyManager.copy.delegateSpirit(CopyEnum.CopySpirit,this._data.mutiple);
        }else{
            ProxyManager.copy.getSpiritReward(this._data.mutiple);
        }
    }

}