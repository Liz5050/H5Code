/**
 * 充值系统
 * @author zhh
 * @time 2018-07-05 20:10:06
 */
class RechargeItem extends ListRenderer {
    private loaderIco:GLoader;
    private txtRmb:fairygui.GTextField;
    private txtMoney:fairygui.GTextField;
	private groupDouble:fairygui.GGroup;
    private c1: fairygui.Controller;
    private loaderBg: GLoader;
    private loaderBottom: GLoader;
    private c2: fairygui.Controller;
    private c3: fairygui.Controller;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.c3 = this.getController("c3");
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.loaderBg = <GLoader>this.getChild("loader_bg");
        this.loaderBottom = <GLoader>this.getChild("loader_bottom");
        this.txtRmb = this.getChild("txt_rmb").asTextField;
        this.txtMoney = this.getChild("txt_money").asTextField;
		this.groupDouble = this.getChild("group_double").asGroup;
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data; //mgRecharge的配置
		this.itemIndex = index;
		this.txtRmb.text = "¥"+this._data.money;
		this.loaderBg.load(URLManager.getModuleImgUrl(`bg_${data.type}.png`,PackNameEnum.Recharge));

		if (data.type == ERechargeType.RechargeGold) {
            this.loaderIco.load(ConfigManager.mgRecharge.getTypeIcoUrl(data));
			this.c1.selectedIndex = 0;
            this.c2.selectedIndex = 0;
            this.c3.selectedIndex = 0;
            let isDouGet:boolean = CacheManager.recharge.isRecharged(data.id);
            this.groupDouble.visible = !isDouGet;
            if(!isDouGet){
                this.txtMoney.text = ConfigManager.mgRecharge.getDoubleValue(this._data)+"";
            }else{
                this.txtMoney.text = this._data.value+"";
            }
            this.loaderBottom.clear();
		} else {
            this.loaderIco.clear();
		    let isTypeGoldCard:boolean = data.type == ERechargeType.RechargeGoldCard;
            this.c1.selectedIndex = 1;
            this.c2.selectedIndex = isTypeGoldCard ? 1 : 2;
            let hasCard:boolean = isTypeGoldCard ? CacheManager.welfare2.hasGoldCard : CacheManager.welfare2.hasPrivilegeCard;
            this.txtMoney.text = this._data.value+"";
            this.c3.selectedIndex = hasCard ? 1 : 0;
            this.loaderBottom.load(hasCard ? null : URLManager.getModuleImgUrl(`bottom.jpg`,PackNameEnum.Recharge));
        }

		this.selected = false;
	}


}