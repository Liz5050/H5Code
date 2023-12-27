class TrainCache implements ICache {
	
	public constructor() {
		
	}
	public checkTips():boolean{
		return CacheManager.nobility.checkTips() || CacheManager.daily.checkTips() || CacheManager.medal.checkTips() || this.checkGamePlayTips(); 
	}

	public checkGamePlayTips():boolean {
		return (CacheManager.arena.checkGamePlayTips(EActiveType.EActiveTypeWorlBoss) || 
		// CacheManager.arena.checkGamePlayTips(EActiveType.EActiveTypePosition) || 
		CacheManager.arena.checkGamePlayTips(EActiveType.EActiveTypeBattleBich) || 
		CacheManager.arena.checkGamePlayTips(EActiveType.EActiveTypeCrossStair) ||
		CacheManager.exam.isExamStart());
	}
	
	public clear():void{

	}

}