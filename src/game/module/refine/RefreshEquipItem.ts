/**
 * 洗炼装备项
 */

class RefreshEquipItem extends ListRenderer{
	private controller: fairygui.Controller;
	private numTxt: fairygui.GRichTextField;
	private levelTxt: fairygui.GTextField;
	private equipItem: BaseItem;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.controller = this.getController("c1");
		this.numTxt = this.getChild("txt_num").asRichTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.equipItem = <BaseItem> this.getChild("baseItem");
		this.equipItem.enableToolTip = false;
		// this.colorController = this.getController("c1");
		// this.equipItem.enableToolTip = false;
		
	}

	public setData(data: any): void{
		this._data = data;
		this.equipItem.itemData = data["itemData"];
		// this.controller.selectedIndex = CacheManager.role.getRoleLevel() < data["openLevel"] ? 1 : 0;
		// this.numTxt.text = (CacheManager.role.getRoleLevel() < data["openLevel"] ? "" : "");
		if(CacheManager.role.getRoleLevel() < data["openLevel"]){
			this.controller.selectedIndex = 1;
			this.numTxt.text = `${GameDef.EEquip[data["type"]]}`;
			this.levelTxt.text = `Lv.${data["openLevel"]}`;
		}
		else{
			this.controller.selectedIndex = 0;
			if(data["itemData"]){
				if(data["itemData"].getItemExtInfo().refresh){
					let refreshNum: number = 0;
					for(let key in data["itemData"].getItemExtInfo().refresh){
						refreshNum += 1;
					}
					this.numTxt.text = `${refreshNum}/4`;
				}
				else{
					this.numTxt.text = "1/4";
				}
			}
			else{
				this.numTxt.text = `${GameDef.EEquip[data["type"]]}`;
			}
		}
	}

	public getItemData(): ItemData{
		return this._data["itemData"];
	}

	public openLevel(): number{
		if(CacheManager.role.getRoleLevel() < this._data["openLevel"]){
			return this._data["openLevel"];
		}
		return 0;
	}

	public setSelected(value: boolean): void{
		this.equipItem.selected = value;
	}
}