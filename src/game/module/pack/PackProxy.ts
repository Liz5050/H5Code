class PackProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 背包位置
	 * @param posType EPlayerItemPosType
	 */
	public tidyBag(posType:EPlayerItemPosType):void{
		this.send("ECmdGameTidyBag", {"posType": posType});
	}

	/**
	 * 背包间移动物品
	 */
	public moveItem(uid:string, fromPosType:EPlayerItemPosType, fromPosIndex:number, toPosType:EPlayerItemPosType, toPosIndex:number):void{
		this.send("ECmdGameMoveItemBetweenBag", 
			{"uid": uid, "fromPosType": fromPosType, "fromPosIndex": fromPosIndex, "toPosType": toPosType, "toPosIndex": toPosIndex}
		);
	}

	/**
	 * 背包间移动物品列表
	 * mapUid发空，协议结构没变，本来是发具体的uid，数量过多，uid结构太大，服务端解析出错
	 */
	public moveItemList(fromPosType:EPlayerItemPosType,toPosType:EPlayerItemPosType):void {
		this.send("ECmdGameMoveBag",{fromPosType : fromPosType, toPosType : toPosType, mapUid : {}});
	}

	/**
	 * 出售物品
	 */
	public sellItem(posType:EPlayerItemPosType, uids:Array<string>):void{
		this.send("ECmdGameSellItem", {"posType": posType, "uids": {"data_S": uids}});
	}

	/**
	 * 一键出售
	 */
	public sellEquipOneKey():void{
		this.send("ECmdGameSellEquipOneKey", {});
	}

	/**
	 * 拆分
	 */
	public splitItem(uid:string, amount:number):void{
		this.send("ECmdGameSplitItem", {"uid": uid, "amount": amount});
	}

	public addBagCapacity(posType:number, value:number){
		this.send("ECmdGameAddBagCapacity", {"posType":posType, "amount":value});
	}

	/**
	 * 使用物品
	 */
	public useItem(uid:string, amount:number, values:Array<string>, roleIdx:number = 0):void{
		this.send("ECmdGameUseItem", {"uid": uid, "amount": amount, "values": {"data_S": values}, "roleIdx":roleIdx});
	}

	/**
	 * 根据物品code使用物品
	 */
	public useItemByCode(itemCode:number,amount:number,values:string[]):void{
		this.send("ECmdGameUseByItemCode",{itemCode:itemCode,amount:amount,values:{"data_S": values}});
	}	

	/**
	 * 熔炼装备
	 */
	public meltEquip(posType:EPlayerItemPosType, uids:Array<string>): void{
		this.send("ECmdGameMeltEquip", {"posType": posType, "uids": {"data_S": uids}});
	}

}