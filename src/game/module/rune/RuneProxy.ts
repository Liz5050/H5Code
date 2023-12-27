class RuneProxy extends BaseProxy{
	public constructor() {
		super();
	}
	
	/**
	 * 装备符文
	 * @param hole 孔位
	 * @param uid 符文id
	 * @param index 角色索引
	 */
	public dressRune(hole:number, uid:string, roleIndex: number){
		this.send("ECmdGameRunedressRune", {"hole": hole, "uid": uid, "index": roleIndex});
	}

	/**
	 * 升级符文
	 * @param hole 孔位
	 * @param index 角色索引
	 */
	public upgradeRune(hole:number, roleIndex: number){
		this.send("ECmdGameRuneupgradeRune", {"hole": hole, "index": roleIndex});
	}

	/**
	 * 分解符文
	 * @param uids 符文uid列表
	 */
	public decomposeRune(uids: any){
		this.send("ECmdGameRunedecomposeRune", {"uids": uids});
	}

	/**
	 * 分解符文
	 * @param decomposeRuneInfos 分解符文信息列表（uid:amount） {"key_S": Array<string>, "value_I": Array<number>}
	 */
	public decomposeRuneEx(decomposeRuneInfos: any){
		this.send("ECmdGameRunedecomposeRuneEx", {"decomposeRuneInfos": decomposeRuneInfos});
	}

	/**
	 * 符文寻宝
	 * @param amount 寻宝次数
	 * @param free 是否免费寻宝
	 */
	public lotteryRune(amount: number, free: boolean){
		this.send("ECmdGameRunelotteryRune", {"amount": amount, "free": free});
	}

	/**
	 * 合成符文
	 * @param smeltPlanCode 合成编码
	 */
	public smeltRune(smeltPlanCode: number){
		this.send("ECmdGameRunesmeltRune", {"smeltPlanCode": smeltPlanCode});
	}
}