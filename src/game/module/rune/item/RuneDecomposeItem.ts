/**
 * 符文分解物品项 
 */
class RuneDecomposeItem extends fairygui.GButton{
	private runeItem: RuneItem;
	private attrTxt: fairygui.GRichTextField;
	private _data: ItemData;
	private runeData: any;
	private amount: number = 1;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.runeItem = <RuneItem>this.getChild("runeItem");
		this.attrTxt = this.getChild("txt_attr").asRichTextField;
		this.addClickListener(this.click, this);
		this.runeItem.touchable = false;
		this.runeItem.numTxt.visible = false;
	}

	public setData(itemData: ItemData, index: number):void{
		this._data = itemData;
		if(itemData){
			this.amount = itemData.getItemAmount();
			this.runeItem.setData(itemData);
			this.runeItem.setNameText(itemData.getColorString(`<font size= 24>${itemData.getName()} Lv.${itemData.getItemExtInfo().level}</font>`));
			this.runeData = ConfigManager.mgRune.getByPk(`${itemData.getEffect()},${itemData.getItemExtInfo().level}`);
			let attrDict: any = this.runeData ? WeaponUtil.getAttrDict(this.runeData.attrList) : null;
			if(attrDict){
				let attrStr: string = "";
				for(let key in attrDict){
					if(WeaponUtil.isPercentageAttr(Number(key))){
						attrStr += `${GameDef.EJewelName[key][0]} <font color='${Color.GreenCommon}'>+${attrDict[key]/100}%</font>\n`;
					}else{
						attrStr += `${GameDef.EJewelName[key][0]} <font color='${Color.GreenCommon}'>+${attrDict[key]}</font>\n`;
					}
				}
				this.attrTxt.text = attrStr.slice(0, attrStr.length - 1);
			}
		}
		this.selected = CacheManager.rune.decomIndexSel[index];
	}

	private click():void{

	}

	public get itemData(): ItemData{
		return this._data;
	}

	public get runeExp(): number{
		if(this.runeData.decomposeExp){
			return this.runeData.decomposeExp;
		}
		return 0;
	}

	public get runeCoin(): number{
		if(this.runeData.decomposeCoin){
			return this.runeData.decomposeCoin
		}
		return 0;
	}
}