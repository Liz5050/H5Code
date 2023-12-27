/**
 * 寻路到目标点并开启挂机 
 * 额外功能:
 * 1.可以传 checkFn 和 checkCaller 进行判断到达目标点后是否需要挂机
 * 2.不传判断的话 直接挂机
 */
class AIRouteBossHook extends AIBase {
	private mapId: number;
	private gridX: number;
	private gridY: number;
	private bossCode: number;
	private distance: number = 0;
	private waitFrame: number = 60;//等待帧数，防止传送点切图多次调用
	private leftTime: number = 0;
	private selectMonster: RpgMonster;
	/**判断是否需要挂机的函数 */
	private checkFn:Function;
	private checkCaller:any;
	/**
	 * 参数data:
	 * mapId
	 * gridX
	 * gridY
	 * checkFn
	 * checkCaller
	 * bossCode
	 * search  寻路过程中是否需要搜怪挂机
	 * searchDis 搜索范围
	 */
	public constructor(data?: any) {
		super(data);
		this.mapId = data.mapId;
		this.gridX = data.x;
		this.gridY = data.y;
		this.bossCode = data.bossCode;
		this.checkFn = data.checkFn;
		this.checkCaller = data.checkCaller;
		if (data.distance != null) {
			this.distance = data.distance;
		}
	}

	public isComplete(data?: any): boolean {
		var isArrive: boolean = CacheManager.map.mapId == this.mapId && PathUtils.isInRange(this.gridX, this.gridY, this.distance);
		if (isArrive) {
			this.checkAutoFight();
		}
		return isArrive;
	}

	protected checkAutoFight():void{
		if(this.checkFn && this.checkCaller){
			if(this.checkFn.call(this.checkCaller,this.bossCode)){
				EventManager.dispatch(LocalEventEnum.AutoStartFight);
			}			
		}else{ //不需要额外判断 直接挂机
			EventManager.dispatch(LocalEventEnum.AutoStartFight,this.data.hookData);
		}
	}

	public update(...params): boolean {
		if (this.isComplete()) {
			super.onComplete();
			return true;
		}
				
		if(this.data && this.data.search){//寻路过程中是否停下来打怪
			let serchDis:number = this.data.searchDis?this.data.searchDis:CacheManager.battle.autoBattleSearchDis;
			this.selectMonster = CacheManager.map.getNearestMonster(serchDis,this.bossCode);
			if (this.selectMonster != null && !this.selectMonster.isDead()) {
				if(this.data && this.data.hookData){
					EventManager.dispatch(LocalEventEnum.AutoStartFight,this.data.hookData);				
				}else{
					EventManager.dispatch(LocalEventEnum.AutoStartFight,{ "bossCode": this.bossCode });
				}
				return true;
			}
		}
		
		if (CacheManager.map.mapId == this.mapId) {//同场景内移动
			AI.addAI(AIType.Move, { "x": this.gridX, "y": this.gridY, "distance": this.distance });
		} else {
			if (this.leftTime > 0) {
				this.leftTime--;
				return;
			}
			//寻路到传送点
			let passPoint: any = ConfigManager.map.getPassPoint(CacheManager.map.mapId, this.mapId);
			if (passPoint != null) {
				let passPointGridX: number = passPoint.point.x;
				let passPointGridY: number = passPoint.point.y;
				if (PathUtils.isInRange(passPointGridX, passPointGridY)) {//已经走到了传送点范围
					let entityId: string = EntityUtil.getPassPointEntityId(passPoint);
					AI.addAI(AIType.ClickEntity, { "entityId": entityId });
					this.leftTime = this.waitFrame;
				} else {
					//传送点的坐标为格子坐标
					AI.addAI(AIType.Move, { "x": passPointGridX, "y": passPointGridY, "distance": this.distance });
				}
			}
		}
		return false;
	}
}