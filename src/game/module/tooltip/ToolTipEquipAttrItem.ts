/**
 * 特殊装备的属性item
 */
class ToolTipEquipAttrItem extends  ListRenderer {
	private txt_attribute1:fairygui.GTextField;
	public constructor() {
		super()
	}
	protected constructFromXML(xml:any):void{
		super.constructFromXML(xml);
		this.txt_attribute1 = this.getChild("txt_attribute1").asTextField;
	}

	public setData(data:any,index:number):void{
		this._data = data;
		this.itemIndex = index;
		this.txt_attribute1.text = CommonUtils.getAttrName(Number(this._data.type))+"：" + HtmlUtil.html(this._data.value+"", Color.Color_8);
		// 生命:<font color='#0df14b'>5215166</font>
	}
	
}