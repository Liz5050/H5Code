/**
 * 装备tip的宝石属性项
 */

class EquipStoneAttrItem extends ListRenderer{
	private statusController: fairygui.Controller;
	private vipController: fairygui.Controller;
	private stoneTxt: fairygui.GRichTextField;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.statusController = this.getController("c1");
		this.vipController = this.getController("c2");
		this.stoneTxt = this.getChild("txt_stone").asRichTextField;
	}

	public setData(data: any): void{
		this._data = data;
		
		if(data["itemData"]){
			let itemData: ItemData = data["itemData"];
			this.stoneTxt.text = "";
			if(itemData.getType() == EProp.EPropJewelAdvance){
				this.statusController.selectedIndex = 2;
				this.stoneTxt.text = `<font color = ${Color.ItemColor[EColor.EColorRed]}>${itemData.getItemLevel()}级红宝石</font>\n`;
			}else if(itemData.getType() == EProp.EPropGuildBeastFood){
				this.statusController.selectedIndex = 3;
				this.stoneTxt.text = `<font color = ${Color.ItemColor[EColor.EColorBlue]}>${itemData.getItemLevel()}级蓝宝石</font>\n`;
			}
			this.stoneTxt.text += this.setAttr();
		}else{
			this.statusController.selectedIndex = 0;
			this.stoneTxt.text = "未镶嵌";
		}
		if(data["index"] == 0){
			this.vipController.selectedIndex = 1;
			if(CacheManager.vip.vipLevel < 5 && !data["itemData"]){
				this.statusController.selectedIndex = 1;
			}
		}else{
			this.vipController.selectedIndex = 0;
		}
	}

	/**宝石的加成属性 */
	private setAttr():string{
		if(this._data["itemData"]){
			let attr: string = "";
			let itemData: ItemData = this._data["itemData"];
			let jewelData: any = ConfigManager.jewel.getByPk(itemData.getItemLevel());
			let jewelDict: any = WeaponUtil.getAttrDict(itemData.getType() == EProp.EPropJewelAdvance ? jewelData.attackAttrList : jewelData.defenseAttrList);
			for(let key in jewelDict){
				attr += `<font color = ${Color.ItemColor[EColor.EColorWhite]}>${GameDef.EJewelName[key][0]} +${jewelDict[key]}   </font>`;
			}
			return attr;
		}
		return "";
	}

	public get height():number{
		if(this.stoneTxt != null){
			return this.stoneTxt.height + 5;
		}
		return 34;
	}
}