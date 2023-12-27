class QiongCangBossPanel extends BaseTabView {
	private loader_bg:GLoader;

	private btn_set:fairygui.GButton;
	private txt_leftOwnerNum:fairygui.GTextField;
	private txt_leftAssistNum:fairygui.GTextField;

	private tower_view:TowerImgView;
	private towerBtnList:TowerImgView2[];
	private bossCfgs:any[];
	public constructor() {
		super();
	}

	public initOptUI():void {
		this.loader_bg = this.getGObject("loader_bg") as GLoader;
		this.loader_bg.load(URLManager.getModuleImgUrl("qiongCangBoss/bg.jpg",PackNameEnum.QiongCang));

		this.btn_set = this.getGObject("btn_set").asButton;
		this.btn_set.addClickListener(this.onOpenSetWindow,this);
		this.txt_leftOwnerNum = this.getGObject("txt_leftOwnerNum").asTextField;
		this.txt_leftAssistNum = this.getGObject("txt_leftAssistNum").asTextField;

		this.tower_view = this.getGObject("tower_view") as TowerImgView;

		this.towerBtnList = [];
		this.bossCfgs = ConfigManager.mgGameBoss.getQCAtticBossList();

		for(let i:number = 0; i < this.bossCfgs.length; i++) {
			let tower:TowerImgView2 = this.getGObject("btn_tower_" + i) as TowerImgView2;
			tower.floor = i+1;
			tower.setData(this.bossCfgs[i]);
			this.towerBtnList.push(tower);
		}
	}

	public updateAll():void {
		this.tower_view.updateAll();
		for(let tower of this.towerBtnList) {
			tower.updateAll();
		}
		let roleInfo:any = CacheManager.role.role;
		this.txt_leftOwnerNum.text = App.StringUtils.substitude(LangQiongCang.L4,roleInfo.qiongCangOwnerTimes_BY);
		this.txt_leftAssistNum.text = App.StringUtils.substitude(LangQiongCang.L5,roleInfo.qiongCangCoTimes_BY);
	}

	private onOpenSetWindow():void {
		EventManager.dispatch(UIEventEnum.BossSetOpen,CopyEnum.QiongCangBoss);
	}

	public hide():void {
		this.tower_view.hide();
		for(let tower of this.towerBtnList) {
			tower.hide();
		}
		super.hide();
	}
}