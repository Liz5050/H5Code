class MapCache implements ICache {
	/**当前地图id */
	private gMapId: number;
	private gMapResId: number;
	private gMapData:{[mapId:number]:any} = {};
	private gMapScene:{[mapId:number]:any} = {};
	private gMapSpecial:{[mapId:number]:any} = {};
	private gMapBlockType:{[blockType:number]:number[]};//地图格子类型 - 坐标
	// public data: any;
	// public scene: any;
	// public special: any;
	/**传送成功后回调 */
	public conveyCallBack:CallBack;
	/**保存所有实体 */
	private _entitys: { [entityId: string]: RpgGameObject };

	private gEntityInfos:{[entityId:string]:EntityBaseInfo} = {};
	/**当前场景显示中的玩家实体id列表 */
	private _scenePlayerShowIds:string[] = [];
	/**当前场景显示中所有玩家实体id列表 */
	private _scenePlayerAllIds:string[] = [];
	private publicDropKeys:string[] = [];
	private privateDropKeys:string[] = [];

	private gNpcTaskState:{[npcId:number]:TaskNpcStatus} = {};
	/**服务端发送过的移除实体id */
	//因为实体创建有延迟，防止实体还未创建，服务端就发了移除协议，导致实体移除不成功的bug（2018年4月8日13:51:44 lizhi）
	public deleteList:string[] = [];

	/**可攻击的玩家列表 */
	private canAttackIds:{[entityId:string]:any[]} = {};
	private fightPlayerIds:{[entityId:string]:any[]} = {};
	private murdererIds:{[entityId:string]:any[]} = {};//击杀过我的玩家列表
	private _isMapRendering:boolean = true;//场景渲染
	private attackTipsId:any;

	private _collectInfo:any;//当前采集信息

	private _txtAsBitmap:boolean = false;
	public constructor() {
	}

	/**结构：SEntityInfo */
	public addServerEntity(entityMsgInfo:any):EntityInfo
	{
		let _entityId:string = EntityUtil.getEntityId(entityMsgInfo.entityId);
		let selfIndex:number = -1;
		if(EntityUtil.isPlayer(entityMsgInfo.entityId)) {
			selfIndex = EntityUtil.isMainPlayerOther(entityMsgInfo.entityId);
			this.addPlayerId(_entityId);
		}
		let _info:EntityInfo;
		if(selfIndex != -1) {
			// console.log("收到主角实体数据--->>>索引",selfIndex,"，当前时间：",egret.getTimer(),entityMsgInfo);
			_info = CacheManager.role.getEntityInfo(selfIndex);
			_info.parseData(entityMsgInfo,selfIndex);
			this.gEntityInfos[_entityId] = _info;
			this.addPlayerShowId(_entityId);
			let posInfo:any = CacheManager.role.pos[selfIndex];
			if(!posInfo) {
				posInfo = {};
				CacheManager.role.pos[selfIndex] = posInfo;
			}
			posInfo.posX_I = _info.col;
			posInfo.posY_I = _info.row;
			posInfo.index_I = selfIndex;
		}
		else {
			_info = this.gEntityInfos[_entityId] as EntityInfo;
			if(!_info)
			{
				_info = new EntityInfo();
				_info.id = _entityId;//实体唯一id
				this.gEntityInfos[_entityId] = _info;
			}
			_info.parseData(entityMsgInfo,selfIndex);
			// if(_info.type == EEntityType.EEntityTypePlayer) {
			// 	this.addCanAttackPlayer(_info.entityId);
			// }
			if(_info.type == EEntityType.EEntityTypeDropItem) {
				this.publicDropKeys.push(_entityId);
			}
		}
		return _info;
	}

	/**
	 * 更新实体数据
	 */
	public updateEntityInfo(param:any):void {
		if (null == param || null == param.propertyUpdates) {
			return;
		}
		
		let entityId:any;
		let fromEntity:RpgGameObject;
		if(param.entityId) {
			//实体属性更新
			entityId = param.entityId;
		}
		else {
			//实体战斗属性更新
			entityId = param.toEntity;
			fromEntity = this.getEntity(param.fromEntity);
		}
		
		let entityInfo:any;
		if(EntityUtil.isMainPlayer(entityId)) {
			entityInfo = CacheManager.role.entityInfo;
		}
		else {
			let entityIdStr:string = EntityUtil.getEntityId(entityId);
			entityInfo = this.getEntityInfo(entityIdStr);
		}
		if(!entityInfo) {
			return;
		}
		let entityObj:RpgGameObject = this.getEntity(entityId);
        let propertyUpdates:any[] = param.propertyUpdates.data;
        let propertyLen: number = propertyUpdates ? propertyUpdates.length : 0;
        let _hurtType:number = EHurtType.EHurtTypeNormal;
        let _hpChange:number = -1;
        let _pointX:number = 0;
        let _pointY:number = 0;
        for (let i = 0; i < propertyLen; i++) {
            let sAttributeUpdate = propertyUpdates[i];
            let attr: number = sAttributeUpdate.attribute;
            let value: number = sAttributeUpdate.value_I;
            let value_S: number = Number(sAttributeUpdate.valueStr_S);
            switch (attr) {
                case EEntityAttribute.EAttributeLife://生命
					if(entityInfo.life_L64 == value_S || EntityUtil.isMainPlayerOther(entityInfo.entityId) >= 0) break;
					let isAddHp:boolean = false;
					if(Number(entityInfo.life_L64) < value_S) {
						//回血直接更新视图，扣血要等技能特效打到实体身上才扣血
						isAddHp = true;
					}
					entityInfo.life_L64 = value_S;
					// if(entityInfo.type == EEntityType.EEntityTypeBoss) {
					// 	let hp:number = (entityInfo.life_L64 / entityInfo.maxLife_L64) * 100;
					// 	console.log("怪物实体血量数据更新：",entityInfo.name_S,value_S,Number(entityInfo.maxLife_L64),hp);
					// }
					if(entityObj) {
						if(isAddHp) entityObj.updateLife();
						if(fromEntity) {
							entityObj.updateDeathDir(fromEntity);
						}
						if (value_S < 1) { 
							//死亡
							entityObj.death(fromEntity);
						} 
						else if (entityObj.isDead()) {
							// Tips.show(this.entityInfo.name_S + "复活了");
							// entityObj.action = Action.Stand;
							entityObj.revive();
						}
					}
                    break;
				case EEntityAttribute.EAttributeMaxLife:
					entityInfo.maxLife_L64 = value_S;
					entityObj && entityObj.updateLife();
					break;
                case EEntityAttribute.EAttributeHurt://伤害数据
                    // let _test:number = Math.round(Math.random()*9999);
                    // if(_test > 5000) _hurtType = EHurtType.EHurtTypeCrit;
                    _hpChange = value_S;// + _test;
                    break;
                case EEntityAttribute.EAttributeHurtType://伤害类型EHurtType
                    _hurtType = value;
                    break;
                case EEntityAttribute.EAttributeAttackType://攻击类型EAttackType
                    break;
                case EEntityAttribute.EAttributeAttackSkill://攻击技能
                    break;
                case EEntityAttribute.EAttributeDirection://朝向
					let dir:number = 0;
                    if (value > 0 && value < 9) {
                        dir = (value + 1) % 8;
                    }
                    break;
                case EEntityAttribute.EAttributeSpeed://速度
					entityInfo.speed_SH = value;
                    // this.entityInfo.speed_SH = value;
                    // this.updateAvatarModel(attr);
                    break;
                case EEntityAttribute.EAttributeGuild: //仙盟名字
					entityInfo.guildName_S = sAttributeUpdate.valueStr_S;
                    // this.entityInfo.guildName_S = sAttributeUpdate.valueStr_S;
                    // this.setGuildName();
                    break;
				case EEntityAttribute.EAttributeStrengthenExLordLevel://爵位等级  
					entityInfo.lordLevel_I = value;
					entityObj && entityObj.updateName();
					break;
				case EEntityAttribute.EAttributeForeverEquipSuit://混元套装外形			              
                // case EEntityAttribute.EAttributeShapePet://宠物
                case EEntityAttribute.EAttributeMounts://坐骑
                case EEntityAttribute.EAttributeShapeLaw://法阵
                case EEntityAttribute.EAttributeShapeSpirit://法宝
                case EEntityAttribute.EAttributeSpirit://小精灵
                case EEntityAttribute.EAttributeWeapon://武器
                case EEntityAttribute.EAttributeShapeMagic://神兵
                case EEntityAttribute.EAttributeClothes://衣服
                case EEntityAttribute.EAttributeFashion://时装
                case EEntityAttribute.EAttributeSwordPool://龙魂
				case EEntityAttribute.EAttributeShapeSwordPool://剑池
                case EEntityAttribute.EAttributeWing://翅膀
				case EEntityAttribute.EAttributeShapeBattle://战阵
                    if(entityInfo.weapons[attr] != value) {
                        entityInfo.weapons[attr] = value;
                        entityObj && entityObj.updateAvatarModel(attr);
                    }
                    break;
                case EEntityAttribute.EAttributeNotShowShapePet:
                    entityInfo.weapons[attr] = value;
                    let _pet:PetEntity = this.getBelongEntity(entityInfo.entityId,EEntityType.EEntityTypePet) as PetEntity;
                    if(_pet) _pet.updateNotShow(value == 1);
                    break;
                case EEntityAttribute.EAttributeNotShowWing:
                    entityInfo.weapons[attr] = value;
                    entityObj && entityObj.updateNotShowFashion(ComponentType.AvatarWing,value == 1);
                    break;
                case EEntityAttribute.EAttributeNotShowShapeMantle:
                    break;
                case EEntityAttribute.EAttributeNotShowFashionTrack:
                    break;
                case EEntityAttribute.EAttributeNotShowFashionHalo:
                    break;
                case EEntityAttribute.EAttributeNotShowShapeSpirit:
                    entityInfo.weapons[attr] = value;
                    entityObj && entityObj.updateNotShowFashion(ComponentType.AvatarSpirit,value == 1);
                    break;
                case EEntityAttribute.EAttributeNotShowShapeMagic:
                case EEntityAttribute.EAttributeNotShowFashionWeapon:
                    entityInfo.weapons[attr] = value;
                    entityObj && entityObj.updateAvatarModel(EEntityAttribute.EAttributeWeapon);
                    break;
                case EEntityAttribute.EAttributeNotShowShapeSoul:
                    entityInfo.weapons[attr] = value;
                    // this.updateNotShowFashion(ComponentType.AvatarSoul,value == 1);
                    break;
                case EEntityAttribute.EAttributePointX://最新位置X
                    _pointX = value;
                    break;
                case EEntityAttribute.EAttributePointY://最新位置Y
                    _pointY = value;
                    break;
                case EEntityAttribute.EAttributeBuffer://buff更新
					entityInfo.updateBuffInfo(value,sAttributeUpdate.valueStr_S);
                    entityObj && entityObj.updateBuff({buffId:value, type:sAttributeUpdate.valueStr_S});
                    break;
				case EEntityAttribute.EAttributeIsDropOwner:                    
                    // this._isDropOwner = value > 0;		
                    // this.setDropOwnerStatus(this._isDropOwner);
                    break;
                // case EEntityAttribute.EAttributeRealmLevel: //境界等级
                //     entityInfo.realmLevel_BY = value;
                //     entityObj && entityObj.setRealmName();
                //     break;
                case EEntityAttribute.EAttributeTalk://宠物怪物说话
                    // this.entityInfo.talk_S = value_S;//无用
                    // let _talkCom:TalkComponent = this.getComponent(ComponentType.Talk) as TalkComponent;
                    break;
                case EEntityAttribute.EAttributeTitleMain://称号更新
                    let titleKey_I:number[] = entityInfo.titles.key_I;
                    let titleIdx:number = titleKey_I.indexOf(EEntityAttribute.EAttributeTitleMain);
                    if(titleIdx == -1){
                        titleKey_I.push(EEntityAttribute.EAttributeTitleMain);
                        entityInfo.titles.value_S.push(value_S + "");
                    }
                    else {
                        entityInfo.titles.value_S[titleIdx] = value_S + "";
                    }
                    entityObj && entityObj.objType != RpgObjectType.MainPlayer && entityObj.updateTitle();
                    break;
                case EEntityAttribute.EAttributeMaxLifeShield:
                    //value_S
                    entityInfo.maxLifeShield_I = value_S;
                    entityObj && entityObj.updateLifeShield();
                    break;
                case EEntityAttribute.EAttributeLifeShield:
                    //value_S
                    entityInfo.lifeShield = value_S;
                    entityObj && entityObj.updateLifeShield();
                    break;
				case EEntityAttribute.EAttributeForceUpdate:
					entityInfo.force_BY = value;
					entityObj && entityObj.updateForce();
					break;
				case EEntityAttribute.EAttributeName: //名称
					entityInfo.name_S = sAttributeUpdate.valueStr_S;
					entityObj && entityObj.updateName();
                    break;
				case EEntityAttribute.EAttributeStatus://实体状态更新//EMoveStatus
					entityInfo.status_BY = value;
					entityObj && entityObj.updateStatus();
					break;
				case EEntityAttribute.EAttributeNotShowAttacked:
					if(value == 1) fromEntity = null;//不显示被攻击
					break;
                default:
                // Log.trace("other attribute update, type: " + attr);
            }
        }
		if(entityObj) {
			entityObj.showHpChange(_hpChange,param.fromEntity,_hurtType,fromEntity);
			if (_pointX != 0 || _pointY != 0) {
				//位置变动
				if(!PathUtils.gridXYCanWalk(_pointX,_pointY)) {
					Log.trace(Log.RPG,"实体位置更新--->不可移动点：",_pointX,_pointY,param,entityObj,"当前地图资源id:",CacheManager.map.getMapResId());
				}
				let mt:EMoveType = _hpChange > 0 ? EMoveType.EMoveTypeSimple : EMoveType.EMoveTypeCharge;
				entityObj.moveToServerPoint(_pointX, _pointY, mt);
			}
		}
	}

	public updateEntityBuff():void {

	}

	/**
	 * 添加私有掉落
	 */
	public addPrivateDropEntity(data:any):DropPrivateInfo[]
	{
		if(!data || !data.playerItem) return;
		if(data.point.x_SH < 0 || data.point.y_SH < 0) {
			Log.trace(Log.FATAL,"掉落点坐标错误",data);
			if(App.DebugUtils.isDebug) {
				AlertII.show("掉落点坐标错误！！ECmdBroadcastEntityDropItem");
			}
			return;
		}
        let _len:number = data.playerItem.data.length;
		let _pts:number[] = App.MathUtils.getDropPts(data.point.x_SH,data.point.y_SH,_len - 1);
		_pts.unshift(data.point.x_SH,data.point.y_SH);
		let _list:DropPrivateInfo[] = [];
		for(let i:number = 0; i < _len; i++)
        {
			if(_pts.length == 0) break;
            let _sItemData:any = data.playerItem.data[i];
            /**组合唯一key */
            // let _key:string = _pts[i].x + "_" + _pts[i].y + "_" + _sItemData.uid_S + "_" + (Math.random()*100);
			let posX:number = _pts.shift();
			let posY:number = _pts.shift();
			let _key:string = posX + "_" + posY + "_" + _sItemData.uid_S;
			if(_sItemData.uid_S == "") {
				//掉落的是货币没有uid
				Log.trace(Log.RPG,"掉落数据道具uid是空串",_sItemData);
				_key = _key + "_" + (Math.random()*100);
			}
			let _info:DropPrivateInfo = this.gEntityInfos[_key] as DropPrivateInfo;	
			if(!_info)
			{
				_info = new DropPrivateInfo();
				_info.id = _key;
				this.gEntityInfos[_key] = _info;
				this.privateDropKeys.push(_key);
			}
			_info.setData(posX,posY,_sItemData,data.point.x_SH,data.point.y_SH);
			_info.ownerId = data.rewardId;
			_list.push(_info);
        }
		return _list;
	}

	public addPassPointData(passInfo:any):PassPointInfo {
        let _passPointId:string = EntityUtil.getPassPointEntityId(passInfo);
        let _passPoint:PassPointInfo = this.gEntityInfos[_passPointId] as PassPointInfo;
        if(!_passPoint)
        {
            _passPoint = new PassPointInfo();
            _passPoint.id = _passPointId;
            this.gEntityInfos[_passPointId] = _passPoint;
        }
        _passPoint.setData(passInfo);
        return _passPoint;
	}

	public addSceneEffectData(gridX:number, gridY:number, mapId:number, effectName:string, scaleX:number = 1, scaleY:number = 1):SceneEffectInfo {
        let _effectId:string = EntityUtil.getSceneEffectEntityId(gridX, gridY, effectName);
        let _effectInfo:SceneEffectInfo = this.gEntityInfos[_effectId] as SceneEffectInfo;
        if(!_effectInfo)
        {
            _effectInfo = new SceneEffectInfo();
            _effectInfo.id = _effectId;
            this.gEntityInfos[_effectId] = _effectInfo;
        }
        _effectInfo.setData(gridX, gridY, mapId, effectName, scaleX, scaleY);
        return _effectInfo;
	}

	/**
	 * 攻击我的玩家列表
	 */
	public addFightPlayerId(sEntityId:any):void {
		if(!sEntityId || !EntityUtil.isPlayer(sEntityId)) return;
		if(EntityUtil.isMainPlayerOther(sEntityId) > 0) return;
		let id:string = EntityUtil.getEntityId(sEntityId);
		let entity:RpgGameObject = this.getEntity(id);
		if(!entity || entity.isDead()) return;
		let idKey:string = EntityUtil.getEntityId(sEntityId,RoleIndexEnum.Role_index0);//EntityUtil.convertMainEntityId(sEntityId);//id_I + "_" + sEntityId.type_BY + "_" + sEntityId.typeEx_SH + "_" + sEntityId.typeEx2_BY;
		let list:string[] = this.fightPlayerIds[idKey];
		if(!list) {
			list = [];
			this.fightPlayerIds[idKey] = list;
		}
		if(list.indexOf(id) == -1) {
			list.push(id);
			if(MapUtil.checkShowFightView()) {
				if (!CacheManager.copy.isInCopyByType(ECopyType.ECopyBattleBich)) {
					if(!this.attackTipsId || EntityUtil.getEntityId(this.attackTipsId,RoleIndexEnum.Role_index0) != EntityUtil.getEntityId(sEntityId,RoleIndexEnum.Role_index0)) {
						this.attackTipsId = sEntityId;
						Tip.showRollTip("受到 " + HtmlUtil.html(this.getEntityInfo(id).name_S,Color.Green2) + " 玩家的攻击，点击右边头像进行反击");
						App.TimerManager.doDelay(10000,function(){
							this.attackTipsId = null;
						},this)
					}
				}
			}
			EventManager.dispatch(NetEventEnum.FightEntitysUpdate);
		}
	}

	/**
	 * 从列表中移除一个攻击我的玩家（死亡、或者离开场景）
	 */
	public removeFightPlayer(sEntityId:any):void {
		if(!sEntityId || !EntityUtil.isPlayer(sEntityId)) return;
		let idKey:string = EntityUtil.getEntityId(sEntityId,RoleIndexEnum.Role_index0);//EntityUtil.getEntityId(sEntityId);
		let list:string[] = this.fightPlayerIds[idKey];
		if(list) {
			let id:string = EntityUtil.getEntityId(sEntityId);
			let index:number = list.indexOf(id);
			if(index != -1) {
				list.splice(index,1);
				EventManager.dispatch(NetEventEnum.FightEntitysUpdate);
			}
		}
	}

	/**
	 * 新增击杀过我的玩家
	 */
	public addMurdererId(sEntityId:any):void {
		if(!MapUtil.showMurdererList()) return;
		if(!sEntityId || !EntityUtil.isPlayer(sEntityId)) return;
		let id:string = EntityUtil.getEntityId(sEntityId);
		let entity:RpgGameObject = this.getEntity(id);
		if(!entity) return;
		if(entity.isDead()) {
			entity = this.getOtherPlayer(sEntityId);
		}
		if(!entity) return;
		let idKey:string = EntityUtil.getEntityId(sEntityId,RoleIndexEnum.Role_index0);//EntityUtil.convertMainEntityId(sEntityId);//id_I + "_" + sEntityId.type_BY + "_" + sEntityId.typeEx_SH + "_" + sEntityId.typeEx2_BY;
		let list:string[] = this.murdererIds[idKey];
		if(!list) {
			list = [];
			this.murdererIds[idKey] = list;
		}
		if(list.indexOf(id) == -1) {
			list.push(id);
			EventManager.dispatch(NetEventEnum.MurdererListUpdate);
		}
	}

	/**
	 * 从仇恨列表移除一个玩家
	 */
	public removeMurdererId(sEntityId:any):void {
		if(!sEntityId || !EntityUtil.isPlayer(sEntityId)) return;
		let other:RpgGameObject = this.getOtherPlayer(sEntityId);
		if(other) return;//还存在未死亡的其他角色
		let idKey:string = EntityUtil.getEntityId(sEntityId,RoleIndexEnum.Role_index0);//EntityUtil.getEntityId(sEntityId);
		let list:string[] = this.murdererIds[idKey];
		if(list && list.length > 0) {
			list.length = 0;
			EventManager.dispatch(NetEventEnum.MurdererListUpdate);
			// let id:string = EntityUtil.getEntityId(sEntityId);
			// let index:number = list.indexOf(id);
			// if(index != -1) {
			// 	list.splice(index,1);
			// 	EventManager.dispatch(NetEventEnum.MurdererListUpdate);
			// }
		}
	}

	/**清空攻击我的玩家列表 */
	public clearFightPlayers():void {
		this.fightPlayerIds = {};
		EventManager.dispatch(NetEventEnum.FightEntitysUpdate);
	}

	/**清空仇恨列表 */
	public clearMurdererIds():void {
		this.murdererIds = {};
		EventManager.dispatch(NetEventEnum.MurdererListUpdate);
	}

	/**获取攻击我的玩家列表 */
	public getFightEntityInfos():EntityInfo[] {
		let players:EntityInfo[] = [];
		for(let idKey in this.fightPlayerIds) {
			let list:string[] = this.fightPlayerIds[idKey];
			if(list.length == 0) continue;
			for(let i:number = 0; i < list.length; i ++) {
				let entity:RpgGameObject = this.getEntity(list[i]);
				if(!entity || !entity.entityInfo || entity.isDead()) continue;
				players.unshift(entity.entityInfo);
				break;
			}
		}
		return players;
	}

	/**获取击杀过我的玩家列表 */
	public getMurdererInfos():EntityInfo[] {
		let players:EntityInfo[] = [];
		for(let idKey in this.murdererIds) {
			let list:string[] = this.murdererIds[idKey];
			if(list.length == 0) continue;
			for(let i:number = 0; i < list.length; i ++) {
				let entity:RpgGameObject = this.getEntity(list[i]);
				if(!entity || !entity.entityInfo) continue;//死亡也需要显示在列表中，必须是由我击杀复仇后才清除
				if(entity.isDead()) {
					let other:RpgGameObject = this.getOtherPlayer(entity.entityInfo.entityId);
					if(other) {
						players.unshift(other.entityInfo);
						break;
					}
				}
				players.unshift(entity.entityInfo);
				break;
			}
		}
		return players;
	}

	/**
	 * 新增一个可攻击的玩家
	 */
	public addCanAttackPlayer(sEntityId:any):void {
		if(!sEntityId || !EntityUtil.isPlayer(sEntityId)) return;
		if(EntityUtil.isMainPlayerOther(sEntityId) > 0) return;
		let id:string = EntityUtil.getEntityId(sEntityId);
		let info:EntityBaseInfo = this.gEntityInfos[id];
		//允许放入已死亡的玩家，获取的时候过滤死亡状态，实体只初始化一次，否则复活时不放入到可攻击列表中
		if(!info) return;// || Number(info["life_L64"]) <= 0
		let idKey:string = EntityUtil.getEntityId(sEntityId,RoleIndexEnum.Role_index0);//EntityUtil.convertMainEntityId(sEntityId);//id_I + "_" + sEntityId.type_BY + "_" + sEntityId.typeEx_SH + "_" + sEntityId.typeEx2_BY;
		let list:string[] = this.canAttackIds[idKey];
		if(!list) {
			list = [];
			this.canAttackIds[idKey] = list;
		}
		if(list.indexOf(id) == -1) {
			list.push(id);
			// EventManager.dispatch(NetEventEnum.CanAttackPlayersUpdate);
		}
	}

	/**
	 * 移除一个在可攻击列表的玩家，只有玩家离开场景或者下线才移除
	 * 死亡时不移除，获取时过滤死亡状态的实体
	 */
	public removeCanAttackPlayer(sEntityId:any):void {
		if(!sEntityId || !EntityUtil.isPlayer(sEntityId)) return;
		let idKey:string = EntityUtil.getEntityId(sEntityId,RoleIndexEnum.Role_index0);//EntityUtil.getEntityId(sEntityId);
		let list:string[] = this.canAttackIds[idKey];
		if(list) {
			let id:string = EntityUtil.getEntityId(sEntityId);
			let index:number = list.indexOf(id);
			if(index != -1) {
				list.splice(index,1);
				EventManager.dispatch(NetEventEnum.CanAttackPlayersUpdate);
			}
		}
	}

	/**
	 * 获取当前地图可攻击的玩家列表
	 * @param firstId 需要放在列表第一位的玩家id
	 */
	public getCanAttackPlayerInfos(firstId:any = null):EntityInfo[] {
		let players:EntityInfo[] = [];
		let firstInfo:EntityInfo;
		for(let idKey in this.canAttackIds) {
			let list:string[] = this.canAttackIds[idKey];
			if(list.length == 0) continue;
			let deadNum:number = 0;
			for(let i:number = 0; i < list.length; i ++) {
				let entity:RpgGameObject = this.getEntity(list[i]);
				if(!EntityUtil.checkEntityIsCanAttack(entity,false,false)) continue;
				if(entity.isDead()) {
					deadNum ++;
					if(deadNum == list.length) {
						//三角色全死亡才放入列表,否则查找未死亡的实体放入列表
						players.push(entity.entityInfo);
					}
					continue;
				}
				if(EntityUtil.isPlayerOther(firstId,entity.entityInfo.entityId)) {
					firstInfo = entity.entityInfo;
					break;
				}
				players.push(entity.entityInfo);
				break;
			}
		}
		if(firstInfo != null) {
			players.unshift(firstInfo);
		}
		return players;
	}

	public getCollectingTargets():RpgGameObject[] {
		let entity:RpgGameObject;
		let targets:RpgGameObject[] = [];
        for(let entityId in this.entitys) {
            entity = this.entitys[entityId];
            if(!entity || entity.isDead() || !entity.entityInfo || entity.objType != RpgObjectType.OtherPlayer) continue;
            if (entity.entityInfo.status_BY == EMoveStatus.EMoveStatusCollect) targets.push(entity);
        }
        return targets;
	}

	public getBossEntityInfo():any {
		for(let id in this.gEntityInfos) {
			if(this.gEntityInfos[id].type != EEntityType.EEntityTypeBoss) continue;
			if(EntityUtil.isShowBossHp(this.gEntityInfos[id])) {
				return this.gEntityInfos[id];
			}
		}
		return null;
	}

	public deleteEntity(entityId:string):void {
		if(this.gEntityInfos[entityId]) {
			delete this.gEntityInfos[entityId];
		}

		let index:number = this.publicDropKeys.indexOf(entityId);
		if(index != -1) this.publicDropKeys.splice(index,1);

		index = this.privateDropKeys.indexOf(entityId);
		if(index != -1) this.privateDropKeys.splice(index,1);

		this.deletePlayerShowId(entityId);
		this.deletePlayerId(entityId);
	}

	public deleteAllEntity():void
	{
		// console.log("清理所有实体数据",this.gEntityInfos,"当前时间：",egret.getTimer());
		this.gEntityInfos = {};
		this._scenePlayerShowIds = [];
		this._scenePlayerAllIds = [];
		this.publicDropKeys = [];
		this.privateDropKeys = [];
		this.deleteList = [];
		this.canAttackIds = {};
		this.fightPlayerIds = {};
		this.murdererIds = {};
		CacheManager.role.entityInfo.selfIndex = -1;
	}

	public set entitys(entitys: { [entityId: string]: RpgGameObject }) {
		this._entitys = entitys;
	}

	public get entitys(): { [entityId: string]: RpgGameObject } {
		return this._entitys;
	}

	/**
	 * 获取某类实体的个数
	 * @param objType RpgObjectType
	 * @param extCode 不计算数量的怪物code
	 * 
	 */
	public getEntityNum(objType:number=RpgObjectType.Monster,extCode:number[]=null):number{
		let n:number = 0;
		let entity: RpgGameObject;
		for (let entityId in this._entitys) {
			entity = this.getEntity(entityId);
			if (entity && entity.objType == objType){ //RpgObjectType.Monster
				if(extCode){
					if(extCode.indexOf(entity.entityInfo.code_I)==-1){
						n++;
					}
				}else{
					n++;
				}
			}
		}
		return n;
	}

	/**根据bossCode获取实体 */
	public getEntityByBossCode(bossCode:number):EntityBaseInfo{
		
		for (let key in this.gEntityInfos) {
			let entityInfo:EntityBaseInfo = this.gEntityInfos[key];
			if(entityInfo && entityInfo instanceof EntityInfo && entityInfo.code_I==bossCode){
				return entityInfo;
			}
		}
		return null;
	}

	public getEntityTotalNum():number {
        let n:number = 0;
        for (let entityId in this._entitys) {
			n++;
        }
        return n;
	}

	/**
	 * 获取场景中的实体
	 */
	public getEntity(entityId: any): RpgGameObject {
		if(typeof entityId == "string" || typeof entityId == "number") {
			return this._entitys[entityId];
		}
		else {
			if(EntityUtil.isMainPlayer(entityId)) {
				return CacheManager.king.kingEntity;
			}
			else {
				let idStr:string = EntityUtil.getEntityId(entityId);
				return this._entitys[idStr];
			}
		}
	}

	/**
	 * 获取属于实体的某个类型实体
	 * @param sEntityId 主人id
	 * @param type 实体类型
	 */
	public getBelongEntity(sEntityId:any,type:EEntityType):RpgGameObject
	{
		if(!sEntityId) return;
		let _id:any = {roleIndex_BY:0,id_I:sEntityId.id_I, type_BY:type, typeEx_SH:sEntityId.typeEx_SH, typeEx2_BY:sEntityId.typeEx2_BY};
		return this.getEntity(EntityUtil.getEntityId(_id));
	}

	/**
	 * 获取一个属于玩家自己的实体
	 */
	public getBelongMineEntity(type:EEntityType):RpgGameObject
	{
		let _entityId:any = CacheManager.role.entityInfo.entityId;
		return this.getBelongEntity(_entityId,type);
	}

	/**
	 * 获取实体的任意一个非死亡多角色
	 */
	public getOtherPlayer(entityId:any):RpgGameObject {
		if(!entityId || !EntityUtil.isPlayer(entityId)) return null;
		let roleIndexArrs:number[] = RoleIndexEnum.RoleIndexAll;
		//优化该方法每次都要遍历场景中所有实体
		for(let i:number = 0; i < roleIndexArrs.length; i++) {
			if(entityId.roleIndex_BY == roleIndexArrs[i]) continue;
			let idStr:string = EntityUtil.getEntityId(entityId,roleIndexArrs[i]);
			let entity:RpgGameObject = this.getEntity(idStr);
			if(entity && entity.entityInfo && !entity.isDead()) return entity;
		}
		return null;
		// for(let id in this.entitys) {
		// 	if(idStr == id) continue;
		// 	if(this.entitys[id].isDead()) continue;
		// 	if(!this.entitys[id].entityInfo) continue;
		// 	let eId:any = this.entitys[id].entityInfo.entityId;
		// 	if(!eId) continue;
		// 	if(EntityUtil.isPlayerOther(entityId,eId)) {
		// 		return this.entitys[id];
		// 	}
		// }
		// return null;
	}

	/**
	 * 获取与entityId关联的多角色实体列表
	 */
	public getOtherPlayers(entityId:any):RpgGameObject[] {
		if(!entityId || !EntityUtil.isPlayer(entityId)) return null;
		let list:RpgGameObject[] = [];
		let idStr:string = EntityUtil.getEntityId(entityId);
		for(let id in this.entitys) {
			if(!this.entitys[id].entityInfo) continue;
			let eId:any = this.entitys[id].entityInfo.entityId;
			if(idStr == id || !this.entitys[id].entityInfo || !EntityUtil.isPlayer(eId)) continue;
			if(!eId) continue;
			if(EntityUtil.isPlayerOther(entityId,eId)) {
				list.push(this.entitys[id]);
			}
			// if(entityId.id_I + RoleIndexEnum.RoleBase1 == eId.id_I || entityId.id_I + RoleIndexEnum.RoleBase2 == eId.id_I ||
			// 	entityId.id_I - RoleIndexEnum.RoleBase1 == eId.id_I || entityId.id_I - RoleIndexEnum.RoleBase2 == eId.id_I) {
			// 	list.push(this.entitys[id]);
			// }
		}
		if(EntityUtil.isMainPlayerOther(entityId) > 0) {
			//归属者信息更新是自己的多角色，取0号主角数据
			list.push(CacheManager.king.kingEntity);
		}
		return list;
	}

    public getPlayerLifeAll(entityId:any):{life:number, maxLife:number} {
        let eId:string = EntityUtil.getEntityId(entityId);
        let lifeAll = {life:0, maxLife:0};
        if(eId != "") {
            let entityInfo: any = this.getEntityInfo(eId);
            if (!entityInfo) return lifeAll;
            let _life: number = Number(entityInfo.life_L64);
            if (_life <= 0) _life = 0;
            let _maxLife: number = Number(entityInfo.maxLife_L64);
            let list: RpgGameObject[] = CacheManager.map.getOtherPlayers(entityInfo.entityId);
            for (let i: number = 0; i < list.length; i++) {
                if (list[i].entityInfo) {
                    _life += Number(list[i].entityInfo.life_L64);
                    _maxLife += Number(list[i].entityInfo.maxLife_L64);
                }
            }
            lifeAll.life = _life;
            lifeAll.maxLife = _maxLife;
        }
        return lifeAll;
    }

	/**获取一个附近的玩家 */
	public getNearOtherPlayer():OtherPlayer {
		for(let id in this.entitys) {
			let entityInfo:any = this.entitys[id].entityInfo;
			if(!entityInfo || !entityInfo.entityId || !EntityUtil.isPlayer(entityInfo.entityId)) continue;
			if(this.entitys[id].isDead()) continue;
			if(EntityUtil.isMainPlayerOther(entityInfo.entityId) != -1) continue;
			return this.entitys[id] as OtherPlayer;
		}
	}

	/**
	 * 在范围内自动选择一个最近的怪物
	 * @param distance -1不限定范围
	 * @param bossCode -1不限定怪物
	 * @param isForceFindBoss 是否强制优先找到一个Boss攻击，忽略距离 (某些副本需要)
	 * @param filterCollect 是否排除采集怪
	 */
	public getNearestMonster(distance: number = -1, bossCode: number = -1,isForceFindBoss:boolean=false,filterCollect:boolean = false): RpgMonster {
        let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
		if(!kingEntity || !kingEntity.entityInfo) {
			return null;
		}
		let monster: RpgMonster;
		let dis: number;
		let minDis: number = -1;
		let entity: RpgGameObject;
		for (let entityId in this._entitys) {
			entity = this.getEntity(entityId);
			if(filterCollect && EntityUtil.isCollectionMonster(entity)) {
				continue;
			}
			if(entity.objType == RpgObjectType.Monster) {
				if(!PathUtils.gridXYCanWalk(entity.col,entity.row)) continue;
				if (EntityUtil.checkEntityIsCanAttack(entity) && (bossCode == -1 || entity.entityInfo.code_I == bossCode)) {
					if(isForceFindBoss){ //强制找到一个boss优先攻击 某些副本需要						
						var bossConfig:any = ConfigManager.boss.getByPk((entity as RpgMonster).entityInfo.code_I);
						if(bossConfig.showType && bossConfig.showType==EBossShowType.EBossShowTypeBoss){
							monster = entity as RpgMonster;
							break;
						}
					}

					if (distance != -1) {
						dis = App.MathUtils.getDistance(kingEntity.col, kingEntity.row, entity.col, entity.row);
						if (dis <= distance) {
							if (minDis == -1 || dis < minDis) {
								monster = entity as RpgMonster;
								minDis = dis;
							}
						}
					} else {
						dis = App.MathUtils.getDistance(kingEntity.col, kingEntity.row, entity.col, entity.row);
						if (minDis == -1 || dis < minDis) {
							monster = entity as RpgMonster;
							minDis = dis;
						}
					}
				}
			}
		}
		/*
		if(monster && CacheManager.copy.isInCopyByType(ECopyType.ECopyMgGuildDefense)){
			console.log("---- 守护仙盟 找距离最近的怪坐标:",monster.col,monster.row,"角色坐标",kingEntity.col, kingEntity.row,"minDis=",minDis,"distance",distance,"entityInfo.code_I",monster.entityInfo.code_I);			
		}
		*/
		return monster;
	}

	/**
	 * 获取某个中心点附近的玩家数
	 */
	public getRangeEntityNum(centerCol:number,centerRow:number,distance:number=-1,isCalSelf:boolean=false):number{
		let n:number = 0;
		let entity: RpgGameObject;
		let dis: number;
		for (let entityId in this._entitys){
			entity = this.getEntity(entityId);
			if(entity && entity.entityInfo && (entity.entityInfo instanceof EntityInfo) && entity.entityInfo.getRoleIndex()==0){
				if(!isCalSelf && CacheManager.king.isLeaderEntity(entity.entityInfo.entityId)){
					continue; //不计算自己
				}
				dis = App.MathUtils.getDistance(centerCol,centerRow, entity.col, entity.row);
				if(dis<distance || distance==-1){
					n++;
				}
			}			
		}
		return n;
	}

    /**
     * 在范围内自动选择一个最近的采集物
     * @param distance -1不限定范围
     * @param bossCode -1不限定怪物
     */
    public getNearestCollect(distance: number = -1, bossCode: number = -1): RpgMonster {
        let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
        if(!kingEntity || !kingEntity.entityInfo) {
            return null;
        }
        let monster: RpgMonster;
        let dis: number;
        let minDis: number = -1;
        let entity: RpgGameObject;
        for (let entityId in this._entitys) {
            entity = this.getEntity(entityId);
            if (EntityUtil.isCollectionMonster(entity) && (bossCode == -1 || entity.entityInfo.code_I == bossCode)) {

                if (distance != -1) {
                    dis = App.MathUtils.getDistance(kingEntity.col, kingEntity.row, entity.col, entity.row);
                    if (dis <= distance) {
                        if (minDis == -1 || dis < minDis) {
                            monster = entity as RpgMonster;
                            minDis = dis;
                        }
                    }
                } else {
                    dis = App.MathUtils.getDistance(kingEntity.col, kingEntity.row, entity.col, entity.row);
                    if (minDis == -1 || dis < minDis) {
                        monster = entity as RpgMonster;
                        minDis = dis;
                    }
                }
            }
        }
        return monster;
    }

	/**
	 * 根据距离筛选怪物
	 * @param dis:距离(格子) -1:全部 >0:小于等于该距离
	 */
	public getTargetsSortByDis(roleIndex:number = 0, dis:number = -1, forceObjType:RpgObjectType = null): Array<RpgGameObject> {
		let targets: Array<RpgGameObject> = [];
        let kingEntity: MainPlayer = CacheManager.king.getRoleEntity(roleIndex);
		let entity: RpgGameObject;
		for (let entityId in this._entitys) {
			entity = this.getEntity(entityId);
			if(entity.entityInfo && !PathUtils.gridXYCanWalk(entity.col,entity.row)) continue;
			if ((!forceObjType || entity.objType == forceObjType)
				&& EntityUtil.checkEntityIsCanAttack(entity)
				&& !EntityUtil.isCollectionMonster(entity)//非采集怪
				&& (dis == -1 || dis >= App.MathUtils.getDistance(kingEntity.col, kingEntity.row, entity.col, entity.row))) {
                targets.push(entity);
			}
		}

		targets.sort((m1:RpgGameObject, m2:RpgGameObject)=>{//判断距离
            if (kingEntity) {
                return App.MathUtils.getDistance(kingEntity.col, kingEntity.row, m1.col, m1.row)
                    - App.MathUtils.getDistance(kingEntity.col, kingEntity.row, m2.col, m2.row);
            }
            return 0;
		});
		return targets;
	}

	public set mapId(value:number)
	{
		if(this.gMapId == value) return;
		this.clearCurMap();
		ControllerManager.scene.sceneState = SceneStateEnum.Loading;
		this.gMapId = value;
        let mapMaping:any = ConfigManager.mapMaping.getByPk(value);
        this.gMapResId = !mapMaping ? value : mapMaping.toMapId;
		// this.deleteAllEntity();
	}

	public parseCurrentMapData():void
	{
		let resId:number = this.getMapResId();
		let mapData:any = this.gMapData[resId];
		if(!mapData)
		{
			mapData = RES.getRes("map_" + resId + "_data.json");
			if(mapData)
			{
				this.gMapData[resId] = mapData;
                this.parseBlockType(mapData.blocks);
            }
		}
		else
		{
            this.parseBlockType(mapData.blocks);
		}
		let sceneData: any = this.gMapScene[resId];
		if(!sceneData)
		{
			sceneData = ConfigManager.map.getSceneConfig(resId);
			if(sceneData) this.gMapScene[resId] = sceneData;
		}

		//某些副本不显示npc
		let _npcs:any = sceneData.npcs;
		if(_npcs && !CacheManager.copy.isInCopyByType(ECopyType.ECopyPunchLead))
		{
			for(let i:number = 0; i < _npcs.length; i++)
			{
				let _npcId:number = _npcs[i].npcId;
				let _npcInfo:NpcInfo = this.gEntityInfos[_npcId] as NpcInfo;
				if(!_npcInfo)
				{
					_npcInfo = new NpcInfo();
					_npcInfo.id = String(_npcId);
					this.gEntityInfos[_npcId] = _npcInfo;
				}
				_npcInfo.setData(_npcs[i]);
			}
		}
		
		let _passPoints:any = sceneData.passPoints;
		if(_passPoints && !CacheManager.copy.isInCopyByType(ECopyType.ECopyMgMining))
		{
			for(let i:number = 0; i < _passPoints.length; i++)
			{
				this.addPassPointData(_passPoints[i]);
			}
		}

		let _special:any = this.gMapSpecial[resId];
		if(!_special)
		{
			_special = RES.getRes("map_" + resId + "_special.json");
			if(_special) this.gMapSpecial[resId] = _special;
		}

		let jumpPoints:any[] = sceneData.jumpPoints;
        if (jumpPoints && jumpPoints.length) {
        	let jumpDir:Dir;
            for (let jp of jumpPoints) {
                jumpDir = RpgGameUtils.computeGameObjDir(jp.fromX, jp.fromY, jp.toX, jp.toY);
                this.addSceneEffectData(jp.fromX, jp.fromY, resId, RpgGameConst.SCENE_EFFECT_ID_JUMP+'', jumpDir >= Dir.BottomLeft ? -1 : 1);
            }
        }

		let sceneEffects:any[] = sceneData.sceneEffects;
        if (sceneEffects && sceneEffects.length) {
            for (let se of sceneEffects) {
                this.addSceneEffectData(se.fromX, se.fromY, resId, se.name);
            }
        }
	}

	private parseBlockType(blocks:number[][]):void {
        this.gMapBlockType = {};
        let rows: number = blocks.length;
        let cols: number = blocks[0].length;

        let px: number;
        let py: number;
        let blockVal:number;
        for (py = 0; py < rows; py++) {//记录类型大于20的点坐标，不重复
            for (px = 0; px < cols; px++) {
                blockVal = blocks[py][px];
                if (blockVal > 20) {
                	!this.gMapBlockType[blockVal] && (this.gMapBlockType[blockVal] = [px, py]);
				}
            }
        }
	}

	/**
	 * 判断地图格子类型
     * gridPos 地图格子
	 * mpType 格子类型
     * @returns {boolean}
     */
    public isMapPointType(gridPos:egret.Point, mpType:EMapPointType):boolean
    {
    	let mapData:any = this.getCurMapData();
    	if (mapData)
		{
            if (mapData.blocks[gridPos.y])
            	return mapData.blocks[gridPos.y][gridPos.x] == mpType;
		}
		return false;
    }

    public getCurMapPointType():EMapPointType {
    	let leader:RpgGameObject = CacheManager.king.leaderEntity;
    	if (!leader) return null;
    	let roleGrid:egret.Point = leader.gridPoint;
        let mapData:any = this.getCurMapData();
        if (mapData) {
            if (mapData.blocks[roleGrid.y])
                return mapData.blocks[roleGrid.y][roleGrid.x];
        }
        return null;
	}

    public isMapInstanceType(type:EMapInstanceType):boolean
	{
        let sceneData:any = this.getCurMapScene();
        return sceneData && sceneData.instanceType == type;
	}

	public setNpcTaskState(npcId:number,state:TaskNpcStatus):void
	{
		this.gNpcTaskState[npcId] = state;
	}

	public getNpcTaskState(npcId:number):TaskNpcStatus
	{
		return this.gNpcTaskState[npcId] == undefined ? TaskNpcStatus.None : this.gNpcTaskState[npcId];
	}

	public get allInfos():{[entityId:string]:EntityBaseInfo}
	{
		return this.gEntityInfos;
	}

	public getEntityInfo(id:string):EntityBaseInfo
	{
		return this.gEntityInfos[id];
	}

	public getEntityInfosByObjType(type:EEntityType, bossType:EBossType = null):EntityBaseInfo[]
	{
		let infos:EntityBaseInfo[] = [];
		let entityInfo:EntityBaseInfo;
		for (let key in this.gEntityInfos) {
            entityInfo = this.gEntityInfos[key];
			if (entityInfo.type == type && (type != EEntityType.EEntityTypeBoss || EntityUtil.checkMonsterType(this,bossType)))
				infos.push(entityInfo);
		}
		return infos;
	}

	public getConfigEntity():EntityBaseInfo[]
	{
		let _list:EntityBaseInfo[] = [];
		for(let id in this.gEntityInfos)
		{
			let _info:EntityBaseInfo = this.gEntityInfos[id];
			if(_info.type == EEntityType.EEntityTypeNPC || _info.type == EEntityType.EEntityTypePassPoint)
			{
				_list.push(_info);
			}
		}
		return _list;
	}

	public getCurMapData():any
	{
		let mapData:any = this.gMapData[this.getMapResId()];		
		return mapData;
	}

	public getCurMapScene():any
	{
		return this.gMapScene[this.getMapResId()];
	}

	/**获取当前地图限制类型 */
	public  getRestrictionType():number{
		var restrictionType:number = 0;
		var mapSceneInf:any = this.getCurMapScene();
		if(mapSceneInf){
			restrictionType = mapSceneInf.restrictionType;
		}
		return restrictionType;
	}
	public getCurMapSpecial():any
	{
		return this.gMapSpecial[this.getMapResId()];
	}

	public get mapId():number
	{
		return this.gMapId;
	}

	public getMapResId():number{
		return this.gMapResId;
	}

	/** 地图是否可点击移动/摇杆*/
    public getMapCanHandOperate():boolean {
        let mapSceneInf:any = this.getCurMapScene();
        if (mapSceneInf){
            return mapSceneInf.canHandOperate;
        }
        return false;
    }

	/** 地图是否屏蔽模型特效*/
    public getMapShieldModel():boolean {
        let mapSceneInf:any = this.getCurMapScene();
        if (mapSceneInf){
            return mapSceneInf.shieldModel;
        }
        return false;
    }

	/** 地图名字*/
    public get mapName():string {
        let mapSceneInf:any = this.getCurMapScene();
        if (mapSceneInf){
            return mapSceneInf.name;
        }
        return "";
    }

	/** 通过格子类型获取坐标*/
    public getMapCoordsByBlockType(type):number[] {
        return this.gMapBlockType[type];
    }

    public get isMapRendering(): boolean {
        return this._isMapRendering;
    }

    public set isMapRendering(value: boolean) {
        this._isMapRendering = value;
    }

	public addPlayerShowId(entityId:string):void {
		if(this._scenePlayerShowIds.indexOf(entityId) == -1) {
			this._scenePlayerShowIds.push(entityId);
		}
	}

	public deletePlayerShowId(entityId:string):void {
		let index:number = this._scenePlayerShowIds.indexOf(entityId);
		if(index != -1) {
			this._scenePlayerShowIds.splice(index,1);
		}
	}

	private addPlayerId(entityId:string):void {
		if(this._scenePlayerAllIds.indexOf(entityId) == -1) {
			this._scenePlayerAllIds.push(entityId);
			this.changeAsBitmap();
		}
	}

	private deletePlayerId(entityId:string):void {
		let index:number = this._scenePlayerAllIds.indexOf(entityId);
		if(index != -1) {
			this._scenePlayerAllIds.splice(index,1);
			this.changeAsBitmap();
		}
	}

	private changeAsBitmap():void {
		if(this._scenePlayerAllIds.length >= RpgGameData.CacheAsBitmapLimit) {
			!this._txtAsBitmap && this.txtAsBitmap();
		}
		else {
			this._txtAsBitmap && this.txtAsBitmap();
		}
	}

	public txtAsBitmap(value:number = -1):void {
		if(value != -1) {
			this._txtAsBitmap = Boolean(value);
		}
		else {
			this._txtAsBitmap = !this._txtAsBitmap;
		}
		ControllerManager.rpgGame.view.cacheAsBitmapLayer(this._txtAsBitmap);
	}

	/**当前场景中所有玩家实体id */
	public get scenePlayerIds():string[] {
		return this._scenePlayerShowIds;
	}

	/**当前场景玩家是否超过最大数量限制 */
	public get playerFull():boolean {
		return this.scenePlayerIds.length >= RpgGameData.PlayerMaxNum;
	}

	public get hasPublicDrops():boolean {
        return this.publicDropKeys.length > 0;
    }

    public get hasPrivateDrops():boolean {
        return this.privateDropKeys.length > 0;
    }

    public get dropPrivateKeys():string[] {
        return this.privateDropKeys;
    }

    public get publicDrops():RpgGameObject[] {
        let _sortList:RpgGameObject[] = [];
        if(!this.publicDropKeys) return [];
        for(let key of this.publicDropKeys) {
            if(this.entitys[key]) {
                _sortList.push(this.entitys[key]);
            }
        }
        _sortList.sort(this.onDisSort);
        return _sortList;
    }

    public get privateDrops():RpgGameObject[] {
        let _sortList:RpgGameObject[] = [];
        if(!this.privateDropKeys) return [];
        for(let key of this.privateDropKeys) {
            if(this.entitys[key]) {
                _sortList.push(this.entitys[key]);
            }
        }
        _sortList.sort(this.onDisSort);
        return _sortList;
    }

    private onDisSort(value1:RpgGameObject,value2:RpgGameObject):number {
        let _king:MainPlayer = CacheManager.king.leaderEntity;
		let kingX:number = _king.x;
		let kingY:number = _king.y;
        let _dis1:number = App.MathUtils.getDistance(kingX,kingY,value1.x,value1.y);
        let _dis2:number = App.MathUtils.getDistance(kingX,kingY,value2.x,value2.y);
        if(_dis1 < _dis2) return -1;
        if(_dis2 < _dis1) return 1;
        return 0;
    }

    /**获取一个属于自己的公有掉落 */
    public getCanPickUpDrop():DropPublicEntity {
        let _drops:DropPublicEntity[] = this.publicDrops as DropPublicEntity[];
		for(let i:number = 0; i < _drops.length; i++) {
            let _entity:DropPublicEntity = _drops[i];
            if(!_entity.entityInfo) continue;
            //没有设置自动拾取该物品
            if(CacheManager.sysSet.checkItemShield(Number(_entity.entityInfo.code_I))) continue;
			if(_entity.entityInfo && _entity.entityInfo.canPickUp) {
				return this.publicDrops[i] as DropPublicEntity;
			}
		}
        return null;
	}

	public isPickUpAll():boolean {
		if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgParadiesLost)) return false; //双生乐园副本,逐个拾取
		if(!this.isMapInstanceType(EMapInstanceType.EMapInstanceTypeCheckPoint)) {
			//不在关卡
			return CacheManager.copy.isPickupAll;
		}
		return true;
    }

    public getJumpPoint(gridX:number, gridY:number, isEnd:boolean = false):any {
        let sceneData: any = this.getCurMapScene();
        let jumpPoints: any[] = sceneData ? sceneData.jumpPoints : null;
    	if (jumpPoints && jumpPoints.length) {
            for (let jp of jumpPoints) {
            	if (isEnd == false) {
                    if (gridX == jp.fromX && gridY == jp.fromY) {
                        return jp;
                    }
				} else if (gridX == jp.toX && gridY == jp.toY) {
                    return jp;
				}
            }
        }
        return null;
	}

	public getJumpPointByCheckPointId(id:number, isCopy:boolean):any {
        let sceneData: any = this.getCurMapScene();
        let jumpPoints: any[] = sceneData.jumpPoints;
        let jumpPointId:number;
        let jumpType:EJumpType;
        let jumpIdx:number = ConfigManager.checkPoint.getIdxInMap(id);//关卡在地图中属于第几关
        if (isCopy) {
            jumpType = EJumpType.CheckPointBoss;
            jumpPointId = 2000 + jumpIdx;
		} else {
            jumpType = EJumpType.CheckPoint;
            jumpPointId = 1000 + jumpIdx;
		}
        if (jumpPoints && jumpPoints.length) {
            for (let jp of jumpPoints) {
                if (jumpPointId == jp.id) {
                    return jp;
                }
                if (jp.exParams && jp.exParams.indexOf(id) != -1 && jumpType == jp.type) {
                    return jp;
                }
            }
        }
        return null;
	}

    public clearCurMap(): void {
        let resId:number = this.getMapResId();
        let mapData:any = this.gMapData[resId];
		if (mapData) {
            delete this.gMapData[resId];
            // App.LoaderManager.destroyRes("map_" + resId + "_data.json");
		}
        let sceneData: any = this.gMapScene[resId];
        if (sceneData) {
            delete this.gMapScene[resId];
        }
        let special:any = this.gMapSpecial[resId];
        if (special) {
            delete this.gMapSpecial[resId];
            // App.LoaderManager.destroyRes("map_" + resId + "_special.json");
        }
    }

	public get isInMainCity(): boolean {
		return MapUtil.isMainCity(this.gMapId);
	}

	public clear(): void {

	}

	public statlog():string {
		let log:string = "";
		let objCount:number=0;
		for (let objKey in this._entitys) {
			objCount++;
		}
        log += `实体数量=${objCount}\n`;
		let infoCount:number = 0;
		for (let infoKey in this.gEntityInfos) {
			infoCount++;
		}
        log += `数据数量=${infoCount}\n`;

		let objKeys:Array<string> = ["RpgText","RpgGameObject", "MainPlayer", "RpgMonster", "OtherPlayer", "Npc", "PassPointEntity", "PetEntity", "DropEntity", "DropPublicEntity"];
		let poolContent:any = ObjectPool.getContent();
        for (let i = 0; i < objKeys.length; i++) {
            let objKey:string = objKeys[i];
			let objPool:Array<any> = poolContent[objKey];
            objPool && (log += `${objKeys[i]}池数量=${objPool.length}\n`);
        }
		return log;

	}

}