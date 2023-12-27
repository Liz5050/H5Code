class GodEquipProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 神装合成
	 * @param index 角色索引
	 * @param type 装备小类
	 */
	public generateGodEquip(index: number, type: number):void{
		this.send("ECmdGameGenerateGodEquip",{"index": index, "type": type});
	}

	/**
	 * 神装升级
	 * @param index 角色索引
	 * @param type 装备小类
	 */
	public upgradeGodEquip(index: number, type: number):void{
		this.send("ECmdGameUpgradeGodEquip",{"index": index, "type": type});
	}

	/**
	 * 神装分解
	 * @param uids 神装分解列表
	 */
	public decomposeGodEquip(uids: Array<string>):void{
		this.send("ECmdGameDecomposeGodEquip",{"uids": uids});
	}

	/**
	 * 获取对应合成的神装
	 * @param index 角色索引
	 * @param type 装备小类
	 */
	public getGenerateGodEquip(index: number, type: number):void{
		this.send("ECmdGameGetGenerateGodEquip",{"index": index, "type": type});
	}

	/**
	 * 装备合成(自动穿戴) 升级(九黎)
	 * @param roleIndex 角色索引
	 * @param equipType 升级表对应的equipType
	 * @param pos 升级装备部位（装备小类）
	 * @param cmdType 命令类型
	 */
	public upgradeEquip(roleIndex: number, equipType: number, pos: number, cmdType: number):void{
		this.send("ECmdGameUpgradeEquip",{"roleIndex": roleIndex, "equipType": equipType, "pos": pos, "cmdType": cmdType});
	}
}