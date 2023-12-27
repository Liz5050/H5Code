class NewServerBuyItem extends ListRenderer {
	private c1:fairygui.Controller;
	private txtDiscount:fairygui.GTextField;
	private txtVip:fairygui.GTextField;
	private txtOldPrice:fairygui.GTextField;
	private txtPrice:fairygui.GTextField;
	private txtBuyLimit:fairygui.GRichTextField;
	private btnBuy:fairygui.GButton;
	private itemList:List;
	private btnMc:UIMovieClip;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.itemList = new List(this.getChild("list_item").asList);
		this.txtDiscount = this.getChild("txt_discount").asTextField;
		this.txtVip = this.getChild("txt_vip").asTextField;
		this.txtOldPrice = this.getChild("txt_oldPrice").asTextField;
		this.txtPrice = this.getChild("txt_price").asTextField;
		this.txtBuyLimit = this.getChild("txt_buyLimit").asRichTextField;
		this.btnBuy = this.getChild("btn_buy").asButton;
		this.btnBuy.addClickListener(this.onBuyHandler,this);
	}

	public setData(data:ActivityRewardInfo):void {
		this._data = data;
		let rewards:any[] = data.rewards;
		let conds:number[] = data.conds;
		this.itemList.data = data.getItemDatas();
		//conds中对应索引意义
		//原价,现价,折扣,vip等级,库存,是否广播
		this.txtOldPrice.text = "" + conds[0];
		this.txtPrice.text = "" + conds[1];
		this.txtDiscount.text = "" + conds[2];
		let vipLimit:number = conds[3];
		this.txtVip.text = "P" + vipLimit;
		let vipLv:number = CacheManager.vip.vipLevel;
		let maxNum:number = conds[4];
		let leftNum:number = maxNum - data.hadGetCount;
		let enabled:boolean = true;
		if(vipLimit > 0) {
			this.c1.selectedIndex = 1;
			if(leftNum > 0) {
				if(!this.btnMc) {
					this.btnMc = UIMovieManager.get(PackNameEnum.MCOneKey, -140, -204, 0.86, 0.95);
					this.btnBuy.addChild(this.btnMc);
				}
			}
			else if(this.btnMc) {
				UIMovieManager.push(this.btnMc);
				this.btnMc = null;
			}
		}
		else {
			this.c1.selectedIndex = 0;
			if(this.btnMc) {
				UIMovieManager.push(this.btnMc);
				this.btnMc = null;
			}
		}
		if(leftNum <= 0) {
			enabled = false;
			this.btnBuy.title = LangActivity.LANG6;
			this.txtBuyLimit.text = "";
		}
		else {
			this.txtBuyLimit.text = "可购买：" + HtmlUtil.html(leftNum + "/" + maxNum,Color.Green2);
			this.btnBuy.title = LangActivity.LANG5;
		}
		
		App.DisplayUtils.grayButton(this.btnBuy, !enabled, !enabled);
		CommonUtils.setBtnTips(this.btnBuy,enabled && vipLv >= vipLimit && MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,this._data.conds[1],false));
	}

	private onBuyHandler():void {
		let vipLimit:number = this._data.conds[3];
		if(vipLimit > 0) {
			let vipLv:number = CacheManager.vip.vipLevel;
			if(vipLimit > vipLv) {
				Tip.showTip(LangActivity.LANG8);
				return;
			}
		}
		if(!MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,this._data.conds[1])) {
			return;
		}
		MoveMotionUtil.itemListMoveToBag(this.itemList.list._children,0,LayerManager.UI_Popup);
		EventManager.dispatch(LocalEventEnum.ActivityGetReward,this._data.code,this._data.index);
	}
}