/**
 * 神装
 */
class GodEquipCache implements ICache{
	private dressEquipsType: Array<number>;
	private godEquips: any;
	private generateEquips: any;
	private _godEquipFragmentCode: number = 0;

	public constructor() {
		this.dressEquipsType = [EEquip.EEquipWeapon, EEquip.EEquipWristlet, 
			EEquip.EEquipShoulder, EEquip.EEquipHelmet, EEquip.EEquipGloves, 
			EEquip.EEquipClothes, EEquip.EEquipBelt, EEquip.EEquipShoes];
	}

	public setEquips(): void{
		let roleIndexs: Array<number> = RoleIndexEnum.RoleIndexAll;
		this.godEquips = {};
		this.generateEquips = {};
		for(let index of roleIndexs){
			if(index < CacheManager.role.roles.length){
				let equipDict: { [key: number]: ItemData } = CacheManager.pack.rolePackCache.getEquips(index);
				let itemData: ItemData;
				this.godEquips[index] = {};
				this.generateEquips[index] = {};
				let career: number = CacheManager.role.getRoleCareerByIndex(index);
				for (let type of this.dressEquipsType) {
					itemData = equipDict[type];
					// if(itemData && itemData.getColor() == 5 && itemData.getNewItemLevel() != 0)
					if(ItemsUtil.isTrueItemData(itemData) && itemData.isGodEquipType()){
						this.godEquips[index][type] = itemData;
					}else{																	
						this.generateEquips[index][type] = ConfigManager.item.getGodEquipGenerate(career, type);
					}
				}
			}
		}
	}

	public setEquipByIndex(packIndex: number): void{
		let itemData: ItemData = CacheManager.pack.rolePackCache.getItemAtIndex(packIndex);
		if(ItemsUtil.isTrueItemData(itemData)){
			// let career: number =itemData.getRoleIndex();
			// let index: number = CacheManager.role.getRoleIndex(career);
			let index: number = itemData.getRoleIndex();
			let career: number =CacheManager.role.getRoleCareerByIndex(index);
			let type: number = itemData.getType();
			if(itemData.isGodEquipType()){
				if(this.generateEquips && this.generateEquips[index] && this.generateEquips[index][type]){
					this.generateEquips[index][type] = null;
				}
				if(!this.godEquips){
					this.godEquips = {};
				}
				if(!this.godEquips[index]){
					this.godEquips[index] = {};
				}
				this.godEquips[index][type] = itemData;
			}else{
				if(this.godEquips && this.godEquips[index] && this.godEquips[index][type]){
					this.godEquips[index][type] = null;
				}
				if(!this.generateEquips){
					this.generateEquips = {};
				}
				if(!this.generateEquips[index]){
					this.generateEquips[index] = {};
				}
				this.generateEquips[index][type] = ConfigManager.item.getGodEquipGenerate(career, type);

			}
		}
	}

	public get godEquipFragmentCode(): number{
		if(this._godEquipFragmentCode == 0){
			this._godEquipFragmentCode = ConfigManager.const.getConstValue("GodEquipFragmentCode");
		}
		return this._godEquipFragmentCode;
	}

	public checkUpgradeByType(index: number, type: number): boolean{
		if(this.godEquips && this.godEquips[index] && this.godEquips[index][type]){
			let itemData: ItemData = this.godEquips[index][type];
			let nextItemData: ItemData = ConfigManager.item.getGodEquipNext(itemData.getCode());
			if(WeaponUtil.isCanEquipByItemData(nextItemData)){
				let godEquipCostData: any = ConfigManager.mgGodEquipCost.getByPk(`${itemData.getType()},${itemData.getNewItemLevel()}`);
				let nextGodEquipCostData: any = ConfigManager.mgGodEquipCost.getByPk(`${nextItemData.getType()},${nextItemData.getNewItemLevel()}`);
				let count: number = CacheManager.pack.propCache.getItemCountByCode2(this.godEquipFragmentCode);
				if(nextGodEquipCostData && count >= (nextGodEquipCostData.cost - godEquipCostData.cost)){
					return true;
				}
			}
		}
		return false;
	}

	public checkGenerateByType(index: number, type: number): boolean{
		if(this.generateEquips && this.generateEquips[index] && this.generateEquips[index][type]){
			let itemData: ItemData = this.generateEquips[index][type];
			let baseCareer:number = CareerUtil.getBaseCareer(itemData.getCareer());
			let roleEquipScore:number = CacheManager.pack.rolePackCache.getEquipsScoreByCT(baseCareer, type);
			if(roleEquipScore < WeaponUtil.getScoreBase(itemData)){
				let godEquipCostData: any = ConfigManager.mgGodEquipCost.getByPk(`${itemData.getType()},${itemData.getNewItemLevel()}`);
				let count: number = CacheManager.pack.propCache.getItemCountByCode2(this.godEquipFragmentCode);
				if(count >= godEquipCostData.cost){
					return true;
				}
			}
		}
		return false;
	}

	public checkTipByType(index: number, type: number): boolean{
		if(this.checkUpgradeByType(index, type) || this.checkGenerateByType(index, type)){
			return true;
		}
		return false;
	}

	public checkGenerateTipByIndex(index: number): boolean{
		/**未穿戴的判断是否可合成 */
		if(this.generateEquips && this.generateEquips[index]){
			let generateEquipData: any = this.generateEquips[index];
			for(let type in generateEquipData){
				if(this.checkGenerateByType(Number(index), Number(type))){
					return true;
				}
			}
		}
		return false;
	}

	public checkTipByIndex(index: number): boolean{
		/**已穿戴的判断是否可升级 */
		let godEquipData: any = this.godEquips[index];
		for(let type in godEquipData){
			if(this.checkUpgradeByType(Number(index), Number(type))){
				return true;
			}
		}

		// /**未穿戴的判断是否可合成 */
		// if(this.generateEquips && this.generateEquips[index]){
		// 	let generateEquipData: any = this.generateEquips[index];
		// 	for(let type in generateEquipData){
		// 		if(this.checkGenerateByType(Number(index), Number(type))){
		// 			return true;
		// 		}
		// 	}
		// }
		if(this.checkGenerateTipByIndex(index)){
			return true;
		}

		return false;
	}

	public checkUpgrade(): boolean{
		for(let index in this.godEquips){
			let indexData: any = this.godEquips[index];
			for(let type in indexData){
				if(this.checkUpgradeByType(Number(index), Number(type))){
					return true;
				}
			}
		}
		return false;
	}

	public checkGenerate(): boolean{
		for(let index in this.generateEquips){
			let indexData: any = this.generateEquips[index];
			for(let type in indexData){
				if(this.checkGenerateByType(Number(index), Number(type))){
					return true;
				}
			}
		}
		return false;
	}

	public checkDecompose(): boolean{
		let itemDatas: Array<ItemData> = WeaponUtil.getGodEquipCanDecompose();
		let equipsScoreDict: any = CacheManager.pack.rolePackCache.getEquipsScoreDict();
		let career: number;
		for(let itemData of itemDatas){
			career = CareerUtil.getBaseCareer(itemData.getCareer());
			if(equipsScoreDict[career] && equipsScoreDict[career][itemData.getType()]){
				if(WeaponUtil.getScoreBase(itemData) <= equipsScoreDict[career][itemData.getType()]){
					return true;
				}
			}
		}
		return false;
	}

	public checkTips(): boolean{
		if(this.checkGenerate() || this.checkUpgrade() || this.checkDecompose()){
			return true;
		}
		return false;
	}

	public checkGodEquipModuleTips(): boolean{
		if(this.checkTips() || CacheManager.shura.checkTips()){
			return true;
		}
		return false;
	}

	public clear(): void{

	}
}