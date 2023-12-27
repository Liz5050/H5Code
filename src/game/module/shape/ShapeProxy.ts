class ShapeProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 外形激活
	 */
	public shapeActivate(shape: EShape, roleIdx: number = 0) {
		this.send("ECmdGameShapeActivate", { "shape": shape, "roleIdx": roleIdx });
	}


	/**
	 * 外形进阶（宠物/坐骑）
	 * @param shape 外形
	 * @param autoBuy 是否自动购买材料
	 */
	public shapeUpgrade(shape: number, autoBuy: boolean, roleIdx: number = 0): void {
		this.send("ECmdGameShapeUpgrade", { "shape": shape, "autoBuy": autoBuy, "roleIdx": roleIdx });
	}

	/**
	 * 外形
	 * 使用丹药/仙羽
	 * @param drugType（1-3）
	 */
	public shapeUseDrug(shape: number, drugType: number, useNum: number, roleIdx: number = 0) {
		this.send("ECmdGameShapeUseDrug", { "shape": shape, "drugType": drugType, "useNum": useNum, "roleIdx": roleIdx });
	}

	/**
	 * 穿戴外形装备
	 * @param type EShapePetEquipType
	 */
	public shapeDressEquip(shape: number, type: number, itemCode: number, roleIdx: number = 0) {
		this.send("ECmdGameShapeDressEquip", { "shape": shape, "type": type, "itemCode": itemCode, "roleIdx": roleIdx });
	}

	/**
	 * 升级外形装备
	 * @param type EShapePetEquipType
	 */
	public shapeUpgradeEquip(shape: number, type: number) {
		this.send("ECmdGameShapeUpgradeEquip", { "shape": shape, "type": type });
	}

	/**
	 *     optional int32 shape = 1;	    //外形
	optional int32 roleIdx = 2;	    //角色下标 不分角色的在第一个角色
	optional int32 skillType = 3;	    //当前升级技能类型 0-普通 1-天赋
    optional int32 currentSkillId = 4;	    //当前技能Id
	 */

	public shapeUpgradeSkill(shape: number, roleIdx: number, skillType: number, currentSkillId: number) {
		this.send("ECmdGameShapeUpgradeSkill", { "shape": shape, "roleIdx": roleIdx, "skillType": skillType, "currentSkillId": currentSkillId });
	}


	/**
	 *     optional int32 shape = 1;		//外形枚举
	optional int32 roleIdx = 2;		//角色下标 不分角色的在第一个角色
    optional int32 type = 3;		//装备类型
	 */
	public shapeReplaceEquip(shape: number, roleIdx: number, type: number) {
		this.send("ECmdGameShapeReplaceEquip", { "shape": shape, "roleIdx": roleIdx, "type": type });
	}

	/**
	 * 激活化形（宠物/坐骑）
	 * @param shape 外形
	 * @param change 化形
	 */
	public shapeActivateChange(shape: number, change: number, roleIdx: number = 0): void {
		this.send("ECmdGameShapeActivateChange", { "shape": shape, "change": change, "roleIdx": roleIdx });
	}

	/**
	 * 激活/升级化形（神兵/翅膀/法宝）
	 * @param shape 外形
	 * @param change 化形
	 */
	public shapeUpgradeChange(shape: number, change: number): void {
		this.send("ECmdGameShapeUpgradeChange", { "shape": shape, "change": change });
	}

	/**
	 * 升级化形（宠物/坐骑）
	 * @param shape 外形
	 * @param change 化形
	 * @param itemCode 进阶选择道具
	 */
	public shapeUpgradeChangeEx(shape: number, change: number, itemCode: number, autoBuy: boolean, roleIdx: number = 0): void {
		this.send("ECmdGameShapeUpgradeChangeEx", { "shape": shape, "change": change, "itemCode": itemCode, "autoBuy": autoBuy, "roleIdx": roleIdx });
	}

	/**
	 * 升级化形（宠物/坐骑）
	 * @param shape 外形
	 * @param change 化形
	 * @param skillIndex 技能索引
	 */
	public shapeUpgradeChangeSkill(shape: number, change: number, skillIndex: number,  roleIdx: number = 0): void {
		this.send("ECmdGameShapeUpgradeChangeSkill", { "shape": shape, "change": change, "skillIndex": skillIndex,  "roleIdx": roleIdx});
	}

	/**
	 * 幻化（宠物/坐骑），改变使用的模型	//法宝取消幻化
	 * @param shape 外形
	 * @param stage 阶数
	 */
	public shapeChangeUseModelByS(shape: number, stage: number, roleIdx: number = 0): void {
		this.send("ECmdGameShapeChangeUseModel", { "shape": shape, "stage": stage, "roleIdx": roleIdx });
	}

	/**
	 * 幻化（神兵/翅膀/法宝），改变使用的模型
	 * @param shape 外形
	 * @param change 化形
	 */
	public shapeChangeUseModelByC(shape: number, change: number): void {
		this.send("ECmdGameShapeChangeUseModel", { "shape": shape, "change": change });
	}

	/**
	 * 宠物/坐骑幻形中的 幻化，改变使用的模型
	 * @param shape 外形
	 * @param change 化形
	 */
	public shapeChangeUseModelEx(shape: number, change: number, roleIdx: number = 0): void {
		this.send("ECmdGameShapeChangeUseModelEx", { "shape": shape, "change": change, "roleIdx": roleIdx });
	}



	/**
	 * 翅膀幻形中的 幻化，改变使用的模型
	 * @param shape 外形
	 * @param change 化形
	 */
	public wingChangeUseUseModel(shape: number, change: number, roleIdx: number = 0): void {
		this.send("ECmdGameStrengthenExWingChangeUseModel",{ "index": roleIdx, "change":change });
	}

	public wingChangeCancelUseModel(roleIdx: number = 0) {
		this.send("ECmdGameStrengthenExWingChangeUseModel",{ "index": roleIdx, "change":0 });
	}
}