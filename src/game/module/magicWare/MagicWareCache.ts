/**
 * 法器
 */
class MagicWareCache implements ICache {
	public constructor() {
	}

	/**
	 * 角色头像是否需要显示红点
	 */
	public isRoleRedTip(type: EStrengthenExType, roleIndex: number): boolean {
		switch (type) {
			case EStrengthenExType.EStrengthenExTypeDragonSoul:
				if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.DragonSoul], false)){
					return false;
				}
				if(!CacheManager.role.isStrengthenExActive(type, roleIndex) && !CacheManager.role.isStrengthenExCanActive(type, roleIndex)) {
					//未开启且不能激活
					return false;
				}
				return CacheManager.role.isStrengthenExCanActive(type, roleIndex) || CacheManager.role.isCanUpgradeStrengthenEx(type, roleIndex)
				 || CacheManager.pack.propCache.getItemCountByFun(ItemsUtil.isDragonScaleUpItem, ItemsUtil) > 0;
			case EStrengthenExType.EStrengthenExTypeWing:
				if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.Wing], false)){
					return false;
				}
				if(!CacheManager.role.isStrengthenExActive(type, roleIndex) && !CacheManager.role.isStrengthenExCanActive(type, roleIndex)) {
					//未开启且不能激活
					return false;
				}
				return CacheManager.role.isStrengthenExCanActive(type, roleIndex) || 
				CacheManager.role.isCanUpgradeStrengthenEx(type, roleIndex) || 
				this.isCanUseDrug(type, roleIndex) || CacheManager.godWing.checkRoleTip(roleIndex) || 
				this.checkWingUpItem(roleIndex) ||CacheManager.shapeWingChange.checkAllTips();
			case EStrengthenExType.EStrengthenExTypeHeartMethod:
				return CacheManager.heartMethod.checkRoleTips(roleIndex);
			case EStrengthenExType.EStrengthenExTypeColorStone:
				return this.checkColorStoneRoleTips(roleIndex);
			
		}
		return true;
	}

	public checkColorStoneRoleTips(roleIndex:number):boolean{
		let type:number = EStrengthenExType.EStrengthenExTypeColorStone;
		if(!ConfigManager.mgOpen.isOpenedByKey(PanelTabType[PanelTabType.ColorStone], false)){
			return false;
		}
		let info:any = CacheManager.role.getPlayerStrengthenExtInfo(type,roleIndex);
		if(!info){
			return false;
		}
		if(!CacheManager.role.isStrengthenExActive(type, roleIndex)){
			return true; //可激活
		}
		let curLv:number = info.level;
		let isMax:boolean = curLv>=ConfigManager.mgStrengthenEx.getMaxLevel(type);
		if(isMax){
			return this.checkColorStoneDrup(roleIndex);
		}
		let cfg:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(type,curLv);
		if(cfg.stageUpFlag){ // 可升阶 不需要消耗材料
			return true;
		}
		if(this.isHasColorStoneMat()){
			return true;
		}
		return this.checkColorStoneDrup(roleIndex);
	}
	/**是否有五色石升级材料 */
	public isHasColorStoneMat():boolean{
		let chooseItems:ItemData[] = ConfigManager.mgStrengthenEx.getChooseItems(EStrengthenExType.EStrengthenExTypeColorStone);
		let flag:boolean = false;
		for(let item of chooseItems){ //升级材料
			let c:number = CacheManager.pack.getItemCount(item.getCode());
			if(c>=item.getItemAmount()){
				return true; //有升级材料
			}
		}
		return flag;
	}

	public checkColorStoneDrup(roleIndex:number):boolean{
		let flag:boolean = false;
		let type:number = EStrengthenExType.EStrengthenExTypeColorStone;
		let info:any = CacheManager.role.getPlayerStrengthenExtInfo(type,roleIndex);
		if(!info){
			return false;
		}
		let curLv:number = info.level;
		//丹药使用
		let drups:ItemData[] = ConfigManager.strengthenExDrug.getDrugs(type);
		let cfg:any = ConfigManager.mgStrengthenEx.getByTypeAndLevel(type,curLv);
		if(cfg){
			for(let i:number = 0;i<drups.length;i++){
				let item:ItemData = drups[i];
				let key:string = `drug${i+1}ItemMax`;
				let maxN:number = cfg && cfg[key]?cfg[key]:0; 
				let drugDict: any;
				if(info && info.drugDict){
					drugDict = StructUtil.dictIntIntToDict(info.drugDict);
				}
				let hn:number = CacheManager.pack.getItemCount(item.getCode());
				let n:number = drugDict && drugDict[item.getCode()]?drugDict[item.getCode()]:0;//已使用的数量
				if(hn>0 && n<maxN){
					return true; //有可用的丹药
				}
			}
		}
		return flag;
	}

	/**
	 * 标签页是否需要显示红点
	 */
	public isTabRedTip(type: EStrengthenExType): boolean {
		let flag:boolean = false;
		for (let index: number = 0; index < CacheManager.role.roles.length; index++) {
			if (this.isRoleRedTip(type, index)) {
				flag = true;
				break;
			}
		}
		if(!flag && type==EStrengthenExType.EStrengthenExTypeWing){
			flag = CacheManager.godWing.checkTip();
		}
		return flag;
	}

	/**
	 * 法器是否需要显示红点
	 */
	public isMagicWareRedTip(): boolean {
		let flag: boolean = this.isTabRedTip(EStrengthenExType.EStrengthenExTypeDragonSoul);
		if(!flag){
			flag = this.isTabRedTip(EStrengthenExType.EStrengthenExTypeHeartMethod);
		}
		if(!flag){
			flag = this.isTabRedTip(EStrengthenExType.EStrengthenExTypeColorStone);
		}
		if(!flag){
			flag = CacheManager.beastBattle.checkTips();
		}
		return flag;
	}

	public clear(): void {

	}

	/**
     * 技能释放已开启
     */
    private isOpenSkill(skillId: number, type: EStrengthenExType, roleIndex: number): boolean {
		let info: any = CacheManager.role.getPlayerStrengthenExtInfo(type, roleIndex);
        let skillIds: Array<number> = info.skills.data_I;
        return skillIds != null && skillIds.indexOf(skillId) != -1;
    }

	public getSkills(type: EStrengthenExType, roleIndex: number): Array<any> {
		// let skillIds: Array<number> = ConfigManager.mgShapeOpen.getAllSkillByShape(this.eShape);
		let skillCfgArr: Array<any> = ConfigManager.mgStrengthenEx.getHadOpenSkills(type);
		let skillData: Array<any> = [];
		let data: any;
		let openLevel: number = 0;
		for (let cfg of skillCfgArr) {
			data = {};
			data["strengthenType"] = type;
			data["skillId"] = cfg.openSkill;
			data["isOpen"] = this.isOpenSkill(cfg.openSkill, type, roleIndex);
			data["isTalent"] = false;
			data["roleIndex"] = roleIndex;
			if (!data.isOpen) {
				openLevel = cfg.strengthenLevel ? cfg.strengthenLevel : 0;
				data["openLevelStr"] = ConfigManager.mgStrengthenEx.getStageStar(type, cfg.strengthenLevel);
			}
			skillData.push(data);
		}
		return skillData;
	}

	/**
	 * 是否可以使用属性药
	 */
	private isCanUseDrug(type: EStrengthenExType, roleIndex: number): boolean {
		let drugItemDatas: Array<ItemData> = ConfigManager.strengthenExDrug.getDrugs(type);
		let itemCode: number;
		let canUseAmount: number = 0;
		for (let itemData of drugItemDatas) {
			itemCode = itemData.getCode();
			let itemCount = CacheManager.pack.propCache.getItemCountByCode2(itemCode);
			let usedCount: number = 0;
			if (itemCount > 0) {
				let exInfo: any = CacheManager.role.getPlayerStrengthenExtInfo(type, roleIndex);
				let drugDict: any = StructUtil.dictIntIntToDict(exInfo.drugDict);
				let drugMaxDict: any = ConfigManager.strengthenExDrug.getDrugMaxDict(type);//最大使用数量
				if (drugDict[itemCode] != null) {
					usedCount = drugDict[itemCode];
				}
				canUseAmount = drugMaxDict[itemCode] - usedCount;
				if (canUseAmount > 0) {
					return true;
				}
			}
		}
		return false;
	}

	public getDrugUsed(type: EStrengthenExType, roleIndex: number): any {
		let drugUsed: any = {};
		let info: any = CacheManager.role.getPlayerStrengthenExtInfo(type, roleIndex);
		if (info) {
			let drugCfg: any = info.drugDict;
			for (let i = 0; i < drugCfg.key_I.length; i++) {
				drugUsed[drugCfg.key_I[i]] = drugCfg.value_I[i];
			}
		}
		return drugUsed;
	}



	public checkWingUpItem(roleIndex: number): boolean{
		let upgradeItemDatas: ItemData[] = CacheManager.pack.propCache.getItemsByFun(ItemsUtil.isWingUpgradeItem, ItemsUtil);
		let curStage: number;
		if(upgradeItemDatas.length > 0){
			curStage = StrengthenExUtil.getCurrentCfg(EStrengthenExType.EStrengthenExTypeWing, roleIndex).stage;
			for (let itemData of upgradeItemDatas) {
				if (!itemData.isExpire) {
					if(itemData.getEffect() == curStage){
						return true;
					}
				}
			}
		}
		return false;
	}
}
