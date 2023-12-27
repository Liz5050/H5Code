class TitlePropertyItemView extends fairygui.GComponent {
	private txt_quality:fairygui.GTextField;
	private txt_noAttr:fairygui.GTextField;
	private txt_noAttr2:fairygui.GTextField;
	private list_cur:List;
	private list_total:List;
	private txt_getWay:fairygui.GTextField;
	private fightTxt:fairygui.GTextField;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.list_cur = new List(this.getChild("list_cur").asList);
		this.list_total = new List(this.getChild("list_total").asList);

		this.txt_getWay = this.getChild("txt_getWay").asTextField;
		this.txt_quality = this.getChild("txt_quality").asTextField;
		this.txt_noAttr = this.getChild("txt_noAttr").asTextField;
		this.txt_noAttr2 = this.getChild("txt_noAttr2").asTextField;

		this.fightTxt = this.getChild("txt_fight").asTextField;
	}

	public setData(data:any):void {
		let fight:number = data.warfare > 0 ? data.warfare : 0;
		this.fightTxt.text = "" + (fight * CacheManager.role.roles.length);//.text = this.titleCfg.warfare + "";
		this.txt_getWay.text = "获取条件：" + data.desc;
		this.txt_noAttr.visible = data.attrList == undefined;
		this.list_cur.data = WeaponUtil.getAttrArray(data.attrList);
		if(!data.quality) {
			this.txt_quality.text = "-";
		}
		else {
			this.txt_quality.text = "稀有度：" + HtmlUtil.html(GameDef.TitleQualityName[data.quality],Color.titleQuality[data.quality]);
		}

		let totalAttrs:number[][] = CacheManager.title.getActiveTitleTotalProperty();
		this.txt_noAttr2.visible = !totalAttrs || totalAttrs.length == 0;
		this.list_total.data = totalAttrs;
		// this.txt_attr.text = WeaponUtil.getAttrDictStr(data.attrList,Color.White,Color.Green2);
	}
}