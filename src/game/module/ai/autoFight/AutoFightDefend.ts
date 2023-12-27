class AutoFightDefend extends AutoFightCopy {
	public constructor(data:any) {
		super(data);
		let dis:number = CopyUtils.getSearchDis(CacheManager.copy.curCopyType);
		if(dis){
			this.searchDis = dis;
		}
	}
	public update():boolean
    {
        var flag:boolean = this.findMonster();        
        if(!flag && this.waitPoint && !PathUtils.isInRange(this.waitPoint.x, this.waitPoint.y,0)){
			let data:any = {x:this.waitPoint.x,y:this.waitPoint.y,autoFightCtrl:this}
            AI.addAI(AIType.Move,data);
        }
        return flag;
    }

	public updateOnMoving():void
    {
		var flag:boolean = this.findMonster();
		if(flag){
			AI.removeAIByType(AIType.Move);
		}
    }
}