class QiongCangModule extends BaseTabModule {
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.QiongCang);
	}

	public initOptUI():void {
		super.initOptUI();
		this.className = {
			[PanelTabType.TalentCultivate] : ["TalentCultivateView",TalentCultivateView,PackNameEnum.TalentCultivate],
			[PanelTabType.QiongCangCopy] : ["QiongCangCopyPanel",QiongCangCopyPanel,PackNameEnum.QiongCangCopy],
			[PanelTabType.QCSmelt] : ["QiongCangSmeltPanel",QiongCangSmeltPanel,PackNameEnum.QiongCangSmelt],
			[PanelTabType.QiongCangBoss] : ["QiongCangBossPanel",QiongCangBossPanel,PackNameEnum.QiongCangBoss],
		}
	}

	public updateAll():void {
		this.setBtnTips(PanelTabType.QiongCangCopy,CacheManager.qcCopy.checkTips());
		this.setBtnTips(PanelTabType.QiongCangBoss,CacheManager.bossNew.checkQiongCangBossTips());
		this.checkTalentCultivateTips();
	}

	protected updateSubView():void{
		this.descBtn.visible = this.isTypePanel(PanelTabType.QiongCangBoss);
		if(this.isTypePanel(PanelTabType.QiongCangCopy)){
			EventManager.dispatch(LocalEventEnum.GetRankList,EToplistType.ETopListTypeQiongCangDreamland);
		}
		if(this.curPanel instanceof QiongCangBossPanel){
			this.tabBgType = TabBgType.None;
		}else{
			this.tabBgType = TabBgType.Default;
		}
	}

	public updateRank(data:any[]):void{
		if(this.isTypePanel(PanelTabType.QiongCangCopy)){
			(this.curPanel as QiongCangCopyPanel).updateRank(data);
		}
	}
	public updateQCSmelt(data:any):void{
		if(this.isTypePanel(PanelTabType.QCSmelt)){
			(this.curPanel as QiongCangSmeltPanel).updateAll(data);
		}
	}
	public onTaskPlayerTaskUpdated(): void {
	    if(this.curPanel instanceof TalentCultivateView) {
	        this.curPanel.onTaskPlayerTaskUpdated();
        }
		this.checkTalentCultivateTips();
    }

	public onUpdateMoney(): void {
	    if(this.curPanel instanceof TalentCultivateView) {
	        this.curPanel.onUpdateMoney();
        }
		this.checkTalentCultivateTips();
    }

	public onTalentUpdate(): void{
		if(this.curPanel instanceof TalentCultivateView) {
	        this.curPanel.onTalentUpdated();
        }
		this.checkTalentCultivateTips();
	}

	public onPropUpdate(): void {
	    if(this.curPanel instanceof TalentCultivateView) {
	        this.curPanel.onPropUpdate();
        }
		this.checkTalentCultivateTips();
    }

	protected clickDesc():void {
		let tipStr:string = "";
		if(this.isTypePanel(PanelTabType.QiongCangBoss)) {
			tipStr = LangQiongCang.LANG3;
		}
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:tipStr});
	}

	public checkQiongCangBossTips():void {
		if(this.isTypePanel(PanelTabType.QiongCangBoss)) {
			this.curPanel.updateAll();
		}
		this.setBtnTips(PanelTabType.QiongCangBoss,CacheManager.bossNew.checkQiongCangBossTips());
	}

	/**天赋页签红点 */
	public checkTalentCultivateTips(): void{
		this.setBtnTips(PanelTabType.TalentCultivate,CacheManager.talentCultivate.checkTalentTip());
	}
}