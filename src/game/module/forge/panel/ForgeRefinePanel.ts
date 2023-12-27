class ForgeRefinePanel extends ForgeBaseTabPanel {
	private c1: fairygui.Controller;
	private curItem:ForgeRefineItem;
	private nextItem:ForgeRefineItem;
	private propIcon:GLoader;
	// private items:ForgeRefineItem[];
	private list_attr:List;
	private listItem:List;
	private costTxt:fairygui.GRichTextField;
	private costIcon:GLoader;
	private refineBtn:fairygui.GButton;
	private oneKeyRefineBtn: fairygui.GButton;
	private getBtn: fairygui.GButton;

	private isCanUpgrade:boolean;
	private equipConfs: Array<any>;
	private equipCount: number;

	private lastUpdateIndex:number = 0;
	// private mcSuccess: UIMovieClip;
	private mcSuccesses: Array<UIMovieClip>;

	private mcLeft:UIMovieClip;
	private mcRight:UIMovieClip;
	private mcFull:UIMovieClip;
	private maskObj:fairygui.GGraph;

	private isMax: boolean;

	// /**是否一键提升中 */
    // private isOneKeyPromoteing: boolean = false;
    // private isCanContinuePromote: boolean = true;
	private isCanPlayMc: boolean = false;
	private startLevel: number;
	private mcName: string = "MovieClip";

	public constructor() {
		super();
		this.type = EStrengthenExType.EStrengthenExTypeRefine;
	}

	protected initOptUI():void {
		this.c1 = this.getController("c1");

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

		this.curItem = this.getGObject("curLevel_item") as ForgeRefineItem;
		this.nextItem = this.getGObject("nextLevel_item") as ForgeRefineItem;
		this.propIcon = this.getGObject("prop_icon") as GLoader;

		this.costTxt = this.getGObject("txt_cost").asRichTextField;
		this.costIcon = this.getGObject("loader_icon") as GLoader;
		this.costIcon.addClickListener(this.onTouchCostIconHandler,this);

		this.refineBtn = this.getGObject("btn_refine").asButton;
		this.refineBtn.addClickListener(this.clickRefine, this);
		this.oneKeyRefineBtn = this.getGObject("btn_oneKeyRefine").asButton;
		this.oneKeyRefineBtn.addClickListener(this.clickOneKeyRefine, this);

		this.getBtn = this.getGObject("btn_get").asButton;
		this.getBtn.addClickListener(this.clickGet, this);

		this.listItem = new List(this.getGObject("list_item").asList);
		this.listItem.data = this.equipConfs;
		this.list_attr = new List(this.getGObject("list_attr").asList);

		this.mcSuccesses = [];

		let mcContainer:fairygui.GComponent = this.getGObject("mc_container").asCom;
		this.maskObj = this.getGObject("shape_mask").asGraph;
		this.maskObj.x = 214;
		this.maskObj.y = 270;
		this.maskObj.width = 320;
		this.maskObj.height = 100;
		this.mcFull = UIMovieManager.get(PackNameEnum.MCRefineProgressFull);
		this.mcFull.setDouble(true,-2);
		this.mcFull.playing = false;
		mcContainer.addChild(this.mcFull);
		mcContainer.addChild(this.maskObj);
		this.mcFull.displayObject.mask = this.maskObj.displayObject;

		this.mcLeft = UIMovieManager.get(PackNameEnum.MCRefineProgress);
		this.mcRight = UIMovieManager.get(PackNameEnum.MCRefineProgress);
		this.mcRight.scaleX = -1;
		this.mcRight.x = 768;
		this.mcLeft.y = this.mcRight.y = 2;
		mcContainer.addChild(this.mcLeft);
		mcContainer.addChild(this.mcRight);
		// this.mcRight.addEventListener(UIMovieClip.Ready,this.onReadyHandler,this);

		GuideTargetManager.reg(GuideTargetName.ForgeRefinePanelRefineBtn, this.refineBtn);
		GuideTargetManager.reg(GuideTargetName.ForgeRefinePanelOneKeyRefineBtn, this.oneKeyRefineBtn);
	}

	public updateAll():void {
		super.updateAll();
		let itemCfg:any = ConfigManager.item.getByPk(this.useItemCode);
		if(itemCfg) {
			let iconUrl:string = URLManager.getIconUrl(itemCfg.icon,URLManager.ITEM_ICON);
			this.costIcon.load(iconUrl);
			this.propIcon.load(iconUrl);
		}
		this.updateAttrList();
		let items:ForgeRefineItem[] = this.listItem.list._children as ForgeRefineItem[];
		let lv:number = this.level % items.length;
		let maxLv:number = ConfigManager.mgStrengthenEx.getMaxLevel(this.type);
		for(let i:number = 0; i < items.length; i ++) {
			if(lv == i){
				this.lastUpdateIndex = i;
				items[i].setItemSelected(true);
				this.curItem.setData(items[i].getData(),i);
				this.curItem.updateLevel(this.level);
				this.nextItem.setData(items[i].getData(),i);
				if(this.level + 1 >= maxLv) {
					this.nextItem.updateLevel(maxLv);
				}
				else {
					this.nextItem.updateLevel(this.level+1);
				}
				// if(i == 0){
				// 	this.stopOneKey();
				// 	App.TimerManager.remove(this.clickPromote, this);
				// }
			}
			else {
				items[i].setItemSelected(false);
			}
			items[i].updateLevel(this.level);
		}
		this.updateProp();
		this.playEffect();
		// this.updateOneKeyBtn();
	}

	public set roleIndex(roleIndex: number) {
        this._roleIndex = roleIndex;
        // this.stopOneKey();
        this.updateAll();

		// if(this.mcSuccess != null){
		// 	this.mcSuccess.removeFromParent();
		// 	this.mcSuccess.playing = false;
		// }
		for(let i = 0; i < this.listItem.list.numItems; i++){
			let item: ForgeRefineItem = <ForgeRefineItem>this.listItem.list._children[i];
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

	/**精炼 */
	private clickRefine(): void {
		if (this.isMax) {
            Tip.showOptTip(LangForge.L14);
            return;
        }
		if (this.isCanUpgrade) {
			this.startLevel = this.level;
			this.isCanPlayMc = true;
			EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, this.type, this.roleIndex);
		} else {
			this.clickGet();
			let itemCfg: any = ConfigManager.item.getByPk(this.useItemCode);
			Tip.showOptTip(App.StringUtils.substitude(LangForge.L15, itemCfg.name));
		}
	}

	/**一键精炼 */
	private clickOneKeyRefine(): void {
		if (this.isMax) {
            Tip.showOptTip(LangForge.L14);
            return;
        }
		if (this.isCanUpgrade) {
			this.startLevel = this.level;
			this.isCanPlayMc = true;
			EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, this.type, this.roleIndex, false, 0, true);
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
	// 		this.refineBtn.text = LangForge.L10[0];
    //     } else {
    //         this.refineBtn.text = LangForge.L10[1];
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
    //         Tip.showTip(LangForge.L11);
    //         this.stopOneKey();
    //         return;
    //     }
    //     if (this.isCanUpgrade) {
	// 		this.isCanPlayMc = true;
    //         EventManager.dispatch(LocalEventEnum.PlayerStrengthExUpgrade, this.type, this.roleIndex);
    //     } else {
    //         if (!isAuto) {//一键提升材料不足时不弹窗
    //             this.clickGet();
    //         }
    //         Tip.showTip(LangForge.L4);
    //         this.stopOneKey();
    //     }
    // }

	private clickGet():void {
		EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.PropGet, { "itemCode": this.useItemCode });
	}

	public updateBySUpgradeStrengthenEx():void {
		this.updateAll();
		this.playerSuccessMc();
		App.SoundManager.playEffect(SoundName.Effect_QiangHuaChengGong);

		// this.isCanContinuePromote = true;
        // if (this.isOneKeyPromoteing) {
        //     App.TimerManager.doDelay(50, this.clickPromote, this);
        // }
	}

	private playEffect():void {
		this.stopEffect();
		this.mcLeft.setPlaySettings(0,-1,1,-1);
		this.mcRight.setPlaySettings(0,-1,1,-1,function(){
			this.playFull();
		},this);
		this.mcLeft.visible = true;
		this.mcRight.visible = true;
		this.mcLeft.playing = true;
		this.mcRight.playing = true;
	}

	private playFull():void {
		this.mcLeft.playing = false;
		this.mcRight.playing = false;
		this.mcLeft.visible = false;
		this.mcRight.visible = false;
		this.maskObj.height = 100;
		this.mcFull.setPlaySettings(0,-1,-1,-1);
		this.mcFull.playing = true;
		egret.Tween.get(this.maskObj).to({height:230},500);
	}

	private stopEffect():void {
		egret.Tween.removeTweens(this.maskObj);
		this.maskObj.height = 0;
		this.mcLeft.playing = false;
		this.mcRight.playing = false;
		this.mcFull.playing = false;
	}

	// private onReadyHandler():void {
	// 	this.playEffect();
	// }

	/**
	 * 播放特效
	 */
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
				let baseItem: ForgeRefineItem = <ForgeRefineItem>this.listItem.list._children[itemIndex];
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
			// 	this.mcSuccess.x = -209;
			// 	this.mcSuccess.y = -209;
			// }
			// let items:ForgeRefineItem[] = this.listItem.list._children as ForgeRefineItem[];
			// let item: ForgeRefineItem = items[this.lastUpdateIndex];
			// if (item) {
			// 	item.addChild(this.mcSuccess);
			// 	this.mcSuccess.setPlaySettings(0, -1, 1, -1, function (): void {
			// 		this.mcSuccess.removeFromParent();
			// 		this.mcSuccess.playing = false;
			// 	}, this);
			// 	this.mcSuccess.playing = true;
			// }
		}
	}

	/**
	 * 更新道具
	 */
	public updateProp(): void {
		let count: number = CacheManager.pack.propCache.getItemCountByCode2(this.useItemCode);
		let costNum: number = this.cfg.useItemNum;
		let color: string = Color.GreenCommon;
		if (costNum > count) {
			color = Color.RedCommon;
		}
		this.costTxt.text = `<font color="${color}">${count}/${costNum}</font>`;
		this.isCanUpgrade = count >= costNum;
		this.isMax = this.cfg.strengthenLevel >= ConfigManager.mgStrengthenEx.getMaxLevel(EStrengthenExType.EStrengthenExTypeRefine);

		// if (this.isMax || !this.isCanUpgrade) {//达到最高等级/不可提升
        //     this.stopOneKey();
        // }
		this.updateBtn();
	}

	public updateBtn(): void{
		if(CacheManager.checkPoint.curFloor < 14){
			this.c1.selectedIndex = 0;
			CommonUtils.setBtnTips(this.refineBtn, this.isCanUpgrade);
		}else{
			this.c1.selectedIndex = 1;
			CommonUtils.setBtnTips(this.refineBtn, false);
			CommonUtils.setBtnTips(this.oneKeyRefineBtn, this.isCanUpgrade);
		}
	}
	/**
	 * 更新属性列表
	 */
	private updateAttrList(): void {
		let attrListData: Array<AttrInfo> = StrengthenExUtil.getAttrListData(this.type, this.level);
		var info = CacheManager.role.getPlayerStrengthenExtInfo(this.type, this.roleIndex);
		if(info && info.addRate) {
			for(let i = 0;i<attrListData.length; i++) {
				attrListData[i].value +=  attrListData[i].value * info.addRate /100;
				attrListData[i].value = Math.floor(attrListData[i].value);
				attrListData[i].addValue += attrListData[i].addValue * info.addRate /100;
				attrListData[i].addValue = Math.floor(attrListData[i].addValue);
			}
		}
		this.list_attr.data = attrListData;
	}
}