class CopyHallModule_old extends BaseModule {
	private c1: fairygui.Controller;
	private c2: fairygui.Controller;
	private towerPanel: CopyHallTowerPanel;
	/**守护仙灵 */
	private defendPanel:CopyHallModelPanel;
	/**仙帝宝库 */
	private moneyPanel:CopyHallModelPanel;
	public expPanel: CopyHallExpPanel;
	private bloodPanel: CopyHallBloodPanel;
	private btn_singleCopy:fairygui.GButton;
	private btn_teamCopy:fairygui.GButton;
	private btn_ward:fairygui.GButton;
	private btn_treasury:fairygui.GButton;
	private btn_jiuyou:fairygui.GButton;
	private btn_shengling:fairygui.GButton;
	private btn_zhenmo:fairygui.GButton;


	public curSelectPanel:BaseCopyTabPanel;
	public constructor() {
		super(ModuleEnum.CopyHall, PackNameEnum.Copy);
	}

	public initOptUI(): void {

		this.title = "CopyHall_0";
		this.btn_singleCopy = this.getGObject("btn_singleCopy").asButton;
		this.btn_teamCopy = this.getGObject("btn_teamCopy").asButton;
		this.btn_treasury = this.getGObject("btn_treasury").asButton;
		this.btn_ward = this.getGObject("btn_ward").asButton;
		this.btn_jiuyou = this.getGObject("btn_jiuyou").asButton;
		this.btn_shengling = this.getGObject("btn_shengling").asButton;
		this.btn_zhenmo = this.getGObject("btn_zhenmo").asButton;

		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.c2.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onC2Change, this);
		this.c1.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onC1Change, this);
		var towerCom: fairygui.GComponent = this.getGObject("panel_tower").asCom;
		this.towerPanel = new CopyHallTowerPanel(towerCom, this.c1, 0);	//
		this.defendPanel = new CopyHallModelPanel(this.getGObject("panel_guard").asCom, this.c1, 1,CopyEnum.CopyDefend,CopyUtils.getDefendCopys());
		this.moneyPanel = new CopyHallModelPanel(this.getGObject("panel_treasury").asCom, this.c1, 2,CopyEnum.CopyMoney,CopyUtils.getMoneyCopys());

		this.expPanel = new CopyHallExpPanel(this.getGObject("panel_jiuyou").asCom, this.c1, 3);
		this.bloodPanel = new CopyHallBloodPanel(this.getGObject("panel_blood").asCom, this.c1, 4);	
		
	}

	public onShow(data?:any): void {
		super.onShow(data);
		if(this.c2){
			this.c2.selectedIndex = 0;
		}
		
	}

	private onC2Change(evt: any): void {
		switch (this.c2.selectedIndex) {
			case 0: //单人
				this.c1.selectedIndex = 0;
				break;
			case 1: //组队
				this.c1.selectedIndex = 3;
				break;
		}
	}

	private onC1Change(e:any):void{		
		var openInxs:number[] = [0,1,2,3,4];
		if(openInxs.indexOf(this.c1.selectedIndex)==-1){
			Tip.showTip("功能未开放");
			this.c1.selectedIndex < 3? this.c1.selectedIndex = 0:this.c1.selectedIndex = 3;
		}
	}

	public updateAll(data?:any): void {
		switch (this.c1.selectedIndex) {
			case 0:
				this.towerPanel.updateAll();
				break;
			case 1:
				this.defendPanel.updateAll();
				break;
			case 2:
				this.moneyPanel.updateAll();
				break;
			case 3:
				this.expPanel.updateAll()
				break;
			case 4:
				this.bloodPanel.updateAll();
				break;
		}
		var c2Idx:number = this.c1.selectedIndex>=3?1:0;
		if(this.c2.selectedIndex!=c2Idx){
			this.c2.selectedIndex = c2Idx;
		}
		this.checkTip();
	}

	private checkTip():void{
		var isDefend:boolean = CacheManager.copy.isEnterNumOk(CopyEnum.CopyDefend);
		var isMoney:boolean = CacheManager.copy.isEnterNumOk(CopyEnum.CopyMoney);
		CommonUtils.setBtnTips(this.btn_singleCopy,(isDefend || isMoney));
		CommonUtils.setBtnTips(this.btn_ward,isDefend);
		CommonUtils.setBtnTips(this.btn_treasury,isMoney);

		var isExp:boolean = CacheManager.copy.isEnterNumOk(CopyEnum.CopyExp);
		var isBlood:boolean = CacheManager.copy.isEnterNumOk(CopyEnum.CopyBlood);
		CommonUtils.setBtnTips(this.btn_teamCopy,(isExp || isBlood));
		CommonUtils.setBtnTips(this.btn_jiuyou,isExp);
		CommonUtils.setBtnTips(this.btn_shengling,isBlood);

	}

	protected onMainTabChanged(e: any): void {
	}


}