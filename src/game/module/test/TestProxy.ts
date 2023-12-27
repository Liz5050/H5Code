class TestProxy extends BaseProxy {
	public constructor() {
		super();
	}

	public updateRoleLevel(value: number): void {
		Log.trace(Log.TEST, "updateRoleLevel:" + value);
		this.send("ECmdGameGmUpdateLevel", { "level": value });
	}

	public updateRoleExp(value: number): void {
		this.send("ECmdGameGmUpdateExp", { "exp": value });
	}

	public updateRoleLife(value: number,roleIndex:number): void {
		//type 1:life 2:mana 3:nimbus
		this.send("ECmdGameGmUpdateLifeOrMana", { "type": 1, "value": value ,"index":roleIndex});
	}

	/**
	 * @param unit {EPriceUnit}
	 */
	public updateMoney(unit: number, value: number): void {
		this.send("ECmdGameGmUpdateMoney", { "uint": unit, "amount": value });
	}

	/**
	 * 增加物品
	 */
	public addItem(code: number, value: number): void {
		this.send("ECmdGameGmAddItem", { "itemCode": code, "amount": value });
	}

	/**
	 * 复活
	 */
	public revive(): void {
		ProxyManager.player.revive(0, EPriceUnit.EPriceUnitGold,-1);
	}

	/**
	 * 切换地图
	 * struct:C2S_SConvey
	 */
	public convey(mapId: number, conveyType: number, point: any): void {
		this.send("ECmdGameConvey", { "mapId": mapId, "conveyType": conveyType, "point": { "x_SH": point.x, "y_SH": point.y } });
	}

	/**
	 * gm操作
	 */
	public gmOperation(optType: EGmOpType, intParams: Array<number> = [], strParams: Array<string> = []): void {
		this.send("ECmdGameGmOperation", { "type": optType, "intParas": intParams, "strParas": strParams });
	}

	/**
	 * 测试指令
	 */
	public exeCmd(type: number, params: Array<number>): void {
		this.send("ECmdGameGmTest", { "type": type, "params": { "data_I": params } });
	}
	/**后端发送命令 */
	public sendCmd(cmd:string,json:string):void{
		cmd = cmd.trim();
		let data:any = JSON.parse(json);
		this.send(cmd,data);
	}

}