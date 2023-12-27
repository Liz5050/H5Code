/**
 * 龙鳞甲
 */

class DragonScalePanel extends BaseTabView {
	private activeBtn: fairygui.GButton;
	// private promoteBtn: fairygui.GButton;
	private onekeyBtn: fairygui.GButton;
	private starList: fairygui.GList;
	private fightPanel: FightPanel;
	private levelTxt: fairygui.GTextField;
	private materialTxt: fairygui.GRichTextField;
	private currentAttrTxt: fairygui.GRichTextField;
	private nextAttrTxt: fairygui.GRichTextField;
	private finalAttrTxt: fairygui.GRichTextField;
	private statusController: fairygui.Controller;
	private blessingBar: ProgressBar1;
	private mcUpStar: UIMovieClip;
	private mcSuccess: UIMovieClip;
	private fullImg: fairygui.GImage;
	private propLoader: GLoader;
	// private modelContainer: fairygui.GComponent;

	/**模型展示 */
	private modelContainer: fairygui.GComponent;
	private modelBody: egret.DisplayObjectContainer;
	private model: ModelShow;
	private levelUpBtn: fairygui.GButton;

	/**活动按钮 */
    private activityIcon: MaterialsActivityGetItem;

	private cfg: any;
	private curInfo: any;
	private _roleIndex: number = RoleIndexEnum.Role_index0;
	private strengthenLevel: number = 0;
	private equipCount: number;
	private isCanUpgrade: boolean;
	private curStage: number;
	private lastStage:number;
	private isMax: boolean;
	private useItemCode: number;
	private levelUpItemDatas: Array<ItemData>;
	private upgradeItemDatas: Array<ItemData>;

	/**是否一键提升中 */
    private isOneKeyPromoteing: boolean = false;
    private isCanContinuePromote: boolean = true;

	public constructor() {
		super();
		this.useItemCode = ConfigManager.mgStrengthenEx.getUseItemCode(EStrengthenExType.EStrengthenExTypeDragonSoul);
	}

	public initOptUI(): void {
		this.activeBtn = this.getGObject("btn_activation").asButton;
		// this.promoteBtn = this.getGObject("btn_promote").asButton;
		this.onekeyBtn = this.getGObject("btn_automaticPromote").asButton;
		this.starList = this.getGObject("list_star").asList;
		this.fightPanel = <FightPanel>this.getGObject("panel_fight");
		this.levelTxt = this.getGObject("txt_level").asTextField;
		this.materialTxt = this.getGObject("txt_material").asRichTextField;
		this.currentAttrTxt = this.getGObject("txt_front").asRichTextField;
		this.nextAttrTxt = this.getGObject("txt_after").asRichTextField;
		this.finalAttrTxt = this.getGObject("txt_final").asRichTextField;
		this.statusController = this.getController("c1");
		this.blessingBar = this.getGObject("progressBar_blessing") as ProgressBar1;
		this.fullImg = this.getGObject("img_full").asImage;
		this.propLoader = <GLoader>this.getGObject("loader_material");
		this.propLoader.addClickListener(this.clickMetarial, this);
		// this.modelContainer = this.getGObject("DragonScaleModel").asCom;

		this.modelContainer = this.getGObject("effectContainer").asCom;
		this.model = new ModelShow(EShape.EDragonScale);
		this.modelBody = ObjectPool.pop("egret.DisplayObjectContainer");
		this.modelBody.x = 12;
		this.modelBody.addChild(this.model);
		(this.modelContainer.displayObject as egret.DisplayObjectContainer).addChild(this.modelBody);

		this.activeBtn.addClickListener(this.clickActivethen, this);
		// this.promoteBtn.addClickListener(this.clickStrengthen, this);
		this.onekeyBtn.addClickListener(this.clickOnekey, this);
		this.levelUpBtn = this.getGObject("btn_levelUp").asButton;
		this.levelUpBtn.addClickListener(this.clickLevelUp, this);
		this.starListAddItem();

		this.activityIcon = <MaterialsActivityGetItem>FuiUtil.createComponent(PackNameEnum.Common, "MaterialsActivityGetItem", MaterialsActivityGetItem);
        this.activityIcon.setParent(this, 15, 875);

		// GuideTargetManager.reg(GuideTargetName.DragonScalePromoteBtn, this.promoteBtn);
		GuideTargetManager.reg(GuideTargetName.DragonScalePromoteBtn, this.onekeyBtn);
	}

	public updateAll(): void {
		this.updateActiveStatus();
		this.model.setData(1);

		if((this.curInfo && this.curInfo.active != 0) && !this.isMax){
            this.activityIcon.setData(this.useItemCode);
        }else{
            this.activityIcon.setData(0);
        }
	}

	public hide(): void {
        super.hide();
        this.stopOneKey();
    }

	public set roleIndex(roleIndex: number) {
		this._roleIndex = roleIndex;
		App.TimerManager.remove(this.onUpgrade, this);
		this.stopOneKey();
		this.updateAll();
		this.lastStage = this.curStage;
	}

	public get roleIndex(): number {
		return this._roleIndex;
	}

	/**激活 */
	private clickActivethen(): void {
		EventManager.dispatch(LocalEventEnum.PlayerStrengthExActive, EStrengthenExType.EStrengthenExTypeDragonSoul, this.roleIndex);
	}

	// /**强化 */
	// public clickStrengthen(): void {
	// 	if (this.isMax) {
	// 		Tip.showTip("已达到最高等级，无法提升");
	// 		return;
	// 	}
	// 	if (this.isCanUpgrade) {
	// 		EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, EStrengthenExType.EStrengthenExTypeDragonSoul, this.roleIndex);
	// 	} else {
	// 		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
	// 		let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
    //         Tip.showOptTip(App.StringUtils.substitude(LangShapeBase.LANG24, itemCfg.name));
	// 	}
	// }

	/**
     * 提升
     * @param {boolean} isAuto 是否为自动点击的
     */
    private clickPromote(isAuto: boolean = true): void {
        if (this.isMax) {
            Tip.showOptTip(LangForge.L14);
            this.stopOneKey();
            return;
        }
        if (this.isCanUpgrade) {
            EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, EStrengthenExType.EStrengthenExTypeDragonSoul, this.roleIndex);
        } else {
            // if (!isAuto) {//一键提升材料不足时不谈窗
            // 	EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
            // }
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
            let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
            Tip.showOptTip(App.StringUtils.substitude(LangForge.L15, itemCfg.name));
            this.stopOneKey();
        }
    }

    /**点击一键提升/停止 */
    private clickOnekey(): void {
        if (this.isOneKeyPromoteing) {
            this.stopOneKey();
            return;
        }

        if (!this.isCanContinuePromote) {
            return;
        }
        this.isOneKeyPromoteing = true;
        this.clickPromote(false);
        this.updateOneKeyBtn();
    }

    private updateOneKeyBtn(): void {
        if (this.isOneKeyPromoteing) {
            this.onekeyBtn.text = LangForge.L16;
        } else {
            this.onekeyBtn.text = LangForge.L17;
        }
    }

    /**
     * 停止一键提升
     */
    private stopOneKey(): void {
        this.isOneKeyPromoteing = false;
        this.updateOneKeyBtn();
    }

	/**
	 * 根据强化结果更新
	 */
	public updateBySUpgradeStrengthenEx(info: SUpgradeStrengthenEx): void {
		if (info.result) {
			this.blessingBar.setValue(this.cfg["luckyNeed"], this.cfg["luckyNeed"]);
			App.TimerManager.remove(this.onUpgrade, this);
			App.TimerManager.doDelay(100, this.onUpgrade, this);
			this.stopOneKey();
			// if (this.lastStage != -1 && this.curStage > this.lastStage) {
			// 	//升阶了
			// 	EventManager.dispatch(LocalEventEnum.OpenUpgradeSuccessView,{type:EShape.EDragonScale,roleIndex:this.roleIndex});
			// }
			this.lastStage = this.curStage;
		} else {
			this.updateAll();
		}
		this.isCanContinuePromote = true;
        if (this.isOneKeyPromoteing) {
            App.TimerManager.doDelay(50, this.clickPromote, this);
        }
	}

	private onUpgrade(): void {
		let stage: number = this.curStage;
		this.updateAll();
		if (this.curStage > stage) {
			this.playerUpStar(true);
		} else {
			this.playerUpStar(false);
		}
	}

	/**升星 */
	private playerUpStar(isUpStage: boolean): void {
		if (this.mcUpStar == null) {
			this.mcUpStar = UIMovieManager.get(PackNameEnum.MCStar);//FuiUtil.createMc("MCStar", PackNameEnum.MovieClip);
			this.mcUpStar.x = -232;
			this.mcUpStar.y = -232;
		}
		// let starNum: number = this.cfg.star ? this.cfg.star : 0;
		let starItem: fairygui.GComponent = this.starList.getChildAt(this.cfg.star - 1).asCom;
		starItem.addChild(this.mcUpStar);
		this.mcUpStar.setPlaySettings(0, -1, 1, -1, function (): void {
			this.mcUpStar.removeFromParent();
			this.mcUpStar.playing = false;
			if (isUpStage) {
				this.playerSuccessMc();
			} 
		}, this);
		this.mcUpStar.playing = true;
	}

	/**升阶 */
	private playerSuccessMc(): void {
		if (this.mcSuccess == null) {
			this.mcSuccess = UIMovieManager.get(PackNameEnum.MCSuccessAdd);
		}
		this.mcSuccess.x = this.modelContainer.x - 260;
		this.mcSuccess.y = this.modelContainer.y - 130;
		this.addChild(this.mcSuccess);
		this.mcSuccess.alpha = 1;
		egret.Tween.removeTweens(this.mcSuccess);
		this.mcSuccess.setPlaySettings(0, -1, 1, -1, function (): void {
			egret.Tween.get(this.mcSuccess).to({ alpha: 0 }, 2000).call(() => {
				this.mcSuccess.removeFromParent();
				this.mcSuccess.playing = false;
			})
		}, this);
		this.mcSuccess.playing = true;
	}

	private updateActiveStatus(): void {
		this.curInfo = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeDragonSoul, this.roleIndex);
		if (this.curInfo && this.curInfo.active != 0) {
			this.statusController.selectedIndex = 1;
			this.strengthenLevel = CacheManager.role.getPlayerStrengthenExLevel(EStrengthenExType.EStrengthenExTypeDragonSoul, this.roleIndex);
			this.isMax = this.strengthenLevel == ConfigManager.mgStrengthenEx.getMaxLevel(EStrengthenExType.EStrengthenExTypeDragonSoul);
			this.cfg = StrengthenExUtil.getCurrentCfg(EStrengthenExType.EStrengthenExTypeDragonSoul, this.roleIndex);
			this.curStage = this.cfg.stage;
			this.updateStrengthen();
			this.updateAttrList(this.strengthenLevel);
			this.updateProp();
			let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
			if (itemCfg) {
				this.propLoader.load(URLManager.getIconUrl(itemCfg.icon, URLManager.ITEM_ICON));
			}
			if (this.isMax) {
				this.statusController.selectedIndex = 2;
			}
		} else {
			this.statusController.selectedIndex = 0;
		}

		// if (this.lastStage != -1 && this.curStage > this.lastStage) {
        //     //升阶了
		// 	EventManager.dispatch(LocalEventEnum.OpenUpgradeSuccessView,{type:EShape.EDragonScale,roleIndex:this.roleIndex});
        // }

		if (this.isMax) {//达到最高等级
            this.stopOneKey();
        }

		this.updateAcitiveBtn();

		// this.lastStage = this.curStage;
	}

	private updateAcitiveBtn(): void {
		let isOpen: boolean = ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.DragonSoul], false);
		App.DisplayUtils.grayButton(this.activeBtn, !isOpen, !isOpen);
	}



	/**
	 * 更新强化等级
	 */
	private updateStrengthen(): void {
		let currentDict: any = WeaponUtil.getAttrDict(this.cfg.attrList);
		this.fightPanel.updateValue(Number(this.curInfo.warfare));
		this.levelTxt.text = `${FuiUtil.getStageStr(this.cfg.stage)}阶`;
		if (!this.cfg.star && this.mcUpStar != null) {
			this.mcUpStar.removeFromParent();
			this.mcUpStar.playing = false;
		}
		this.setStarListNum(this.cfg.star);
		if (this.isMax) {
			this.blessingBar.setValue(this.cfg.luckyNeed, this.cfg.luckyNeed);
			this.fullImg.visible = true;
			this.setStarListNum(10);
		} else {
			this.blessingBar.setValue(this.curInfo.lucky, this.cfg.luckyNeed);
			this.fullImg.visible = false;
		}
	}

	/**
	 * 更新属性列表
	 * @param level 等级
	 */
	private updateAttrList(level: number): void {
		let attrListData: Array<AttrInfo> = StrengthenExUtil.getAttrListData(EStrengthenExType.EStrengthenExTypeDragonSoul, level);

		var info = CacheManager.role.getPlayerStrengthenExtInfo(EStrengthenExType.EStrengthenExTypeDragonSoul, this.roleIndex);
		if (info && info.addRate) {
			for (let i = 0; i < attrListData.length; i++) {
				attrListData[i].value += attrListData[i].value * info.addRate / 100;
				attrListData[i].value = Math.floor(attrListData[i].value);
				attrListData[i].addValue += attrListData[i].addValue * info.addRate / 100;
				attrListData[i].addValue = Math.floor(attrListData[i].addValue);
			}
		}
		// this.attrList.data = attrListData;
		let currentStr: string = "";
		let nextStr: string = "";
		for (let data of attrListData) {
			currentStr += `${data.name}： ${data.value}\n`;
			nextStr += `${data.name}： ${data.nextValue}\n`;
		}
		this.currentAttrTxt.text = currentStr;
		this.nextAttrTxt.text = nextStr;
		this.finalAttrTxt.text = currentStr;
	}

	/**
	 * 更新道具
	 */
	public updateProp(): void {
		if (this.cfg) {
			let count: number = CacheManager.pack.propCache.getItemCountByCode2(this.cfg["useItemCode"]);
			let costNum: number = this.cfg["useItemNum"];
			let color: string = "#0DF14B";
			if (costNum > count) {
				color = Color.RedCommon;
			}
			this.materialTxt.text = `<font color="${color}">${count}/${costNum}</font>`;
			this.isCanUpgrade = count >= costNum;
		}

		if (!this.isCanUpgrade) {//资源不足，停止一键
            if (this.isOneKeyPromoteing) {//一键中
                this.clickPromote();
            }
        }

		this.levelUpItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isDragonScaleLevelItem, ItemsUtil);
		this.upgradeItemDatas = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isDragonScaleUpgradeItem, ItemsUtil);

		this.levelUpBtn.visible = this.levelUpItemDatas.length > 0 || this.upgradeItemDatas.length > 0;
		CommonUtils.setBtnTips(this.levelUpBtn, this.levelUpBtn.visible);
	}

	private starListAddItem(): void {
		this.starList.removeChildrenToPool();
		for (let i = 0; i < 10; i++) {
			let item: fairygui.GComponent = this.starList.addItemFromPool().asCom;

		}
	}

	public setStarListNum(num: number): void {
		for (let i = 0; i < 10; i++) {
			let item: fairygui.GComponent = this.starList.getChildAt(i).asCom;
			let controller: fairygui.Controller = item.getController("c1");
			controller.selectedIndex = i < num ? 1 : 0;
		}
	}

	public clickMetarial() {
		//EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
		ToolTipManager.showByCode(this.useItemCode);
	}

	/**
     * 点击提升
     */
	private clickLevelUp(): void {
		let tip: string;
		let upgradeTip: string = "确定使用龙炎甲进阶丹提升龙炎甲吗？\n说明：龙炎甲等阶在5阶才能使用，使用后直升1阶，超过5阶使用获得50个龙鳞碎片。强烈推荐在龙炎甲5阶的时候使用";
		let levelTip: string = "确定使用龙炎甲直升丹提升龙炎甲吗？\n说明：龙炎甲等阶在4阶及以下使用可以直升1阶，超过4阶使用获得300个龙鳞碎片。强烈推荐在龙炎甲4阶的时候使用。";
		let isCanUse: boolean = true;
		let itemData: ItemData;
		if (this.curStage >= 5) {
			if (this.upgradeItemDatas.length > 0) {
				itemData = this.upgradeItemDatas[0];
				tip = upgradeTip;
				if (itemData.isExpire) {
					tip = `道具已过期，使用后将获得${itemData.getEffectEx2()}铜钱，确定使用吗？`;
				}
			} else if (this.levelUpItemDatas.length > 0) {
				tip = levelTip;
				itemData = this.levelUpItemDatas[0];
				if (itemData.isExpire) {
					tip = `道具已过期，使用后将获得${itemData.getEffectEx2()}铜钱，确定使用吗？`;
				}
			}
		} else {
			tip = levelTip;
			if (this.levelUpItemDatas.length > 0) {
				itemData = this.levelUpItemDatas[0];
				if (itemData.isExpire) {
					tip = `道具已过期，使用后将获得${itemData.getEffectEx2()}铜钱，确定使用吗？`;
				}
			} else if (this.upgradeItemDatas.length > 0) {
				itemData = this.upgradeItemDatas[0];
				tip = upgradeTip;
				isCanUse = false;
                if (itemData.isExpire) {
                    tip = `道具已过期，使用后将获得${itemData.getEffectEx2()}铜钱，确定使用吗？`;
                }
			}
		}

		if (itemData) {
			Alert.alert(tip, () => {
				if (isCanUse || itemData.isExpire) {
					ProxyManager.pack.useItem(itemData.getUid(), 1, [], this.roleIndex);
				} else {
					Tip.showLeftTip("龙炎甲等阶在5阶才能使用");
				}
			}, this);
		}
	}
}