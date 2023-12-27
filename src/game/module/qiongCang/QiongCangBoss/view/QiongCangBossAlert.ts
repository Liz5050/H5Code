class QiongCangBossAlert extends BaseWindow {
	private list_item:List;
	private loader_icon:GLoader;
	private txt_gold:fairygui.GTextField;
	private txt_propCount:fairygui.GTextField;
	private btn_sure:fairygui.GButton;

	private copyCfg:any;
	private shopCfg:any;
	private bossCfg:any;
	private needNum:number = 1;
	private neddGold:number = 500;
	public constructor() {
		super(PackNameEnum.QiongCangBoss,"QiongCangBossAlert");
		this.isShowCloseObj = true;
		this.isForceCloseObj = true;
	}

	public initOptUI():void {
		this.list_item = new List(this.getGObject("list_item").asList);
		this.loader_icon = this.getGObject("loader_icon") as GLoader;
		this.loader_icon.addClickListener(this.onTouchCostIconHandler,this);
		this.txt_gold = this.getGObject("txt_gold").asTextField;
		this.txt_propCount = this.getGObject("txt_propCount").asTextField;
		this.btn_sure = this.getGObject("btn_sure").asButton;
		this.btn_sure.addClickListener(this.onEnterQiongCangBoss,this);
	}

	public updateAll(data:any):void {
		this.bossCfg = data.bossCfg;
		this.title = "穹苍圣殿-" + GameDef.NumberName[data.floor] + "层";
		let itemDatas:ItemData[] = CommonUtils.configStrToArr(this.bossCfg.showReward);
        for(let i:number = 0; i < itemDatas.length; i++) {
            let itemCfg:any = itemDatas[i].getItemInfo();
            if(!itemCfg || itemCfg.type == EProp.EPropGodEquipfragment) {
                //神装碎片奖励不显示在界面（策划需求）
                itemDatas.splice(i,1);
                break;
            }
        } 
		this.list_item.data = itemDatas;
		this.list_item.scrollToView(0);
		this.copyCfg = ConfigManager.copy.getByPk(this.bossCfg.copyCode);
		this.shopCfg = ConfigManager.shopSell.getByPk(ShopType.SHOP_QUICK + "," + this.copyCfg.needProp);
		if(this.copyCfg.propNum > 0) {
			this.needNum = this.copyCfg.propNum;
		}
		let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(this.copyCfg.needProp);
		this.loader_icon.load(URLManager.getIconUrl(this.copyCfg.needProp,URLManager.ITEM_ICON));
		this.txt_propCount.color = bagCount >= this.needNum ? Color.Green2 : Color.Red;
		this.txt_propCount.text = bagCount + "/" + this.needNum;
		if(this.shopCfg) {
			this.neddGold = this.shopCfg.price;
		}
		this.txt_gold.text = this.neddGold + "或";
	}

	private onEnterQiongCangBoss():void {
		let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(this.copyCfg.needProp);
		if(bagCount >= this.needNum || MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,this.neddGold)) {
			EventManager.dispatch(LocalEventEnum.EnterQiongCangBoss,this.bossCfg);
			this.hide();
		}
	}

	private onTouchCostIconHandler():void {
		ToolTipManager.showByCode(this.copyCfg.needProp);
	}
}