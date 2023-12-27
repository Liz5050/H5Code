class BeastExtendWindow extends BaseWindow {
	private baseItem: BaseItem;
	private closeBtn: fairygui.GButton;
	private useBtn: fairygui.GButton;
	private ownTxt: fairygui.GTextField;
	private useTxt: fairygui.GRichTextField;

	private isCanExtend: boolean;
	private isMax: boolean;

	public constructor() {
		super(PackNameEnum.BeastBattle, "BeastExtendWindow");
	}

	public initOptUI(): void {
		this.baseItem = <BaseItem>this.getGObject("baseItem");
		this.closeBtn = this.getGObject("btn_close").asButton;
		this.useBtn = this.getGObject("btn_use").asButton;
		this.ownTxt = this.getGObject("txt_own").asTextField;
		this.useTxt = this.getGObject("txt_use").asRichTextField;
		this.useBtn.addClickListener(this.clickUseBtn, this);
		this.closeBtn.addClickListener(this.clickCloseBtn, this);
		this.baseItem.isShowName = false;
	}

	public updateAll(): void {
		let ownNum: number = CacheManager.pack.propCache.getItemCountByCode(ItemCodeConst.BeastAddNum);
		let maxBattleNum: number = CacheManager.beastBattle.maxBattleNum;
		let curExtendNum: number = maxBattleNum - 3 + 1;
		let beckonCfg: any = ConfigManager.mgBeastBeckonNum.getByPk(curExtendNum);
		this.baseItem.itemData = new ItemData(ItemCodeConst.BeastAddNum);
		this.ownTxt.text = App.StringUtils.substitude(LangBeast.LANG6, ownNum);
		if(beckonCfg){
			this.useTxt.text = App.StringUtils.substitude(LangBeast.LANG7, CacheManager.beastBattle.maxBattleNum, beckonCfg.costNum);
			this.isCanExtend = ownNum >= beckonCfg.costNum;
		}else{
			this.useTxt.text = LangBeast.LANG8;
			this.isCanExtend = ownNum > 0;
		}
		this.isMax = !beckonCfg;
		this.ownTxt.color = this.isCanExtend ? Color.Green : Color.Red2;
	}

	private clickUseBtn(): void{
		if(this.isMax){
			Tip.showTip(LangBeast.LANG8);
		}else{
			if(this.isCanExtend){
				EventManager.dispatch(LocalEventEnum.BeastBattleAddMaxBeckonNum);
				this.hide();
			}else{
				Tip.showTip(LangBeast.LANG9);
			}
		}
	}

	private clickCloseBtn(): void{
		this.hide();
	}

}
