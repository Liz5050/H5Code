/**
 * 必杀系统
 */

class UniqueSkillController extends BaseController{
	private uniqueSkillPanel: UniqueSkillPanel;

	private uniqueSkillAttrView: UniqueSkillAttrView;
	private uniqueSkillDetailView: UniqueSkillDetailView;
	private uniqueSkillSuitAttrView: UniqueSkillSuitAttrView;
	private uniqueSkillDecomposeWindow: UniqueSkillDecomposeWindow;
	private uniqueSkillExchangeWindow: UniqueSkillExchangeWindow;
	private uniqueSkillChipExchangeWindow: UniqueSkillChipExchangeWindow;

	public constructor() {
		super(ModuleEnum.UniqueSkill);
	}

	public addListenerOnInit(): void{
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameDecomposeKillSuccess], this.onDecomposeKillSuccess, this);//分解成功
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameExchangeKillSuccess], this.onExchangeKillSuccess, this);//兑换成功
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameExchangeKillFragmentSuccess], this.onExchangeKillFragmentSuccess, this);//必杀精华转换成功

		this.addListen0(NetEventEnum.CultivateInfoUpdateKill, this.updatePanel, this);//养成系统更新
		this.addListen0(NetEventEnum.moneyKillFragmentJunior, this.onUpdateMoney, this);//低级必杀精华更新
		this.addListen0(NetEventEnum.moneyKillFragmentSenior, this.onUpdateMoney, this);//高级必杀精华更新
		this.addListen0(NetEventEnum.packPosTypeBagChange, this.onBagChange, this);//装备背包更新
		this.addListen0(NetEventEnum.packBackPackItemsChange, this.onBagChange, this);//装备背包更新
		this.addListen0(NetEventEnum.roleStateChanged, this.onRoleStateChange, this);

		this.addListen0(UIEventEnum.UniqueSkillPanelOnOpen, this.uniqueSkillPanelOnOpen, this);//必杀面板打开

		this.addListen0(UIEventEnum.UniqueSkillAttrOpen, this.uniqueSkillAttrOpen, this);
		this.addListen0(UIEventEnum.UniqueSkillDetailOpen, this.uniqueSkillDetailOpen, this);
		this.addListen0(UIEventEnum.UniqueSkillChipDecomposeOpen, this.uniqueSkillChipDecomposeOpen, this);
		this.addListen0(UIEventEnum.UniqueSkillExchangeOpen, this.uniqueSkillExchangeOpen, this);
		this.addListen0(UIEventEnum.UniqueSkillSuitPreviewOpen, this.uniqueSkillSuitPreviewOpen, this);
		this.addListen0(UIEventEnum.UniqueSkillChipExchangeOpen, this.uniqueSkillChipExchangeOpen, this);

	}

	public addListenerOnShow(): void{
		
	}

	private onDecomposeKillSuccess(data: any): void{
		if(this.uniqueSkillDecomposeWindow != null && this.uniqueSkillDecomposeWindow.onStage){
			this.uniqueSkillDecomposeWindow.decomposeSuccess();
		}
		if(this.uniqueSkillPanel != null && this.uniqueSkillPanel.onStage){
			this.uniqueSkillPanel.updateRedPoint();
			this.uniqueSkillPanel.updateBtnTips();
		}
		EventManager.dispatch(NetEventEnum.KillDecomposeSuccess);
	}

	private onExchangeKillSuccess(data: any): void{

	}

	private onExchangeKillFragmentSuccess(data: any): void{

	}

	private onRoleStateChange(): void{
		if(this.uniqueSkillPanel != null && this.uniqueSkillPanel.onStage){
			this.uniqueSkillPanel.updateRedPoint();
			this.uniqueSkillPanel.updateBtnTips();
		}
	}

	private onBagChange(): void{
		if(this.uniqueSkillPanel != null && this.uniqueSkillPanel.onStage){
			this.uniqueSkillPanel.updateRedPoint();
			this.uniqueSkillPanel.updateBtnTips();
		}
		if(this.uniqueSkillExchangeWindow != null && this.uniqueSkillExchangeWindow.onStage){
			this.uniqueSkillExchangeWindow.packUpdate();
		}
	}

	private onUpdateMoney(): void{
		if(this.uniqueSkillExchangeWindow != null && this.uniqueSkillExchangeWindow.onStage){
			this.uniqueSkillExchangeWindow.moneyUpdate();
		}

		if(this.uniqueSkillChipExchangeWindow != null && this.uniqueSkillChipExchangeWindow.onStage){
			this.uniqueSkillChipExchangeWindow.moneyUpdate();
		}

		if(this.uniqueSkillPanel != null && this.uniqueSkillPanel.onStage){
			this.uniqueSkillPanel.updateBtnTips();
		}
	}

	private uniqueSkillPanelOnOpen(panel: UniqueSkillPanel): void{
		this.uniqueSkillPanel = panel;
	}

	/**激活或者升级后更新界面 */
	private updatePanel(): void{
		if(this.uniqueSkillPanel != null && this.uniqueSkillPanel.onStage){
			this.uniqueSkillPanel.updateInfo();
		}
	}

	/**
	 * 打开属性详情窗口
	 */
	private uniqueSkillAttrOpen(): void{
		if(this.uniqueSkillAttrView == null){
			this.uniqueSkillAttrView = new UniqueSkillAttrView();
		}
		this.uniqueSkillAttrView.show();
	}

	/**
	 * 打开必杀技能详情窗口
	 */
	private uniqueSkillDetailOpen(): void{
		if(this.uniqueSkillDetailView == null){
			this.uniqueSkillDetailView = new UniqueSkillDetailView();
		}
		this.uniqueSkillDetailView.show();
	}

	private uniqueSkillChipDecomposeOpen(): void{
		if(this.uniqueSkillDecomposeWindow == null){
			this.uniqueSkillDecomposeWindow = new UniqueSkillDecomposeWindow();
		}
		this.uniqueSkillDecomposeWindow.show();
	}

	private uniqueSkillExchangeOpen(): void{
		if(this.uniqueSkillExchangeWindow == null){
			this.uniqueSkillExchangeWindow = new UniqueSkillExchangeWindow();
		}
		this.uniqueSkillExchangeWindow.show();
	}

	private uniqueSkillSuitPreviewOpen(): void{
		if(this.uniqueSkillSuitAttrView == null){
			this.uniqueSkillSuitAttrView = new UniqueSkillSuitAttrView();
		}
		this.uniqueSkillSuitAttrView.show();
	}

	private uniqueSkillChipExchangeOpen(): void{
		if(this.uniqueSkillChipExchangeWindow == null){
			this.uniqueSkillChipExchangeWindow = new UniqueSkillChipExchangeWindow();
		}
		this.uniqueSkillChipExchangeWindow.show();
	}
}