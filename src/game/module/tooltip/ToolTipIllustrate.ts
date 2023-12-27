/**
 * 图鉴tips
 */
class ToolTipIllustrate extends ToolTipBase {

	private nameTxt: fairygui.GRichTextField;
	private levelTxt: fairygui.GRichTextField;
	private attrTxt: fairygui.GRichTextField;
	private fightPanel: FightPanel;
	private txtSuitName: fairygui.GRichTextField;
    private txtEffectDesc:fairygui.GTextField;

	private txtSanjuese: fairygui.GTextField;
	private imgWeijihuo: fairygui.GImage;
	private imgYijihuo: fairygui.GImage;

	private baseItem: BaseItem;
	private itemData: ItemData;

	private loaderImg: GLoader;

	private btnUse: fairygui.GButton;

	private toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;

	private _txtName:fairygui.GTextField;
	private _imgBounder: GLoader;
	private _txtFight:fairygui.GTextField;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipIllustrate");
	}

	public initUI(): void {
		super.initUI();
		this.nameTxt = this.getChild("txt_name").asRichTextField;
		this.levelTxt = this.getChild("txt_color").asRichTextField;
		this.attrTxt = this.getChild("txt_base").asRichTextField;
		this.fightPanel = <FightPanel>this.getGObject("panel_fight");
		this.txtSuitName = this.getChild("txt_suitname").asRichTextField;
        this.txtEffectDesc = this.getGObject("txt_effectdesc").asTextField;

		this.txtSanjuese = this.getChild("n12").asTextField;
		this.imgWeijihuo = this.getChild("img_weijihuo").asImage;
		this.imgYijihuo = this.getChild("img_yijihuo").asImage;
		
		this.baseItem = <BaseItem>this.getChild("baseItem");
		this.baseItem.isShowName = false;
		this.baseItem.enableToolTip = false;

		this.loaderImg = this.getChild("loader_img") as GLoader;

		this.btnUse = this.getChild("btn_use").asButton;
		this.btnUse.addClickListener(this.onUseBtnClickHandler, this);

		this._txtName = this.getChild("txt_name2").asTextField;
		this._txtFight = this.getChild("txt_fight").asTextField;
		this._imgBounder = this.getChild("color_loader") as GLoader;
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		this.toolTipSource = toolTipData.source;
		
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			if (ItemsUtil.isTrueItemData(this.itemData)) {
				
				this.nameTxt.text = this.itemData.getName(false);
				this.nameTxt.color = Color.ItemColorHex[this.itemData.getColor()];
				this._txtName.text = this.itemData.getName(false);
				this._txtName.color = Color.ItemColorHex[this.itemData.getColor()];
				this._imgBounder.load(URLManager.getModuleImgUrl("illustrate/frame/color_" + this.itemData.getColor() + ".png", PackNameEnum.Train));

				// let datas: Array<any> = ConfigManager.cultivate.select({"position": this.itemData.getCode()});
				let datas: Array<any> = ConfigManager.cultivate.getConfigsByMaterial(this.itemData.getCode());

				if(datas.length > 0) {
                    let illusData:any;
				    if(datas.length == 24) {
                        illusData = datas[1];
                    } else {
                        illusData = datas[0];
                    }
					let attrDict:any = WeaponUtil.getAttrDict(illusData.attr);

					let careerPre:string = ConfigManager.cultivate.getCareerPre(illusData);

					let levelTxt = "";
					levelTxt += `品质：<font color='#f2e1c0'>${GameDef.ColorName[this.itemData.getColor()]}</font>\n`;
					levelTxt += `星级：<font color='#f2e1c0'>0星</font>`;
					this.levelTxt.text = levelTxt;

					if(CacheManager.cultivate.getCultivateLevel(0, ECultivateType.ECultivateTypeIllustrated, illusData.position) == -1)
					{
						this.imgWeijihuo.visible = true;
						this.imgYijihuo.visible = false;
						this.btnUse.text = "使  用";
					}
					else {
						this.imgWeijihuo.visible = false;
						this.imgYijihuo.visible = true;
						this.btnUse.text = "分  解";
					}

					let times:number = 1;
					if(illusData.attrIndex == 1) {
						times = 3;
						this.txtSanjuese.visible = true;
					}
					else {
						this.txtSanjuese.visible = false;
					}
					this.fightPanel.updateValue(WeaponUtil.getCombat(attrDict) * times);
					this._txtFight.text = (WeaponUtil.getCombat(attrDict) * times).toString();

					let attrTxt = "";
					for(let key in attrDict){
						attrTxt += `${careerPre}${GameDef.EJewelName[key][0]}：<font color='#f2e1c0'>${attrDict[key]}</font>\n`;
					}
					this.attrTxt.text = attrTxt;

					this.loaderImg.load(URLManager.getModuleImgUrl("illustrate/img/subtype_" + illusData.subtype + "/pos_" + illusData.position + ".jpg", PackNameEnum.Train));

					let suitDatas:Array<any> = ConfigManager.cultivateSuit.select({"cultivateType":illusData.cultivateType, "subtype":illusData.subtype});
					if(suitDatas.length > 0) {
						let suitData:any = suitDatas[0];
						this.txtSuitName.text = suitData.suitName;
					}

                    let curConfigData:any = ConfigManager.cultivate.getByPKParams(ECultivateType.ECultivateTypeIllustrated, this.itemData.getCode(), 0);
                    if(curConfigData != null && curConfigData.effectDesc != null) {
					    this.txtEffectDesc.text = curConfigData.effectDesc;
                    } else {
                        this.txtEffectDesc.text = "";
                    }
				}
				else {
					this.loaderImg.clear();
					this.attrTxt.text = "配置错误：" + this.itemData.getCode();
					this.txtSuitName.text = "无";
				}
			}
			this.baseItem.itemData = this.itemData;
			this.baseItem.numTxt.text = "";
		}

		if(this.toolTipSource==ToolTipSouceEnum.Pack){
			this.btnUse.visible = true;
		}else{
			this.btnUse.visible = false;
		}
	}

	private onUseBtnClickHandler():void {
		let toolTipData:ToolTipData = this.toolTipData;
		if (toolTipData) {
			let itemData:ItemData = <ItemData>toolTipData.data;
			let b = this.btnUse.text == "分  解";
			if (ItemsUtil.usellustrate(itemData, b)) {
				this.hide();
			}
		}
	}

}