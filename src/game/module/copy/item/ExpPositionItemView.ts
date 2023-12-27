class ExpPositionItemView extends fairygui.GButton {
	private c1:fairygui.Controller;
	private c2:fairygui.Controller;
	private txt_name:fairygui.GTextField;
	private txt_guild:fairygui.GTextField;

	private posId:number;
	private posCfg:any;
	private occupyInfo:any;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.txt_name = this.getChild("txt_name").asTextField;
		this.txt_guild = this.getChild("txt_guild").asTextField;
		this.addClickListener(this.onClickHandler,this);
	}

	public setPosId(posId:number):void {
		this.posCfg = ConfigManager.expPosition.getByPk(posId);
		this.posId = posId;
		this.c1.selectedIndex = this.posCfg.expTimes == 3 ? 0 : 1;
		this.updateOccupyInfo(null);
	}

	public updateOccupyInfo(data:any):void {
		// optional SEntityId entityId = 1;
		// optional string name_S = 2;
		// optional string guildName_S = 3;
		// optional int32 posId_I = 4;
		this.occupyInfo = data;
		if(data == null) {
			this.c2.selectedIndex = 0;
		}
		else {
			this.c2.selectedIndex = 1;
			this.txt_name.text = data.name_S;
			this.txt_guild.text = data.guildName_S;
		}
	}

	private onClickHandler():void {
		if(this.occupyInfo != null) {
			if(EntityUtil.isMainPlayer(this.occupyInfo.entityId)) {
				Tip.showRollTip("您已占领该区域");
				return;
			}
			
			//优先攻击主角
			let entity:RpgGameObject = CacheManager.map.getEntity(this.occupyInfo.entityId);
			if(!entity || entity.isDead()) {
				entity = CacheManager.map.getOtherPlayer(this.occupyInfo.entityId);
			}
			if(entity) {
				CacheManager.bossNew.battleObj = entity;
				// EventManager.dispatch(LocalEventEnum.FocusAttack,entity);
			}
		}
		else {
			CacheManager.king.stopKingEntity(true);
			AI.addAI(AIType.MoveToExpPos, {posCfg:this.posCfg});
		}
	}
}