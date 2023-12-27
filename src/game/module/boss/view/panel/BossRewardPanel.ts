class BossRewardPanel extends BaseContentView {
	private ownerList:List;
	private joinList:List;
	private tipsTxt:fairygui.GTextField;
	// private bossList:any[];
	private closeBtn:fairygui.GButton;
	public constructor() {
		super(PackNameEnum.Boss,"WindowBossReward");
		this.modal = true;
		this.modalAlpha = 0;
		this.isCenter = true;
		this.isPopup = true;
	}

	public initOptUI():void {
		this.ownerList = new List(this.getGObject("list_belong").asList);
		this.joinList = new List(this.getGObject("list_join").asList);
		this.tipsTxt = this.getGObject("txt_tishi").asTextField;
		// this.bossList = ConfigManager.mgGameBoss.getByCopyCode(CopyEnum.CopyWorldBoss);

		this.closeBtn = this.getGObject("btn_close").asButton;
		this.closeBtn.addClickListener(this.hide,this);
	}

	public updateAll(data:any = null):void {
		let cfg:any = ConfigManager.mgGameBoss.getByPk(data);
		if(!cfg) {
			this.hide();
			Log.trace(Log.TEST,"t_mg_game_boss error:",data);
			return;
		}
		
		let copyCfg:any = ConfigManager.copy.getByPk(cfg.copyCode);
		
		let itemDatas:ItemData[] = RewardUtil.getRewards(cfg.showReward);
		let isQiongcang:boolean = copyCfg.copyType == ECopyType.ECopyMgQiongCangHall || copyCfg.copyType == ECopyType.ECopyMgQiongCangAttic;
		let ownerData:any[] = [];
		for(let i:number = 0; i < itemDatas.length; i++) {
			ownerData.push({itemData:itemDatas[i],rate:i,isOwner:true,isQiongcang:isQiongcang});
		}
		this.ownerList.data = ownerData;

		itemDatas = RewardUtil.getRewards(cfg.showJoinReward);
		let joinData:any[] = [];
		for(let i:number = 0; i < itemDatas.length; i++) {
			joinData.push({itemData:itemDatas[i],rate:i,isOwner:false,none: isQiongcang ? 1 : 0});
		}
		this.joinList.data = joinData;
	}
} 