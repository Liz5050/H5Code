/**诛仙塔 符文解锁奖励显示列表item */
class RuneCopyItem extends ListRenderer {
	protected baseItem:BaseItem;
	//protected txt_desc:fairygui.GTextField;
	public constructor() {
		super();
	}
	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.baseItem = <BaseItem>this.getChild("baseItem");
		this.baseItem.bgUrl = URLManager.getModuleImgUrl("img_rune_bg.png",PackNameEnum.Copy);//符文底
		//this.txt_desc = this.getChild("txt_desc").asTextField;
	}
	public setData(data:any):void{
		var itemData:ItemData = data.item;
		var type:number = data.type;
		this.baseItem.itemData = itemData;
		this.baseItem.colorUrl = "";
		if(itemData){			
			this.baseItem.setNameText("新类型");
			//this.txt_desc.text = "新类型";			
		}
		if(type){			
			this.baseItem.icoUrl = URLManager.getModuleImgUrl("img_rune_ico.png",PackNameEnum.Copy);	
			this.baseItem.setNameText("新镶嵌");		
			//this.txt_desc.text = "新镶嵌";
		}
		this.baseItem.showCareerIco(3);
	}

}