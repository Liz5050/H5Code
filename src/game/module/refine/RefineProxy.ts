class RefineProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 强化
	 * @param autoBuy 是否自动购买材料
	 */
	public strengthen(uid:string, autoBuy:Boolean):void{
		this.send(ECmdGame.ECmdGameStrengthen, {"uid": uid, "autoBuy": autoBuy});
	}

	/**
	 * 宝石镶嵌
	 * @param uid 装备 uid
	 * @param hole 孔（0为VIP孔）
	 * @param jewel 宝石 code
	 */
	public jewelEmbed(uid: string, hole: number, jewel: number):void{
		this.send(ECmdGame.ECmdGameJewelEmbed, {"uid": uid, "hole": hole, "jewel": jewel});
	}

	/**
	 * 宝石卸下
	 * @param hole 孔（0为VIP孔）
	 */
	public jewelGetOff(uid: string, hole: number):void{
		this.send(ECmdGame.ECmdGameJewelGetOff, {"uid": uid, "hole": hole});
	}

	/**
	 * 装备洗练槽开启
	 * @param uid 装备 uid
	 * @param refreshIndex 槽位下标
	 */
	public openRefresh(uid: string, refreshIndex: number):void{
		this.send(ECmdGame.ECmdGameOpenRefresh, {"uid": uid, "refreshIndex": refreshIndex});
	}

	/**
	 * 装备洗练
	 * @param uid 装备 uid
	 * @param isGold 是否使用元宝
	 * @param lockIndexs 锁定的槽位列表 SeqInt:｛"data_I": number数组｝
	 */
	public refresh(uid: string, isGold: boolean, lockIndexs: any):void{
		this.send(ECmdGame.ECmdGameRefresh, {"uid": uid, "isGold": isGold, "lockIndexs": lockIndexs});
	}
}