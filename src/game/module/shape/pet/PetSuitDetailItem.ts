/**
 * 套装详情
 */
class PetSuitDetailItem extends ListRenderer {

	private statusTxt: fairygui.GRichTextField;
	private suitLevelTxt: fairygui.GTextField;
	private activeTxt: fairygui.GRichTextField;
	private suitAttrTxt: fairygui.GRichTextField;
	private bgImg: fairygui.GImage;

	private skillCfg: any;
	private isOpen: boolean;
	/**是否为天赋技能 */
	private isTalent: boolean;
	private openLevel: number;
	private nameStr: string;

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.statusTxt = this.getChild("txt_status").asRichTextField;
		this.suitLevelTxt = this.getChild("txt_suitLevel").asTextField;
		this.activeTxt = this.getChild("txt_active").asRichTextField;
		this.suitAttrTxt = this.getChild("txt_suitAttr").asRichTextField;
		this.bgImg = this.getChild("img_bg").asImage;
	}

	public setData(data: any): void {
		this._data = data;
		if (data != null) {
			if(data.isActived){
				this.statusTxt.text = `<font color = ${Color.GreenCommon}>已激活</font>`;
				this.activeTxt.text = "";
			}else{
				this.statusTxt.text = `<font color = ${Color.RedCommon}>未激活</font>`;
				this.activeTxt.text = `<font size = 24>激活条件：</font>\n全部宠物装备达到${data.cfg.level}阶级别激活（${data.activeNum}/${data.cfg.num}）`;
			}
			this.suitLevelTxt.text = `宠物装备套装达到${data.cfg.level}阶激活`;
			this.suitAttrTxt.text = `<font size = 24>激活属性：</font>\n${data.cfg.effectDesc}`;
		}
	}

	// public get height():number{
	// 	if(this.suitAttrTxt && this.suitAttrTxt.text != ""){
	// 		// this.bgImg.height = this.suitAttrTxt.height + this.suitAttrTxt.y + 15;
	// 		return this.suitAttrTxt.height + this.suitAttrTxt.y + 5;
	// 	}
	// 	// else if(this.descTxt && this.descTxt.text != ""){
	// 	// 	this.bgImg.height = this.descTxt.height + this.descTxt.y + 15;
	// 	// 	return this.descTxt.height + this.descTxt.y + 13;
	// 	// }
	// 	return 100;
	// }
}