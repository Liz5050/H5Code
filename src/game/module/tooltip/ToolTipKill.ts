/**
 * 必杀tips
 */

class ToolTipKill extends ToolTipBase {
	private nameTxt: fairygui.GTextField;
	private posTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private attrTxt: fairygui.GRichTextField;
	private specialAttrTxt: fairygui.GTextField;
	private fightPanel: FightPanel;

	private needTypeTxt: fairygui.GTextField;
	private needTxt: fairygui.GRichTextField;
	private actBtn: fairygui.GButton;

	private nextNameTxt: fairygui.GTextField;
	private nextAttrTxt: fairygui.GRichTextField;
	private nextSpecialAttrTxt: fairygui.GTextField;
	private nextFightPanel: FightPanel;

	private roadBtn1: fairygui.GButton;
	private roadBtn2: fairygui.GButton;

	private controller: fairygui.Controller;
	private baseItem: BaseItem;
	private itemData: ItemData;
	private killData: any;
	private actOrUpData: any;

	private toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;

	public constructor() {
		super(PackNameEnum.Common, "ToolTipKill");
	}

	public initUI(): void {
		super.initUI();
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.posTxt = this.getChild("txt_pos").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.attrTxt = this.getChild("txt_attr").asRichTextField;
		this.specialAttrTxt = this.getChild("txt_specialAttr").asTextField;
		this.fightPanel = <FightPanel>this.getGObject("panel_fight");

		this.needTypeTxt = this.getChild("txt_needType").asTextField;
		this.needTxt = this.getChild("txt_need").asRichTextField;
		this.actBtn = this.getChild("btn_act").asButton;
		this.actBtn.addClickListener(this.clickActOrUp, this);

		this.nextNameTxt = this.getChild("txt_nextName").asTextField;
		this.nextAttrTxt = this.getChild("txt_nextAttr").asRichTextField;
		this.nextSpecialAttrTxt = this.getChild("txt_nextSpecialAttr").asTextField;
		this.nextFightPanel = <FightPanel>this.getGObject("panel_nextFight");

		this.roadBtn1 = this.getChild("btn_road1").asButton;
		this.roadBtn1.addClickListener(this.clickRoadBtn, this);

		this.roadBtn2 = this.getChild("btn_road2").asButton;
		this.roadBtn2.addClickListener(this.clickRoadBtn2, this);

		this.controller = this.getController("c1");
		this.baseItem = <BaseItem>this.getChild("baseItem");
		this.baseItem.isShowName = false;
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);
		this.toolTipSource = toolTipData.source;
		if (toolTipData) {
			let datas: Array<any>;
			let attrDict: any;
			this.itemData = <ItemData>toolTipData.data;
			if (ItemsUtil.isTrueItemData(this.itemData)) {
				this.controller.selectedIndex = 0;
				this.nameTxt.text = this.itemData.getName(false);
				this.nameTxt.color = Color.ItemColorHex[this.itemData.getColor()];
				datas = ConfigManager.cultivate.select({ "itemCode": this.itemData.getCode() });
				if (datas.length > 0) {
					this.killData = datas[0];
					attrDict = WeaponUtil.getAttrDict(this.killData.attr);
					this.posTxt.text = this.killData.posName;
					this.levelTxt.text = this.killData.posDesc;
					// this.fightPanel.updateValue(WeaponUtil.getCombat(attrDict));
					this.fightPanel.updateValue(WeaponUtil.getKillCombat(this.itemData, attrDict));
					this.attrTxt.text = "";
					for (let key in attrDict) {
						this.attrTxt.text += `${GameDef.EJewelName[key][0]}：${HtmlUtil.html(attrDict[key], Color.Color_8)}\n`;
					}
					this.attrTxt.text = this.attrTxt.text.slice(0, this.attrTxt.text.length - 1);
					this.specialAttrTxt.text = this.killData.effectDesc;
				}
				if (toolTipData.extData) {
					let extData: any = toolTipData.extData;
					// let nextChipData: any;
					let nextItemData: ItemData;
					let nextAttrDict: any;
					let count: number = 0;
					let color: string;
					if (extData["onActive"]) {
						this.needTypeTxt.text = "激活需要";
						this.actBtn.text = "激 活";
						this.actOrUpData = this.killData;
						count = CacheManager.pack.backPackCache.getItemCountByCode2(this.itemData.getCode());
						color = count > 0 ? Color.GreenCommon : Color.RedCommon;
						this.needTxt.text = `${this.itemData.getName(false)}<font color = '#f2e1c0'>x${this.actOrUpData.itemNum}</font><font color = ${color}>(拥有${count})</font>`;
						this.controller.selectedIndex = count > 0 ? 1 : 2;
					} else if (extData["onUpgrade"]) {
						this.actOrUpData = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${this.killData.position},${this.killData.level + 1}`);//类型，位置，等级
						if (this.actOrUpData) {
							nextItemData = new ItemData(this.actOrUpData.itemCode);
							if (ItemsUtil.isTrueItemData(nextItemData)) {
								this.nextNameTxt.text = `下级(${nextItemData.getName(false)})`;
								this.nextNameTxt.color = Color.ItemColorHex[nextItemData.getColor()];
								nextAttrDict = WeaponUtil.getAttrDict(this.actOrUpData.attr);
								// this.nextFightPanel.updateValue(WeaponUtil.getCombat(nextAttrDict));
								this.nextFightPanel.updateValue(WeaponUtil.getKillCombat(nextItemData, nextAttrDict));
								this.nextAttrTxt.text = "";
								for (let key in nextAttrDict) {
									this.nextAttrTxt.text += `${GameDef.EJewelName[key][0]}：${HtmlUtil.html(nextAttrDict[key], Color.Color_8)}\n`;
								}
								this.nextAttrTxt.text = this.nextAttrTxt.text.slice(0, this.nextAttrTxt.text.length - 1);
								this.nextSpecialAttrTxt.text = this.actOrUpData.effectDesc;

								this.needTypeTxt.text = "升级需要";
								this.actBtn.text = "升 级";
								count = CacheManager.pack.backPackCache.getItemCountByCode2(nextItemData.getCode());
								color = count > 0 ? Color.GreenCommon : Color.RedCommon;
								this.needTxt.text = `<font color = ${Color.ItemColor[nextItemData.getColor()]}>${nextItemData.getName(false)}</font>x${this.actOrUpData.itemNum}<font color = ${color}>(拥有${count})</font>`;
								this.controller.selectedIndex = count > 0 ? 3 : 4;
							}
						}
					}
				}

			}
			this.baseItem.itemData = this.itemData;
		}
	}

	private clickActOrUp(): void {
		if (this.actOrUpData) {
			if (this.actOrUpData.roleState && !CacheManager.role.checkState(this.actOrUpData.roleState)) {
				Tip.showTip(`人物${this.actOrUpData.roleState}转80级可升级`, Color.Red2);
			} else {
				ProxyManager.cultivate.cultivateActive(1, this.actOrUpData.position, this.actOrUpData.level, 0);
			}
		}
		this.hide();
	}

	private clickRoadBtn(): void {
		// if(ConfigManager.mgOpen.getByOpenKey(MgOpenEnum.SecretBoss))
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Boss, { tabType: PanelTabType.SecretBoss }, ViewIndex.Two);
		this.hide();
	}

	private clickRoadBtn2(): void {
		if (!CacheManager.timeLimitTask.needShowIcon()) {
			Tip.showLeftTip("活动已结束");
			return;
		}
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.TimeLimitTask);
		this.hide();
	}
}