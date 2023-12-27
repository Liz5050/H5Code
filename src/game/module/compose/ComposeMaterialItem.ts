/**
 * 合成材料（包括使用的材料&用于合成的装备）
 */

class ComposeMaterialItem extends fairygui.GComponent{
	private baseItem: BaseItem;
	private controller: fairygui.Controller;
	private _data: any;
	private toolTipData: ToolTipData;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.baseItem = <BaseItem>this.getChild("BaseItem");
		this.controller = this.getController("c1");
		this.baseItem.touchable = false;
		this.addClickListener(this.click, this);
	}

	public setData(data: any): void{
		this.controller.selectedIndex = 0;
		this._data = data;
		if(data){
			if(data["isOpen"]){
				this.controller.selectedIndex = 1;
			}else{
				let amount: number = CacheManager.pack.propCache.getItemCountByCode2(data["itemData"].getCode());
				this.baseItem.itemData = data["itemData"];
				this.baseItem.showBind();
				if(data["needNum"]){
					if(amount >= data["needNum"]){
						this.baseItem.updateNum(`<font color = "#0DF14B">${amount}/${data["needNum"]}</font>`);
					}else{
						this.baseItem.updateNum(`<font color = ${Color.ItemColor[EColor.EColorRed]}>${amount}/${data["needNum"]}</font>`);
					}
				}
				this.baseItem.numTxt.stroke = 1.5;
				// this.baseItem.numTxt.strokeColor = 
				this.controller.selectedIndex = 2;
			}
		}
	}

	/**
	 * 孔位（装备合成中镶嵌或卸下装备的位置）
	 */
	public getPos(): number{
		if(this._data && this._data["pos"] > -1){
			return this._data["pos"];
		}
		return -1;
	}

	public isShowToolTip(): boolean{
		if(this.controller.selectedIndex == 1){
			return true;
		}
		return false;
	}

	/**点击弹出tooltip */
	public click(): void {
		if (this.controller.selectedIndex == 2) {
			if (!this.toolTipData) {
				this.toolTipData = new ToolTipData();
			}
			this.toolTipData.isEnableOptList = true;
			this.toolTipData.data = this._data["itemData"];
			this.toolTipData.extData = {"pos": this._data["pos"]};
			this.toolTipData.type = ItemsUtil.getToolTipType(this._data["itemData"]);
			this.toolTipData.source = ToolTipSouceEnum.Compose;
			ToolTipManager.show(this.toolTipData);
		}
	}
}