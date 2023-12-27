/**
 * 符文背包物品项 
 */
class RunePackItem extends fairygui.GButton{
	private runeItem: RuneItem;
	private nameTxt: fairygui.GRichTextField;
	private attrTxt: fairygui.GRichTextField;
	private controller: fairygui.Controller;
	public dressRuneBth: fairygui.GButton;
	private _data: ItemData;
	

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.runeItem = <RuneItem>this.getChild("runeItem");
		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.attrTxt = this.getChild("txt_att").asRichTextField;
		this.controller = this.getController("c1");
		this.dressRuneBth = this.getChild("btn_equip").asButton;
		this.dressRuneBth.addClickListener(this.click, this);
		this.runeItem.setNameVisible(false);
		this.runeItem.touchable = false;
		this.runeItem.numTxt.visible = false;
	}

	public setData(packData: any):void{
		let itemData: ItemData = packData["itemData"];
		let isTips: boolean = false;
		this._data = packData;
		if(ItemsUtil.isTrueItemData(itemData)){
			let level: number = packData["level"] ? packData["level"] : itemData.getItemExtInfo().level;
			let runeData: any = ConfigManager.mgRune.getByPk(`${itemData.getEffect()},${level}`);
			let attrDict: any = runeData ? WeaponUtil.getAttrDict(runeData.attrList) : null;
			if(attrDict){
				this.runeItem.setData(itemData);
				this.nameTxt.text = itemData.getColorString(`${itemData.getName()} Lv.${level}`);
				this.attrTxt.text = "";
				for(let key in attrDict){
					if(WeaponUtil.isPercentageAttr(Number(key))){
						this.attrTxt.text += `${GameDef.EJewelName[key][0]}  <font color='${Color.Color_8}'>+${attrDict[key]/100}%</font>\n`;
					}else{
						this.attrTxt.text += `${GameDef.EJewelName[key][0]}  <font color='${Color.Color_8}'>+${attrDict[key]}</font>\n`;
					}
				}
			}

			if(packData["inlay"] != 2){//2为当前镶嵌符文
				let inlayItem: ItemData = CacheManager.rune.getCurItem(packData.roleIndex, packData.hole);
				if(ItemsUtil.isTrueItemData(inlayItem) && itemData.getType() == inlayItem.getType() && itemData.getColor() > inlayItem.getColor()){
					isTips = true;
				}
			}
		}
		this.controller.selectedIndex = packData["inlay"];//0已有符文类型，1可镶嵌符文， 2当前镶嵌符文
		CommonUtils.setBtnTips(this.dressRuneBth, isTips);
	}

	private click():void{
		if(this._data["hole"] > -1){
			ProxyManager.rune.dressRune(this._data["hole"],this._data["itemData"].getUid(), this._data["roleIndex"]);
		}
		EventManager.dispatch(UIEventEnum.RunePackClose);
	}

	public getData(): ItemData{
		return this._data;
	}
}