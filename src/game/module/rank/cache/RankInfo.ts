class RankInfo {
	public type:EToplistType;
	public typeName:string;
	public titleName_3:string;
	public titleName_4:string;
	public constructor(type:EToplistType) {
		this.type = type;
		switch(type){
			case EToplistType.EToplistTypePlayerFight:
				this.typeName = "战力榜";
				this.titleName_3 = "仙盟";
				this.titleName_4 = "战斗力";
				break;
			case EToplistType.EToplistTypePlayerFightCareer1:
				this.typeName = "天权战力榜";
				this.titleName_3 = "仙盟";
				this.titleName_4 = "战斗力";
				break;
			case EToplistType.EToplistTypePlayerFightCareer2:
				this.typeName = "璇玑战力榜";
				this.titleName_3 = "仙盟";
				this.titleName_4 = "战斗力";
				break;
			case EToplistType.EToplistTypePlayerFightCareer3:
				this.typeName = "穹苍战力榜";
				this.titleName_3 = "仙盟";
				this.titleName_4 = "战斗力";
				break;
			case EToplistType.EToplistTypePlayerLevel:
				this.typeName = "等级榜";
				this.titleName_3 = "职业";
				this.titleName_4 = "等级";
				break;
			case EToplistType.EToplistTypeShapeMount:
				this.typeName = this.titleName_3 = "坐骑榜";
				this.titleName_4 = this.typeName + "品阶";
				break;
			case EToplistType.EToplistTypeShapePet:
				this.typeName = this.titleName_3 = "宠物榜";
				this.titleName_4 = this.typeName + "品阶";
				break;
			case EToplistType.EToplistTypeShapeMagic:
				this.typeName = this.titleName_3 = "神兵榜";
				this.titleName_4 = this.typeName + "品阶";
				break;
			case EToplistType.EToplistTypeShapeWing:
				this.typeName = this.titleName_3 = "翅膀榜";
				this.titleName_4 = this.typeName + "品阶";
				break;
			case EToplistType.EToplistTypeShapeSpirit:
				this.typeName = this.titleName_3 = "法宝榜";
				this.titleName_4 = this.typeName + "品阶";
				break;
			case EToplistType.EToplistTypeShapeBattle:
				this.typeName = this.titleName_3 = "战阵榜";
				this.titleName_4 = this.typeName + "品阶";
				break;
			case EToplistType.EToplistTypeShapeSwordPool:
				this.typeName = this.titleName_3 = "剑池榜";
				this.titleName_4 = this.typeName + "品阶";
				break;
			case EToplistType.EToplistTypeOfflineWorkExpEffect:
				this.typeName = "离线效率";
				this.titleName_3 = "战斗力";
				this.titleName_4 = "离线效率";
				break;
			case EToplistType.EToplistTypeCopyMgRune:
				this.typeName = "诛仙塔";
				this.titleName_3 = "战斗力";
				this.titleName_4 = "通关层数";
				break;
			case EToplistType.EToplistTypeAchievementPoint:
				this.typeName = "成就点数";
				this.titleName_3 = "职业";
				this.titleName_4 = "成就点数";
				break;
			case EToplistType.EToplistTypeLord:
				this.typeName = "爵位榜";
				break;
			case EToplistType.EClientToplistTypeEncounter:
				this.typeName = "杀戮榜";
				break;
			case EToplistType.EToplistTypeMedal:
				this.typeName = "勋章榜";
				break;
		}
	}
}