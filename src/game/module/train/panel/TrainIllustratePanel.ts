/**
 * 图鉴UI界面
 */
class TrainIllustratePanel extends BaseTabView{
	
	private listItem:List;
	private listSubType:List;

	private btnLeft:fairygui.GButton;
	private btnRight:fairygui.GButton;

	private fightPanel: FightPanel;

	private _txtExp:fairygui.GRichTextField;

	private _loaderSuitname:GLoader;
	private _txtSuitNum:fairygui.GRichTextField;
	private _txtSuitAttr:fairygui.GRichTextField;

	private decomposeMC:UIMovieClip;

	private attr1 : fairygui.GRichTextField;
	private attr2 : fairygui.GRichTextField;
	private attr3 : fairygui.GRichTextField;
	private attr4 : fairygui.GRichTextField;
	private btn_decompose : fairygui.GButton;

	public constructor() {
		super();
	}

	protected initOptUI():void {
		let loaderBg:GLoader = <GLoader>this.getGObject("loader_bg");
		//loaderBg.load(URLManager.getModuleImgUrl("nobility/bg.png", PackNameEnum.Train));

		this.fightPanel = <FightPanel>this.getGObject("panel_fight");

		this.btnLeft = this.getGObject("btn_left").asButton;
		this.btnLeft.addClickListener(this.onBtnLeftClick, this);
		this.btnRight = this.getGObject("btn_right").asButton;
		this.btnRight.addClickListener(this.onBtnRightClick, this);

		this.btn_decompose  = this.getGObject("btn_decompose").asButton;
		this.btn_decompose.addClickListener(this.onDecomposeBtnClick, this);

		/**this.decomposeMC = UIMovieManager.get(PackNameEnum.MCCommonButton);
		btn_decompose.addChild(this.decomposeMC);
		this.decomposeMC.scaleX = 0.9;
		this.decomposeMC.scaleY = 0.8;
		this.decomposeMC.x = -10;
		this.decomposeMC.y = -10;*/

		let btn_attr:fairygui.GButton = this.getGObject("btn_attr").asButton;
		btn_attr.addClickListener(this.onXiangqingBtnClick, this);

		this.listItem = new List(this.getGObject("list_item").asList);
		this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK, this.onItemListSelect, this);

		this.listSubType = new List(this.getGObject("list_subtype").asList);
		this.listSubType.list.addEventListener(fairygui.ItemEvent.CLICK, this.onSubTypeListSelect, this);
		this.listSubType.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL, this.onSubTypeListScroll, this);
		this.listSubType.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL_END, this.onSubTypeListScrollEnd, this);
		
		this._txtExp = this.getGObject("txt_exp").asRichTextField;

		this._loaderSuitname = this.getGObject("loader_suitname") as GLoader;
		this._txtSuitNum = this.getGObject("txt_suit_num").asRichTextField;
		this._txtSuitAttr = this.getGObject("txt_suit_attr").asRichTextField;

		this.listSubType.data = ConfigManager.cultivate.getSubTypes(ECultivateType.ECultivateTypeIllustrated);
		this.listSubType.selectedIndex = 0;

		this.attr1 = this.getGObject("attr1").asRichTextField;
		this.attr2 = this.getGObject("attr2").asRichTextField;
		this.attr3 = this.getGObject("attr3").asRichTextField;
		this.attr4 = this.getGObject("attr4").asRichTextField;

		ControllerManager.pack.setHeightTab(0);

	}

	public hide():void {
		super.hide();

	}

	public updateAll(data?:any):void {
		let idx:number = 0;
		if(data && data.subType) {
			for(let i=0; i<this.listSubType.data.length; i++) {
				if(this.listSubType.data[i] == data.subType) {
					idx = i;
					break;
				}
			}
		}

		this.listSubType.selectedIndex = idx;
		this.listSubType.scrollToView(idx);
		this.onSubTypeListScroll();

		this.updateIllustrateExp();
		this.updateFight();

		this.updateIllustrateItems(this.listSubType.selectedData);
		this.listItem.scrollToView(0, false);
		
		this.updateSuitInfo();
		this.checkSubTypeListTips();
		this.checkDecomposeBtnEffect();

		if(data) {
			if(data.isDeco) {
				EventManager.dispatch(LocalEventEnum.TrainShowIllustrateDecomposeView);
			}
		}
	}

	public updateIllustrate():void {
		this.updateIllustrateExp();
		this.updateFight();
		this.updateIllustrateItems(this.listSubType.selectedData);
		this.updateSuitInfo();
		this.checkSubTypeListTips();
		this.checkDecomposeBtnEffect();
	}

	public onPackPropChange():void {
		this.updateIllustrateItems(this.listSubType.selectedData);
		this.checkSubTypeListTips();
		this.checkDecomposeBtnEffect();
	}

	private checkSubTypeListTips():void {
		let selIdx:number = this.listSubType.selectedIndex;
		this.listSubType.data = ConfigManager.cultivate.getSubTypes(ECultivateType.ECultivateTypeIllustrated);
		this.listSubType.selectedIndex = selIdx;

		//触发左右箭头的红点计算
		this.onSubTypeListScrollEnd();
	}

	private checkDecomposeBtnEffect():void {
		CommonUtils.setBtnTips(this.btn_decompose, CacheManager.cultivate.hasDecomposeItem());
		//App.DisplayUtils.addBtnEffect(this.btn_decompose, CacheManager.cultivate.hasDecomposeItem());
		//this.decomposeMC.visible = CacheManager.cultivate.hasDecomposeItem();
	} 

	private updateIllustrateExp():void {
		let exp:number = CacheManager.role.getMoney(EPriceUnit.EPriceUnitIllustratedExp);
		this._txtExp.text = App.StringUtils.substitude(LangTrain.L7, exp);
	}

	private updateFight(): void {
		// let info:any = CacheManager.cultivate.getCultivateInfoByRoleAndType(RoleIndexEnum.Role_index0, ECultivateType.ECultivateTypeIllustrated);
		// info = info?info.levelInfo:null;
		// let cultivateData: any;
		// let attrDict: any = {};
		// let dict: any;
		// let combat: number = 0;
		// for (let key in info) {
		// 	cultivateData = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeIllustrated},${key},${info[key]}`);//类型，位置，等级
		// 	dict = WeaponUtil.getAttrDict(cultivateData.attr);

		// 	let times:number = 1;
		// 	if(cultivateData.attrIndex == 1) {
		// 		times = CacheManager.role.roles.length;
		// 	}
		// 	combat += WeaponUtil.getCombat(dict) * times;
		// }

		let combat:number = 0;
		combat = CacheManager.cultivate.getCultivateFight(ECultivateType.ECultivateTypeIllustrated);
		this.fightPanel.updateValue(combat);
	}

	private updateIllustrateItems(subType:number):void {
		// this.listItem.data = ConfigManager.cultivate.getItems(ECultivateType.ECultivateTypeIllustrated, subType);
		this.listItem.setVirtual(ConfigManager.cultivate.getItems(ECultivateType.ECultivateTypeIllustrated, subType));
	}

	private updateSuitInfo():void {
		let subType = this.listSubType.selectedData;

		let curNum:number = CacheManager.cultivate.getCultivateActiveNum(0, ECultivateType.ECultivateTypeIllustrated, subType);
		let maxNum:number = this.listItem.data.length;
		this._txtSuitNum.text = App.StringUtils.substitude(LangTrain.L6, curNum, maxNum);

		this._loaderSuitname.load(URLManager.getModuleImgUrl("illustrate/name/name_" + subType + ".png", PackNameEnum.Train));

		let suitInfo:any = ConfigManager.cultivateSuit.getCurSuitInfoByCurNum(ECultivateType.ECultivateTypeIllustrated, subType, curNum);
		if(suitInfo) {
			this._txtSuitAttr.text = LangTrain.L15;// + suitInfo.effectDesc;
			this.setSuitAttr(suitInfo, 0x09c73d);
			this._txtSuitAttr.color = 0x09c73d;
		}
		else {
			let suitInfos:Array<any> = ConfigManager.cultivateSuit.select({"cultivateType":ECultivateType.ECultivateTypeIllustrated, "subtype":subType});
			if(suitInfos.length > 0) {
				this._txtSuitAttr.text = LangTrain.L15;// + suitInfos[0].effectDesc;
				this.setSuitAttr(suitInfos[0],  0x786b52);
			}
			this._txtSuitAttr.color = 0x786b52;
		}
	}

	private onSubTypeListSelect(e:fairygui.ItemEvent):void {
		var item:TrainIllustrateSubTypeItem = <TrainIllustrateSubTypeItem>e.itemObject;
		this.updateIllustrateItems(item.getData());
		this.updateSuitInfo();
		this.listItem.scrollToView(0, false);
	}

	private onBtnLeftClick():void {
		let idx:number = this.listSubType.list.getFirstChildInView();
		idx -= 5;
		idx < 0 ? idx = 0 : null;
		
		this.listSubType.scrollToView(idx, true, true);

		App.TimerManager.doDelay(800, this.onSubTypeListScrollEnd, this);
	}

	private onBtnRightClick():void {
		let idx:number = this.listSubType.list.getFirstChildInView();
		idx += 5;
		idx > this.listSubType.data.length-1 ? idx = this.listSubType.data.length-1 : null;
		
		this.listSubType.scrollToView(idx, true, true);

		App.TimerManager.doDelay(800, this.onSubTypeListScrollEnd, this);
	}

	private onSubTypeListScroll():void {
		let percX:number = this.listSubType.list.scrollPane.percX;

		if(percX == 0) {
			this.btnLeft.visible = false;
			this.btnRight.visible = true;
		}
		else if(percX == 1) {
			this.btnLeft.visible = true;
			this.btnRight.visible = false;
		}
		else {
			this.btnLeft.visible = true;
			this.btnRight.visible = true;
		}
	}

	private onSubTypeListScrollEnd():void {
		let leftTip:boolean = false;
		let rightTip:boolean = false;
		let firstIdx:number = this.listSubType.list.getFirstChildInView();
		let item:TrainIllustrateSubTypeItem;
		for(let i=0; i < this.listSubType.data.length; i++) {
			if(!this.listSubType.isChildInView(i)) {
				item = this.listSubType.list.getChildAt(this.listSubType.list.itemIndexToChildIndex(i)) as TrainIllustrateSubTypeItem;
				if(item && item.hasTip) {
					if(i <= firstIdx) {
						leftTip = true;
					}
					else {
						rightTip = true;
					}
				}
			}
		}
		CommonUtils.setBtnTips(this.btnLeft, leftTip);
		CommonUtils.setBtnTips(this.btnRight, rightTip,0,0,false);
	}

	private onItemListSelect(e:fairygui.ItemEvent):void {
		var item:TrainIllustrateItem = <TrainIllustrateItem>e.itemObject;
		EventManager.dispatch(LocalEventEnum.TrainShowIllustrateUpgrateView, item.getData());
	}

	private onDecomposeBtnClick():void {
		EventManager.dispatch(LocalEventEnum.TrainShowIllustrateDecomposeView);
	}

	private onXiangqingBtnClick():void {
		EventManager.dispatch(LocalEventEnum.TrainShowIllustrateSuitTip, this.listSubType.selectedData);
	}
	
	/**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

	private setSuitAttr(cfg : any, color : number) {
		let attrs = WeaponUtil.getAttrArray(cfg.attr);

		this.attr1.text = "";
		this.attr1.color = color;
		this.attr2.text = "";
		this.attr2.color = color;
		this.attr3.text = "";
		this.attr3.color = color;
		this.attr4.text = "";
		this.attr4.color = color;

		if(attrs.length >= 1) {
			this.attr1.text = GameDef.EJewelName[attrs[0][0]][0] + "：" + attrs[0][1];
		}
		if(attrs.length >= 2) {
			this.attr2.text = GameDef.EJewelName[attrs[1][0]][0] + "：" + attrs[1][1];
		}
		if(attrs.length >= 3) {
			this.attr3.text = GameDef.EJewelName[attrs[2][0]][0] + "：" + attrs[2][1];
		}
		if(attrs.length >= 4) {
			this.attr4.text = GameDef.EJewelName[attrs[3][0]][0] + "：" + attrs[3][1];
		}
	}

}