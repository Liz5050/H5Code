class BeastBattleController extends SubController {
	private equipReplaceWindow: BeastEquipReplaceWindow;
    private equipDecomposeWindow: BeastEquipDecomposeWindow;
    private beastExtendWindow: BeastExtendWindow;
    private beastSkillTip: BeastSkillTip;

	public constructor() {
		super();
	}

	public getModule(): BaseModule {
		return this._module;
	}

	public get module(): MagicWareModule{
		return this._module;
	}

	protected addListenerOnInit():void {
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateBeastInfos], this.onBeastInfos, this);
		this.addMsgListener(EGateCommand[EGateCommand.ECmdGateBeastInfoUpdate], this.onBeastInfoUpdate, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameBeastAddMaxBeckonNum], this.onAddMaxBeckonNum, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameBeastEquipStrengthen], this.onBeastEquipStrengthen, this);

        this.addListen0(NetEventEnum.packPosTypePropChange, this.packPosTypePropChange, this);

		this.addListen0(LocalEventEnum.BeastBattleDressEquip, this.dressEquip, this);
		this.addListen0(LocalEventEnum.BeastBattleUndressEquip, this.undressEquip, this);
		this.addListen0(LocalEventEnum.BeastBattleUndressEquipAll, this.undressEquipAll, this);
		this.addListen0(LocalEventEnum.BeastBattleBeckon, this.beckon, this);
		this.addListen0(LocalEventEnum.BeastBattleRecall, this.recall, this);
		this.addListen0(LocalEventEnum.BeastBattleAddMaxBeckonNum, this.addMaxBeckonNum, this);
		this.addListen0(LocalEventEnum.BeastBattleStrengthenEquip, this.strengthenEquip, this);
		this.addListen0(LocalEventEnum.BeastBattleDecomposeEquip, this.decomposeEquip, this);
		this.addListen0(UIEventEnum.BeastEquipReplaceWindowOpen, this.beastEquipReplaceWindowOpen, this);
		this.addListen0(UIEventEnum.BeastEquipReplaceWindowHide, this.beastEquipReplaceWindowHide, this);
        this.addListen0(UIEventEnum.BeastEquipDecomposeWindowOpen, this.beastEquipDecomposeWindowOpen, this);
        this.addListen0(UIEventEnum.BeastExtendWindowOpen, this.equipExtendWindowOpen, this);
        this.addListen0(LocalEventEnum.BeastShowSkillTips, this.onShowBeastSkillTips, this);
        
    }

    public addListenerOnShow(): void {
         
    }

	/**
	 * 登录更新神兽信息
	 * @param data SBeastInfos
	 */
	public onBeastInfos(data: any): void{
		CacheManager.beastBattle.info = data;
		if(this.module && this.module.isShow){
			this.module.updateBeastPanel();
		}
	}

	/**
	 * 更新 神兽信息
	 * @param data SBeastInfo
	 */
	private onBeastInfoUpdate(data: any): void{
		CacheManager.beastBattle.updateBeastInfo(data);
        if(this.module && this.module.isShow){
			this.module.updateBeastPanel();
		}
	}

    /**
	 * 增加上限成功
     * @param data S2C_SAddMaxBeckonNum
     */
	private onAddMaxBeckonNum(data: any): void {
        CacheManager.beastBattle.maxBattleNum = data.maxNum;
        if(this.module && this.module.isShow){
			this.module.updateBeastPanel();
		}
	}

    /**
     * 强化成功成功
     * @param data S2C_SBeastEquipStrengthen
     */
    private onBeastEquipStrengthen(data: any): void {

    }

    /**
	 * 道具背包更新
	 */
	private packPosTypePropChange(): void {
		if(this.module && this.module.isShow) {
			if(this.equipDecomposeWindow && this.equipDecomposeWindow.isShow) {
				this.equipDecomposeWindow.updateAll();
			}
            if(this.beastExtendWindow && this.beastExtendWindow.isShow) {
				this.beastExtendWindow.updateAll();
			}
		}
	}

    /**
	 * 穿戴装备
     */
    private dressEquip(data: any): void {
		ProxyManager.beastBattle.dressEquip(data.code, data.uid);
        this.beastEquipReplaceWindowHide();
	}

    /**
     * 卸下装备
     */
    private undressEquip(data: any): void {
        ProxyManager.beastBattle.undressEquip(data.code, data.holeId);
        this.beastEquipReplaceWindowHide();
    }

    /**
     * 卸下所有装备
     */
    private undressEquipAll(data: any): void {
        ProxyManager.beastBattle.undressEquipAll(data.code);
    }

    /**
     * 出战
     */
    private beckon(data: any): void {
        ProxyManager.beastBattle.beckon(data.code);
    }

    /**
     * 召回
     */
    private recall(data: any): void {
        ProxyManager.beastBattle.recall(data.code);
    }

    /**
     * 增加出战上限
     */
    private addMaxBeckonNum(): void {
        ProxyManager.beastBattle.addMaxBeckonNum();
    }

    /**
     * 强化装备
     */
    private strengthenEquip(data: any): void {
        ProxyManager.beastBattle.strengthenEquip(data.code, data.holeId);
    }

    /**
     * 分解装备
     */
    private decomposeEquip(data: any): void {
        ProxyManager.beastBattle.decomposeEquip({"key_S": data.uids, "value_I": data.amounts});
    }

    private beastEquipReplaceWindowOpen(data: any): void {
		if (!this.equipReplaceWindow) {
			this.equipReplaceWindow = new BeastEquipReplaceWindow();
		}
		this.equipReplaceWindow.show(data);
	}

    private beastEquipReplaceWindowHide(): void {
        if(this.equipReplaceWindow && this.equipReplaceWindow.isShow){
			this.equipReplaceWindow.hide();
		}
    }

    private beastEquipDecomposeWindowOpen(): void {
		if (!this.equipDecomposeWindow) {
            this.equipDecomposeWindow = new BeastEquipDecomposeWindow();
		}
		this.equipDecomposeWindow.show();
	}

    private equipExtendWindowOpen(): void {
		if (!this.beastExtendWindow) {
            this.beastExtendWindow = new BeastExtendWindow();
		}
		this.beastExtendWindow.show();
	}

    private onShowBeastSkillTips(skillID:any) : void {
		if(!this.beastSkillTip) {
			this.beastSkillTip = new BeastSkillTip();
		}
		this.beastSkillTip.show(skillID);
	}
}