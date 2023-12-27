/**
 * 强化
 */
class ForgeStrengthenPanel extends ForgeBaseTabPanel {
	private posController: fairygui.Controller;
	private c2: fairygui.Controller;
	private itemList: List;
	private attrList: List;
	private costTxt: fairygui.GRichTextField;
	private costIcon: GLoader;
	private strengthenBtn: fairygui.GButton;
	private oneKeyStrengthenBtn: fairygui.GButton;
	private getBtn: fairygui.GButton;
	// private mcSuccess: UIMovieClip;
	private mcSuccesses: Array<UIMovieClip>;

	// private cfg: any;
	private equipConfs: Array<any>;
	// private _roleIndex: number = RoleIndexEnum.Role_index0;
	// private strengthenLevel: number = 0;
	private equipCount: number;
	private isCanUpgrade: boolean;
	private isMax: boolean;

	// /**是否一键提升中 */
    // private isOneKeyPromoteing: boolean = false;
    // private isCanContinuePromote: boolean = true;
	private isCanPlayMc: boolean = false;
	private startLevel: number;
	private mcName: string = "MovieClip";

	public constructor() {
		super();
		this.type = EStrengthenExType.EStrengthenExTypeUpgrade;
	}

	public initOptUI(): void {
		this.itemList = new List(this.getGObject("list_item").asList);
		this.attrList = new List(this.getGObject("list_attr").asList);
		this.posController = this.getController("c1");
		this.c2 = this.getController("c2");
		this.equipConfs = [
			{ "pos": EDressPos.EDressPosWeapon, "type": EEquip.EEquipWeapon },//武器
			{ "pos": EDressPos.EDressPosGloves, "type": EEquip.EEquipGloves },//头盔
			{ "pos": EDressPos.EDressPosGloves, "type": EEquip.EEquipWristlet },//护符
			{ "pos": EDressPos.EDressPosClothes, "type": EEquip.EEquipClothes },//衣服
			{ "pos": EDressPos.EDressPosShoulder, "type": EEquip.EEquipShoulder },//护手
			{ "pos": EDressPos.EDressPosBelt, "type": EEquip.EEquipBelt },//护腿
			{ "pos": EDressPos.EDressPosRing, "type": EEquip.EEquipHelmet },//手镯
			{ "pos": EDressPos.EDressPosShoes, "type": EEquip.EEquipShoes },//鞋
		];
		this.equipCount = this.equipConfs.length;
		this.costTxt = this.getGObject("txt_cost").asRichTextField;
		this.costIcon = this.getGObject("loader_icon") as GLoader;
		this.costIcon.addClickListener(this.onTouchCostIconHandler, this);
		this.strengthenBtn = this.getGObject("btn_strengthen").asButton;
		this.strengthenBtn.sound = "";
		this.oneKeyStrengthenBtn = this.getGObject("btn_oneKeyStrengthen").asButton;
		this.oneKeyStrengthenBtn.sound = "";
		this.getBtn = this.getGObject("btn_get").asButton;
		this.strengthenBtn.addClickListener(this.clickStrengthen, this);
		this.oneKeyStrengthenBtn.addClickListener(this.clickOneKeyStrength, this);
		// this.strengthenBtn.addClickListener(this.clickOnekey, this);
		this.getBtn.addClickListener(this.clickGet, this);

		this.itemList.data = this.equipConfs;
		this.mcSuccesses = [];

		GuideTargetManager.reg(GuideTargetName.StrengthenBtn, this.strengthenBtn);
		GuideTargetManager.reg(GuideTargetName.OneKeyStrengthenBtn, this.oneKeyStrengthenBtn);
	}

	public updateAll(data: any = null): void {
		// this.strengthenLevel = CacheManager.role.getPlayerStrengthenExLevel(EStrengthenExType.EStrengthenExTypeUpgrade, this.roleIndex);
		// this.cfg = StrengthenExUtil.getCurrentCfg(EStrengthenExType.EStrengthenExTypeUpgrade, this.roleIndex);
		super.updateAll();
		let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
		if (itemCfg) {
			this.costIcon.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
		}
		this.autoSelect();
		this.updateStrengthen();
		this.updateAttrList(this.level);
		this.updateProp();
		// this.updateOneKeyBtn();
	}

	public set roleIndex(roleIndex: number) {
        this._roleIndex = roleIndex;
        this.updateAll();
        // this.stopOneKey();

		// if(this.mcSuccess != null){
		// 	this.mcSuccess.removeFromParent();
		// 	this.mcSuccess.playing = false;
		// }
		for(let i = 0; i < this.itemList.list.numItems; i++){
			let item: BaseItem = <BaseItem>this.itemList.list._children[i];
			let mc: UIMovieClip = <UIMovieClip>item.getChild(this.mcName);
			if(mc){
				mc.removeFromParent();
				mc.playing = false;
			}
		}
		this.isCanPlayMc = false;
		// App.TimerManager.remove(this.clickPromote, this);
    }

    public get roleIndex(): number {
        return this._roleIndex;
    }

	/**
	 * 更新道具
	 */
	public updateProp(): void {
		let count: number = CacheManager.pack.propCache.getItemCountByCode2(this.cfg["useItemCode"]);
		let costNum: number = this.cfg["useItemNum"];
		this.costTxt.text = MoneyUtil.getResourceText(count, costNum);
		this.isCanUpgrade = count >= costNum;
		this.isMax = this.cfg["strengthenLevel"] >= ConfigManager.mgStrengthenEx.getMaxLevel(EStrengthenExType.EStrengthenExTypeUpgrade);

		// if (this.isMax || !this.isCanUpgrade) {//达到最高等级/不可提升
        //     this.stopOneKey();
        // }
		this.updateBtn();
	}

	public updateBtn(): void{
		if(CacheManager.checkPoint.curFloor < 14){
			this.c2.selectedIndex = 0;
			CommonUtils.setBtnTips(this.strengthenBtn, this.isCanUpgrade);
		}else{
			this.c2.selectedIndex = 1;
			CommonUtils.setBtnTips(this.strengthenBtn, false);
			CommonUtils.setBtnTips(this.oneKeyStrengthenBtn, this.isCanUpgrade);
		}
	}

	/**强化 */
	public clickStrengthen(): void {
		if (this.isMax) {
            Tip.showOptTip(LangForge.L14);
            return;
        }
		if (this.isCanUpgrade) {
			this.startLevel = this.level;
			this.isCanPlayMc = true;
			EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, EStrengthenExType.EStrengthenExTypeUpgrade, this.roleIndex);
		} else {
			this.clickGet();
			let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
        	Tip.showOptTip(App.StringUtils.substitude(LangForge.L15, itemCfg.name));
		}
	}

	/**一键升级 */
	public clickOneKeyStrength(): void {
		if (this.isMax) {
            Tip.showOptTip(LangForge.L14);
            return;
        }
		if (this.isCanUpgrade) {
			this.startLevel = this.level;
			this.isCanPlayMc = true;
			EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, EStrengthenExType.EStrengthenExTypeUpgrade, this.roleIndex, false, 0, true);
		} else {
			this.clickGet();
			let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
        	Tip.showOptTip(App.StringUtils.substitude(LangForge.L15, itemCfg.name));
		}
	}

	// /**点击一键提升/停止 */
    // private clickOnekey(): void {
    //     if (this.isOneKeyPromoteing) {
    //         this.stopOneKey();
    //         return;
    //     }

    //     if (!this.isCanContinuePromote) {
    //         return;
    //     }
    //     this.isOneKeyPromoteing = true;
    //     this.clickPromote(false);
    //     this.updateOneKeyBtn();
    // }

	// private updateOneKeyBtn(): void {
    //     if (this.isOneKeyPromoteing) {
	// 		this.strengthenBtn.text = LangForge.L9[0];
    //     } else {
    //         this.strengthenBtn.text = LangForge.L9[1];
    //     }
    // }

	// /**
    //  * 停止一键提升
    //  */
    // private stopOneKey(): void {
    //     this.isOneKeyPromoteing = false;
    //     this.updateOneKeyBtn();
    // }

	// /**
    //  * 提升
    //  * @param {boolean} isAuto 是否为自动点击的
    //  */
    // private clickPromote(isAuto: boolean = true): void {
    //     if (this.isMax) {
    //         Tip.showTip(LangForge.L8);
    //         this.stopOneKey();
    //         return;
    //     }
    //     if (this.isCanUpgrade) {
	// 		this.isCanPlayMc = true;
    //         EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, EStrengthenExType.EStrengthenExTypeUpgrade, this.roleIndex);
    //     } else {
    //         if (!isAuto) {//一键提升材料不足时不弹窗
    //             this.clickGet();
    //         }
    //         Tip.showTip(LangForge.L4);
    //         this.stopOneKey();
    //     }
    // }

	/**
	 * 根据强化结果更新
	 */
	public updateBySUpgradeStrengthenEx(info: SUpgradeStrengthenEx): void {
		this.updateAll();
		this.playerSuccessMc();
		App.SoundManager.playEffect(SoundName.Effect_QiangHuaChengGong);

		// this.isCanContinuePromote = true;
        // if (this.isOneKeyPromoteing) {
        //     App.TimerManager.doDelay(50, this.clickPromote, this);
		// 	// this.clickPromote();
        // }
	}

	private playerSuccessMc(): void {
		if(this.isCanPlayMc){
			for(let curLevel = this.startLevel; curLevel < this.level; curLevel ++){
				let mcIndex: number = curLevel - this.startLevel;
				if(this.mcSuccesses[mcIndex] == null){
					this.mcSuccesses[mcIndex] = UIMovieManager.get(PackNameEnum.MCStrengthen);
					this.mcSuccesses[mcIndex].x = -214;
					this.mcSuccesses[mcIndex].y = -209;
				}

				let itemIndex: number = StrengthenExUtil.getCurrentItemIndex(curLevel, this.equipCount);
				let baseItem: BaseItem = <BaseItem>this.itemList.list._children[itemIndex];
				this.mcSuccesses[mcIndex].name = "MC";
				baseItem.addChild(this.mcSuccesses[mcIndex]);
				this.mcSuccesses[mcIndex].setPlaySettings(0, -1, 1, -1, function (): void {
					this.mcSuccesses[mcIndex].removeFromParent();
					this.mcSuccesses[mcIndex].playing = false;
				}, this);
				this.mcSuccesses[mcIndex].playing = true;
			}
			// if (this.mcSuccess == null) {
			// 	this.mcSuccess = UIMovieManager.get(PackNameEnum.MCStrengthen);
			// 	this.mcSuccess.x = -214;
			// 	this.mcSuccess.y = -209;
			// }
			// let baseItem: BaseItem = <BaseItem>this.itemList.list._children[this.posController.selectedIndex];
			// // baseItem.name
			// baseItem.addChild(this.mcSuccess);
			// this.mcSuccess.setPlaySettings(0, -1, 1, -1, function (): void {
			// 	this.mcSuccess.removeFromParent();
			// 	this.mcSuccess.playing = false;
			// }, this);
			// this.mcSuccess.playing = true;
		}
	}

	/**
	 * 选择强化位置
	 */
	private autoSelect(): void {
		this.posController.selectedIndex = StrengthenExUtil.getCurrentItemIndex(this.level, this.equipCount);
		// if(this.posController.selectedIndex == 0){
		// 	this.stopOneKey();
		// 	App.TimerManager.remove(this.clickPromote, this);
		// }
	}

	protected onTouchCostIconHandler(): void {
		ToolTipManager.showByCode(this.useItemCode);
	}

	/**
	 * 更新强化等级
	 */
	private updateStrengthen(): void {
		let itemLevel: number;
		let pos: EDressPos;
		let strengthenLevel: number = this.level;
		let strengthenItem: ForgeStrengthenItem;
		let index: number;
		for (let item of this.itemList.list._children) {
			strengthenItem = <ForgeStrengthenItem>item;
			pos = strengthenItem.pos;
			index = strengthenItem.itemIndex;
			strengthenItem.level = StrengthenExUtil.getItemStrengthenLevel(index, strengthenLevel, this.equipCount);
		}
	}

	/**
	 * 更新属性列表
	 * @param level 等级
	 */
	private updateAttrList(level: number): void {
		let attrListData: Array<AttrInfo> = StrengthenExUtil.getAttrListData(EStrengthenExType.EStrengthenExTypeUpgrade, level);
		var info = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeUpgrade, this.roleIndex);
		if(info && info.addRate) {
			for(let i = 0;i<attrListData.length; i++) {
				attrListData[i].value +=  attrListData[i].value * info.addRate / 100;
				attrListData[i].value = Math.floor(attrListData[i].value);
				attrListData[i].addValue += attrListData[i].addValue * info.addRate / 100;
				attrListData[i].addValue = Math.floor(attrListData[i].addValue);
			}
		}
		this.attrList.data = attrListData;


	}

	/**
	 * 获取道具
	 */
	private clickGet(): void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
	}
}