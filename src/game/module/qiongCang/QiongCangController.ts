class QiongCangController extends BaseController {
	private module:QiongCangModule;
	private qcRankWin:QCCopyRankWindow;
	//穹苍圣殿子控制器
	private qiongCangBoss:QiongCangBossController;
	//天赋培养子控制器
	private talentCultivate:TalentCultivateController;
	private qcCopyCtrl:QCCopyController;

	public constructor() {
		super(ModuleEnum.QiongCang);
	}

	public initView():BaseModule {
		this.module = new QiongCangModule(this.moduleId);
		this.qiongCangBoss.setModule(this.module);
		this.talentCultivate.setModule(this.module);
		this.qcCopyCtrl.setModule(this.module);
		return this.module;
	}
	
	protected addListenerOnInit(): void {
		this.qiongCangBoss = new QiongCangBossController();
		this.talentCultivate = new TalentCultivateController();
		this.qcCopyCtrl = new QCCopyController();

		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameSmeltTalentEquipRet],this.onSmeltTalent,this);
	}
	
	protected addListenerOnShow(): void {
		this.qiongCangBoss.addListenerOnShow();
		this.talentCultivate.addListenerOnShow();

		this.addListen1(LocalEventEnum.GetRankInfoUpdate, this.onRankInfoUpdate, this);
		this.addListen1(LocalEventEnum.CopyShowQCRank, this.onShowQcRank, this);
		this.addListen1(NetEventEnum.packPosTypePropChange,this.onPropUpdate,this);
	}

	private onRankInfoUpdate(data:any[]):void{
		this.module.updateRank(data);
		if(this.qcRankWin && this.qcRankWin.isShow){
			this.qcRankWin.updateAll(data);
		}
	}

	private onPropUpdate():void{
		if(this.isShow){
			this.module.updateQCSmelt({isProp:true});
		}
	}

	private onSmeltTalent(data:any):void{
		//S2C_SSmeltTalentEquipRet
		if(this.isShow){
			this.module.updateQCSmelt(data);
		}
		let cfg:any = ConfigManager.item.getByPk(data.genItemcode);
		if(cfg){
			Tip.showLeftTip('合成获得 '+cfg.name); //临时
		}
		
	}

	private onShowQcRank():void{
		if(!this.qcRankWin){
			this.qcRankWin = new QCCopyRankWindow();
		}
		this.qcRankWin.show();
	}

}