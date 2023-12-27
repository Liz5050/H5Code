/**
 * 神兽助战
 */
class BeastBattleProxy extends BaseProxy {
	public constructor() {
		super();
    }

    /**
	 * 穿戴装备
     * @param code 神兽编号
     * @param uid 装备uid
     */
	public dressEquip(code: number, uid: string): void {
        this.send("ECmdGameBeastEquipDress",{"code": code, "uid": uid});
	}

    /**
     * 卸下装备
     * @param code 神兽编号
     * @param holeId 槽位id
     */
    public undressEquip(code: number, holeId: number): void {
        this.send("ECmdGameBeastEquipUndress",{"code": code, "holeId": holeId});
    }

    /**
     * 卸下所有装备
     * @param code 神兽编号
     */
    public undressEquipAll(code: number): void {
        this.send("ECmdGameBeastEquipUndressAll",{"code": code});
    }

    /**
     * 出战/召唤
     * @param code 神兽编号
     */
    public beckon(code: number): void {
        this.send("ECmdGameBeastBeckon",{"code": code});
    }

    /**
     * 召回
     * @param code 神兽编号
     */
    public recall(code: number): void {
        this.send("ECmdGameBeastRecall",{"code": code});
    }

    /**
     * 增加助战上限
     * @param code 神兽编号
     */
    public addMaxBeckonNum(): void {
        this.send("ECmdGameBeastAddMaxBeckonNum",{});
    }

    /**
     * 强化装备
     * @param code 神兽编号
     * @param holeId 槽位id
     */
    public strengthenEquip(code: number, holeId: number): void {
        this.send("ECmdGameBeastEquipStrengthen",{"code": code, "holeId": holeId});
    }

    /**
     * 分解装备
     * @param decomposeBeastEquipInfos {"key_S": Array<string>, "value_I": Array<number>} （uid:amount）
     */
    public decomposeEquip(decomposeBeastEquipInfos: any): void {
        this.send("ECmdGameBeastEquipDecompose",{"decomposeBeastEquipInfos": decomposeBeastEquipInfos});
    }
}