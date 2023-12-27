class FightAttributeCommand implements ICommand {
	private roleCache: RoleCache;

	public constructor() {
		this.roleCache = CacheManager.role;
	}

	public onMessage(data: any, msgId: number): void {
		switch (msgId) {
			case EPublicCommand.ECmdPublicFightAttribute:
			case EPublicCommand.ECmdPublicFightAttributeNotShow:
				if (msgId == EPublicCommand.ECmdPublicFightAttribute) {
					//TODO 瓢字
					let _list: any[] = this.getUpgradePropertys(data);
					if (_list.length > 0) {
						EventManager.dispatch(NetEventEnum.propertyUpgrade, _list);
					}
				}
				let roleIndex: number = data.index_I;
				this.roleCache.fightAttr = data;
				this.roleCache.getEntityInfo(roleIndex).maxLife_L64 = Number(data.maxLife_L64);
				this.roleCache.getEntityInfo(roleIndex).maxMana_I = data.maxMana_I;
				this.roleCache.attackDistance = data.attackDistance_I;
				this.roleCache.attackSpeed = data.attackSpeed_I;
				this.roleCache.setRoleFightAttr(data);
				EventManager.dispatch(NetEventEnum.entityInfoUpdate);
				break;
			case EPublicCommand.ECmdPublicFightAttributeBase:
				this.roleCache.fightAttrBase = data;
				this.roleCache.setRoleFightbasettr(data);
				break;
			case EPublicCommand.ECmdPublicFightAttributeAdd:
				this.roleCache.fightAttrAdd = data;
				this.roleCache.setRoleFightAddAttr(data);
				break;
		}
	}

	private getUpgradePropertys(data: any): any[] {
		let _fightAttr: any = this.roleCache.getRoleFightAttr(data.index_I);
		let _diffList: any[] = [];
		let _diff: number = Number(data.maxLife_L64) - Number(this.roleCache.getEntityInfo(data.index_I).maxLife_L64);//生命;
		if (_diff > 0) {
			//最大生命值
			_diffList.push({ txt: "生", value: _diff });
		}
		let _attack: number = Number(_fightAttr.physicalAttack_L64) + Number(_fightAttr.magicAttack_I);
		let _attack1: number = Number(data.physicalAttack_L64) + Number(data.magicAttack_I);
		_diff = _attack1 - _attack;
		if (_diff > 0) {
			//攻击
			_diffList.push({ txt: "攻", value: _diff });
		}
		let _defend: number = Number(_fightAttr.physicalDefense_I) + Number(_fightAttr.magicDefense_I);
		let _defend1: number = Number(data.physicalDefense_I) + Number(data.magicDefense_I);
		_diff = _defend1 - _defend;
		if (_diff > 0) {
			//防御
			_diffList.push({ txt: "防", value: _diff });
		}
		_diff = Number(data.pass_I) - Number(_fightAttr.pass_I);
		if (_diff > 0) {
			//破甲
			_diffList.push({ txt: "破", value: _diff });
		}
		_diff = Number(data.toughness_I) - Number(_fightAttr.toughness_I);
		if (_diff > 0) {
			//坚韧
			_diffList.push({ txt: "韧", value: _diff });
		}
		_diff = (Number(data.physicalCrit_I) + Number(data.magicCrit_I)) - (Number(_fightAttr.physicalCrit_I) + Number(_fightAttr.magicCrit_I));
		if (_diff > 0) {
			//暴击
			_diffList.push({ txt: "暴", value: _diff });
		}
		_diff = Number(data.jouk_I) - Number(_fightAttr.jouk_I);
		if (_diff > 0) {
			//闪避
			_diffList.push({ txt: "闪", value: _diff });
		}
		_diff = Number(data.hit_I) - Number(_fightAttr.hit_I);
		if (_diff > 0) {
			//命中
			_diffList.push({ txt: "中", value: _diff });
		}
		return _diffList;
	}
}