/**
 * 角色属性更新
 */
class RoleAttributeUpdateCommand implements ICommand {
	private roleCache: RoleCache;
	private roleIndex: number;
	private updateCode: number;
	private roleEntity:MainPlayer;

	public constructor() {
		this.roleCache = CacheManager.role;
	}

	public onMessage(data: any, msgId: number): void {
		this.updateCode = data.code_I;
		this.roleIndex = data.index_I;
		this.roleEntity = CacheManager.king.getRoleEntity(this.roleIndex);
		for (let attrUpdate of data.updates.data) {
			this.roleAttrUpdate(attrUpdate);
		}

		this.roleEntity = null;
	}

	private roleAttrUpdate(attrUpdate: any): void {
		let attr: number = attrUpdate.attribute;
		let valueNum: number = attrUpdate.value_I;
		let valueStrNum: number = Number(attrUpdate.valueStr_S);

		switch (attr) {
			case EEntityAttribute.EAttributeLevel://等级
				let lastRoleLevel: number = CacheManager.role.getRoleLevel();
				valueStrNum = attrUpdate.value_I;
				this.roleCache.updateLevel(valueStrNum);
				EventManager.dispatch(NetEventEnum.roleLevelUpdate, { "cur": valueStrNum, "last": lastRoleLevel });
				ResourceManager.loadByRoleLevel(valueStrNum);
				//sdk上报升级日志
				Sdk.levelUpLog(this.roleCache.role.level_I, CacheManager.vip.vipLevel, this.roleCache.combatCapabilities, this.roleCache.getRoleState());
				break;
			case EEntityAttribute.EAttributeLife://生命
				let curHp:number = CacheManager.role.getEntityInfo(this.roleIndex).life_L64;
				if (curHp == valueStrNum) break;
				if (curHp != undefined) {
					let _diff: number = valueStrNum - curHp;
					if (_diff > 0) {
						EventManager.dispatch(NetEventEnum.roleLifeAdd, _diff,this.roleIndex);
					}
				}
				this.roleCache.updateLife(valueStrNum, this.roleIndex);
				EventManager.dispatch(NetEventEnum.roleLifeUpdate, valueStrNum,this.roleIndex);
                //处理复活
                if (Number(curHp) <= 0 && valueStrNum > 0) {
                    EventManager.dispatch(NetEventEnum.kingRelived,this.roleIndex);
                }/* else if (valueStrNum <= 0) {//死亡事件在MainPlayer.checkDeath
                    EventManager.dispatch(NetEventEnum.kingDie,this.roleIndex);
                }*/
				break;
			case EEntityAttribute.EAttributeMaxLife://最大生命
				this.roleCache.getEntityInfo(this.roleIndex).maxLife_L64 = valueStrNum;
				EventManager.dispatch(NetEventEnum.roleMaxLifeUpdate, valueStrNum,this.roleIndex);
				this.roleEntity && this.roleEntity.updateLife();
				break;
			case EEntityAttribute.EAttributeExperience://经验
                // let delay:number = 0;
				this.roleCache.role.experience_L64 = Number(valueStrNum);
                if (MapUtil.isShowExpEffect()) {
                    // delay = 2000;
					break;
                }
				EventManager.dispatch(NetEventEnum.roleExpUpdate, valueStrNum);
                // egret.setTimeout(() => {
                // }, this, delay);
				break;
			case EEntityAttribute.EAttributeExperienceAdd://经验增加
				CacheManager.role.roleExpAdd = valueStrNum;
				EventManager.dispatch(NetEventEnum.roleExpAdd, { exp: valueStrNum, rate: valueNum, "updateCode": this.updateCode });
				break;
			case EEntityAttribute.EAttributeWarfare://战斗力
				if(this.roleIndex==-1){
					let addValue: number = valueStrNum - this.roleCache.combatCapabilities;
					if (this.roleCache.combatCapabilities > 0 && addValue > 0) {//首次推送除外
						EventManager.dispatch(NetEventEnum.roleCombatCapabilitiesAdd, addValue, this.updateCode);
					}
					this.roleCache.combatCapabilities = valueStrNum;
				}else{
					this.roleCache.setRoleCombat(this.roleIndex,valueStrNum);
				}
				EventManager.dispatch(NetEventEnum.roleCombatCapabilitiesUpdate, valueStrNum);
				break;
			case EEntityAttribute.EAttributeCareer://职业
				let lastBaseCareer: number = CacheManager.role.getBaseCareer();
				let lastState: number = CacheManager.role.getRoleState();
				CacheManager.role.updateCareer(valueNum);
				CacheManager.role.role.roleSubState_I = Number(valueStrNum);
				let curState: number = CacheManager.role.getRoleState();
				let curBaseCareer: number = CacheManager.role.getBaseCareer();
				if (curState > lastState)
					EventManager.dispatch(NetEventEnum.roleStateChanged);
				EventManager.dispatch(NetEventEnum.roleCareerChanged);
				break;
			case EEntityAttribute.EAttributeAvatar://头像
				this.roleCache.player.avatar_I = valueStrNum;
				EventManager.dispatch(NetEventEnum.roleAvatarChanged, valueStrNum);
				break;
			case EEntityAttribute.EAttributeName://名称
				let name: string = attrUpdate.valueStr_S;
				this.roleCache.player.name_S = name;
				for(let i:number = 0; i < CacheManager.role.roles.length; i++ ){
					this.roleCache.getEntityInfo(i).name_S = name;
				}
				EventManager.dispatch(NetEventEnum.roleNameChanged, name);
				break;
			case EEntityAttribute.EAttributeSkillCd://CD
				// Log.trace(Log.RPG, "主角技能CD, skillId: " + valueNum);
				// Log.trace(Log.RPG, "主角技能CD, cd时间: " + valueStrNum, (valueStrNum - CacheManager.serverTime.getServerMTime()));

				if(CacheManager.copy.isInCopyByType(ECopyType.ECopyMgNormalDefense)){ //守护神剑的技能cd
					let skills:any[] =  ConfigManager.copy.getDefendSkills();
					for(let info of skills){
						if(info.id==valueNum){
							let total:number = valueStrNum - CacheManager.serverTime.getServerMTime(); //总cd时间 毫秒
							//total = 20000;
							if(total<1000){ //不够1秒
								continue;
							}
							EventManager.dispatch(NetEventEnum.copyDfSkillCDUpd,{skillId:valueNum,total:total,endTime:total + egret.getTimer()});
							break;				
						}
					}
				}
				
				CacheManager.skill.coolSkillInTime(valueNum, valueStrNum);
				if(valueNum == SkillCache.SKILLID_XP){
					EventManager.dispatch(NetEventEnum.SkillXpCooldown, CacheManager.skill.getCd(SkillCache.SKILLID_XP));
				}				
				break;
			case EEntityAttribute.EAttributeStrengthenExLordLevel://爵位等级  			
				let roleNameStr:string = "";
				for(let i:number = 0; i < CacheManager.role.roles.length; i++ ){
					let info:any = this.roleCache.getEntityInfo(i);
					info.lordLevel_I = valueNum;
					if(i==0){
						roleNameStr = info.name_S;
					}					
				}
				if(roleNameStr){
					EventManager.dispatch(NetEventEnum.roleNameChanged, roleNameStr);
				}				
				break;
			case EEntityAttribute.EAttributeCopyProcess://副本进度
				EventManager.dispatch(NetEventEnum.copyProcess, valueNum, valueStrNum);
				break;
			case EEntityAttribute.EAttributeCopySuccess: //副本成功
				EventManager.dispatch(NetEventEnum.copySuccess, valueNum);
				break;
			case EEntityAttribute.EAttributeCopyFail: //副本失败
				EventManager.dispatch(NetEventEnum.copyFail, valueNum);
				break;
			case EEntityAttribute.EAttributeForeverEquipSuit://混元套装外形				
			// case EEntityAttribute.EAttributeShapePet://宠物
			case EEntityAttribute.EAttributeWeapon://武器
			case EEntityAttribute.EAttributeWing://翅膀
			case EEntityAttribute.EAttributeShapeMagic://神兵
			case EEntityAttribute.EAttributeClothes://衣服
			case EEntityAttribute.EAttributeFashion://时装
			case EEntityAttribute.EAttributeMounts://坐骑
			case EEntityAttribute.EAttributeShapeLaw://法阵
			case EEntityAttribute.EAttributeShapeSpirit://法宝
			case EEntityAttribute.EAttributeSpirit://小精灵
			case EEntityAttribute.EAttributeSwordPool://龙魂
			case EEntityAttribute.EAttributeShapeBattle://战阵
			case EEntityAttribute.EAttributeShapeSwordPool://剑池
					
				let weapons:{ [type: number]: number } = this.roleCache.getEntityInfo(this.roleIndex).weapons;
				let isFirstEquipWing: boolean = attr == EEntityAttribute.EAttributeWing && !weapons[attr] && valueNum > 0;	
				if(weapons[attr] == valueNum) return;
				weapons[attr] = valueNum;
				if (isFirstEquipWing) {//第一次装备翅膀, 延迟显示, 等外观开启点击确定再更新
				} else {
					EventManager.dispatch(NetEventEnum.entityAvatarUpdate, attr,this.roleIndex);
				}
				break;
			case EEntityAttribute.EAttributeSpeed://速度
				this.roleCache.entityInfo.speed_SH = valueNum;
				EventManager.dispatch(NetEventEnum.entityAvatarUpdate, attr);
				break;
			case EEntityAttribute.EAttributeFighting://战斗状态更新
				this.roleCache.entityInfo.fightModel_BY = valueNum;
				EventManager.dispatch(NetEventEnum.FightModeUpdated);
				break;
			case EEntityAttribute.EAttributeIsDropOwner: //掉落归属
				// var curIsOwner: boolean = valueNum > 0;
				// if (CacheManager.role.isDropOwner != curIsOwner) {
				// 	CacheManager.role.isDropOwner = curIsOwner;
				// 	EventManager.dispatch(NetEventEnum.roleDropOwner);
				// }
				break;
			// case EEntityAttribute.EAttributeRealmLevel: //境界等级更新
			// 	this.roleCache.entityInfo.realmLevel_BY = valueNum;
			// 	CacheManager.role.role.realmLevel_BY = valueNum;
			// 	EventManager.dispatch(NetEventEnum.roleRealmUpdateed);
			// 	EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, ModuleEnum.Player, CacheManager.player.checkTips());
			// 	break;
			case EEntityAttribute.EAttributeTire:
				CacheManager.role.role.tire_BY = valueNum;
				EventManager.dispatch(NetEventEnum.BossInfTireValue);
				break;
			case EEntityAttribute.EAttributeTireAdd:
				var curTire: number = CacheManager.role.role.tire_BY;
				curTire += valueNum;
				curTire = Math.min(curTire, CopyEnum.TIRE_MAX_VALUE);
				CacheManager.role.role.tire_BY = curTire;
				EventManager.dispatch(NetEventEnum.BossInfTireValue);
				break;
			case EEntityAttribute.EAttributeFightMode:
				this.roleCache.player.mode_I = valueNum;
				EventManager.dispatch(NetEventEnum.roleFightModel); //战斗模式改变
				break;
			case EEntityAttribute.EAttributeShowCheckPoint:
				this.roleCache.checkPointShow = valueNum == 1;
				break;
			case EEntityAttribute.EAttributeForceUpdate:
				this.roleCache.updateForce(valueNum);
				break;
			/**************************************屏蔽外观时装相关***********************/
			/**↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
			case EEntityAttribute.EAttributeNotShowShapePet:
				this.roleCache.entityInfo.weapons[attr] = valueNum;
				let _pet: PetEntity = CacheManager.map.getBelongEntity(this.roleCache.entityInfo.entityId, EEntityType.EEntityTypePet) as PetEntity;
				if (_pet) _pet.updateNotShow(valueNum == 1);
				break;
			case EEntityAttribute.EAttributeNotShowWing:
				this.roleCache.entityInfo.weapons[attr] = valueNum;
				EventManager.dispatch(NetEventEnum.entityNotShowUpdate, ComponentType.AvatarWing, valueNum == 1);
				break;
			case EEntityAttribute.EAttributeNotShowShapeMantle:
				this.roleCache.entityInfo.weapons[attr] = valueNum;
				break;
			case EEntityAttribute.EAttributeNotShowFashionTrack:
				this.roleCache.entityInfo.weapons[attr] = valueNum;
				break;
			case EEntityAttribute.EAttributeNotShowFashionHalo:
				this.roleCache.entityInfo.weapons[attr] = valueNum;
				break;
			case EEntityAttribute.EAttributeNotShowShapeSpirit:
				this.roleCache.entityInfo.weapons[attr] = valueNum;
				EventManager.dispatch(NetEventEnum.entityNotShowUpdate, ComponentType.AvatarSpirit, valueNum == 1);
				break;
			case EEntityAttribute.EAttributeNotShowShapeMagic:
			case EEntityAttribute.EAttributeNotShowFashionWeapon:
				this.roleCache.entityInfo.weapons[attr] = valueNum;
				EventManager.dispatch(NetEventEnum.entityAvatarUpdate, EEntityAttribute.EAttributeWeapon);
				break;
			case EEntityAttribute.EAttributeNotShowShapeSoul:
				this.roleCache.entityInfo.weapons[attr] = valueNum;
				EventManager.dispatch(NetEventEnum.entityNotShowUpdate, ComponentType.AvatarSoul, valueNum == 1);
				break;
			case EEntityAttribute.EAttributeNotShowSwordPool:
				this.roleCache.entityInfo.weapons[attr] = valueNum;
				EventManager.dispatch(NetEventEnum.entityNotShowUpdate, ComponentType.AvatarSoul, valueNum == 1);
				break;

			/**↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
			/**************************************屏蔽外观时装相关***********************/
			case EEntityAttribute.EAttributeBuffer://buff更新
				EventManager.dispatch(NetEventEnum.entityBuffUpdate, { buffId: valueNum, type: attrUpdate.valueStr_S },this.roleIndex);
				break;
			case EEntityAttribute.EAttributeVipLevel:
				CacheManager.vip.vipLevel = valueNum;
				break;
			/******************战斗属性提升**********************/
			/**↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓*/
			case EEntityAttribute.EAttributePhysicalAttack:
				this.roleCache.fightAttrBase.physicalAttack_L = valueNum;
				break;
			case EEntityAttribute.EAttributeMagicAttack:
				this.roleCache.fightAttrBase.magicAttack_I = valueNum;
				break;
			// case EEntityAttribute.EAttributePower:
			// 	break;
			// case EEntityAttribute.EAttributeAgile:
			// 	break;
			// case EEntityAttribute.EAttributeHabitus:
			// 	break;
			// case EEntityAttribute.EAttributeBrains:
			// 	break;
			// case EEntityAttribute.EAttributeSpiritual:
			// 	break;
			// case EEntityAttribute.EAttributePhysicalHurt:
			// 	break;
			// case EEntityAttribute.EAttributeMagicDefense:
			// 	break;
			// case EEntityAttribute.EAttributePhysicalRelief:
			// 	break;
			// case EEntityAttribute.EAttributeMagicRelief:
			// 	break;
			// case EEntityAttribute.EAttributeHit:
			// 	break;
			// case EEntityAttribute.EAttributeJouk:
			// 	break;
			// case EEntityAttribute.EAttributePass:
			// 	break;
			// case EEntityAttribute.EAttributeBlock:
			// 	break;
			// case EEntityAttribute.EAttributeToughness:
			// 	break;
			// case EEntityAttribute.EAttributeAttackSpeed:
			// 	break;
			case EEntityAttribute.EAttributeGuild:
				this.roleCache.getEntityInfo(this.roleIndex).guildName_S = attrUpdate.valueStr_S;
				EventManager.dispatch(NetEventEnum.roleGuildNameUpdated,this.roleIndex);
				break;
			/**↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑*/
			/******************战斗属性提升**********************/
            case EEntityAttribute.EAttributeCollectTimes:
                this.roleCache.updateCollectTimes(valueNum);
                EventManager.dispatch(NetEventEnum.CrossBossCollectTimesUpdate);
                break;
            case EEntityAttribute.EAttributeBossTimes:
                this.roleCache.updateBossTimes(valueNum);
                EventManager.dispatch(NetEventEnum.CrossBossOwnTimesUpdate);
                break;
			case EEntityAttribute.EAttributeStatus:
                Log.trace(Log.RPG, `EAttributeStatus:${EMoveStatus[this.roleCache.getEntityInfo(this.roleIndex).status_BY]}->${EMoveStatus[valueNum]}`);
                this.roleCache.getEntityInfo(this.roleIndex).status_BY = valueNum;
                this.roleEntity && this.roleEntity.updateStatus();
				break;
			case EEntityAttribute.EAttributeTriggerSkillOrBuf:
				let entity:RpgGameObject = CacheManager.king.getRoleEntity(valueNum);
				SkillUtil.entityTalk(entity, attrUpdate.valueStr_S);
				break;
			case EEntityAttribute.EAttributeQiongCangOwnerTimes:
				this.roleCache.updateQiongCangBossOwnerTimes(valueNum);
				break;
			case EEntityAttribute.EAttributeCrossBossCoTimes:
				this.roleCache.updateCrossBossAssistTimes(valueNum);
				break;
			case EEntityAttribute.EAttributeQiongCangCoTimes:
				this.roleCache.updateQiongcangAssistTimes(valueNum);
				break;
		}
	}
}
