/**
 * 图鉴套装tips界面Item
 */
class IllustrateSuitTipItem extends ListRenderer {
    
    private _txtLevel:fairygui.GTextField;
	private _txtName:fairygui.GTextField;
	private _txtNum:fairygui.GTextField;
	private _txtAttr:fairygui.GTextField;
	private _txtAttr2:fairygui.GTextField;

	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {
		super.constructFromXML(xml);
		
		this._txtLevel = this.getChild("txt_level").asTextField;
		this._txtName = this.getChild("txt_name").asTextField;
		this._txtNum = this.getChild("txt_num").asTextField;
		this._txtAttr = this.getChild("txt_attr").asTextField;
		this._txtAttr2 = this.getChild("txt_attr2").asTextField;
	}

	public setData(data:any):void {
		this._data = data;
		
		this._txtLevel.text = data.level + LangTrain.L10;
		this._txtName.text = data.suitDesc;

		let curNum:number = CacheManager.cultivate.getCultivateActiveNum(0, ECultivateType.ECultivateTypeIllustrated, data.subtype);
		this._txtNum.text = curNum + "/" + data.num;

		let attrDict:any = WeaponUtil.getAttrDict(data.attr);
		let attrText:string = "";
		let attrText2:string = "";
		let index:number = 0;
		for(let key in attrDict) {
			if(index%2 == 0) {
				attrText != "" ? attrText += "\n" : null;
				attrText +=  `${GameDef.EJewelName[key][0]}：`+ "<font color="+ Color.Color_8 + ">" +  +`${attrDict[key]}` + "</font>";
			}
			else {
				attrText2 != "" ? attrText2 += "\n" : null;
				attrText2 += `${GameDef.EJewelName[key][0]}：`+"<font color="+ Color.Color_8 + ">"+`${attrDict[key]}` +  "</font>";
			}
			index += 1;
		}
		this._txtAttr.text = attrText;
		this._txtAttr2.text = attrText2;

		if(curNum >= data.num) {
			this._txtNum.color = 0x09c73d;
			//this._txtAttr.color = 0x0df14b;
			//this._txtAttr2.color = 0x0df14b;
		}
		else {
			this._txtNum.color = 0xff2d14;
			//this._txtAttr.color = 0x979595;
			//this._txtAttr2.color = 0x979595;
		}
	}
}