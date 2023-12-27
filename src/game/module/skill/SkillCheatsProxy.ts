class SkillCheatsProxy extends BaseProxy {
	public constructor() {
		super();
	}
	/**镶嵌秘籍 C2S_SMosaicCheats */
	public embeld(roleIndex:number,costItemcode:number):void{
		this.send("ECmdGameMosaicCheats",{roleIndex:roleIndex,costItemcode:costItemcode});
	}
	/**置换秘籍 
	 * C2S_SExchangeCheats 
	 * mapCost {key_I:[],value_I:[]}
	 * */
	public exchange(mapCost:any):void{
		this.send("ECmdGameExchangeCheats",{mapCost:mapCost});
	}

}