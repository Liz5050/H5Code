class MoneyUpdateCommand implements ICommand {
	private roleCache: RoleCache;
	private updateCode: number;

	public constructor() {
		this.roleCache = CacheManager.role;
	}

	public onMessage(data: any, msgId: number): void {
		this.updateCode = data.code_I;
		for (let attrUpdate of data.updates.data) {
			this.moneyUpdate(attrUpdate);
		}
	}

	private moneyUpdate(attrUpdate: any): void {
		let attr: number = attrUpdate.attribute;
		let value: number = Number(attrUpdate.valueStr_S);//attrUpdate.value_I;
		// let valueS: string = attrUpdate.valueStr_S;
		if (value == 0) {
			value = attrUpdate.value_I;
		}

		let add: number = 0;
		let priceUnitName: string;
		switch (attr) {
			case EEntityAttribute.EAttributeCoinBind://绑定铜钱
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitCoinBind];
				add = value - this.roleCache.money.coinBind_L64;
				this.roleCache.money.coinBind_L64 = value;
				EventManager.dispatch(NetEventEnum.moneyCoinBindUpdate, value);
				break;
			case EEntityAttribute.EAttributeCoin://铜钱
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitCoinBind];
				add = value - this.roleCache.money.coin_I;
				this.roleCache.money.coin_I = value;
				EventManager.dispatch(NetEventEnum.moneyCoinBindUpdate, value);
				break;
			case EEntityAttribute.EAttributeGold://金币
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitGold];
				add = value - this.roleCache.money.gold_I;
				this.roleCache.money.gold_I = value;
				EventManager.dispatch(NetEventEnum.moneyGoldUpdate, value);
				break;
			case EEntityAttribute.EAttributeGoldBind://绑定金币
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitGoldBind];
				add = value - this.roleCache.money.goldBind_I;
				this.roleCache.money.goldBind_I = value;
				EventManager.dispatch(NetEventEnum.moneyGoldBindUpdate, value);
				break;
			case EEntityAttribute.EAttributeHonour://荣誉
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitHonour];
				add = value - this.roleCache.money.honour_I;
				this.roleCache.money.honour_I = value;
				EventManager.dispatch(NetEventEnum.moneyHonourUpdate, value);
				break;
			case EEntityAttribute.EAttributeRuneExp://符文经验+
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitRuneExp];
				add = value - this.roleCache.money.runeExp_I;
				this.roleCache.money.runeExp_I = value;
				EventManager.dispatch(NetEventEnum.moneyRuneExp, value);
				break;
			case EEntityAttribute.EAttributeRuneCoin://符文碎片+
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitRuneCoin];
				add = value - this.roleCache.money.runeCoin_I;
				this.roleCache.money.runeCoin_I = value;
				EventManager.dispatch(NetEventEnum.moneyRuneCoin, value);
				break;
			// case EEntityAttribute.EAttributeRoleExp://修为
			// 	priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitRoleExp];
			// 	add = value - this.roleCache.money.roleExp_I;
			// 	this.roleCache.money.roleExp_I = value;
			// 	EventManager.dispatch(NetEventEnum.moneyRoleStateExp, value);
			// 	break;
			case EEntityAttribute.EAttributeKillFragmentJunior://初级必杀碎片精华
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitKillFragmentJunior];
				add = value - this.roleCache.money.killFragmentJunior_I;
				this.roleCache.money.killFragmentJunior_I = value;
				EventManager.dispatch(NetEventEnum.moneyKillFragmentJunior, value);
				break;
			case EEntityAttribute.EAttributeKillFragmentSenior://高级必杀碎片精华
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitKillFragmentSenior];
				add = value - this.roleCache.money.killFragmentSenior_I;
				this.roleCache.money.killFragmentSenior_I = value;
				EventManager.dispatch(NetEventEnum.moneyKillFragmentSenior, value);
				break;
			case EEntityAttribute.EAttributeTrainScore:
				CacheManager.role.setMoney(EPriceUnit.EPriceUnitTrainScore,value);				
				EventManager.dispatch(NetEventEnum.roleTrainScoreUpdated);
				break;
			case EEntityAttribute.EAttributeIllustratedExp:
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitIllustratedExp];
				add = value - this.roleCache.money.illustratedExp_I;
				CacheManager.role.setMoney(EPriceUnit.EPriceUnitIllustratedExp, value);
				EventManager.dispatch(NetEventEnum.roleIllustrateExpUpdated);
				break;
            case EEntityAttribute.EAttributeGuildContribution:
                priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitGuildContribution];
                add = value;
                break;
			case EEntityAttribute.EAttributeTalentExp://天赋经验
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitTalentExp];
				add = value - this.roleCache.money.talentExp_I;
				this.roleCache.money.talentExp_I = value;
				EventManager.dispatch(NetEventEnum.moneyTalentExp, value);
				break;
			case EEntityAttribute.EAttributeJeton://筹码
				priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitJeton];
				add = value - this.roleCache.money.jeton_I;
				this.roleCache.money.jeton_I = value;
				EventManager.dispatch(NetEventEnum.moneyJeton, value);
				break;
			// case EEntityAttribute.EAttributeHallowEquip://装备强化石
			// 	priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitHallowEquip];
			// 	add = value - this.roleCache.money.runeCoin_I;
			// 	this.roleCache.money.runeCoin_I = value;
			// 	EventManager.dispatch(NetEventEnum.moneyHallowEquip, value);
			// 	break;
            case EEntityAttribute.EAttributeBeastEquipExp://神兽装备经验
                priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitBeastEquipExp];
                add = value - this.roleCache.money.beastEquipExp_I;
                this.roleCache.money.beastEquipExp_I = value;
                EventManager.dispatch(NetEventEnum.moneyBeastEquipExp, value);
                break;
			case EEntityAttribute.EAttributeFightingSpirit://斗魂货币
                priceUnitName = GameDef.EPriceUnitName[EPriceUnit.EPriceUnitFightingSpirit];
                add = value - this.roleCache.money.fightingSpirit_I;
                this.roleCache.money.fightingSpirit_I = value;
                EventManager.dispatch(NetEventEnum.moneyFightingSpirit, value);
                break;

		}
		if (attr == EEntityAttribute.EAttributeCoinBind && add > 0 && this.updateCode == 5) {
			//任务增加的铜钱，瓢字
			// MoveMotionUtil.itemMoveToBag([ItemCodeConst.Coin]);
			EventManager.dispatch(UIEventEnum.TaskFlyReward, [ItemCodeConst.Coin]);
		}
		if (add > 0) {
			EventManager.dispatch(NetEventEnum.moenyAdd, priceUnitName, add, this.updateCode);
		}
	}
}