/**
 * 必杀系统
 */

class UniqueSkillProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 分解必杀碎片
	 * @param posType 背包类型
	 * @param uids 熔炼列表 uids = {"data_S": Array<string>}
	 */
	public decomposeKill(posType: number, uids: Array<string>): void {
		this.send("ECmdGameDecomposeKill", { "posType": posType, "uids": {"data_S": uids}});
	}

	/**
	 * 兑换必杀碎片
	 */
	public exchangeKill(itemCode: number, amount: number): void {
		this.send("ECmdGameExchangeKill", { "itemCode": itemCode, "amount": amount});
	}

	/**
	 * 兑换必杀碎片精华
	 */
	public exchangeKillFragment(amount: number): void {
		this.send("ECmdGameExchangeKillFragment", { "amount": amount});
	}
}