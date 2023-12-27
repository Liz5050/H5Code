class MgBeastStrengthenConfig extends BaseConfig {
	public constructor() {
		super("t_mg_beast_strengthen","equipType,strengthenLevel");
	}

	public isMaxLevel(equipType: number, strengthenLevel: number): boolean{
		let data: any = this.getByPk(`${equipType},${strengthenLevel + 1}`);
		if(data){
			return true;
		}
		return false;
	}

	public getStrAttrDict(equipType: number, strengthenLevel: number): any{
		let data: any = this.getByPk(`${equipType},${strengthenLevel}`);
		if(data){
			return WeaponUtil.getAttrDict(data.attrList);
		}
		return {};
	}

	public getNeedExp(equipType: number, curLevel: number): number{
		let curCfg: any = this.getByPk(`${equipType},${curLevel}`);
		let nextCfg: any = this.getByPk(`${equipType},${curLevel + 1}`);
		let needExp: number = 0;
		if(nextCfg){
			if(curCfg){
				needExp = nextCfg.decomposeExp - curCfg.decomposeExp;
			}else{
				needExp = nextCfg.decomposeExp;
			}
		}
		return needExp;
	}

	public getDecomposeExp(equipType: number, curLevel: number): number{
		let curCfg: any = this.getByPk(`${equipType},${curLevel}`);
		let decomposeExp: number = 0;
		if(curCfg){
			decomposeExp = curCfg.decomposeExp;
		}
		return decomposeExp;
	}

	
}