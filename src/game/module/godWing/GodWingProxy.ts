/**
 * 模块代理类
 * @author zhh
 * @time 2018-08-08 17:33:32
 */
class GodWingProxy extends BaseProxy {
	public constructor() {
		super();
	}
	/**快速合成 */
	public sendQickSmelt(roleIndex:number,StrengthenExType:number,type:number):void{
		this.send("ECmdGameStrengthenExAccessoryUpgrade",{roleIndex:roleIndex,StrengthenExType:StrengthenExType,type:type});
	}
	/**装备 */
	public sendEmbeded(roleIndex:number,StrengthenExType:number,type:number):void{		
		this.send("ECmdGameStrengthenExAccessoryEmbeded",{roleIndex:roleIndex,StrengthenExType:StrengthenExType,type:type});
	}
	/**转换 */
	public sendTransfer(StrengthenExType:EStrengthenExType,fromItemCode:number,toItemCode:number,amount:number):void{
		this.send("ECmdGameStrengthenExAccessoryTransfer",{StrengthenExType:StrengthenExType,fromItemCode:fromItemCode,toItemCode:toItemCode,amount:amount});
	}

}