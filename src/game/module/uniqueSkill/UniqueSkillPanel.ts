/**
 * 必杀系统
 */

class UniqueSkillPanel extends BaseTabView {
	private c1: fairygui.Controller;
	private chipItems: any;
	private chipNamesTxt: any;
	private plusSignBtn: any;
	private redPointImg: any;
	private fightPanel: FightPanel;
	private activeCountTxt: fairygui.GTextField;
	private addAttrTxt: fairygui.GRichTextField;
	private attrBtn: fairygui.GButton;
	private skillBtn: fairygui.GButton;
	private decomposeBtn: fairygui.GButton;
	private exchangeBtn: fairygui.GButton;
	private previewBtn: fairygui.GButton;
	private effectContainer: fairygui.GComponent;

	private info: any;
	private mcArr: Array<UIMovieClip>;

	public constructor() {
		super();
	}

	public initOptUI(): void {
		this.c1 = this.getController("c1");
		this.chipItems = {};
		this.chipNamesTxt = {};
		this.plusSignBtn = {};
		this.redPointImg = {};
		this.mcArr = [];
		for (let i = 1; i < 9; i++) {
			let chip: GLoader = <GLoader>this.getGObject(`loader_img${i}`);
			chip.addClickListener(this.clickChip, this);
			this.chipItems[`chip_${i}`] = chip;

			let nameTxt: fairygui.GTextField = this.getGObject(`txt_name${i}`).asTextField;
			this.chipNamesTxt[`name_${i}`] = nameTxt;

			let addBtn: fairygui.GButton = this.getGObject(`btn_plusSign${i}`).asButton;
			addBtn.addClickListener(this.clickPlusSign, this);
			this.plusSignBtn[`btn_${i}`] = addBtn;

			let redPoint: fairygui.GImage = this.getGObject(`redPoint_${i}`).asImage;
			this.redPointImg[`redPoint_${i}`] = redPoint;

			let mc: UIMovieClip = null;
			this.mcArr.push(mc);
		}

		this.fightPanel = <FightPanel>this.getGObject("panel_fight");
		this.activeCountTxt = this.getGObject("txt_activeCount").asTextField;
		this.addAttrTxt = this.getGObject("txt_addAttr").asRichTextField;

		this.skillBtn = this.getGObject("btn_skill").asButton;
		this.decomposeBtn = this.getGObject("btn_decompose").asButton;
		this.exchangeBtn = this.getGObject("btn_exchange").asButton;
		this.previewBtn = this.getGObject("btn_preview").asButton;
		this.attrBtn = this.getGObject("btn_attr").asButton;
		this.effectContainer = this.getGObject("effectContainer").asCom;

		this.attrBtn.addClickListener(this.clickAttrBtn, this);
		this.skillBtn.addClickListener(this.clickSkillBtn, this);
		this.decomposeBtn.addClickListener(this.clickDecomposeBtn, this);
		this.exchangeBtn.addClickListener(this.clickExchangeBtn, this);
		this.previewBtn.addClickListener(this.clickPreviewBtn, this);
	}

	public updateAll(): void {
		this.setInfo();
		this.updateChips();
		this.updateRedPoint();
		this.updateChipName();
		this.updatePlusSign();
		this.updateAttr();
		this.updateBtnTips();
		EventManager.dispatch(UIEventEnum.UniqueSkillPanelOnOpen, this);
		this.c1.selectedIndex = CacheManager.role.getRoleLevel() >= 60 ? 1 : 0;
	}

	public updateInfo(): void {
		this.setInfo();
		this.updateChips();
		this.updateRedPoint();
		this.updateChipName();
		this.updatePlusSign();
		this.updateAttr();
		this.updateBtnTips();
	}

	/**更新按钮红点 */
	public updateBtnTips(): void {
		CommonUtils.setBtnTips(this.decomposeBtn, CacheManager.uniqueSkill.isCanDecompose());
		CommonUtils.setBtnTips(this.exchangeBtn, CacheManager.uniqueSkill.isCanExchange());
	}

	private setInfo(): void {
		let structInfo: any = CacheManager.uniqueSkill.getUniqueSkillInfo();
		this.info = structInfo ? structInfo.levelInfo : null;
	}

	private clickChip(e: egret.TouchEvent): void {
		for (let i = 1; i < 9; i++) {
			let loader: GLoader = <GLoader>this.chipItems[`chip_${i}`];
			let bitmap: egret.Bitmap = <egret.Bitmap>loader.content;
			let isHit: boolean = false;
			if (bitmap) {
				bitmap.pixelHitTest = true;
				isHit = bitmap.hitTestPoint(e.stageX, e.stageY, true);
			}
			if (isHit) {
				// Tip.showTip(`点击${loader._name}`);
				// break;
				let chipData: any;
				if (this.info && this.info[i]) {
					// let chipData: any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${i},${this.info[i]}`);//类型，位置，等级
					chipData = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${i},${this.info[i]}`);//类型，位置，等级
					this.openTips(true, chipData);
				} else {
					chipData = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${i},1`);//类型，位置，等级
					this.openTips(false, chipData);
				}
				break;
			}
		}
	}

	private clickPlusSign(e: any): void {
		let btn: fairygui.GButton = e.target.asButton;
		let name: string = btn.name;
		let position: number = Number(name.replace("btn_plusSign", ""));
		let chipData: any = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${position},1`);//类型，位置，等级
		this.openTips(false, chipData);
	}

	private openTips(isActived: boolean, chipData: any): void {
		let itemData: ItemData = new ItemData(chipData.itemCode);
		let toolTipData: ToolTipData;
		let extData: any = {};
		if (isActived) {
			extData = { "onUpgrade": true };
		} else {
			extData = { "onActive": true };
		}
		if (itemData) {
			toolTipData = new ToolTipData();
			toolTipData.data = itemData;
			toolTipData.extData = extData;
			toolTipData.type = ItemsUtil.getToolTipType(itemData);
			// this.toolTipData.source = this.toolTipSource;
			ToolTipManager.show(toolTipData);
		}
	}

	private clickAttrBtn(): void {
		EventManager.dispatch(UIEventEnum.UniqueSkillAttrOpen);
	}

	private clickSkillBtn(): void {
		EventManager.dispatch(UIEventEnum.UniqueSkillDetailOpen);
	}

	private clickDecomposeBtn(): void {
		EventManager.dispatch(UIEventEnum.UniqueSkillChipDecomposeOpen);
	}

	private clickExchangeBtn(): void {
		EventManager.dispatch(UIEventEnum.UniqueSkillExchangeOpen);
	}

	private clickPreviewBtn(): void {
		EventManager.dispatch(UIEventEnum.UniqueSkillSuitPreviewOpen);
	}

	private updateChips(): void {
		for (let i = 1; i < 9; i++) {
			let loader: GLoader = <GLoader>this.chipItems[`chip_${i}`];
			if (this.info && this.info[i]) {
				loader.load(URLManager.getModuleImgUrl(`img_${this.info[i]}_${i}.png`, PackNameEnum.UniqueSkill));
			} else {
				loader.load(URLManager.getModuleImgUrl(`img_0_${i}.png`, PackNameEnum.UniqueSkill));
				// loader.clear();
			}
			let redPoint: fairygui.GImage = this.redPointImg[`redPoint_${i}`];
			redPoint.visible = CacheManager.uniqueSkill.isanActiveOrUpgradeByPos(i);
		}
	}

	/**碎片红点更新 */
	public updateRedPoint(): void {
		for (let i = 1; i < 9; i++) {
			let redPoint: fairygui.GImage = this.redPointImg[`redPoint_${i}`];
			redPoint.visible = CacheManager.uniqueSkill.isanActiveOrUpgradeByPos(i);
		}
	}

	private updateChipName(): void {
		for (let i = 1; i < 9; i++) {
			let nameTxt: fairygui.GTextField = this.chipNamesTxt[`name_${i}`].asTextField;
			let data: any;
			if (this.info && this.info[i]) {
				data = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${i},${this.info[i]}`);//类型，位置，等级
				nameTxt.text = data.posName;
				nameTxt.color = 0xf3f232;
			} else {
				data = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${i},${1}`);
				nameTxt.text = data.posName;
				nameTxt.color = 0xffffff;
			}
		}
	}

	private updatePlusSign(): void {
		for (let i = 1; i < 9; i++) {
			let btn: fairygui.GButton = this.plusSignBtn[`btn_${i}`].asButton;
			if (this.info && this.info[i]) {
				btn.visible = false;
			} else {
				btn.visible = true;
			}
		}
	}

	private updateAttr(): void {
		let levels: any = CacheManager.uniqueSkill.getKillLevelNums();
		let levelMaxNum: any = CacheManager.uniqueSkill.getLevelMaxNum();
		let maxLevel: number = CacheManager.uniqueSkill.getMaxLevel();

		this.addAttrTxt.text = "";
		for (let num in levelMaxNum) {
			if (levelMaxNum[num]) {
				let data: any = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeKill},0,${levelMaxNum[num]},${num}`);//养成类型，等级，数量
				let color: string;
				if (levelMaxNum[num] == 1) {
					color = Color.ItemColor[EColor.EColorPurple];
				} else if (levelMaxNum[num] == 2) {
					color = Color.ItemColor[EColor.EColorOrange];
				} else if (levelMaxNum[num] == 3 || levelMaxNum[num] == 4) {
					color = Color.ItemColor[EColor.EColorRed];
				} else if (levelMaxNum[num] >= 5) {
					color = Color.ItemColor[EColor.EColorPink];
				}
				this.addAttrTxt.text += `<font color = ${color}>${data.suitDesc}${num}件套：</font><font color = '#f2e1c0'>${data.effectDesc}</font>\n`;
			} else {
				let data: any = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeKill},0,1,${num}`);
				let str: string = data.effectDesc;
				str = str.replace(/<[^>]+>/g, "");
				this.addAttrTxt.text += `${data.suitDesc}${num}件套：${str}\n`;
			}
		}

		if (maxLevel == 0) {
			maxLevel = 1;
			levels[maxLevel] = 0;
		}
		let activeData: any = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeKill},0,${maxLevel},8`);//养成类型，等级，数量
		this.activeCountTxt.text = `${activeData.suitDesc}齐鸣套装（${levels[maxLevel]}/8）`;
		this.updateFight();
		if (levels[maxLevel] == 8) {
			this.updateEffect(true);
		} else {
			this.updateEffect(false);
		}
	}

	private updateFight(): void {
		let cultivateData: any;
		let attrDict: any = {};
		let dict: any;
		let itemData: ItemData;
		let combat: number = 0;
		for (let key in this.info) {
			cultivateData = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${key},${this.info[key]}`);//类型，位置，等级
			itemData = new ItemData(cultivateData.itemCode);
			dict = WeaponUtil.getAttrDict(cultivateData.attr);
			combat += WeaponUtil.getKillCombat(itemData, dict);
			// for(let key in dict){
			// 	if(!attrDict[key]){
			// 		attrDict[key] = 0;
			// 	}
			// 	attrDict[key] += dict[key];
			// }
		}
		this.fightPanel.updateValue(combat);
		// this.fightPanel.updateValue(WeaponUtil.getCombat(attrDict));
	}

	private updateEffect(isShow: boolean): void {
		for (let i = 0; i < this.mcArr.length; i++) {
			if (isShow) {
				if (this.mcArr[i] == null) {
					this.mcArr[i] = UIMovieManager.get(PackNameEnum.MCUniqueSkill);
					this.mcArr[i].playing = true;
					this.mcArr[i].frame = 0;
					if (ResourceManager.isPackageLoaded(this.mcArr[i].pkgName)) {
						this.setMCUniqueSkill(this.mcArr[i], i);
					} else {
						this.mcArr[i].addEventListener(UIMovieClip.Ready, () => {
							this.setMCUniqueSkill(this.mcArr[i], i);
						}, this);
					}
				}
				this.effectContainer.addChild(this.mcArr[i]);
			} else {
				if (this.mcArr[i] != null) {
					UIMovieManager.push(this.mcArr[i]);
					this.mcArr[i] = null;
				}
			}
		}
	}

	private setMCUniqueSkill(mcUniqueSkill: UIMovieClip, ballNum: number): void {
		mcUniqueSkill.x = -24;
		mcUniqueSkill.y = 30;
		mcUniqueSkill.mc.scaleX = 1.43;
		mcUniqueSkill.mc.scaleY = 1.43;
		mcUniqueSkill.mc.pivotX = 0.5;
		mcUniqueSkill.mc.pivotY = 0.5;
		mcUniqueSkill.mc.rotation = -135 + (ballNum) * 45;
	}
}