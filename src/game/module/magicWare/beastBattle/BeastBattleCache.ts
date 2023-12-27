/**
 * 神兽助战
 */
class BeastBattleCache implements ICache{
	private beastInfo: any = {};
	private maxBeckonNum: number;
	private curBeckonNum: number;
	private beckonBeastCode: any;

	public decomIndexSel: any = {};//{index: true/false}

	public constructor() {
	}

	/**
	 * @param data SBeastInfos
	 */
	public set info(data: any){
		this.maxBeckonNum = data.maxBeckonNum_I;
		this.curBeckonNum = 0;
		this.beckonBeastCode = {};
		for(let info of data.infos.data){
			this.beastInfo[info.code_I] = info;

			if(info.isBeckon_B){
				this.curBeckonNum += 1;
				this.beckonBeastCode[info.code_I] = true;
			}
		}
	}

    /**
	 * 神兽更新
     * @param data SBeastInfo
     */
	public updateBeastInfo(data: any): void {
		let info: any = this.beastInfo[data.code_I];
        this.beastInfo[data.code_I] = data;
		if(info.isBeckon_B && !data.isBeckon_B){
			this.curBeckonNum -= 1;
			this.beckonBeastCode[data.code_I] = false;
		}else if(!info.isBeckon_B && data.isBeckon_B){
			this.curBeckonNum += 1;
			this.beckonBeastCode[info.code_I] = true;
		}
	}

	public set maxBattleNum(maxNum: number){
		this.maxBeckonNum = maxNum;
	}

	public get maxBattleNum(): number{
		if(this.maxBeckonNum){
			return this.maxBeckonNum;
		}
		return 0;
	}

	public get curBattleNum(): number{
		if(this.curBeckonNum){
			return this.curBeckonNum;
		}
		return 0;
	}

	public get lowBeckonCode(): number{
		let code: number = 0;
		for(let beastcode in this.beckonBeastCode){
			if(this.beckonBeastCode[beastcode]){
				if(code == 0 || Number(beastcode) < code){
					code = Number(beastcode);
				}
			}
		}
		return code;
	}

	public getHoleInfo(beastCode: number): Array<any>{
		if(this.beastInfo && this.beastInfo[beastCode]){
			return this.beastInfo[beastCode].holes.data;
		}
		return [];
	}

	/**是否已出战 */
	public isBeckonByCode(beastCode: number): boolean{
		if(this.beastInfo && this.beastInfo[beastCode]){
			return this.beastInfo[beastCode].isBeckon_B;
		}
		return false;
	}

	public getEquipAttrDict(beastCode: number): any{
		let itemData: ItemData;
		let strLevel: number;
		let baseAttrDict: any;
		let starAttrDict: any;
		let strAttrDict: any;
		let attrDict: any = WeaponUtil.getAttrDict(ConfigManager.mgBeast.getByPk(beastCode).attrList);
		for(let equipInfo of this.beastInfo[beastCode].holes.data){
			if(equipInfo.itemCode_I){
				itemData = new ItemData(equipInfo);
				baseAttrDict = WeaponUtil.getBaseAttrDict(itemData);
				starAttrDict = ConfigManager.mgBeastEquip.getStarAttrDict(itemData.getEffect());
				strAttrDict = {};
				if(itemData.getItemExtInfo().strLevel){
					strLevel = itemData.getItemExtInfo().strLevel;
					strAttrDict = ConfigManager.mgBeastStrengthen.getStrAttrDict(itemData.getType(), strLevel);
				}
				
				for(let key in baseAttrDict){
					if(!attrDict[key]){
						attrDict[key] = 0;
					}
					attrDict[key] += Number(baseAttrDict[key]);
					attrDict[key] += Number(starAttrDict[key]);
					attrDict[key] += strAttrDict[key] ? Number(strAttrDict[key]) : 0;
				}
			}
		}
		return attrDict;
	}

	/**
	 * 可出战
	 */
	public getBattleStatesByCode(beastCode: number): boolean{
		let holes: Array<any> = this.getHoleInfo(beastCode);
		let isCanBattle: boolean = true;
		if(holes.length > 0){
			for(let data of holes){
				if(data.itemCode_I == 0){
					isCanBattle = false;
					break;
				}
			}
		}else{
			isCanBattle = false;
		}
		return isCanBattle;
	}

	public isMaxBeckon(): boolean{
		return this.maxBattleNum <= this.curBattleNum;
	}

	/**
	 * 可出战
	 */
	public isCanBattleByCode(beastCode: number): boolean{
		if(!this.isMaxBeckon()){
			if(!this.isBeckonByCode(beastCode) && this.getBattleStatesByCode(beastCode)){
				return true;
			}
		}
		return false;
	}

	/**
	 * 某个部位是否可穿戴/替换装备
	 * @param data SBeastHole
	 */
	public checkEquipDressByHole(beastCode: number, holeId: number, data: any): boolean{
		if(!this.isMaxBeckon() || this.lowBeckonCode <= beastCode){
			let holeCfg: any = ConfigManager.mgBeastHole.getByPk(`${beastCode},${holeId}`);
			let colorEx: number = holeCfg.colorEx ? holeCfg.colorEx : 0;
			let equips: Array<ItemData> = CacheManager.pack.propCache.getBeastEquips(holeCfg.color, colorEx, holeCfg.star, holeCfg.type);
			let dressItem: ItemData;
			let dressScore: number;
			let curScore: number;
			if(equips.length > 0){
				if(data.itemCode_I == 0){
					return true;
				}else{
					dressItem = new ItemData(data);
					dressScore = WeaponUtil.getCombat(WeaponUtil.getBeastEquipAttrDict(dressItem));
					for(let itemData of equips){
						curScore = WeaponUtil.getCombat(WeaponUtil.getBeastEquipAttrDict(itemData));
						if(curScore > dressScore){
							return true;
						}
					}
				}
			}
		}
		return false;
	}

	/**
	 * 装备可强化
	 * @param data SBeastHole
	 */
	public checkEquipStrengthByHole(beastCode: number, data: any): boolean{
		if(this.isBeckonByCode(beastCode)){
			let itemData: ItemData = new ItemData(data);
			let needExp: number = ConfigManager.mgBeastStrengthen.getNeedExp(itemData.getType(), itemData.beastStrLevel);
			if(needExp > 0){
				return MoneyUtil.checkEnough(EPriceUnit.EPriceUnitBeastEquipExp, needExp, false);
			}
		}
		return false;
	}

	/**
	 * 可装备/有评分更高的装备(单个神兽)
	 */
	public checkEquipDressByCode(beastCode: number): boolean{
		let holes: Array<any> = this.getHoleInfo(beastCode);
		for(let data of holes){
			if(this.checkEquipDressByHole(beastCode, data.id_BY, data)){
				return true;
			}
		}
		return false;
	}

	/**
	 * 神兽装备可强化
	 */
	public checkEquipStrengthByCode(beastCode: number): boolean{
		let holes: Array<any> = this.getHoleInfo(beastCode);
		for(let data of holes){
			if(this.checkEquipStrengthByHole(beastCode, data)){
				return true;//装备可强化
			}
		}
		return false;
	}

	public checkTipsByCode(beastCode: number): boolean{
		let flag: boolean = false;
		if(!flag){
			flag = this.checkEquipDressByCode(beastCode);
		}
		if(!flag){
			flag = this.checkEquipStrengthByCode(beastCode);
		}
		if(!flag){
			flag = this.isCanBattleByCode(beastCode);
		}
		return flag;
	}

	public checkExtendCardTips(): boolean{
		let ownNum: number = CacheManager.pack.propCache.getItemCountByCode(ItemCodeConst.BeastAddNum);
		let maxBattleNum: number = CacheManager.beastBattle.maxBattleNum;
		let curExtendNum: number = maxBattleNum - 3 + 1;
		let beckonCfg: any = ConfigManager.mgBeastBeckonNum.getByPk(curExtendNum);
		if(beckonCfg){
			return ownNum >= beckonCfg.costNum;
		}
		return false;
	}

	public checkTips(): boolean{
		if(ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.BeastBattle,false)){
			for(let code in this.beastInfo){
				if(this.checkTipsByCode(Number(code))){
					return true;
				}
			}
			if(this.checkExtendCardTips()){
				return true;
			}
		}
		return false;
	}


	public clear(): void{

	}
}