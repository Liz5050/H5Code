class PlayerProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**一键换装 C2S_SDressByOneKey  */
	public dressByOneKey(dressInfos: any[], roleIndex: number): void {
		CacheManager.player.isReplaceRet = false;
		this.send("ECmdGameDressByOnekey", { dressInfos: dressInfos, roleIndex: roleIndex });
	}

	/**穿装备 */
	public dress(uid: string, rolePosIndex: number, roleIndex: number): void {
		CacheManager.player.isReplaceRet = false;
		this.send("ECmdGameDress", { "uid": uid, "rolePosIndex": rolePosIndex, "roleIndex": roleIndex });
	}

	/**脱装备 */
	public unDress(uid: string): void {
		this.send("ECmdGameUndress", { "uid": uid });
	}

	/**
	 * 复活
	 * @param revivalType 0：原地复活，2：回城复活, 3：满状态复活 ERevivalType
	 * @param roleIndex 复活角色索引 -1 全部复活
	 * @param mainIndex 全部复活后主控制索引
	 * @param posX posY 复活后主控制的位置
	 */
	public revive(revivalType: number, priceUnit: number, roleIndex: number = -1, mainIndex: number = 0, posX: number = 0, posY: number = 0): void {
		let point: any = { "x_SH": posX, "y_SH": posY };
		this.send("ECmdGameRevival", { "revivalType": revivalType, "priceUnit": priceUnit, index: roleIndex, mainIndex: mainIndex, point: point });
	}

	/**
	 * 外形
	 * 使用材料提升等级
	 * @param shape：外形，如翅膀，宠物等
	 */
	public shapeUpgradeEx(shape: number, itemCode: number): void {
		this.send("ECmdGameShapeUpgradeEx", { "shape": shape, "itemCode": itemCode });
	}

	/**
	 * 外形
	 * 使用丹药/仙羽
	 * @param drugType（1-3）
	 */
	public shapeUseDrug(shape: number, drugType: number, useNum: number) {
		this.send("ECmdGameShapeUseDrug", { "shape": shape, "drugType": drugType, "useNum": useNum });
	}

	/**
	 * 屏蔽外形
	 * @param value 是否屏蔽（true：屏蔽，false：不屏蔽）
	 */
	public shapeNotShow(shape: number, value: boolean) {
		this.send("ECmdGameShapeNotShow", { "shape": shape, "value": value });
	}

	/**
	 * 学习技能
	 * @param posType 技能槽位置（没有位置的填 -1 ）
	 * @param planType 方案索引(planType:0是指方案一,1是指方案二)
	 */
	public learnSkill(skillId: number, posType: number, planType: number): void {
		this.send("ECmdGameLearnSkill", { "skillId": skillId, "pos": posType, "planType": planType });
	}

	/**
	 * 提升境界
	 */
	public upgradeRealm(): void {
		this.send("ECmdGameUpgradeRealmLevel", {});
	}

	/**
	 * 开启新角色
	 */
	public openNewRole(career: ECareer): void {
		//this.send("ECmdGamePlayerOpenNewRole", {"career": career});
		this.send("ECmdGameOpenNewRealRole", { "career": career });
	}

	/**
	 * 提升强化
	 * @param isAutoBuy 材料不足是否使用元宝自动购买
	 * @param oneKeyUpgrade 是否一键升级
	 */
	public upgradeStrengthenEx(type: EStrengthenExType, roleIndex: number, isAutoBuy: boolean = false, chooseItemCode: number = 0, oneKeyUpgrade: boolean = false): void {
		this.send("ECmdGameUpgradeStrengthenEx", { "type": type, "index": roleIndex, "autoBuy": isAutoBuy, "chooseItemCode": chooseItemCode, "oneKeyUpgrade": oneKeyUpgrade });
	}

	/**
	 * 激活新强化系统
	 */
	public activateStrengthenEx(type: EStrengthenExType, roleIndex: number): void {
		this.send("ECmdGameActivateStrengthenEx", { "type": type, "index": roleIndex });
	}

	/**
	 * 使用属性药
	 * @param drugType  1-3
	 */
	public strengthenExUseDrug(type: EStrengthenExType, roleIndex: number, drugType: number, useNum: number): void {
		this.send("ECmdGameStrengthenExUseDrug", { "type": type, "index": roleIndex, "drugType": drugType, "useNum": useNum });
	}

	/**
	 * 修改角色名称
	 */
	public modifyRoleName(name: string): void {
		this.send("ECmdGameModifyRoleName", { "name": name });
	}

	/**
	 * 装备（龙鳞甲和摄坤铃）进阶
	 */
	public upgradeEquipEx(index: number, type: number): void {
		this.send("ECmdGameUpgradeEquipEx", { "index": index, "type": type });
	}
}