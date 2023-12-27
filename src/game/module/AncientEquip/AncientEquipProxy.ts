/**
 * 模块代理类
 * @author zhh
 * @time 2018-08-24 11:31:46
 */
class AncientEquipProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 道具转换（无损分解和合成） 
	 * C2S_SItemTransfer
	 * @param itemCode
	 * @param oper      // 1：分解；2：合成
	 *  */
	public compose(itemCode:number,oper:number):void{
		this.send("ECmdGameBagItemTransfer",{itemCode:itemCode,oper:oper});
	}
	/**
	 * 指定物品的无损分解 C2S_SSpecificItemTransDecompose
	 * @param uids
	 * @param posType 背包类型
	 */
	public decompose(uids:string[],posType:number):void{
		this.send("ECmdGameBagSpecificItemTransDecompose",{uids:uids,posType:posType});
	}

}