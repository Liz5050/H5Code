/**
 * 必杀系统
 */

class UniqueSkillCache implements ICache {
	private suitNum: Array<number> = [3,5,8];

	public constructor() {
	}

	public getUniqueSkillInfo(): any {
		let structInfo: any = CacheManager.cultivate.getCultivateInfoByRoleAndType(RoleIndexEnum.Role_index0, ECultivateType.ECultivateTypeKill);
		if (structInfo) {
			return structInfo;
		}
		return {};
	}

	/**每个等级已激活的数量 */
	public getKillLevelNums(): any{
		let info: any = this.getUniqueSkillInfo();
		let levelNums: any = {};
		if(info){
			info = info.levelInfo;
			for(let key in info){
				for(let level = 1; level <= info[key]; level++){
					if(!levelNums[level]){
						levelNums[level] = 0;
					}
					levelNums[level] += 1;
				}
			}
		}
		return levelNums;
	}

	/**每个套装已激活的最高等级 */
	public getLevelMaxNum(): any{
		let levelNums: any = this.getKillLevelNums();
		let levelMaxNum: any = {};
		for(let num of this.suitNum){
			levelMaxNum[num] = 0;
			for(let key in levelNums){//key为等级level，levels[key]为数量num
				if(levelNums[key] >= num && Number(key) > levelMaxNum[num]){
					levelMaxNum[num] = Number(key);
				}
			}
		}
		return levelMaxNum;
	}

	public getMaxLevel(): number{
		let levelNums: any = this.getKillLevelNums();
		let maxLevel: number = 0;
		for(let key in levelNums){
			if(Number(key) > maxLevel){
				maxLevel = Number(key);
			}
		}
		return maxLevel;
	}

	public getExchangeOpenLevel(): number{
		let levels: any = this.getKillLevelNums();
		let maxLevel: number = this.getMaxLevel();
		let openLevel: number;
		if(levels && levels[maxLevel] < 8){
			openLevel = maxLevel;
		}else{
			openLevel = maxLevel + 1;
		}
		return openLevel;
	}

	/**某个等级是否全部激活 */
	public isLevelAllAct(level: number): boolean{
		let levels: any = this.getKillLevelNums();
		return levels[level] == 8;
	}

	public isCanDecompose(): boolean {
		let itemDatas: Array<ItemData> = CacheManager.pack.backPackCache.getChipsCanDecompose();
		if (itemDatas.length > 0) {
			return true;
		}
		return false
	}

	public isCanExchangeByPos(pos: number, level: number = -1): boolean {
		let structInfo: any = this.getUniqueSkillInfo();
		let info: any = structInfo ? structInfo.levelInfo : null;
		let nextLevel: number;
		let cultivateData: any;
		let itemInfo: any;
		if (info && info[pos]){
			nextLevel = info[pos] + 1;
		}else{
			nextLevel = 1;
		}
		if(level == -1){
			level = nextLevel;
		}
		if(level >= nextLevel && level <= this.getExchangeOpenLevel()){
			cultivateData = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${pos},${level}`);//类型，位置，等级
			if (cultivateData != null) {
                if(CacheManager.pack.backPackCache.getItemCountByCode(cultivateData.itemCode) == 0){
                    itemInfo = ConfigManager.item.getByPk(cultivateData.itemCode);
                    if (itemInfo && MoneyUtil.checkEnough(itemInfo.sellUnit, itemInfo.sellPrice, false)) {
                        return true;
                    }
                }
            }
		}
		return false;
	}

	public isCanExchangeByLevel(level: number): boolean{
		for (let pos = 1; pos < 9; pos++) {
			if (this.isCanExchangeByPos(pos, level)) {
				return true;
			}
		}
		return false;
	}

	public isCanExchange(): boolean {
		for (let pos = 1; pos < 9; pos++) {
			if (this.isCanExchangeByPos(pos)) {
				return true;
			}
		}
		return false;
	}

	public isanActiveOrUpgradeByPos(pos: number): boolean {
		let structInfo: any = this.getUniqueSkillInfo();
		let info: any = structInfo ? structInfo.levelInfo : null;
		let chipData: any;//类型，位置，等级
		if (info && info[pos]) {
			chipData = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${pos},${info[pos] + 1}`);//类型，位置，等级
		} else {
			chipData = ConfigManager.cultivate.getByPk(`${ECultivateType.ECultivateTypeKill},${pos},${1}`);
		}
		if (chipData) {
			if (chipData.roleState && !CacheManager.role.checkState(chipData.roleState)) {
				return false;
			}
			if (CacheManager.pack.backPackCache.getItemCountByCode2(chipData.itemCode) > 0) {
				return true;
			}
		}
		return false;
	}

	public isCanActiveOrUpgrade(): boolean {
		for (let i = 1; i < 9; i++) {
			if (this.isanActiveOrUpgradeByPos(i)) {
				return true;
			}
		}
		return false;
	}

	public checkBtnTip(): boolean {
		if (this.isCanDecompose() || this.isCanActiveOrUpgrade() || this.isCanExchange()) {
			return true;
		}
		return false;
	}

	public clear(): void {

	}

}