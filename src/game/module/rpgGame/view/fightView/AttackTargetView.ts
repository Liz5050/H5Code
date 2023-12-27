class AttackTargetView extends fairygui.GComponent {
	private attackTarget:RpgFightPlayerItem;
	private hpBar:UIProgressBar;
	private entityInfo:EntityInfo;
	public constructor() {
		super();
	}

	protected constructFromXML(xml:any):void {		 	
		super.constructFromXML(xml);
		this.attackTarget = this.getChild("btn_target") as RpgFightPlayerItem;
		this.attackTarget.isShowCross = false;
		this.hpBar = this.getChild("progressBar") as UIProgressBar;
		this.hpBar.setStyle(URLManager.getComonRes("progressBar_1"),URLManager.getComonRes("bg_1"),0,0,1,1);
		this.hpBar.setValue(1,1);
	}

	public setData(data:any):void {
		this.entityInfo = data;
		this.attackTarget.setData(data);
		this.updateLife();
	}

	public updateLife():void {
		if(EntityUtil.isBoss(this.entityInfo)) {
			this.hpBar.visible = false;
			return;//boss自己有独立的boss血条
		}
		this.hpBar.visible = true;
		if(this.entityInfo) {
			let _life: number = Number(this.entityInfo.life_L64);
			if (_life <= 0) _life = 0;
			let _maxLife: number = Number(this.entityInfo.maxLife_L64);
			if(EntityUtil.isPlayer(this.entityInfo.entityId)) {
				let list:RpgGameObject[] = CacheManager.map.getOtherPlayers(this.entityInfo.entityId);
				for(let i:number = 0; i < list.length; i++) {
					if(list[i].entityInfo) {
						_life += Number(list[i].entityInfo.life_L64);
						_maxLife += Number(list[i].entityInfo.maxLife_L64);
					}
				}	
			}
			this.hpBar.setValue(_life, _maxLife, true, true);
		}
	}
}