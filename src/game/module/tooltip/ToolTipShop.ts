/**
 * 商店扩展的tips
 */

class ToolTipShop extends fairygui.GComponent{
	private priceTxt: fairygui.GRichTextField;
	private controller: fairygui.Controller;
	private numTxt: NumberInput;
	private unitPrice: number;
	private unit: number;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.priceTxt = this.getChild("txt_price").asRichTextField;
		this.controller = this.getController("c1");
		this.numTxt = <NumberInput>this.getChild("input_num");
		this.numTxt.setChangeFun(this.calculateMoney, this);
	}

	public setData(data: any): void{
		let shopData: any = ConfigManager.shop.getByPk(data["sellData"].shopCode);
		this.unitPrice = data["sellData"].price;
		this.unit = shopData.unit;
		if(MoneyUtil.checkEnough(this.unit, data["sellData"].price, false, true)){
			this.priceTxt.text = this.unitPrice.toString();
		}else{
			this.priceTxt.text = `<font color = ${Color.ItemColor[EColor.EColorRed]}>${this.unitPrice.toString()}</font>`;
		}
		if(data["limitNum"] != null){
			if(data["limitNum"] == 0){
				this.numTxt.max = 0;
				this.numTxt.value = 0;
			}else{
				this.numTxt.max = data["limitNum"];
				this.numTxt.value = 1;
			}
			
		}else{
			this.numTxt.max = 999;
			this.numTxt.value = 1;
		}
		switch(shopData.unit){
			case EPriceUnit.EPriceUnitGold:
				this.controller.selectedIndex = 0;
				break;
			case EPriceUnit.EPriceUnitGoldBind:
				this.controller.selectedIndex = 1;
				break;
			case EPriceUnit.EPriceUnitHonour:
				this.controller.selectedIndex = 2;
				break;
		}
	}

	private calculateMoney(): void {
		if(this.numTxt.value){
			// this.priceTxt.text = (this.unitPrice * this.numTxt.value).toString();
			if(MoneyUtil.checkEnough(this.unit, this.unitPrice * this.numTxt.value, false, true)){
				this.priceTxt.text = (this.unitPrice * this.numTxt.value).toString();
			}else{
				this.priceTxt.text = `<font color = ${Color.ItemColor[EColor.EColorRed]}>${this.unitPrice * this.numTxt.value}</font>`;
			}
		}
	}

	public getValue(): number{
		return this.numTxt.value;
	}
}