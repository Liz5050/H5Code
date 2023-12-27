class ShuraCache implements ICache{
	private dressEquipsType: Array<number>;
	private curEquips: any;
	private generateEquips: any;
	public curIndex: number = 0;
	// public fragmentCode: number;

	public constructor() {
		this.dressEquipsType = [EEquip.EEquipWeapon, EEquip.EEquipClothes];

		// let datas: Array<any> = ConfigManager.item.selectByCT(ECategory.ECategoryProp, EProp.EPropGodEquipfragment);
		// this.fragmentCode = datas[0].code;
	}

	public setEquips(): void{
		let roleIndexs: Array<number> = RoleIndexEnum.RoleIndexAll;
		this.curEquips = {};
		this.generateEquips = {};
		for(let index of roleIndexs){
			if(index < CacheManager.role.roles.length){
				let equipDict: { [key: number]: ItemData } = CacheManager.pack.rolePackCache.getEquips(index);
				let itemData: ItemData;
				this.curEquips[index] = {};
				this.generateEquips[index] = {};
				let career: number = CacheManager.role.getRoleCareerByIndex(index);
				for (let type of this.dressEquipsType) {
					itemData = equipDict[type];
					if(ItemsUtil.isTrueItemData(itemData) && itemData.isShuraEquipType()){
						this.curEquips[index][type] = itemData;
					}else{																	
						this.generateEquips[index][type] = ConfigManager.item.getShuraEquipGenerate(career, type);
					}
				}
			}
		}
	}

	public setEquipByIndex(packIndex: number): void{
		let itemData: ItemData = CacheManager.pack.rolePackCache.getItemAtIndex(packIndex);
		if(ItemsUtil.isTrueItemData(itemData)){
			let index: number = itemData.getRoleIndex();
			let career: number =CacheManager.role.getRoleCareerByIndex(index);
			let type: number = itemData.getType();
			if(itemData.isShuraEquipType()){
				if(this.generateEquips && this.generateEquips[index] && this.generateEquips[index][type]){
					this.generateEquips[index][type] = null;
				}
				if(!this.curEquips){
					this.curEquips = {};
				}
				if(!this.curEquips[index]){
					this.curEquips[index] = {};
				}
				this.curEquips[index][itemData.getType()] = itemData;
			}else{
				if(this.curEquips && this.curEquips[index] && this.curEquips[index][type]){
					this.curEquips[index][type] = null;
				}
				if(!this.generateEquips){
					this.generateEquips = {};
				}
				if(!this.generateEquips[index]){
					this.generateEquips[index] = {};
				}
				this.generateEquips[index][type] = ConfigManager.item.getShuraEquipGenerate(career, type);
			}
		}
	}

	public getEquipByIndex(index: number): Array<any>{
		let equipDataArr: Array<any> = [];
		for(let type of this.dressEquipsType){
			if(this.curEquips && this.curEquips[index] && this.curEquips[index][type]){
				let itemData: ItemData = this.curEquips[index][type];
				let nextItemData: ItemData = new ItemData(itemData.getCode()+1);
				if(ItemsUtil.isTrueItemData(nextItemData)){
					equipDataArr.push({"itemData": nextItemData, "isDress": true, "isNextItem": true});//可升级装备
				}else{
					equipDataArr.push({"itemData": itemData, "isDress": true, "isNextItem": false});//无可升级装备，显示为当前穿戴装备
				}
			}else if(this.generateEquips && this.generateEquips[index] && this.generateEquips[index][type]){
				equipDataArr.push({"itemData": this.generateEquips[index][type], "isDress": false});//可合成装备
			}
		}
		return equipDataArr;
	}

	public checkTipByType(index: number, type: number): boolean{
		if(this.curEquips && this.curEquips[index] && this.curEquips[index][type]){
			let itemData: ItemData = this.curEquips[index][type];
			let nextItemData: ItemData;
			if(ConfigManager.item.getByPk(itemData.getCode() + 1)){
				nextItemData = new ItemData(itemData.getCode()+1);
				if(WeaponUtil.isCanEquipByItemData(nextItemData)){
					let equipUpgradeData: any = ConfigManager.equipUpgrade.getByPk(`${itemData.getCategory()},${EEquipType.EEquipTypeJiuli},${itemData.getType()},${itemData.getNewItemLevel()}`);
					let nextEquipUpgradeData: any = ConfigManager.equipUpgrade.getByPk(`${itemData.getCategory()},${EEquipType.EEquipTypeJiuli},${nextItemData.getType()},${nextItemData.getNewItemLevel()}`);
					let count: number = CacheManager.pack.propCache.getItemCountByCode2(equipUpgradeData.costItemcode);
					if(nextEquipUpgradeData && count >= (nextEquipUpgradeData.costNum - equipUpgradeData.costNum)){
						return true;
					}
				}
			}
		}else if(this.generateEquips && this.generateEquips[index] && this.generateEquips[index][type]){
			let itemData: ItemData = this.generateEquips[index][type];
			let baseCareer:number = CareerUtil.getBaseCareer(itemData.getCareer());
			let roleEquipScore:number = CacheManager.pack.rolePackCache.getEquipsScoreByCT(baseCareer, type);
			if(roleEquipScore < WeaponUtil.getScoreBase(itemData) && WeaponUtil.isCanEquipByItemData(itemData)){
				let equipUpgradeData: any = ConfigManager.equipUpgrade.getByPk(`${itemData.getCategory()},${EEquipType.EEquipTypeJiuli},${itemData.getType()},${itemData.getNewItemLevel()}`);
				let count: number = CacheManager.pack.propCache.getItemCountByCode2(equipUpgradeData.costItemcode);
				if(count >= equipUpgradeData.costNum){
					return true;
				}
			}
		}
		return false;
	}

	public checkTipByIndex(index: number): boolean{
		/**已穿戴的判断是否可升级 */
		let curEquipData: any = this.curEquips[index];
		for(let type in curEquipData){
			if(this.checkTipByType(Number(index), Number(type))){
				return true;
			}
		}

		/**未穿戴的判断是否可合成 */
		if(this.generateEquips && this.generateEquips[index]){
			let generateEquipData: any = this.generateEquips[index];
			for(let type in generateEquipData){
				if(this.checkTipByType(Number(index), Number(type))){
					return true;
				}
			}
		}

		return false;
	}

	public checkUpgrade(): boolean{
		for(let index in this.curEquips){
			let indexData: any = this.curEquips[index];
			for(let type in indexData){
				if(this.checkTipByType(Number(index), Number(type))){
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
				if(this.checkTipByType(Number(index), Number(type))){
					return true;
				}
			}
		}
		return false;
	}

	public checkDecompose(): boolean{
		let itemDatas: Array<ItemData> = WeaponUtil.getShuraCanDecompose();
		let equipsScoreDict: any = CacheManager.pack.rolePackCache.getEquipsScoreDict();
		let isHigher: boolean;
		for(let itemData of itemDatas){
			isHigher = false;
			for(let career of CareerUtil.CareerAll){
				if(equipsScoreDict[career] && equipsScoreDict[career][itemData.getType()]){
					if(WeaponUtil.getScoreBase(itemData) > equipsScoreDict[career][itemData.getType()]){
						isHigher = true;
						break;
					}
				}else{
					isHigher = true;
					break;
				}
			}
			if(!isHigher){
				return true;
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

	public clear(): void{

	}
}