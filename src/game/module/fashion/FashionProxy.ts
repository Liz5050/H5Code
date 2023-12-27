class FashionProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 时装激活
	 * @param type 类型
	 * @param code 时装编号
	 */
	public activateFashion(type: number, code: number):void{
		this.send("ECmdGameActivateFashion", {"type": type, "code": code});
	}

	/**
	 * 时装升星
	 * @param type 类型
	 * @param code 时装编号
	 */
	public upgradeFashion(type: number, code: number):void{
		this.send("ECmdGameUpgradeFashion", {"type": type, "code": code});
	}

	/**
	 * 时装装备
	 * @param type 类型
	 * @param code 时装编号
	 */
	public dressFashion(type: number, code: number):void{
		this.send("ECmdGameDressFashion", {"type": type, "code": code});
	}

	/**
	 * 时装卸下
	 * @param type 类型
	 * @param code 时装编号
	 */
	public undressFashion(type: number, code: number):void{
		this.send("ECmdGameUndressFashion", {"type": type, "code": code});
	}

	/**
	 * 时装分解
	 * @param uids 物品uid
	 */
	public decomposeFashion(uids: any):void{
		this.send("ECmdGameDecomposeFashion", {"uids": uids});
	}	

	/**
	 * 时装升级
	 * @param type 类型
	 * @param code 时装编号
	 */
	public upgradeFashionLevel(type: number, code: number):void{
		this.send("ECmdGameUpgradeFashionLevel", {"type": type, "code": code});
	}	
}