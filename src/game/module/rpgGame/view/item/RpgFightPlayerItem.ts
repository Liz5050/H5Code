class RpgFightPlayerItem extends ListRenderer {
	private headImg:GLoader;
	private nameTxt:fairygui.GTextField;
	private mcClick:UIMovieClip;
    private c1: fairygui.Controller;
    private serverTxt: fairygui.GTextField;
	public isShowCross:boolean = true;//不支持列表中设置该属性，列表中有缓存池，会影响到其他item
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController('c1');
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.serverTxt = this.getChild("txt_server").asTextField;
		this.headImg = this.getChild("loader") as GLoader;
		this.addClickListener(this.onClickHandler,this);
	}

	public setData(data:any):void {
		if(!data) {
			if(this._data) this._data = null;
			this.nameTxt.text = "";
			this.headImg.clear();
			this.visible = false;
			return;
		}
		// this.selected = false;
		// if(CacheManager.king.leaderEntity) {
		// 	let battleObj:RpgGameObject = CacheManager.king.leaderEntity.battleObj;
		// 	this.selected = battleObj && battleObj.entityInfo && battleObj.entityInfo.id == data.id;
		// }
		this.visible = true;
		this._data = data;
		this.nameTxt.text = data.name_S;
		let iconUrl:string;
		let entityType:EEntityType = data.entityId.type_BY;
		if(entityType == EEntityType.EEntityTypeBoss) {
			let bossConfig:any = ConfigManager.boss.getByPk(data.code_I);
			iconUrl = URLManager.getIconUrl(bossConfig.avatarId,URLManager.AVATAR_ICON);
		}
		else {
			let career:number = data.career_SH;
			if(data.entityId.roleIndex_BY != RoleIndexEnum.Role_index0) {
				let mainId:string = EntityUtil.getEntityId(data.entityId,RoleIndexEnum.Role_index0);
				let mainEntity:RpgGameObject = CacheManager.map.getEntity(mainId);
				if(mainEntity && mainEntity.entityInfo) {
					career = mainEntity.entityInfo.career_SH;
				}
			}
			iconUrl = URLManager.getPlayerHead(CareerUtil.getBaseCareer(career));
		}
		
		this.headImg.load(iconUrl);

		
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgCrossGuildBossIntruder)){ //仙盟抢boss  固定显示仙盟名字
			data.guildName_S?this.serverTxt.text = '[盟]'+data.guildName_S:this.serverTxt.text = "";
			this.height = 165;
			this.c1.selectedIndex = 1;
		}else if (EntityUtil.isCrossPlayer(data.entityId) && this.isShowCross) { //显示跨服
            this.serverTxt.text = `S${data.entityId.typeEx_SH}`;
            this.height = 165;
            this.c1.selectedIndex = 1;
        } else {
			this.height = 140;
            this.c1.selectedIndex = 0;
		}
		this.grayed = data.isOnlyHpDied;
	}

	private onClickHandler():void {
		if(!this.mcClick) {
			this.mcClick = UIMovieManager.get(PackNameEnum.MCClick);
			this.mcClick.x = -185;
			this.mcClick.y = -195;
			this.addChild(this.mcClick);
		}
		this.mcClick.setPlaySettings(0,-1,1,-1,function(){
            this.mcClick.destroy();
            this.mcClick = null;
		},this);
	}

    public getTarget():RpgGameObject {
        if (this._data) {
        	let target:RpgGameObject = CacheManager.map.getEntity(this._data.id);
        	if (CacheManager.copy.isInCopyByType(ECopyType.ECopyNewCrossBoss) && EntityUtil.isCollectionMonster(target)) {
                let targets:RpgGameObject[] = CacheManager.map.getCollectingTargets();//点击采集物时发现有其他人正在采集，攻击那个人
                if (targets.length) return targets[0];
                else return target;
			}
        	return target;
        }
        return null;
    }
}