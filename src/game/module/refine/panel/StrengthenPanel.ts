/**
 * 强化
 */
class StrengthenPanel extends BaseTabPanel {
	private typeController:fairygui.Controller;
	private current: BaseItem;
	private next: BaseItem;
	private costItem: BaseItem;
	private oneBtn: fairygui.GButton;
	private oneKeyBtn: fairygui.GButton;
	private luckyBar: fairygui.GProgressBar;
	private coinNumTxt: fairygui.GTextField;

	//属性
	private attrList: fairygui.GList;

	//动效
	private tCrit: fairygui.Transition;
	private tAddLucky: fairygui.Transition;
	private tSuccess: fairygui.Transition;
	private successMC: fairygui.GMovieClip;
	private explodeMC: fairygui.GMovieClip;
	private circleMC: fairygui.GMovieClip;

	private critTxt: fairygui.GTextField;
	private luckyAddTxt: fairygui.GTextField;

	private roleCache: RoleCache;
	private equipConfs: Array<any>;
	private posEquipItems: any;//按位置装备项
	private typeEquipItems: any;//按类型装备项
	private costItemData: ItemData;
	private selectedItemData: ItemData;//当前选择的装备
	private cNames: Array<string> = ["mc_explode", "mc_success", "mc_circle", "txt_crit", "txt_luckyAdd"];
	private addAttrTips:Array<string>;//升级加成属性

	private refreshPanel: RefreshPanel;

	private refreshBtn: fairygui.GButton;
	private strengthenBtn: fairygui.GButton;

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}

	public initOptUI(): void {
		this.typeController = this.getController("c1");
		this.typeController.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTypeTabChanged, this);
		this.refreshPanel = new RefreshPanel(this.getGObject("panle_polish").asCom, this.typeController, 1);
		this.roleCache = CacheManager.role;
		this.equipConfs = [
			{ "name": "baseItem_gloves", "pos": EDressPos.EDressPosGloves, "type": EEquip.EEquipGloves },//头盔
			{ "name": "baseItem_clothes", "pos": EDressPos.EDressPosClothes, "type": EEquip.EEquipClothes },//衣服
			{ "name": "baseItem_belt", "pos": EDressPos.EDressPosBelt, "type": EEquip.EEquipBelt },//护腿
			{ "name": "baseItem_shoulder", "pos": EDressPos.EDressPosShoulder, "type": EEquip.EEquipShoulder },//护手
			{ "name": "baseItem_shoes", "pos": EDressPos.EDressPosShoes, "type": EEquip.EEquipShoes },//鞋
			{ "name": "baseItem_weapon", "pos": EDressPos.EDressPosWeapon, "type": EEquip.EEquipWeapon },//武器
			// { "name": "baseItem_spirit", "pos": EDressPos.EDressPosSpirit, "type": EEquip.EEquipSpirit },//守护
			{ "name": "baseItem_jewelry", "pos": EDressPos.EDressPosJewelry, "type": EEquip.EEquipJewelry },//项链
			{ "name": "baseItem_wristlet", "pos": EDressPos.EDressPosWristlet, "type": EEquip.EEquipWristlet },//仙符
			{ "name": "baseItem_helmet", "pos": EDressPos.EDressPosHelmet, "type": EEquip.EEquipHelmet },//手镯
			{ "name": "baseItem_ring", "pos": EDressPos.EDressPosRing, "type": EEquip.EEquipRing },//戒指
			// { "name": "baseItem_heartLock", "pos": EDressPos.EDressPosHeartLock, "type": EEquip.EEquipHeartLock }//同心锁
		];

		//装备项
		this.posEquipItems = {};
		this.typeEquipItems = {};
		for (let c of this.equipConfs) {
			let baseItem: BaseItem = <BaseItem>this.getGObject(c["name"]);
			baseItem.bgVisible = false;
			this.posEquipItems[c["pos"]] = baseItem;
			this.typeEquipItems[c["type"]] = baseItem;
			baseItem.enableToolTip = false;
			baseItem.addClickListener(this.clickBaseItem, this);
		}

		this.current = <BaseItem>this.getGObject("baseItem_before");
		this.next = <BaseItem>this.getGObject("baseItem_after");
		this.costItem = <BaseItem>this.getGObject("baseItem_icon");
		this.coinNumTxt = this.getGObject("txt_useCion").asTextField;

		this.luckyBar = <fairygui.GProgressBar>this.getGObject("progressBar_lucky")
		this.luckyBar.value = 0;
		this.luckyBar.max = 100;
		this.oneBtn = <fairygui.GButton>this.getGObject("btn_strengthen");
		this.oneKeyBtn = <fairygui.GButton>this.getGObject("btn_automaticStrengthen");

		//属性文本
		this.attrList = this.getGObject("list_attr").asList;

		this.tCrit = this.getTransition("t_crit");
		this.tAddLucky = this.getTransition("t_addLucky");
		this.tSuccess = this.getTransition("t_success");
		this.successMC = this.getGObject("mc_success").asMovieClip;
		this.explodeMC = this.getGObject("mc_explode").asMovieClip;
		this.circleMC = this.getGObject("mc_circle").asMovieClip;
			

		this.critTxt = this.getGObject("txt_crit").asTextField;
		this.luckyAddTxt = this.getGObject("txt_luckyAdd").asTextField;

		this.oneBtn.addClickListener(this.clickOne, this);
		this.oneKeyBtn.addClickListener(this.clickOneKey, this);

		this.refreshBtn = this.getGObject("btn_succinct").asButton;
		this.strengthenBtn = this.getGObject("btn_strengthenTop").asButton;
		
	}

	public updateAll(): void {
		this.typeController.selectedIndex = 0;
		this.updateEquips();
		this.autoSelectEquip();
		this.enableOneKey(false);
		this.hideMC();
		this.updateRefreshBtn();
		CommonUtils.setBtnTips(this.refreshBtn, CacheManager.refine.isCanRefreshFree());
		CommonUtils.setBtnTips(this.strengthenBtn, CacheManager.refine.checkStrengthen());
	}

	/**更新洗炼某一项 */
	public updateRefreshItem(itemData: ItemData): void{
		this.refreshPanel.updateRefreshItem(itemData);
	}

	/**更新洗炼次数后，更新红点推送 */
	public updateRefreshBtnTip(): void{
		CommonUtils.setBtnTips(this.refreshBtn, CacheManager.refine.isCanRefreshFree());
	}

	/**更新洗炼石 */
	public updateRefreshStone(): void{
		if(this.refreshPanel){
			this.refreshPanel.updateRefreshStone();
		}
	}

	/**强化一次 */
	public clickOne(): void {
		let itemData: ItemData = this.current.itemData;
		if (itemData) {
			if (CacheManager.refine.isCanStrengthen(itemData)) {
				EventManager.dispatch(LocalEventEnum.Strength, { "uid": itemData.getUid(), "autoBuy": false });
			}
		}else{
			Tip.showTip("请穿戴装备后再进行强化");
		}
	}

	/**
	 * 根据强化结果更新
	 */
	public updateByStrengthenReuslt(data: any): void {
		let itemData: ItemData = CacheManager.pack.rolePackCache.getItemByUid(data.resultPlayerItem.uid_S);
		this.selectByItemData(itemData);
		//成功处理  addLucky、crit、resultPlayerItem
		let success: boolean = data.result;
		if (success) {
			this.successMC.frame = 0;
			this.explodeMC.frame = 0;
			this.circleMC.frame = 0;
			this.tSuccess.play();
		}

		if (data.crit > 1) {
			this.getGObject("txt_crit").text = "BX" + data.crit;
			this.tCrit.play();
		}

		let lucky: number = data.addLucky * data.crit;
		this.luckyAddTxt.text = "+" + lucky.toString();
		this.tAddLucky.play();
		CommonUtils.setBtnTips(this.strengthenBtn, CacheManager.refine.checkStrengthen());
		this.updateEquips();
	}

	/**
	 * 启用一键强化
	 */
	public enableOneKey(enable: boolean): void {
		CacheManager.refine.isOneKeyStrengthening = enable;
		if (enable) {
			this.oneKeyBtn.text = "停止";
			this.clickOne();
		} else {
			this.oneKeyBtn.text = "自动强化";
		}
	}

	/**
	 * 更新所有装备
	 */
	private updateEquips(): void {
		for (let type in this.typeEquipItems) {
			let baseItem: BaseItem = this.typeEquipItems[type];
			let data: Array<ItemData> = CacheManager.pack.rolePackCache.getByCT(ECategory.ECategoryEquip, Number(type));
			if (data.length > 0) {
				baseItem.itemData = data[0];
			} else {
				baseItem.itemData = null;
				this.clickBaseItem({ "target": baseItem });
			}
			let point: egret.Point = new egret.Point();
			point.setTo(58, 0);
			CommonUtils.setBtnTips(baseItem, CacheManager.refine.isCanStrengthen(baseItem.itemData, false), 58, 0,false);
		}
	}

	/**
	 * 更新指定位置上的装备
	 */
	private updateEquipAtPos(pos: number, itemData: ItemData): void {
		(this.posEquipItems[pos] as BaseItem).itemData = itemData;
	}

	/**点击装备项 */
	private clickBaseItem(e: any): void {
		let baseItem: BaseItem = <BaseItem>e.target;
		let itemData: ItemData = baseItem.itemData;
		if (itemData) {
			this.selectedBaseItem(baseItem);
			this.updateCurrent(itemData);
			this.updateNext(itemData);
			//切换选中其他装备，停止自动强化
			if (this.selectedItemData != null && this.selectedItemData.getUid() != itemData.getUid() && CacheManager.refine.isOneKeyStrengthening) {
				this.enableOneKey(false);
			}
		} else {
			baseItem.selected = false;
		}
		this.selectedItemData = itemData;
	}

	/**
	 * 更新当前强化信息
	 */
	private updateCurrent(itemData: ItemData): void {
		if (itemData) {
			this.current.itemData = itemData;
			let strengthLevel: number = itemData.getStrengthenLevel();
			let conf: any = ConfigManager.mgStrengthen.getByTypeAndLevel(itemData.getType(), strengthLevel);
			// this.currentLevelTxt.text = "+" + strengthLevel;
			if (this.costItemData == null) {
				this.costItemData = new ItemData(conf.useItemCode);
			}
			this.costItem.itemData = this.costItemData;
			this.coinNumTxt.text = conf.useCoin + "";
			if (itemData.isStrengthenMax()) {
				this.luckyBar.max = 100;
				this.luckyBar.value = 100;
				(this.luckyBar['_titleObject'] as fairygui.GTextField).text = `MAX(超出${itemData.getLucky()})`;
			} else {
				this.luckyBar.max = conf.luckyMin;
				this.luckyBar.value = itemData.getLucky();
			}
			this.updateNextAttr(itemData);
			//显示流光特效
			this.getGObject("mc_itemWeapon").visible = true;
			this.getGObject("mc_itemCion").visible = true;
		} else {
			this.current.itemData = null;
			// this.currentLevelTxt.text = "";
			this.costItem.itemData = null;
			this.coinNumTxt.text = "";
			this.luckyBar.value = 0;
			this.updateNextAttr(null);
		}
	}

	/**
	 * @param itemData 当前等级数据
	 */
	private updateNext(itemData: ItemData): void {
		if (itemData != null) {
			var nextLevel: number = 0;
			if (itemData.isStrengthenMax()) {
				nextLevel = itemData.getStrengthenLevel();
			} else {
				nextLevel = itemData.getStrengthenLevel() + 1;
			}
			// this.nextLevelTxt.text = "+" + nextLevel.toString();
			var nextItemData: ItemData = new ItemData(itemData.data);
			nextItemData.getItemExtInfo().strengthen = nextLevel;
			this.next.itemData = nextItemData;
		}else{
			this.next.itemData = null;
		}
	}

	/**
	 * 更新下一级属性值
	 * @param itemData 当前装备信息
	 * @param attrs 下一级强化加成 1,0#3,0#
	 */
	private updateNextAttr(itemData: ItemData): void {
		this.attrList.removeChildrenToPool();
		if (itemData != null) {
			let strengthLevel: number = itemData.getStrengthenLevel();
			let conf: any = ConfigManager.mgStrengthen.getByTypeAndLevel(itemData.getType(), strengthLevel);
			let nextConf: any = ConfigManager.mgStrengthen.getByTypeAndLevel(itemData.getType(), strengthLevel + 1);
			if (nextConf == null) {
				//没有下一级
				nextConf = conf;
			}
			//加成属性
			let currentAddAttrDict: any = WeaponUtil.getAttrDict(conf.attrList);
			let nextAddAttrDict: any = WeaponUtil.getAttrDict(nextConf.attrList);
			//基础属性
			let baseAttrDict: any = WeaponUtil.getBaseAttrDict(itemData);

			this.addAttrTips = [];

			for (let attrType in baseAttrDict) {
				var item: fairygui.GComponent = <fairygui.GComponent>this.attrList.addItemFromPool();
				let nameTxt: fairygui.GTextField = item.getChild("txt_name").asTextField;
				let valueTxt: fairygui.GTextField = item.getChild("txt_value").asTextField;
				let addValueTxt: fairygui.GTextField = item.getChild("txt_addValue").asTextField;
				let name: string = GameDef.EJewelName[attrType][0];
				var currentValue: number = baseAttrDict[attrType];
				var currentAddValue: number = 0;
				if (currentAddAttrDict[attrType]) {//当前强化加成值存在，0级没有对应的加成值
					currentAddValue = currentAddAttrDict[attrType];
				}
				let value: number = currentValue + currentAddValue;//当前装备的基础值+当前装备强化等级对应的加成值
				let addValue: number = nextAddAttrDict[attrType] - currentAddValue;
				nameTxt.text = name + ":";
				valueTxt.text = value.toString();
				addValueTxt.text = "+" + addValue;

				this.addAttrTips.push(`${name}+${addValue}`);
			}
		}
	}

	/**选中一个装备 */
	private selectedBaseItem(baseItem: BaseItem): void {
		Log.trace(Log.UI, typeof (this.posEquipItems));
		for (let i in this.posEquipItems) {
			let tmp: BaseItem = <BaseItem>this.posEquipItems[i];
			tmp.selected = baseItem == tmp
		}
	}

	/**一键强化 */
	private clickOneKey(): void {
		if (CacheManager.refine.isOneKeyStrengthening) {
			this.enableOneKey(false);
		} else {
			let itemData: ItemData = this.current.itemData;
			if (itemData) {
				if (CacheManager.refine.isCanStrengthen(itemData)) {
					this.enableOneKey(true);
				}
			}else{
				Tip.showTip("请穿戴装备后再进行强化");
			}
		}
	}

	/**
	 * 自动选择合适的装备
	 * 规则：可强化等级倒序->铜钱不足以强化->已达到最大强化等级
	 */
	private autoSelectEquip(): void {
		var rule: Array<any> = [];
		var data: Array<ItemData> = CacheManager.refine.getStrengthenEquips();
		data = data.sort(this.compareFunction);
		if (data.length > 0) {
			let itemData: ItemData = data[0];
			this.selectByItemData(itemData);
		}else{
			// this.current.itemData = null;
			// this.costItem.itemData = null;
			this.coinNumTxt.text = "";
			this.updateCurrent(null);
			this.updateNext(null);
			this.getGObject("mc_itemWeapon").visible = false;
			this.getGObject("mc_itemCion").visible = false;
		}
	}

	/**
	 * 比较
	 * @returns < 0 a在b前
	 */
	private compareFunction(a: ItemData, b: ItemData): number {
		let cache: RefineCache = CacheManager.refine;
		if (cache.isCanStrengthen(a, false) && !cache.isCanStrengthen(b, false)) {
			return -1;
		} else if (!cache.isCanStrengthen(a, false) && cache.isCanStrengthen(b, false)) {
			return 1;
		} else {
			//比较等级
			if (a.getStrengthenLevel() < b.getStrengthenLevel()) {
				return -1;
			} else if (a.getStrengthenLevel() > b.getStrengthenLevel()) {
				return 1;
			} else {
				return 0;
			}
		}
	}

	private selectByItemData(itemData: ItemData): void {
		if (itemData != null) {
			let baseItem: BaseItem = this.typeEquipItems[itemData.getType()];
			baseItem.itemData = itemData;
			this.clickBaseItem({ "target": baseItem });
		}
	}

	/**
	 * 隐藏所有动效包含的组件。
	 * 主要处理播放特效的过程中，关闭了界面导致动效没正常完成的时候，特效一直播放的问题。
	 */
	private hideMC(): void {
		for (let name of this.cNames) {
			this.getGObject(name).visible = false;
		}
	}

	/**
	 * 显示属性加成Tip
	 */
	private showAttrAddTip(): void {
		let x: number = -1;
		let y: number = this.next.y + 100;
		for (let tip of this.addAttrTips) {
			Tip.showRollTip(`<font color='#00ff00'>${tip}</font>`, x, y);
		}
	}

	/**
     * tab标签改变
     */
    private onTypeTabChanged(e: any): void {
		// if(this.typeController.selectedIndex == 1){
		// 	this.typeController.selectedIndex = 0;
		// 	Tip.showTip("功能未开放");
		// }
		// let tips: string = ConfigManager.mgOpen.isOpen(77);//三转开启
        // if(tips == "0"){
        //     // EventManager.dispatch(UIEventEnum.ModuleToggle, ModuleEnum.Rune);
		// 	return;
        // }
        // else{
        //     Tip.showTip(tips);
		// 	this.typeController.selectedIndex = 0;
        // }
    }

	private updateRefreshBtn(): void{
		this.refreshBtn.visible = false;
		// if(ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.)){//三转开启
		// 	this.refreshBtn.visible = true;
		// }
		if(CacheManager.role.playerLevelWhen3State != 0){//完成三转开启
			this.refreshBtn.visible = true;
		}
	}
}