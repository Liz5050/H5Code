class GuildScoreWareHouseLogItem extends ListRenderer{
	private txt_time:fairygui.GTextField;
	private txt_content:fairygui.GRichTextField
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
		this.txt_time = this.getChild("txt_time").asTextField;
		this.txt_content = this.getChild("txt_content").asRichTextField;
	}

	public setData(data:any):void {
		this.txt_time.text = "[" + App.DateUtils.formatDate(data.recordDt_DT,DateUtils.FORMAT_M_D_HH_MM) + "]";
		let itemData:ItemData = new ItemData(data.itemCode_I);
		let nameStr:string = itemData.getName(true);
		if(itemData.getCategory() == ECategory.ECategoryEquip) {
			let career:number = itemData.getCareer();
			nameStr += "（" + WeaponUtil.getEquipLevelText(itemData,false) + " " + CareerUtil.getCareerName(career) + "）";
		}
		else {
			nameStr += "*" + data.itemNum_I;
		}
		
		if(data.recordType_I == EGuildWarehouseRecordType.EGuildWarehouseRecordTypeGBIC) {
			this.txt_content.text = HtmlUtil.colorSubstitude(LangGuildNew.L25,data.playerName_S,nameStr);
		}
		else {
			this.txt_content.text = HtmlUtil.colorSubstitude(LangGuildNew.L19,data.playerName_S,GameDef.GuildWarehouseRecord[data.recordType_I],nameStr);
			if(data.recordType_I == EGuildWarehouseRecordType.EGuildWarehouseRecordTypeDonate) {
				this.txt_content.text += HtmlUtil.colorSubstitude(LangGuildNew.L23,data.credit_I);
			}
			else {
				this.txt_content.text += HtmlUtil.colorSubstitude(LangGuildNew.L24,data.credit_I);
			}
		}
	}
}