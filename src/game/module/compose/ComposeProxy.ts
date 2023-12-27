class ComposeProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 物品合成
	 * @param smeltPlanCode 合成方案编号
	 */
	public smelt(smeltPlanCode: number, amount:number = 1): void{
		this.send("ECmdGameRefineSmelt", {"smeltPlanCode": smeltPlanCode, "amount":amount});
	}

	/**
	 * 装备合成（玩家装备、神兽装备）
	 * @param smeltPlanCode 合成方案编号
	 * @param mapUid 装备 uid map {"key_S": string[], "value_I": number[]}
	 */
	public smeltEquip(smeltPlanCode: number, mapUid: any): void{
		this.send("ECmdGameRefineSmeltEquip", {"smeltPlanCode": smeltPlanCode, "mapUid": mapUid});
	}

	/**合成天赋圣物 */
	public smeltTalent(itemCodes:number[]):void{
		this.send("ECmdGameSmeltTalentEquip",{itemcodeSeq:{data_I:itemCodes}});
	}

}