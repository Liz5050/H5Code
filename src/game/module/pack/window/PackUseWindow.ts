class PackUseWindow extends BaseWindow {
	private c1: fairygui.Controller;
	private itemData: ItemData;
	private roleIndex: number = 0;

	public constructor() {
		super(PackNameEnum.Pack, "WindowUse");
	}

	private numberInput: NumberInput;
	private uid: string;
	private itemNameTxt: fairygui.GTextField;
	private txtUse: fairygui.GTextField;
	private countTxt: fairygui.GRichTextField;
	private levelTxt: fairygui.GRichTextField;
	private desTxt: fairygui.GRichTextField;
	private useBtn: fairygui.GButton;
	private baseItem: BaseItem;

	private isHasUseNum:boolean = true; //是否还有使用次数

	public initOptUI() {
		this.c1 = this.getController("c1");
		this.baseItem = <BaseItem>this.getGObject("baseItem_prop");
		this.baseItem.touchable = false;
		this.baseItem.isShowName = false;
		this.numberInput = this.getGObject("number_input") as NumberInput;
		this.numberInput.showExBtn = true;
		this.itemNameTxt = this.getGObject("txt_name").asTextField;
		this.txtUse = this.getGObject("txt_use").asTextField;
		this.countTxt = this.getGObject("txt_count").asRichTextField;
		this.levelTxt = this.getGObject("txt_level").asRichTextField;
		this.desTxt = this.getGObject("txt_des").asRichTextField;
		this.useBtn = this.getGObject("btn_use").asButton;
		this.useBtn.addClickListener(this.useItem, this);
	}

	public updateAll(data: any = null) {
		this.itemData = data.itemData;
		this.baseItem.itemData = this.itemData;
		if (data.roleIndex != null) {
			this.roleIndex = data.roleIndex;
		}
		this.uid = this.itemData.getUid();
		this.itemNameTxt.text = this.itemData.getName(true);
		this.countTxt.text = "数量：" + HtmlUtil.html(this.itemData.getItemAmount() + "", Color.Color_8);
		this.levelTxt.text = "等级：" + HtmlUtil.html(this.itemData.getLevel() + "", Color.Color_8);
		this.useBtn.text = this.buttonName;

		let usage: string = this.itemData.getUsageDesc();
		usage = usage != undefined ? "\n\n" + HtmlUtil.br(this.itemData.getUsageDesc()) : "";
		if(this.itemData.getType() == EProp.EPropDynamicRoleStateProp){
			let roleExp: number = ConfigManager.mgDynamicRoleStateProp.getRoleExp(this.itemData.getCode(), CacheManager.role.getRoleState());
			this.desTxt.text = App.StringUtils.substitude(this.itemData.getDesc(), roleExp) + usage;
		}else{
			this.desTxt.text = this.itemData.getDesc() + usage;
		}
		this.desTxt["renderNow"]();
		let itemInfo: any = this.itemData.getItemInfo();
		if (itemInfo.useFlag == 1) {
			//只能单个使用
			this.c1.selectedIndex = 1;
			this.numberInput.max = 1;
			this.numberInput.value = 1;
		} else {
			this.c1.selectedIndex = 0;//可批量使用
			let totalNum: number = this.itemData.getItemAmount();
			this.numberInput.max = totalNum;
			let defaultNum: number = itemInfo.defaultUseNum;
			if (defaultNum > 0) {
				this.numberInput.value = Math.min(defaultNum, totalNum);
			}
			else {
				this.numberInput.value = this.itemData.getItemAmount();
			}
		}
		if(itemInfo.dayUseNum){ //配置了限制次数
			this.txtUse.visible = true;
			let ln:number = CacheManager.pack.getItemLeftUseCount(this.itemData.getCode());
			this.isHasUseNum = ln>0;
			let clr:any = this.isHasUseNum?Color.Color_6:Color.Color_4;
			this.txtUse.text = App.StringUtils.substitude(LangPack.L6,HtmlUtil.html(ln+"/"+itemInfo.dayUseNum,clr));
		}else{
			this.txtUse.visible = false;
			this.isHasUseNum = true;
		}
	}

	private useItem(): void {
		if(!this.isHasUseNum){
			Tip.showLeftTip(LangPack.L7);
			this.hide();
			return;
		}
		if (ItemsUtil.isModifyNameItem(this.itemData)) {
			EventManager.dispatch(LocalEventEnum.PackUse, this.itemData);
		} else if (ItemsUtil.isRechargeGiftBag(this.itemData)) {			
			if (!CacheManager.recharge.isRechargedAny) {
				HomeUtil.openRecharge(ViewIndex.One);
				Tip.showTip("充值任意金额才能开启礼包");
			} else {
				this.doUse();
			}
		} else if (ItemsUtil.isCheatsItem(this.itemData)) {
			HomeUtil.open(ModuleEnum.Skill, false, { tabType: PanelTabType.SkillCheats, addItem: this.itemData });
		} else if (ItemsUtil.isRuneZero(this.itemData)) {
			let sendUids: Array<string> = [this.itemData.getUid()];
			let sendAmounts: Array<number> = [this.numberInput.value];
			EventManager.dispatch(LocalEventEnum.RuneDecompose, sendUids, sendAmounts);
		} else if (ItemsUtil.isWingUpItem(this.itemData) && !this.itemData.isExpire) {
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.Wing }, ViewIndex.Two);
		} else if (ItemsUtil.isDragonScaleUpItem(this.itemData)) {
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.MagicWare, { "tabType": PanelTabType.DragonSoul }, ViewIndex.Two);
		} else if (ItemsUtil.isPetUpItem(this.itemData)) {
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Shape, { "tabType": PanelTabType.Pet }, ViewIndex.Two);
		}  else if (ItemsUtil.isLawUpItem(this.itemData)) {
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Forge, { "tabType": PanelTabType.MagicLaw }, ViewIndex.Two);
		} else if(ItemsUtil.isQiongCangToken(this.itemData)) {
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.QiongCang, { "tabType":PanelTabType.QiongCangBoss }, ViewIndex.Two);
		} else {
			this.doUse();
		}
		this.hide();
	}

	private doUse(): void {
		let value: number = this.numberInput.value;
		let values: Array<string> = [];
		if (ItemsUtil.isWingUpLevelItem(this.itemData)) {//直升丹
			values = [this.roleIndex.toString()];
		}
		if(this.itemData.getType() == EProp.EPropPriceUnitCard) {
			let unit:number = this.itemData.getEffect();
			let isMoney:boolean = unit == EPriceUnit.EPriceUnitCoinBind || unit == EPriceUnit.EPriceUnitGold || unit == EPriceUnit.EPriceUnitGoldBind;
			if(isMoney) {
				App.SoundManager.playEffect(SoundName.Effect_RongLian);
			}
		}
		ProxyManager.pack.useItem(this.uid, value, values);
	}

	/**
	 * 获取按钮名称
	 */
	private get buttonName(): string {
		let name: string = "使用";
		if (ItemsUtil.isRechargeGiftBag(this.itemData)) {
			name = "1元宝";
		}
		return name;
	}

	public onShow(param: any = null):void{
		super.onShow(param);		
		if(ItemsUtil.isRechargeGiftBag(this.itemData)){
			CacheManager.pack.isRechargeGiftBag = true;
			EventManager.dispatch(LocalEventEnum.PackCheckPropTips);  
		}		
	}
}