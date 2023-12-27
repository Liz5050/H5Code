/**
 * 图鉴升级
 */
class IllustrateUpgrateView extends BaseWindow {
	
	private _data:any;
	private _level:number;
	private _item:TrainIllustrateItem;

	private controller:fairygui.Controller;

	private _txtEffectDesc:fairygui.GTextField;

	private _txtAttrCur:fairygui.GTextField;
	private _txtAttrNext:fairygui.GTextField;
	private _txtAttrFull:fairygui.GTextField;

	private _txtMat:fairygui.GRichTextField;
	private _progressBar:UIProgressBar;
	private _progressBarFrame:fairygui.GImage;

	private _upgrateBtn:fairygui.GButton;
	private _getWayBtn:fairygui.GButton;

	public constructor() {
		super(PackNameEnum.TrainIllustratePanel, "TrainIllustrateUpgrateView");
		
	}

	public initOptUI():void {
		//---- script make start ----
		this.controller = this.getController("c1");

		let bg:GLoader = this.getGObject("loader_bg") as GLoader;
		bg.load(URLManager.getModuleImgUrl("illustrate/upgrate_bg.jpg", PackNameEnum.Train));

		this._item = this.getGObject("illustrate_item") as TrainIllustrateItem;
		this._item.isUpgrateUI = true;

		this._txtEffectDesc = this.getGObject("txt_effectdesc").asTextField;

		this._txtAttrCur = this.getGObject("txt_attr_cur").asTextField;
		this._txtAttrNext = this.getGObject("txt_attr_next").asTextField;
		this._txtAttrFull = this.getGObject("txt_attr_full").asTextField;

		this._progressBar = this.getGObject("progressBar") as UIProgressBar;
		this._progressBar.setStyle(URLManager.getCommonIcon("progressBar_4"),URLManager.getCommonIcon("bg_4"),430,24,0,0);
		this._progressBar.labelType = BarLabelType.Current_Over_Total;
		this._progressBar.labelSize = 18;

		this._progressBarFrame = this.getGObject("progressBar_frame").asImage;

		this._txtMat = this.getGObject("txt_mat").asRichTextField;

		this._upgrateBtn = this.getGObject("btn_upgrate").asButton;
		this._upgrateBtn.addClickListener(this.onUpgrateBtnClickHandler, this);

		this._getWayBtn = this.getGObject("btn_getway").asButton;
		this._getWayBtn.addClickListener(this.onGetwayBtnClickHandler, this);
	}

	public get data():any {
		return this._data;
	}

	public hide(param: any = null, callBack: CallBack = null):void {
		super.hide(param,callBack);

		this._data = null;
	}

	public updateAll(data?:any):void{
		if(!data) {
			return;
		}

		//弹出激活成功界面
		if(this._data && this._data.position == data.position) {
			if(this._level == -1 && CacheManager.cultivate.getCultivateLevel(0, ECultivateType.ECultivateTypeIllustrated, data.position) == 0)
			{
				let attrDict:any = WeaponUtil.getAttrDict(this._data.attr);
				var times = 1;
				if(this._data.attrIndex == 1) {
					 times = CacheManager.role.roles.length;
				}
				var fightv = (WeaponUtil.getCombat(attrDict) * times) + "";
			    this.hide();
				let color:number;
				if(data.itemData.getItemInfo()) {
					color = data.itemData.getColor();
				}
				else {
					color = EColor.EColorRed;
				}
				EventManager.dispatch(LocalEventEnum.ActivationShow, 
					{ 
						"name": data.posName, 
						"urlModel": URLManager.getModuleImgUrl("illustrate/img/subtype_" + data.subtype + "/pos_" + data.position + ".jpg",PackNameEnum.Train),
						"urlFrame2": URLManager.getModuleImgUrl("illustrate/frame/frame.png", PackNameEnum.Train),
						"urlFrame3": URLManager.getModuleImgUrl("illustrate/frame/color_" + color + ".png", PackNameEnum.Train),
						"fight" : fightv,
						"nameColor": Color.ItemColor[color],
					});
			}
		}
		
		this._data = data;

		this._item.setData(data, 0);
		
		let level:number = CacheManager.cultivate.getCultivateLevel(0, ECultivateType.ECultivateTypeIllustrated, data.position);

		let tempLevel = level == -1 ? 0 : level;
		let curConfigData:any = ConfigManager.cultivate.getByPKParams(ECultivateType.ECultivateTypeIllustrated, data.position, tempLevel);
		let attrDict:any = WeaponUtil.getAttrDict(curConfigData.attr);

		this._txtEffectDesc.text = curConfigData.effectDesc;

		let nextData:any = ConfigManager.cultivate.getByPKParams(ECultivateType.ECultivateTypeIllustrated, data.position, level+1);
		this._level = level;

		let careerPre:string = ConfigManager.cultivate.getCareerPre(curConfigData);
		
		if(nextData) {
			this.controller.selectedIndex = 0;
			
			if(this._level == -1)
			{
				this._progressBar.visible = false;
				this._progressBarFrame.visible = false;
				this._txtMat.visible = true;

				let nextAttrDict:any = WeaponUtil.getAttrDict(nextData.attr);
				let nextAttrTxt:string = "";
				for(let key in nextAttrDict) {
					nextAttrTxt += `${careerPre}${GameDef.EJewelName[key][0]}：${nextAttrDict[key]}\n`;
				}
				this._txtAttrNext.text = nextAttrTxt;

				let curAttrTxt:string = "";
				for(let key in nextAttrDict) {
					curAttrTxt += `${careerPre}${GameDef.EJewelName[key][0]}：0\n`;
				}
				this._txtAttrCur.text = curAttrTxt;

				let itemdata:ItemData = new ItemData(nextData.itemCode);
				this._txtMat.text = App.StringUtils.substitude(LangTrain.L16, itemdata.getName(), nextData.itemNum, Color.ItemColor[itemdata.getColor()]);
				this._upgrateBtn.text = LangTrain.L11;

				this._getWayBtn.text = LangTrain.L12;
				this._getWayBtn.titleColor = 0x0df14b;
				this._getWayBtn.data = 0;
				this._getWayBtn.visible = true;
			}
			else {
				this._progressBar.visible = true;
				this._progressBarFrame.visible = true;
				// this._txtMat.text = App.StringUtils.substitude(LangTrain.L5, nextData.itemNum);
				this._txtMat.visible = false;

				this._progressBar.setValue(CacheManager.role.getMoney(EPriceUnit.EPriceUnitIllustratedExp), nextData.itemNum, true);

				let attrTxt:string = "";
				for(let key in attrDict) {
					attrTxt += `${careerPre}${GameDef.EJewelName[key][0]}：${attrDict[key]}\n`;
				}
				this._txtAttrCur.text = attrTxt;

				let nextAttrDict:any = WeaponUtil.getAttrDict(nextData.attr);
				let nextAttrTxt:string = "";
				for(let key in nextAttrDict) {
					nextAttrTxt += `${careerPre}${GameDef.EJewelName[key][0]}：${nextAttrDict[key]}\n`;
				}
				this._txtAttrNext.text = nextAttrTxt;
				this._upgrateBtn.text = LangTrain.L13;

				this._getWayBtn.text = LangTrain.L14;
				this._getWayBtn.titleColor = 0x0CF24A;
				this._getWayBtn.data = 1;
				this._getWayBtn.visible = true;
			}
		}
		else {
			this.controller.selectedIndex = 1;

			let attrTxt:string = "";
			for(let key in attrDict) {
				attrTxt += `${careerPre}${GameDef.EJewelName[key][0]}：${attrDict[key]}\n`;
			}
			this._txtAttrFull.text = attrTxt;
		}
	}

	public updateIllustrateExp():void {
		if (!this.data) {
			return;
		}
		let level:number = CacheManager.cultivate.getCultivateLevel(0, ECultivateType.ECultivateTypeIllustrated, this._data.position);
		let nextData:any = ConfigManager.cultivate.getByPKParams(ECultivateType.ECultivateTypeIllustrated, this._data.position, level+1);
		
		if(nextData) {
			this._progressBar.setValue(CacheManager.role.getMoney(EPriceUnit.EPriceUnitIllustratedExp), nextData.itemNum, true);
		}
	}

	private onUpgrateBtnClickHandler():void {
		ProxyManager.cultivate.cultivateActive(ECultivateType.ECultivateTypeIllustrated, this._data.position, this._level+1, 0);
	}

	private onGetwayBtnClickHandler():void {
		if(this._getWayBtn.data == 0) {
			if(ConfigManager.propGet.getDataById(this._data.position).length > 0) {
				EventManager.dispatch(LocalEventEnum.TrainShowGetWindow, this._data);
			}
			else {
				 Tip.showTip("暂无获取途径");
			}
		}
		else if(this._getWayBtn.data == 1) {
			EventManager.dispatch(LocalEventEnum.TrainShowIllustrateDecomposeView);
		}
	}

}