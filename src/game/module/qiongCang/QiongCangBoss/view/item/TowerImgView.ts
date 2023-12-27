class TowerImgView extends fairygui.GComponent {
	private c1:fairygui.Controller;
	private c2:fairygui.Controller;
	private txt_time:fairygui.GTextField;
	private txt_floors:fairygui.GTextField[];

	private _floor:number = 0;
	private bossCfgs:any[];
	private leftTime:number = -1;
	private curBossCfg:any;
	private	curBossInfo:any;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.txt_time = this.getChild("txt_time").asTextField;

		this.bossCfgs = ConfigManager.mgGameBoss.getByCopyType(ECopyType.ECopyMgQiongCangHall);
		this.bossCfgs.sort(function (value1:any,value2:any):number {
			return value1.roleState - value2.roleState;
		})
		this.txt_floors = [];
		for(let i:number = 0; i < this.bossCfgs.length; i ++) {
			let floor:number = i + 1;
			let txt_floor:fairygui.GTextField = this.getChild("txt_floor_" + floor).asTextField;
			this.txt_floors.push(txt_floor);
			txt_floor.text = GameDef.NumberName[floor] + "层（" + this.bossCfgs[i].roleState + "转-" + this.bossCfgs[i].maxRoleState + "转）";
		}
		this.addClickListener(this.onEnterMainTowerHandler,this);
	}

	public updateAll():void {
		let roleState:number = CacheManager.role.getRoleState();
		for(let i:number = 0; i < this.bossCfgs.length; i ++) {
			if(roleState >= this.bossCfgs[i].roleState && roleState <= this.bossCfgs[i].maxRoleState) {
				this.floor = i + 1;
				this.curBossCfg = this.bossCfgs[i];
				break;
			}
		}
		this.txt_time.text = "";
		this.c2.selectedIndex = 0;
		if(this.curBossCfg) {
			let isCd:boolean = CacheManager.bossNew.isBossCd(this.curBossCfg.bossCode);
			if(isCd) {
				this.curBossInfo = CacheManager.bossNew.getBossInfoByCode(this.curBossCfg.bossCode);
				if(this.curBossInfo) {
					this.leftTime = this.curBossInfo.dateVal_DT - CacheManager.serverTime.getServerTime();
					this.txt_time.text = App.DateUtils.getTimeStrBySeconds(this.leftTime,"{2}:{1}:{0}",false);
					App.TimerManager.doTimer(1000,0,this.onTimerHandler,this);
				}
			}
			else if(CacheManager.bossNew.isFollowBoss(this.curBossCfg.bossCode)){
				let copyCfg:any = ConfigManager.copy.getByPk(this.curBossCfg.copyCode);
				let needNum:number = 1;
				let needGold:number = 500;
				if(copyCfg.propNum > 0) {
					needNum = copyCfg.propNum;
				}
				let shopCfg:any = ConfigManager.shopSell.getByPk(ShopType.SHOP_QUICK + "," + copyCfg.needProp);
				if(shopCfg) {
					needGold = shopCfg.price;
				}
				let bagCount:number = CacheManager.pack.propCache.getItemCountByCode2(copyCfg.needProp);
				if((bagCount >= needNum || MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold,needGold,false))) {
					this.c2.selectedIndex = 1;
				}
			}
		}
	}

	public set floor(value:number) {
		this._floor = value;
		this.c1.selectedIndex = this._floor;
	}

	public get floor():number {
		return this._floor;
	}

	private onEnterMainTowerHandler():void {
		if(!this.curBossCfg) {
			return;
		}
		EventManager.dispatch(LocalEventEnum.ShowQiongCangAlert,this.curBossCfg,this.floor);
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
		this.txt_time.text = "";
		this.leftTime = -1;
		this.curBossCfg = null;
		this.curBossInfo = null;
		App.TimerManager.remove(this.onTimerHandler,this);
	}
}