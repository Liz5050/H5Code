class EntityInfo extends EntityBaseInfo
{
	public buffers:any;
	public buffersBeginDt:any;
	public buffersEndDt:any;
	// public name_S: string;
	public camp_BY: number;
	public career_SH: number;
	public careerEnable_SH: number;
	public code_I: number;
	public direction_BY: number;
	public entityId: any;
	public fighting_BY: number;
	public fightModel_BY: number;
	public force_BY: number;//EForce阵营
	public groupId_I: any;
	public groupStatus_BY: number;
	public guildId_I: number;
	public guildLevel_BY: number;
	public guildName_S: string;
	public guildPosition_BY;
	public isOfflineWork_B: boolean;
	public killValue_BY: number;
	public level_SH: number;
	public life_L64: number;
	// public life_SH:number;
	public mana_I: number;
	public mateName_S: string;
	public maxLife_L64: number;
	public maxMana_I: number;
	public modelId_I: number;//用于宠物进阶; 人物则表示坐骑模型
	public points: any[];
	public realmLevel_BY: number;
	public reserveJs_S: string;
	public sex_BY: number;
	public showServerName_S: string;
	public speed_SH: number;
	public status_BY: number;
	public talent_SH: number;//野怪用于精英怪标识EBossShowType
	public talk_S: string;
	public titles: any;
	public toEntitys: any;
	public toEntitys2: any;
	public VIP_BY: number;
	public vipLevel_BY: number;
	public lordLevel_I:number;  //爵位等级
	public weapons: { [type: number]: number } = {};//type 对应EEntityAttribute
	public minerPos_BY:number;
	public constructor() 
	{
		super();
	}

	public parseData(data: any,selfIndex:number = -1): void {
		if (!data) return;
		this.entityId = data.entityId;
		this.id = EntityUtil.getEntityId(this.entityId);
		this.gType = this.entityId.type_BY;
		this.gSelfIndex = selfIndex;
		this.buffers = data.buffers;
		this.buffersBeginDt = data.buffersBeginDt;
		this.buffersEndDt = data.buffersEndDt;
		this.gName = data.name_S;
		this.camp_BY = data.camp_BY;
		this.career_SH = data.career_SH;
		this.careerEnable_SH = data.careerEnable_SH;
		this.code_I = data.code_I;
		this.direction_BY = data.direction_BY;
		this.fighting_BY = data.fighting_BY;
		this.fightModel_BY = data.fightModel_BY;
		this.force_BY = data.force_BY;
		this.groupId_I = data.groupId_I;
		this.groupStatus_BY = data.groupStatus_BY;
		this.guildId_I = data.guildId_I;
		this.guildLevel_BY = data.guildLevel_BY;
		this.guildName_S = data.guildName_S;
		this.guildPosition_BY = data.guildPosition_BY;
		this.isOfflineWork_B = data.isOfflineWork_B;
		this.killValue_BY = data.killValue_BY;
		this.level_SH = data.level_SH;
		this.lordLevel_I = data.lordLevel_I;
		if(!this.life_L64) this.life_L64 = Number(data.life_L64);
		// this.life_SH = data.life_SH;
		this.mana_I = data.mana_I;
		this.mateName_S = data.mateName_S;
		this.maxLife_L64 = Number(data.maxLife_L64);
		this.maxMana_I = data.maxMana_I;
		this.modelId_I = data.modelId_I;
		// this.points = data.points;
		this.points = data.points.data;
		// this.points = [];
		// for(let i:number = 0; i < _sPt.length; i++)
		// {			
		// 	let _pt:egret.Point = new egret.Point(_sPt[i].x_SH,_sPt[i].y_SH);
		// 	this.points.push(_pt);
		// }
		this.gCol = this.points[0].x_SH;//this.points[0].x;
		this.gRow = this.points[0].y_SH;//this.points[0].y;
		this.realmLevel_BY = data.realmLevel_BY;
		this.reserveJs_S = data.reserveJs_S;
		this.sex_BY = data.sex_BY;
		this.showServerName_S = data.showServerName_S;
		this.speed_SH = data.speed_SH;
		this.status_BY = data.status_BY;
		this.talent_SH = data.talent_SH;
		this.talk_S = data.talk_S;
		this.titles = data.titles;
		this.toEntitys = data.toEntitys;
		this.toEntitys2 = data.toEntitys2;
		this.VIP_BY = data.VIP_BY;
		this.vipLevel_BY = data.vipLevel_BY;
		this.minerPos_BY = data.minerPos_BY;

		let _key_I: number[] = data.weapons.key_I;
		let _value_I: number[] = data.weapons.value_I;
		if (!_key_I || _key_I.length == 0) {
			this.weapons = {};
		}
		else {
			for (let type in this.weapons) {
				if (_key_I.indexOf(Number(type)) == -1) delete this.weapons[type];
			}
			for (let i: number = 0; i < _key_I.length; i++) {
				let _type: number = _key_I[i];
				this.weapons[_type] = _value_I[i];
			}
		}
	}

	public updateBuffInfo(buffId:number,typeStr:string):void {
		let typeArr:string[] = typeStr.split("#");
		let type:EBufferOp = Number(typeArr[0]);
		let buffIndex:number = this.buffers.data_I.indexOf(buffId);
        if(type == EBufferOp.EBufferOpAdd) {
            if(buffIndex != -1) {
                this.buffers.data_I[buffIndex] = buffId;
            }
            else {
                this.buffers.data_I.push(buffId);
            }
        }
        else if(type == EBufferOp.EBufferOpRemove) {
            if(buffIndex != -1) { 
                this.buffers.data_I.splice(buffIndex,1);
            }
        }
        if(typeArr) {
            if(type == EBufferOp.EBufferOpAdd) {
                if(buffIndex != -1) {
                    // this.entityInfo.buffers.data_I[buffIndex] = data.buffId;
                    this.buffersBeginDt.data_I[buffIndex] = typeArr[1];
                    this.buffersEndDt.data_I[buffIndex] = typeArr[2];
                }
                else {
                    // this.entityInfo.buffers.data_I.push(data.buffId);
                    this.buffersBeginDt.data_I.push(typeArr[1]);
                    this.buffersEndDt.data_I.push(typeArr[2]);
                }
            }
            else if(type == EBufferOp.EBufferOpRemove) {
                if(buffIndex != -1) { 
                    // this.entityInfo.buffers.data_I.splice(buffIndex,1);
                    this.buffersBeginDt.data_I.splice(buffIndex,1);
                    this.buffersEndDt.data_I.splice(buffIndex,1);
                }
            }
			if(this.type == EEntityType.EEntityTypeBoss) {
				EventManager.dispatch(LocalEventEnum.BossBuffUpdate,this,type,buffId);
			}
        }
	}

	public getRoleIndex():number{
		if(this.entityId){
			return this.entityId.roleIndex_BY;
		}
		return -1;
	}

	public get selfIndex():number {
		return this.gSelfIndex;
	}

	public set selfIndex(index:number) {
		this.gSelfIndex = index;
	}

	public get selfInit():boolean
	{
		return this.gSelfIndex != -1;
	}

	public get className():string
	{
		switch(this.gType)
		{
			case EEntityType.EEntityTypePlayer:
			case EEntityType.EEntityTypePlayerMirror:
				if(this.gSelfIndex >= 0) return "MainPlayer";
				// if(this.gSelfIndex == 1 || this.gSelfIndex == 2) return "MainPlayerOther";
				return "OtherPlayer";
			case EEntityType.EEntityTypeBoss:
				// if(EntityUtil.checkMonsterType(this,EBossType.EBossTypeTombstone)) return "RpgTombstone";
				if(EntityUtil.checkMonsterType(this,EBossType.EBossTypeMiner)) return "RpgMiner";
				return "RpgMonster";
			case EEntityType.EEntityTypeDropItem:
				return "DropPublicEntity";
			case EEntityType.EEntityTypeDropItemPrivate:
				return "DropEntity";
			case EEntityType.EEntityTypePet:
				return "PetEntity";
		}
	}

	/**获取唯一id */
	public get entityUid(): string {
		return EntityUtil.getEntityId(this.entityId);
	}

	/**是否在坐骑上 */
	public get isOnMount(): boolean {
		let _mountId: number = this.getModelId(EEntityAttribute.EAttributeMounts);
		return _mountId && _mountId > 0;
	}

	/**是否死亡(仅根据当前血量判断，实际死亡,移除对象还涉及到死亡动作，延迟死亡等) */
	public get isOnlyHpDied(): boolean {
		return this.life_L64 <= 0;
	}

	/**
	 * 获取人物武器，包括神兵、时装等
	 * 武器type统一为：EAttributeWeapon
	 * 人物模型type统一为：EAttributeClothes
	 */
	public getModelId(type: EEntityAttribute): any {
		let value: any;
		switch (type) {
			case EEntityAttribute.EAttributeClothes:
				//优先级:装扮、衣服
				value = this.weapons[EEntityAttribute.EAttributeClothes];//对应装扮时装
				let baseCareer:number = CareerUtil.getBaseCareer(this.career_SH);
				// value = ConfigManager.client.getPlayerFashionId(this.weapons[EEntityAttribute.EAttributeClothes],baseCareer);
				if (!value) {
					if (baseCareer == 1) {
						value = 10100;
					} else if (baseCareer == 2) {
						value = 10200;
					} else {
						value = 10300;
					}
					this.weapons[EEntityAttribute.EAttributeClothes] = value;
				}
				if(this.type == EEntityType.EEntityTypePet) value = this.modelId_I;
				break;
			case EEntityAttribute.EAttributeWeapon:
				//优先级:装扮、神兵、武器
				value = this.weapons[EEntityAttribute.EAttributeWeapon];//对应装扮武器
				if (!value && !this.weapons[EEntityAttribute.EAttributeNotShowShapeMagic]) {
					value = this.weapons[EEntityAttribute.EAttributeShapeMagic];//对应神兵
				}
				break;
			default:
				value = this.weapons[type];
				break;
		}
		return value;
	}

	/**是否可拾取(仅判断归属，无拾取距离判断) */
	public get canPickUp():boolean
	{
		let _belongList:any[] = this.toEntitys.data;
		if(!_belongList || _belongList.length == 0) return false;
		// this.life_L64//保护时间
		let _kingId:string = EntityUtil.getEntityId(CacheManager.king.kingEntity.entityInfo.entityId);
		for(let i:number = 0; i < _belongList.length; i++)
		{
			if(_kingId == EntityUtil.getEntityId(_belongList[i]))
			{
				return true;
			}
		}
		return this.life_L64 && Number(this.life_L64) < CacheManager.serverTime.getServerTime();
	}

	/**是否显示任务指引箭头 */
	public get canShowArrow():boolean
	{
		return this.level_SH <= 62;
	}
}