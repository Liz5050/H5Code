class FashionPlayerProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 时装激活
	 * @param type 类型
	 * @param code 时装编号
	 * @param roleIdx 角色索引
	 */
	public activateFashion(type: number, code: number, roleIdx: number):void{
		this.send("ECmdGameActivateFashion", {"type": type, "code": code, "roleIdx": roleIdx});
	}

	/**
	 * 时装升星
	 * @param type 类型
	 * @param code 时装编号
	 * @param roleIdx 角色索引
	 */
	public upgradeFashion(type: number, code: number, roleIdx: number):void{
		this.send("ECmdGameUpgradeFashion", {"type": type, "code": code, "roleIdx": roleIdx});
	}

	/**
	 * 时装装备
	 * @param type 类型
	 * @param code 时装编号
	 * @param roleIdx 角色索引
	 */
	public dressFashion(type: number, code: number, roleIdx: number):void{
		this.send("ECmdGameDressFashion", {"type": type, "code": code, "roleIdx": roleIdx});
	}

	/**
	 * 时装卸下
	 * @param type 类型
	 * @param code 时装编号
	 * @param roleIdx 角色索引
	 */
	public undressFashion(type: number, code: number, roleIdx: number):void{
		this.send("ECmdGameUndressFashion", {"type": type, "code": code, "roleIdx": roleIdx});
	}

	/**
	 * 时装过期检测请求
	 */
	public checkFashionEndDt():void {
		this.send("ECmdGameCheckFashionEndDt",{});
	}
}