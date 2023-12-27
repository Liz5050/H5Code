/**
 * 合击兑换列表项
 */
class UniqueSkillExchangeItem extends ListRenderer{
	private runeItem: BaseItem;
	private runeTxt: fairygui.GTextField;
	private countTxt: fairygui.GRichTextField;
	private exchangeBtn: fairygui.GButton;
	private controller: fairygui.Controller;
	private isCanExchange: boolean;
	private tipStr: string;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.runeItem = <BaseItem>this.getChild("baseItem");
		this.runeTxt = this.getChild("txt_rune").asTextField;
		this.countTxt = this.getChild("txt_count").asRichTextField;
		this.exchangeBtn = this.getChild("btn_exchange").asButton;
		this.exchangeBtn.addClickListener(this.clickExchangeBtn, this);
		this.controller = this.getController("c1");
	}

	public setData(itemData: ItemData): void{
		if(ItemsUtil.isTrueItemData(itemData)){
			this._data = itemData;
			this.runeItem.itemData = itemData;
			this.runeItem.txtName.visible = false;
			this.runeTxt.text = itemData.getName();
			this.countTxt.text = `${CacheManager.role.getMoney(itemData.getItemInfo().sellUnit)}/${itemData.getItemInfo().sellPrice}`;
			this.isCanExchange = MoneyUtil.checkEnough(itemData.getItemInfo().sellUnit, itemData.getItemInfo().sellPrice, false);
			this.countTxt.color = this.isCanExchange ? Color.Green2 : Color.Red2;
			if(itemData.getItemInfo().sellUnit == EPriceUnit.EPriceUnitKillFragmentJunior){
				this.controller.selectedIndex = 0;
				this.tipStr = "低级精华";
			}else{
				this.controller.selectedIndex = 1;
				this.tipStr = "高级精华";
			}

			let isExchange: boolean = CacheManager.uniqueSkill.isCanExchangeByPos(itemData.getItemInfo().effectEx, itemData.getItemLevel());
			CommonUtils.setBtnTips(this.exchangeBtn, isExchange);
		}
	}

	private clickExchangeBtn(): void{
		if(this.isCanExchange){
			ProxyManager.uniqueSkill.exchangeKill(this._data.getCode(), 1);
		}else{
			Tip.addTip(`${this.tipStr}不足`);
		}
	}
}