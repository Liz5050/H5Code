/**
 * 符文兑换物品项 
 */
class RuneExchangeItem extends ListRenderer {
	private runeItem: RuneItem;
	private attrTxt: fairygui.GRichTextField;
	private coinTxt: fairygui.GRichTextField;
	private conditionTxt: fairygui.GTextField;
	private exchangeBtn: fairygui.GButton;
	private _runeData: any;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.runeItem = <RuneItem>this.getChild("runeItem");
		this.attrTxt = this.getChild("txt_att").asRichTextField;
		this.coinTxt = this.getChild("txt_limit").asRichTextField;
		this.conditionTxt = this.getChild("txt_condition").asTextField;
		this.exchangeBtn = this.getChild("btn_change").asButton;
		this.exchangeBtn.addClickListener(this.clickExchangeBtn, this);
		this.runeItem.touchable = false;
	}

	public setData(runeShop: any):void{
		let itemData: ItemData = new ItemData(runeShop.itemCode);
		let isPassTower: boolean = true;
		this._data = itemData;
		this._runeData = runeShop;
		if(itemData){
			this.runeItem.setData(itemData);
			this.runeItem.setNameText(itemData.getColorString(`<font size= 24>${itemData.getName()}Lv.1</font>`));
			if(itemData.getType()){
				let runeData: any = ConfigManager.mgRune.getByPk(`${itemData.getEffect()},${1}`);
				let attrDict: any = WeaponUtil.getAttrDict(runeData.attrList);
				this.attrTxt.text = "";
				for(let key in attrDict){
					let valueStr: string = "";
					if(WeaponUtil.isPercentageAttr(Number(key))){
						valueStr = `${attrDict[key]/100}%`;
					}else{
						valueStr = `${attrDict[key]}`
					}
					if(this.attrTxt.text == ""){
						this.attrTxt.text += `${GameDef.EJewelName[key][0]}  +${valueStr}`;
					}else{
						this.attrTxt.text += `\n${GameDef.EJewelName[key][0]}  +${valueStr}`;
					}
				}
			}
			else{
				this.attrTxt.text = itemData.getDesc();
			}
		}
		if(runeShop.copyFloor) {
			this.conditionTxt.text = `通关诛仙塔[${runeShop.copyFloor}层]`;
		}
		else {
			this.conditionTxt.text = "默认解锁";
		}
		isPassTower = !runeShop.copyFloor || CacheManager.copy.getCopyProcess(CopyEnum.CopyTower) >= runeShop.copyFloor;
		let color: string = CacheManager.role.getMoney(EPriceUnit.EPriceUnitRuneCoin) >= runeShop.price ? Color.GreenCommon : Color.RedCommon;
		let isGray: boolean = !(CacheManager.role.getMoney(EPriceUnit.EPriceUnitRuneCoin) >= runeShop.price && isPassTower);
		App.DisplayUtils.grayButton(this.exchangeBtn, isGray, isGray);
		this.coinTxt.text = `<font color=${color}>${CacheManager.role.getMoney(EPriceUnit.EPriceUnitRuneCoin)}</font>/${runeShop.price.toString()}`;
	}

	private clickExchangeBtn(): void{
		ProxyManager.shop.buyItem(0, this._runeData.shopCode, this._data.getCode(), 1, 0, false);
	}
}