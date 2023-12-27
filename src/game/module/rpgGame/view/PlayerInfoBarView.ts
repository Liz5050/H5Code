class PlayerInfoBarView extends fairygui.GComponent {
	private txt_level:fairygui.GTextField;
	private txt_name:fairygui.GTextField;
	private hpBar:UIProgressBar;
	private loader_head:GLoader;

	private entityInfo:EntityInfo;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		let loaderPlayerHp:GLoader = this.getChild("loader_player") as GLoader;
		loaderPlayerHp.load(URLManager.getModuleImgUrl("boss_bg.png",PackNameEnum.SceneBossInfo));
		this.txt_level = this.getChild("txt_level").asTextField;
		this.txt_name = this.getChild("txt_name").asTextField;
		this.hpBar = this.getChild("progressBar") as UIProgressBar;
		this.hpBar.setStyle(URLManager.getPackResUrl(PackNameEnum.FightPlayers,"bossBar_5"),"",0,0,0,0,UIProgressBarType.Mask);
		this.loader_head = this.getChild("loader_head") as GLoader;
		this.visible = false;
	}

	public updateLife():void {
		if(EntityUtil.isBoss(this.entityInfo)) return;//boss自己有独立的boss血条
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
			if(!EntityUtil.checkMonsterType(this.entityInfo,EBossType.EBossTypeCollection)) {
				this.hpBar.setValue(_life, _maxLife, true, true);
			}
			this.visible = _life > 0;
		}
	}

	public set info(value:EntityInfo) {
		this.entityInfo = value;
		if(!value) {
			this.visible = false;
			return;
		}
		if(EntityUtil.isPlayer(this.entityInfo.entityId)) {
			this.txt_level.text = CareerUtil.getLevelName(this.entityInfo.level_SH,this.entityInfo.career_SH);
			this.txt_name.text = this.entityInfo.name_S;
			let career:number = this.entityInfo.career_SH;
			if(this.entityInfo.entityId.roleIndex_BY != RoleIndexEnum.Role_index0) {
				let mainId:string = EntityUtil.getEntityId(this.entityInfo.entityId,RoleIndexEnum.Role_index0);
				let mainEntity:RpgGameObject = CacheManager.map.getEntity(mainId);
				if(mainEntity && mainEntity.entityInfo) {
					career = mainEntity.entityInfo.career_SH;
				}
			}
			this.loader_head.load(URLManager.getPlayerHead(CareerUtil.getBaseCareer(career)));
		}
		else if(this.entityInfo.type == EEntityType.EEntityTypeBoss) {
			let bossCfg:any = ConfigManager.boss.getByPk(this.entityInfo.code_I);
			if(bossCfg) {
				this.loader_head.load(URLManager.getIconUrl(bossCfg.avatarId,URLManager.AVATAR_ICON));
				this.txt_level.text = "Lv." + bossCfg.level;
				this.txt_name.text = bossCfg.name;
			}
		}
	}

	public get info():EntityInfo {
		return this.entityInfo;
	}
}