class LotteryModule extends BaseTabModule {
	// private equipTitleMc:LotteryEquipTitleMCView;
	public constructor(moduleId:ModuleEnum) {
		super(ModuleEnum.Lottery,PackNameEnum.Lottery);
		this.indexTitle = false;
	}
	
	public initOptUI():void {
		super.initOptUI();
		this.className = {
			[PanelTabType.LotteryEquip]:["LotteryEquipPanel",LotteryEquipPanel],
			[PanelTabType.LotteryRune]:["LotteryRunePanel",LotteryRunePanel], 
			// [PanelTabType.LotteryAncient]:["LotteryAncientPanel",LotteryAncientPanel]
		};
		this.tabBgType = TabBgType.High;
		// this.equipTitleMc = new LotteryEquipTitleMCView(this.getGObject("mc_title_container").asCom);
	}

	public updateAll(data?:any):void {
		// let type:PanelTabType = PanelTabType.LotteryEquip;
		// if(data && data.tabType) {
		// 	type = data.tabType;
		// }
		// this.setIndex(type);
		this.checkAllBtnTips();
	}

	/**
	 * 寻宝信息更新
	 */
	public updateLotteryInfo():void {
		(this.curPanel as LotteryBaseTabPanel).updateLotteryInfo();
		if(this.isTypePanel(PanelTabType.LotteryRune)) {
			this.setBtnTips(PanelTabType.LotteryRune,CacheManager.lottery.checkLotteryTips(LotteryCategoryEnum.LotteryRune));
		}
		else if(this.isTypePanel(PanelTabType.LotteryAncient)) {
			this.setBtnTips(PanelTabType.LotteryAncient,CacheManager.lottery.checkLotteryTips(LotteryCategoryEnum.LotteryAncient));
		}
	}

	/**
	 * 寻宝记录更新
	 */
	public updateRecord():void {
		(this.curPanel as LotteryBaseTabPanel).updateRecord();
	}

	/**
	 * 道具背包更新
	 */
	public onPosTypeBagChange():void {
		(this.curPanel as LotteryBaseTabPanel).onPosTypeBagChange();
		this.checkAllBtnTips();
	}

	/**
	 * 装备寻宝仓库更新
	 */
	public onLotteryEquipBagUpdate():void {
		if(this.isTypePanel(PanelTabType.LotteryEquip)) {
			(this.curPanel as LotteryEquipPanel).onLotteryEquipBagUpdate();
		}
		this.setBtnTips(PanelTabType.LotteryEquip,CacheManager.lottery.checkLotteryTips(LotteryCategoryEnum.LotteryEquip));
	}

	/**
	 * 战纹寻宝仓库更新
	 */
	public onLotteryRuneBagUpdate():void {
		if(this.isTypePanel(PanelTabType.LotteryRune)) {
			(this.curPanel as LotteryRunePanel).onLotteryRuneBagUpdate();
		}
		this.setBtnTips(PanelTabType.LotteryRune,CacheManager.lottery.checkLotteryTips(LotteryCategoryEnum.LotteryRune));
	}

	/**
	 * 混元寻宝仓库更新
	 */
	public onLotteryAncientBagUpdate():void {
		if(this.isTypePanel(PanelTabType.LotteryAncient)) {
			(this.curPanel as LotteryAncientPanel).onLotteryAncientBagUpdate();
		}
		this.setBtnTips(PanelTabType.LotteryAncient,CacheManager.lottery.checkLotteryTips(LotteryCategoryEnum.LotteryAncient));
	}

	private checkAllBtnTips():void {
		this.setBtnTips(PanelTabType.LotteryEquip,CacheManager.lottery.checkLotteryTips(LotteryCategoryEnum.LotteryEquip));
		this.setBtnTips(PanelTabType.LotteryRune,CacheManager.lottery.checkLotteryTips(LotteryCategoryEnum.LotteryRune));
		// this.setBtnTips(PanelTabType.LotteryAncient,CacheManager.lottery.checkLotteryTips(LotteryCategoryEnum.LotteryAncient));
	}

	protected updateSubView():void {
		// if(this.isTypePanel(PanelTabType.LotteryEquip)) {
		// 	this.equipTitleMc.show();
		// }
		// else if(this.equipTitleMc.isShow){
		// 	this.equipTitleMc.hide();
		// }
		let category:LotteryCategoryEnum = (this.curPanel as LotteryBaseTabPanel).category;
		if(!CacheManager.lottery.isClick[category]) {
			CacheManager.lottery.isClick[category] = true;
			// this.setBtnTips(this.curType,CacheManager.lottery.checkLotteryTips(category));
			// EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.Lottery,CacheManager.lottery.checkAllTips());
		}
	}

	public hide():void {
		super.hide();
		// if(this.equipTitleMc.isShow) {
		// 	this.equipTitleMc.hide();
		// }
	}
}