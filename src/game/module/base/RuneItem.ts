/**
 * 单个符文
 */
class RuneItem extends ListRenderer {
    private bgLoader: GLoader;
    private iconLoader: GLoader;
    public colorLoader: GLoader;
    private nameTxt: fairygui.GRichTextField;
    public numTxt: fairygui.GTextField;
    private mcColor: UIMovieClip;

    private toolTipData: ToolTipData;
    private _itemData: ItemData;
    private amount: number = 1;
    private itemName: string;
    /**是否显示金色特效 */
	public isShowGoldMc: boolean = true;
    /**金色额外特效 */
	private goldMc: UIMovieClip;

    public constructor() {
        super();
    }

    public constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.bgLoader = this.getChild("loader_bg") as GLoader;
        this.iconLoader = this.getChild("loader") as GLoader;
        this.colorLoader = this.getChild("loader_color") as GLoader;
        this.nameTxt = this.getChild("txt_name").asRichTextField;
        this.numTxt = this.getChild("txt_num").asTextField;
        this.addClickListener(this.click, this);
    }

    public setData(data: any): void {
        // this._data = data;
        this.itemData = <ItemData>data;
    }

    public set itemData(itemData: ItemData) {
        this._itemData = itemData;
        if (this.itemData) {
            this.itemName = "";
            this.amount = this.itemData.getItemAmount();
            this.itemName = this.itemData.getColorString(this.itemData.getName());
            if (!ItemsUtil.isRuneZero(itemData)) {
                let level: number = this.itemData.getItemExtInfo().level ? this.itemData.getItemExtInfo().level : 1;
                this.itemName += this.itemData.getColorString(` Lv.${level}`);
            }
            this.nameTxt.text = this.itemName;
            this.numTxt.text = this.amount > 1 ? this.amount.toString() : "";
            this.iconLoader.load(this.itemData.getIconRes());
            this.colorLoader.load(itemData.getColorRes());
            this.addItemEff();
            CommonUtils.setBtnTips(this, ItemsUtil.isRedTipCanUse(itemData));
            this.showGoldMc(this.itemData.getColor() == EColor.EColorGold);
        } else {
            this.nameTxt.text = "";
            this.numTxt.text = "";
            this.iconLoader.clear();
            this.colorLoader.clear();
            this.removeEff();
            CommonUtils.setBtnTips(this, false);
            this.showGoldMc(false);
        }
    }

    /**设置名称文本 */
    public setNameText(text: string): void {
        this.nameTxt.text = text;
    }

    /**
	 * 设置名称文本是否可见
	 */
    public setNameVisible(value: boolean): void {
        if (this.nameTxt.visible != value) {
            this.nameTxt.visible = value;
        }
    }

    /**
	 * 设置背景图片
	 */
    public set bgUrl(url: string) {
        this.bgLoader.load(url);
    }

    private addItemEff(): void {
        this.removeEff();
        this.addEff();
    }

    private addEff(): boolean {
        let flag: boolean = false;
        let pkgName: string = this.getColotEffectName();
        if (pkgName) {
            flag = true;
            this.mcColor = UIMovieManager.get(pkgName, -195, -197, 1, 1);
            this.mcColor.frame = 0;
            this.mcColor.visible = true;
            this.mcColor.playing = true;
            this.mcColor.grayed = false; //创建的时候都不是灰的
            this.addChild(this.mcColor);
            // this.swapChildren(this.imgSelect, this.mcColor);
            let redPoint: fairygui.GObject = this.getChild(CommonUtils.redPointName);
            if (redPoint) {
                this.setChildIndex(redPoint, this.numChildren - 1);
            }
        }
        return flag;
    }
    private removeEff(): void {
        if (this.mcColor) {
            UIMovieManager.push(this.mcColor);
            this.mcColor = null;
        }
    }
    private getColotEffectName(): string {
        let pkgName: string = "";
        if (this._itemData && this._itemData.isNeedEffect()) {
            pkgName = PackNameEnum[`MCItemColor${this._itemData.getColor()}`];
        }
        return pkgName;
    }

    public get itemData(): ItemData {
        return this._itemData;
    }

    /**点击弹出tooltip */
    private click(): void {
        if (this.itemData) {
            if (this.itemData.getUid() != null && this.itemData.isCanUseInPack && CacheManager.pack.runePackCache.hasItem(this.itemData)) {
                EventManager.dispatch(UIEventEnum.PackUseOpen, this.itemData);
                return;
            }
            if (!this.toolTipData) {
                this.toolTipData = new ToolTipData();
            }
            this.toolTipData.isEnableOptList = false;
            this.toolTipData.data = this.itemData;
            this.toolTipData.type = ItemsUtil.getToolTipType(this.itemData);
            ToolTipManager.show(this.toolTipData);
        }
        this.selected = false;
    }

    /**显示金色特效 */
	private showGoldMc(isShow: boolean): void {
		if (isShow && this.isShowGoldMc) {
			if (!this.goldMc) {
				this.goldMc = UIMovieManager.get(PackNameEnum.MCEquipBest, 61, 58, 0.7, 0.7);
				this.goldMc.setSize(170, 170);
				this.goldMc.setPivot(0.5, 0.5, true);
			}
			this.addChild(this.goldMc);
		} else {
			if (this.goldMc) {
				this.goldMc.removeFromParent();
			}
		}
	}
}