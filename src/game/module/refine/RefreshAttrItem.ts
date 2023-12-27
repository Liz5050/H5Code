/**
 * 洗炼属性项
 */

class RefreshAttrItem extends ListRenderer{
	private openBtn: fairygui.GButton;
	private lockBtn: fairygui.GButton;
	private attrTxt: fairygui.GRichTextField;
	private controller: fairygui.Controller;
	private color: number;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.openBtn = this.getChild("btn_open").asButton;
		this.lockBtn = this.getChild("btn_lock").asButton;
		this.attrTxt = this.getChild("txt_att").asRichTextField;
		this.controller = this.getController("c1");
		this.openBtn.addClickListener(this.clickOpenBtn, this);
	}

	public setData(data: any): void{
		this._data = data;
		this.color = 0;
		if(data["index"] == 0){
			this.attrTxt.text = `<font color = ${"#0cf24a"}>可洗炼属性</font>`;
			this.controller.selectedIndex = 1;
			return;
		}
		else if(data["index"] == 1 || data["index"] == 2 || data["index"] == 3){
			this.attrTxt.text = `<font color = ${"#c8b185"}>第${GameDef.NumberName[data["index"]+1]}条洗炼属性槽（未开启）</font>`;
			this.controller.selectedIndex = 0;
			return;
		}
		let attrData:any = ConfigManager.mgRefreshRate.getByPk(data["refresh"][0]);
		let attrs: Array<any> = ConfigManager.mgRefreshRate.select({"attrType": attrData.attrType});
		let addAttr: string;
		let min: string;
		let max: string;
		if(WeaponUtil.isPercentageAttr(attrData.attrType)){
			addAttr = `${data["refresh"][1]/100}%`;
			min = `${attrs[0].lower/100}%`;
			max = `${attrs[attrs.length - 1].upper/100}%`;
		}
		else{
			addAttr = data["refresh"][1];
			min = attrs[0].lower;
			max = attrs[attrs.length - 1].upper;
		}
		this.color = attrData.color;
		this.attrTxt.text = `<font color = ${Color.ItemColor[this.color]}>${GameDef.EJewelName[attrData.attrType][0]}+${addAttr}</font>(${min}-${max})`;
		this.controller.selectedIndex = 1;
		this.lockBtn.selected = false;
	}

	/**点击开启 */
	private clickOpenBtn(): void{
		Alert.info(`是否使用<font color='#01ab24'>100</font>元宝开启<font color='#01ab24'>1</font>条洗炼属性槽\n（优先使用绑元）？`, this.openRefresh, this);
	}

	/**开启洗炼槽，发送消息到服务器 */
	private openRefresh(): void{
		// EventManager.dispatch(LocalEventEnum.OpenRefresh, this._data);
		ProxyManager.refine.openRefresh(this._data["uid"], this._data["index"]);
	}

	public setLock(): void{
		this.lockBtn.selected = true;
	}

	public isLock(): boolean{
		return this.lockBtn.selected;
	}

	/**主要用于设置洗炼属性锁定，当只有一条属性未锁定时，锁定复选框不可见 */
	public getsatus(): number{
		return this.controller.selectedIndex;
	}

	public setsatus(value: number){
		this.controller.selectedIndex  = value;
	}

	/**洗炼属性的颜色 */
	public getColor(): number{
		return this.color;
	}
}