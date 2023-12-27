/**
 * 符文镶嵌
 */
class RuneInlayPanel extends BaseTabView {
	private runeTxt: fairygui.GRichTextField;
	private runeExpTxt: fairygui.GRichTextField;
	private iconLoader: GLoader;
	private propertyList: fairygui.GList;
	private runeInlayItems: Array<RuneInlayItem>;
	private stateController: fairygui.Controller;
	private upgradeGroup: fairygui.GGroup;
	private upgradeBtn: fairygui.GButton;
	private packBtn: fairygui.GButton;
	private detailsBtn: fairygui.GButton;
	private fightPanel: FightPanel;
	private selectData: any;
	// private needExp: number;

	private isCanUpgrade: boolean = false;

	private _roleIndex: number = RoleIndexEnum.Role_index0;

	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.runeTxt = this.getGObject("txt_rune").asRichTextField;
		this.runeExpTxt = this.getGObject("txt_runeexp").asRichTextField;
		this.iconLoader = this.getGObject("loader") as GLoader;
		this.propertyList = this.getGObject("list_property").asList;
		this.stateController = this.getController("c1");
		this.upgradeGroup = this.getGObject("group").asGroup;
		this.upgradeBtn = this.getGObject("btn_upgrade").asButton;
		this.packBtn = this.getGObject("btn_replace").asButton;
		this.detailsBtn = this.getGObject("btn_details").asButton;
		this.fightPanel = <FightPanel>this.getGObject("panel_fight");
		
		this.runeInlayItems = [];
		for (let i = 1; i < 9; i++) {
			let runeInlayItem: RuneInlayItem = <RuneInlayItem>this.getGObject("btn_rune" + i);
			this.runeInlayItems.push(runeInlayItem);
			runeInlayItem.addClickListener(this.clickInlayItem, this);
		}
		
		this.getGObject("btn_over").addClickListener(this.clickRunePandect, this);
		this.packBtn.addClickListener(this.clickRunePack, this);
		this.upgradeBtn.addClickListener(this.clickUpgrade, this);
		this.detailsBtn.addClickListener(this.clickDetailsBtn, this);

		GuideTargetManager.reg(GuideTargetName.RuneInlayPanelInlayItem1, this.runeInlayItems[0]);
		GuideTargetManager.reg(GuideTargetName.RuneInlayPanelUpgradeBtn, this.upgradeBtn);
	}

	public updateAll(): void {
		this.updateRuneInlay();
		this.selectRune();
	}

	public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
		this.updateAll();
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}

	/**装备升级后更新 */
	public updateRune(): void {
		this.updateRuneInlay();
		let inlayDatas: Array<any> = CacheManager.rune.getInlayData(this.roleIndex);
		this.updateAttr(inlayDatas[this.selectData["hole"] - 1]);
		App.SoundManager.playEffect(SoundName.Effect_QiangHuaChengGong);

	}

	/**更新符文镶嵌信息 */
	public updateRuneInlay(): void {
		let runeDatas: Array<any> = CacheManager.rune.getInlayData(this.roleIndex);
		let floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
		let nextFloorData: any = ConfigManager.mgRuneCopy.getOpenHoleInf(floor);
		for (let i = 0; i < runeDatas.length; i++) {
			if(nextFloorData && Number(nextFloorData.openHole) == runeDatas[i]["hole"]){
				runeDatas[i]["nextOpen"] = nextFloorData.floor;
			}else{
				runeDatas[i]["nextOpen"] = 0;
			}
			this.runeInlayItems[i].setData(runeDatas[i], this.roleIndex);
		}
		this.fightPanel.updateValue(WeaponUtil.getCombat(CacheManager.rune.getAttrDetailDict(this.roleIndex)));
		// if(runeDatas.length == 0){
		// 	this.updateAll();
		// }
	}

	public getRuneInlayItem(index: number): RuneInlayItem {
		return this.runeInlayItems[index];
	}

	private selectRune(): void{
		let selectRune: RuneInlayItem;
		for (let rune of this.runeInlayItems) {
			if(rune.getSelected() == 2){
				if(!selectRune){
					selectRune = rune;
				}else{
					if(this.isItemCanSelect(selectRune, rune)){
						selectRune = rune;
					}
				}
			}
		}
		if(selectRune){
			this.clickInlayItem({"target": selectRune});
		}else{
			this.stateController.selectedIndex = 0;
			this.clickInlayItem();
			selectRune = this.runeInlayItems[0];
			selectRune.selected = true;
			this.updateAttr(selectRune.getData());
		}
	}

	private isItemCanSelect(selectItem: RuneInlayItem, compareItem: RuneInlayItem): boolean{
		let selectInfo: any = selectItem.getData();
		let compareInfo: any = compareItem.getData();
		if(CacheManager.rune.canUpgradeRune(selectInfo) && !CacheManager.rune.canUpgradeRune(compareInfo)){
			return false;
		}else if(!CacheManager.rune.canUpgradeRune(selectInfo) && CacheManager.rune.canUpgradeRune(compareInfo)){
			return true;
		}else{
			if(selectInfo.level < compareInfo.level){
				return false;
			}else if(selectInfo.level > compareInfo.level){
				return true;
			}else{
				let selectItemData: ItemData = new ItemData(selectInfo.item);
				let compareItemData: ItemData = new ItemData(compareInfo.item);
				if(selectItemData.getColor() > compareItemData.getColor()){
					return false;
				}else if(selectItemData.getColor() < compareItemData.getColor()){
					return true;
				}else{
					if(selectItemData.getType() < compareItemData.getType()){
						return false;
					}else if(selectItemData.getType() > compareItemData.getType()){
						return true;
					}
				}
			}
		}
		return false;
	}

	/**点击符文镶嵌孔位 */
	private clickInlayItem(e: any = null): void {
		for (let rune of this.runeInlayItems) {
			rune.selected = false;
		}
		if (e) {
			e.target.selected = true;
			this.updateAttr(e.target.getData());
			if(e.target.getSelected() == 2){
				this.stateController.selectedIndex = 1;
			}else if(e.target.getSelected() == 1){
				this.stateController.selectedIndex = 0;
				this.clickRunePack();
			}else{
				this.stateController.selectedIndex = 0;
			}
		}
	}

	/**点击符文总览 */
	private clickRunePandect(): void {
		EventManager.dispatch(UIEventEnum.RunePandectOpen);
	}

	/**点击符文背包 */
	private clickRunePack(): void {
		EventManager.dispatch(UIEventEnum.RunePackOpen, this.selectData, this.roleIndex);
	}

	/**点击符文升级 */
	private clickUpgrade(): void {
		if (this.isCanUpgrade) {
			ProxyManager.rune.upgradeRune(this.selectData["hole"], this.roleIndex);
		}else{
			Tip.showOptTip("符文经验不足");
		}
	}

	/**点击符文详情 */
	private clickDetailsBtn(): void{
		EventManager.dispatch(UIEventEnum.RuneDetailOpen, this.roleIndex);
	}

	private updateAttr(runeInaly: any): void {
	/**更新镶嵌符文等级属性加成和升级经验 */
		this.selectData = runeInaly;
		CacheManager.rune.setSelected(runeInaly);
		if (runeInaly["item"]) {
			let itemData: ItemData = new ItemData(runeInaly["item"]);
			let attrDict: any = CacheManager.rune.attrDict;
			let nextattrDict: any = CacheManager.rune.nextAttrDict;
			let needExp: number = CacheManager.rune.needExp;
			// this.needExp = CacheManager.runeInlay.needExp;
			this.isCanUpgrade = MoneyUtil.checkEnough(EPriceUnit.EPriceUnitRuneExp, needExp, false);
			this.upgradeGroup.visible = nextattrDict ? true : false;
			this.propertyList.removeChildrenToPool();
			for (let key in attrDict) {
				this.runeTxt.text = itemData.getColorString(`${itemData.getName()} Lv.${runeInaly["level"]}`);

				let item: fairygui.GComponent = <fairygui.GComponent>this.propertyList.addItemFromPool();
				let typeTxt: fairygui.GTextField = item.getChild("txt_type").asTextField;
				let typeValueTxt: fairygui.GTextField = item.getChild("txt_typeSum").asTextField;
				let typeIncreaseNameTxt: fairygui.GTextField = item.getChild("txt_typeIncreaseName").asTextField;
				let typeIncreaseTxt: fairygui.GTextField = item.getChild("txt_typeIncrease").asTextField;
				let up: fairygui.GImage = item.getChild("up").asImage;
				typeTxt.text = GameDef.EJewelName[key][0] + " ";
				typeIncreaseNameTxt.text = GameDef.EJewelName[key][0] + " ";
				if(WeaponUtil.isPercentageAttr(Number(key))){
					typeValueTxt.text = `+${attrDict[key]/100}%`;
					typeIncreaseTxt.text = nextattrDict ? `+${nextattrDict[key]/100}%` : "";
				}else{
					typeValueTxt.text = `+${attrDict[key]}`;
					typeIncreaseTxt.text = nextattrDict ? `+${nextattrDict[key] }` : "";
				}
				typeIncreaseNameTxt.visible = nextattrDict ? true : false;
				up.visible = nextattrDict ? true : false;
			}
			let color: string = this.isCanUpgrade ? Color.GreenCommon : Color.RedCommon;
			this.runeExpTxt.text = `<font color=${color}>${CacheManager.role.getMoney(EPriceUnit.EPriceUnitRuneExp)}/${needExp}</font>`;
			this.iconLoader.load(itemData.getIconRes());
			this.stateController.selectedIndex = 1;
			CommonUtils.setBtnTips(this.upgradeBtn, CacheManager.rune.canUpgradeRune(runeInaly));
			CommonUtils.setBtnTips(this.packBtn, CacheManager.rune.isHasHigtRune(runeInaly));
		}else{
			this.stateController.selectedIndex = 0;
		}

		App.DisplayUtils.grayButton(this.upgradeBtn, !this.upgradeGroup.visible, !this.upgradeGroup.visible);
	}
}