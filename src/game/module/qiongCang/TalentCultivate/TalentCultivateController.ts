class TalentCultivateController extends SubController {
    private talentReplaceWindow: TalentReplaceWindow;
    private talentAttrDetailView: TalentAttrDetailView;
    private talentSkillResetView: TalentSkillResetView;
    private talentSkillTip: TalentSkillTip;

	public constructor() {
		super();
	}

	public getModule(): BaseModule {
		return this._module;
	}

	protected addListenerOnInit():void {
		this.addListen0(NetEventEnum.moneyTalentExp, this.onUpdateMoney, this);//天赋经验更新
        this.addListen0(LocalEventEnum.TaskPlayerTaskUpdated, this.taskPlayerTaskUpdated, this);
        this.addListen0(NetEventEnum.CultivateInfoUpdateTalent, this.updateTalent, this);//养成系统更新
        this.addListen0(NetEventEnum.packPosTypePropChange, this.onPropUpdate, this);
        this.addListen0(LocalEventEnum.TalentReplaceWindowOpen, this.openReplaceWindow, this);
        this.addListen0(LocalEventEnum.TalentReplaceWindowHide, this.hideReplaceWindow, this);
        this.addListen0(LocalEventEnum.TalentAttrDetailViewOpen, this.openAttrDetailView, this);
        this.addListen0(LocalEventEnum.TalentSkillResetViewOpen, this.openSkillResetView, this);
        this.addListen0(LocalEventEnum.TalentSkillTipOpen, this.openSkillTip, this);
    }

    public addListenerOnShow(): void {

    }

	private onUpdateMoney(): void{
        if(this.isShow) {
            (this._module as QiongCangModule).onUpdateMoney();
        }
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.QiongCang,CacheManager.talentCultivate.checkTips());
	}

    /**
     * 任务更新
     */
	private taskPlayerTaskUpdated(data: any=null): void {
        if(this.isShow) {
            (this._module as QiongCangModule).onTaskPlayerTaskUpdated();
        }
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.QiongCang,CacheManager.talentCultivate.checkTips());
    }

    /**
     * 天赋培养更新
     */
    private updateTalent(): void{
        if(this.isShow) {
            (this._module as QiongCangModule).onTalentUpdate();
        }
        if(this.talentSkillTip && this.talentSkillTip.isShow){
            //更新界面
            this.talentSkillTip.updateTips();
        }
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.QiongCang,CacheManager.talentCultivate.checkTips());
    }

    /**道具背包更新 */
    private onPropUpdate(): void{
        if(this.isShow) {
            (this._module as QiongCangModule).onPropUpdate();
        }
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.QiongCang,CacheManager.talentCultivate.checkTips());
    }

    private openReplaceWindow(data: any): void {
		if (!this.talentReplaceWindow) {
			this.talentReplaceWindow = new TalentReplaceWindow();
		}
		this.talentReplaceWindow.show(data);
	}

    private hideReplaceWindow(): void{
        if (this.talentReplaceWindow && this.talentReplaceWindow.isShow) {
			this.talentReplaceWindow.hide();
		}
    }

    private openAttrDetailView(roleIndex: number): void {
		if (!this.talentAttrDetailView) {
			this.talentAttrDetailView = new TalentAttrDetailView();
		}
		this.talentAttrDetailView.show(roleIndex);
	}

    private openSkillResetView(roleIndex: number): void {
		if (!this.talentSkillResetView) {
			this.talentSkillResetView = new TalentSkillResetView();
		}
		this.talentSkillResetView.show(roleIndex);
	}

    private openSkillTip(data: any): void {
		if (!this.talentSkillTip) {
			this.talentSkillTip = new TalentSkillTip();
		}
		this.talentSkillTip.show(data);
	}
}