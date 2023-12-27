/**
 * 历练模块代理类
 * @author zhh
 * @time 2018-06-11 14:15:54
 */
class TrainProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 激活神器
	 */
	public actGodWeapon(code:number):void{
		this.send("ECmdGameActiveGodWeapon",{code:code});
	}
	/**
	 * 激活神器碎片
	 */
	public actGodWeaponPiece(code:number,piece:number):void{		
		this.send("ECmdGameActiveGodPiece",{code:code,piece:piece});
	}
	/**
	 * 领取奖励
	 */
	public getStageReward(type:EStrengthenExType,level:number,index:number=-1):void{
		// C2S_SStrengthenExGetReward
		this.send("ECmdGameStrengthenExGetReward",{type:type,level:level,index:index});
	}
	
	/**领取历练值 */
	public getTrainScore(eventType:number):void{
		this.send("ECmdGameSwordPoolGetTrainScore",{eventType:eventType});
	}

}