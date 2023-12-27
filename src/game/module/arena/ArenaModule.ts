class ArenaModule extends BaseTabModule {
	public constructor(moduleId:ModuleEnum) {
		super(moduleId,PackNameEnum.Arena);
	}

	public initOptUI():void {
		super.initOptUI();
		this.descBtn.visible = true;
	}

	protected initTabInfo():void {
        this.className = {
			[PanelTabType.Encounter]:["EncounterPanel",EncounterPanel,PackNameEnum.Encounter]
			, [PanelTabType.KingBattle]:["KingBattlePanel",KingBattlePanel,PackNameEnum.KingBattle]
			, [PanelTabType.Mining]:["MiningPanel",MiningPanel,PackNameEnum.Mining]
		};
	}

    protected changeTitle():void{
        if(this.curIndex == -1) return;
        if(!this.isTypePanel(PanelTabType.Mining)) {
            this.title = ModuleEnum[this.moduleId] + "_0";
		} else {
            this.title = ModuleEnum[this.moduleId] + "_1";
		}
    }

	public updateAll():void {
		// this.setIndex(PanelTabType.KingBattle);
		this.checkAllTips();
	}

	protected updateSubView():void {
		this.bottomArea = this.isTypePanel(PanelTabType.KingBattle);
	}

	public onCopyInfoUpdate():void {
		if(this.isTypePanel(PanelTabType.KingBattle)) {
			(this.curPanel as KingBattlePanel).updateTimeCount();
		}
		this.setBtnTips(PanelTabType.KingBattle,CacheManager.arena.checkKingBattleTips());
	}

	public updateKingBattleInfo():void {
		if(this.isTypePanel(PanelTabType.KingBattle)) {
			this.curPanel.updateAll();
		}
	}

    public updateEncounterInfo():void {
        if(this.isTypePanel(PanelTabType.Encounter)) {
			this.curPanel.updateInfo();
        }
    }

	private checkAllTips():void {
		this.setBtnTips(PanelTabType.KingBattle,CacheManager.arena.checkKingBattleTips());
		this.setBtnTips(PanelTabType.Mining,CacheManager.mining.checkTips());
	}

	protected clickDesc():void {
		let tipStr:string = "";
		if(this.isTypePanel(PanelTabType.Encounter)) {
			tipStr = LangArena.LANG13;
		}
		else if(this.isTypePanel(PanelTabType.KingBattle)) {
			tipStr = LangArena.LANG1;
		}
		else if(this.isTypePanel(PanelTabType.Mining)) {
			tipStr = LangMining.LANG1;
		}
		if(tipStr == "") return;
		EventManager.dispatch(UIEventEnum.BossExplainShow,{desc:tipStr});
	}
}