/**
 * 熔炼窗口
 */
class PackSmeltWindow extends BaseWindow {
	private itemList: List;
	private smeltBtn: fairygui.GButton;
	private bgLoader: GLoader;
	/**是否一键熔炼中 */
	private isOneKeySmelting: boolean = false;
	private itemDatas: Array<ItemData>;
	private showItemDatas: Array<ItemData>;
	private maxSize: number = 9;
	private isCanOneKey: boolean;
	/**熔炼结果未返回之前不能继续熔炼 */
	private isCanContinueSmelt: boolean = true;
	private mcs: Array<UIMovieClip>;
    private openPrivilegeBtn: fairygui.GButton;
    private c1: fairygui.Controller;

	public constructor() {
		super(PackNameEnum.Pack, "WindowSmelt");
		this.isPopup = true;
	}

	public initOptUI(): void {
		this.bgLoader = this.getGObject("loader_bg") as GLoader;
		this.itemList = new List(this.getGObject("list_item").asList);
		this.itemList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickItem, this);
		this.smeltBtn = this.getGObject("btn_smelt").asButton;
		this.smeltBtn.sound = "";
		this.smeltBtn.addClickListener(this.clickSmelt, this);
		this.closeObj.visible = true;
		GuideTargetManager.reg(GuideTargetName.PackSmeltBtn, this.smeltBtn);

        this.openPrivilegeBtn = this.getGObject("btn_privilege").asButton;
        this.openPrivilegeBtn.addClickListener(this.onOpenPrivilege, this);
        this.c1 = this.getController('c1');

		this.bgLoader.load(URLManager.getModuleImgUrl("bg/popup_bg.png", PackNameEnum.Common));
	}

	public updateAll(data: any = null): void {
		if (this.isShow) {
			this.isCanContinueSmelt = true;
			this.isCanOneKey = CacheManager.welfare2.isPrivilegeCard;//CacheManager.vip.vipLevel > 0;
			this.updateSmeltBtn();

			this.itemDatas = CacheManager.pack.backPackCache.getEquipsCanSmelt();
			this.showItemDatas = [];
			for (let i: number = 0; i < this.maxSize; i++) {
				if (i < this.itemDatas.length) {
					this.showItemDatas.push(this.itemDatas[i]);
				} else {
					this.showItemDatas.push(null);
				}
			}
			this.showItemDatas.sort(function (a: ItemData, b: ItemData): number {
				if (a != null && b == null) {
					return -1;
				}
				if (a == null && b != null) {
					return 1;
				}
				if (a != null && b != null) {
					let aCareer: number = CareerUtil.getBaseCareer(a.getCareer());
					let bCareer: number = CareerUtil.getBaseCareer(b.getCareer());
					return aCareer - bCareer;
				}
				return -1;
			});
			this.itemList.data = this.showItemDatas;
			let baseItem: BaseItem;
			for (let item of this.itemList.list._children) {
				baseItem = <BaseItem>item;
				baseItem.enableToolTip = false;
				baseItem.bgVisible = true;
				baseItem.bgUrl = `ui://${PackNameEnum.Pack}/item_bg`;
			}

			this.c1.selectedIndex = CacheManager.welfare2.isPrivilegeCard ? 1 : 0;
		}

	}

	public onHide(param: any = null): void {
		super.onHide();
		this.isOneKeySmelting = false;
		this.updateSmeltBtn();
	}

	private updateSmeltBtn(): void {
		if (this.isCanOneKey) {
			this.smeltBtn.title = this.isOneKeySmelting ? "取消熔炼" : "一键熔炼";
		} else {
			this.smeltBtn.title = "熔  炼";
		}
	}

	private clickSmelt(): void {
		if (this.isOneKeySmelting) {
			this.isOneKeySmelting = false;
			this.updateSmeltBtn();
			return;
		}

		if (!this.isCanContinueSmelt) {
			return;
		}
		if (this.isCanOneKey) {
			if (this.isOneKeySmelting) {
				this.isOneKeySmelting = false;
			} else {
				this.isOneKeySmelting = true;
				this.smelt(true);
			}
		} else {
			this.smelt(true);
		}
		this.updateSmeltBtn();
	}

	/**
	 * 熔炼成功。
	 * 需要将装备从背包中删除，因为熔炼成功的消息在背包更新之前到
	 */
	public smeltSuccess(): void {
		for (let itemData of this.showItemDatas) {
			if (itemData) {
				CacheManager.pack.backPackCache.removeItemByUid(itemData.getUid());
			}
		}

		this.playerSmeltSuccessEffect();
		this.updateAll();
		this.isCanContinueSmelt = true;
		if (this.isOneKeySmelting) {
			App.TimerManager.doDelay(50, this.smelt, this);
		}
		App.SoundManager.playEffect(SoundName.Effect_RongLian);
	}

	private smelt(isAlert: boolean = false): void {
		let uids: Array<string> = [];
		for (let itemData of this.showItemDatas) {
			if (itemData != null) {
				uids.push(itemData.getUid());
			}
		}
		if (uids.length > 0) {
			ProxyManager.pack.meltEquip(EPlayerItemPosType.EPlayerItemPosTypeBag, uids);
			this.isCanContinueSmelt = false;
		} else {
			if (isAlert && (typeof isAlert) == "boolean")
				Tip.showCenterTip(LangPack.L5);
			if (this.isOneKeySmelting) {
				this.isOneKeySmelting = false;
			}
			this.updateSmeltBtn();
		}
	}

	/**
	 * 播放熔炼成功特效
	 */
	private playerSmeltSuccessEffect(): void {
		let mc: UIMovieClip;
		if (this.mcs == null) {
			this.mcs = [];
			for (let i: number = 0; i < this.maxSize; i++) {
				// mc = fairygui.UIPackage.createObject(PackNameEnum.MovieClip, "MCMelting").asMovieClip;
				mc = UIMovieManager.get(PackNameEnum.MCMelting);
				this.mcs.push(mc);
			}
		}

		let baseItem: BaseItem;
		for (let i: number = 0; i < this.maxSize; i++) {
			baseItem = <BaseItem>this.itemList.list._children[i];
			if (baseItem.itemData == null) {
				continue;
			}
			let mc: UIMovieClip = this.mcs[i];
			mc.x = -66;
			mc.y = -68;
			baseItem.addChild(mc);
			mc.setPlaySettings(0, -1, 1, -1, () => {
				if (mc && mc.parent != null) {
					mc.removeFromParent();
				}
				mc.playing = false;
			}, this);
			mc.playing = true;
		}
	}

	/**点击物品项 */
	private onClickItem(e: fairygui.ItemEvent): void {
		let baseItem: BaseItem = <BaseItem>e.itemObject;
		if (baseItem.itemData == null) {
			return;
		}
		this.showItemDatas.splice(this.showItemDatas.indexOf(baseItem.itemData), 1);
		baseItem.itemData = null;
	}

    private onOpenPrivilege() {
        HomeUtil.open(ModuleEnum.Welfare2, false, {tabType: PanelTabType.PrivilegeCard});
        this.hide();
    }
}