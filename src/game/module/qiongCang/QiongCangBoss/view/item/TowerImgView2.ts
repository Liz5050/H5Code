class TowerImgView2 extends fairygui.GButton {
	private c1:fairygui.Controller;
	private c2:fairygui.Controller;
	private tower_icon:GLoader;
	private txt_openCondition:fairygui.GTextField;
	private txt_time:fairygui.GTextField;

	private _floor:number = 0;
	private bossCfg:any;
	private bossInfo:any;
	private leftTime:number = -1;
	private isOpen:boolean;

	private static redPoint:number[][] = [[145,45],[165,45],[145,25]];
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.tower_icon = this.getChild("icon") as GLoader;
		this.txt_openCondition = this.getChild("txt_openCondition").asTextField;
		this.txt_time = this.getChild("txt_time").asTextField;
		this.addClickListener(this.onEnterTowerHander,this);
	}

	public setData(bossCfg:any):void {
		this.bossCfg = bossCfg;
		this.txt_openCondition.text = "（" + this.bossCfg.roleState + "转-" + this.bossCfg.maxRoleState + "转）";
	}

	public updateAll():void {
		let roleState:number = CacheManager.role.getRoleState();
		this.isOpen = roleState >= this.bossCfg.roleState && roleState <= this.bossCfg.maxRoleState;
		this.c1.selectedIndex = this.isOpen ? 1 : 0;
		this.grayed = !this.isOpen;
		this.tower_icon.visible = this.isOpen;
		let isCd:boolean = CacheManager.bossNew.isBossCd(this.bossCfg.bossCode);
		this.txt_time.text = "";
		if(isCd) {
			this.bossInfo = CacheManager.bossNew.getBossInfoByCode(this.bossCfg.bossCode);
			if(this.bossInfo) {
				this.leftTime = this.bossInfo.dateVal_DT - CacheManager.serverTime.getServerTime();
				this.txt_time.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false);
				App.TimerManager.doTimer(1000,0,this.onTimerHandler,this);
			}
		}
		let pts:number[] = TowerImgView2.redPoint[this.floor - 1];
		let ownerTimes:number = CacheManager.role.role.qiongCangOwnerTimes_BY;
		CommonUtils.setBtnTips(this,ownerTimes > 0 && this.isOpen && !isCd && CacheManager.bossNew.isFollowBoss(this.bossCfg.bossCode),pts[0],pts[1]);
	}

	private onEnterTowerHander():void {
		if(!this.isOpen) {
			// Tip.showTip("暂未开启该层BOSS");策划需求，不要提示
			return;
		}
		EventManager.dispatch(LocalEventEnum.EnterQiongCangBoss,this.bossCfg);
	}

	public set floor(value:number) {
		this._floor = value;
		this.c2.selectedIndex = this._floor;
		this.tower_icon.load(URLManager.getModuleImgUrl("qiongCangBoss/floor_" + this._floor + ".png",PackNameEnum.QiongCang));
	}

	public get floor():number {
		return this._floor;
	}

	private onTimerHandler():void {
		this.leftTime --;
		if(this.leftTime <= 0) {
			this.txt_time.text = "";
			App.TimerManager.remove(this.onTimerHandler,this);
			return;
		}
		this.txt_time.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false);
	}

	public hide():void {
		App.TimerManager.remove(this.onTimerHandler,this);
		this.txt_time.text = "";
		this.bossInfo = null;
		this.isOpen = false;
	}
}