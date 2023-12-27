class GuildDefendCache extends ActivityWarfareCache {

	/**烈焰仙尊 怪物code */
	public static DEFENDER_1:number = 24010101;
	/**雷霆仙尊 怪物code */
	public static DEFENDER_2:number = 24010201;
	/**仙盟神女 怪物code */
	public static DEFENDER_3:number = 24010001;

	/**副本的挂机范围 */
	public static searchDis:number = 10;

	private _scopyInfo:any;
	private _nextWaveDt:number = 0;
	private _defenderCodes:number[];
	private _rankInfo:any;
	
	public boxInfo:any;
	public isCloseAct:boolean = false;
	public actStageInfo:any;
	/**当前刷出来的boss(攻击目标) */
	public bossEntity:any;

	public isGodDefendTip:boolean=false;

	private waitPointMap:any={
		[GuildDefendCache.DEFENDER_3]:"12,59|19,66",//仙盟神女 左右两个点
		[GuildDefendCache.DEFENDER_1]:"14,30",//烈焰仙尊
		[GuildDefendCache.DEFENDER_2]:"41,57",//雷霆仙尊
	}

	private defenderLifeMap:any;

	public constructor() {
		super();
		this.iconId = IconResId.GuildDefend;
		this.defenderLifeMap = {};
	}
	public checkTips():boolean{
		return this.isOpen;
	}


	public setNextWaveDt(data:any):void{
		this._nextWaveDt = data.value_I*1000+egret.getTimer();
	}
	public get nextWaveDt():number{
		return this._nextWaveDt;
	}
	

	public setDefenderInfo(value:any){		
		if(!this._defenderCodes){
			this._defenderCodes = [];
			for(let i:number=1;i<=3;i++){
				let key:string = `bossCode${i}_I`;
				if(value[key]){
					this._defenderCodes.push(value[key]);
				}				
			}
		}
	}
	
	public get defenderCodes():number[]{
		return this._defenderCodes;
	}

	public setDefenderLife(code:number,life:any):void{
		this.defenderLifeMap[code] = life;
	}

	public clearDefenderLife():void{
		ObjectUtil.emptyObj(this.defenderLifeMap);
	}

	public isLifeChange(code:number,curLife:any):boolean{
		let old:any = this.defenderLifeMap[code];
		return old && old!=curLife;
	}

	/**是否仙盟守护的防守怪 */
	public isDefender(bossCode:number):boolean{		
		return this._defenderCodes && this._defenderCodes.indexOf(bossCode)>-1;
	}



	/**是否在赏灯阶段 */
	public isInTravel():boolean{
		return this.actStageInfo && this.actStageInfo.stage_I==EMgGuildDefenseStageType.EMgGuildDefenseStageTypeTravel;
	}

	public get scopyInfo():any{
		return this._scopyInfo;
	}

	public set scopyInfo(value:any){
		this._scopyInfo = value;
	}

	public get rankInfo():any{
		return this._rankInfo;
	} 

	public set rankInfo(value:any){
		this._rankInfo = value; 
	}

	/**获取在角色挂机范围内最近的挂机点*/
	public getNearHookPoint():any{
		let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
		if(!kingEntity || !kingEntity.entityInfo) {
			return null;
		}
		let minDis:number = -1;
		let nearPoint:any;
		for(let key in this.waitPointMap){
			let str:string = this.waitPointMap[key];
			let points:string[] = str.split("|");
			for(let i:number = 0;i<points.length;i++){
				let a:string[] = points[i].split(",");
				let dis:number = App.MathUtils.getDistance(kingEntity.col, kingEntity.row,Number(a[0]), Number(a[1]));
				if(dis<GuildDefendCache.searchDis){//在某个挂机点附近
					if(minDis==-1 || minDis>dis){ //并且是最近的点
						minDis = dis;
						nearPoint = this.createWP(Number(a[0]),Number(a[1]));
					}					 
				}
			}				
		}
		return nearPoint;
	}

	/**获取离我最近的仙尊点 */
	public getNearPoint():any{
		let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
		if(!kingEntity){
			return null;
		}
		let minDis:number = -1;
		let tarPos:string[];
		for(let key in this.waitPointMap){
			let code:number = Number(key);
			if(code!=GuildDefendCache.DEFENDER_3){
				let str:string = this.waitPointMap[key];
				let p:string[] = str.split(",");
				let d:number = App.MathUtils.getDistance(kingEntity.col, kingEntity.row,Number(p[0]), Number(p[1]));
				if(minDis==-1 || d<minDis){
					minDis = d;
					tarPos = p;
				}
			}
		}
		return this.createWP(Number(tarPos[0]),Number(tarPos[1]));
	}

	public isGodDefend(code:number):boolean{
		return code==GuildDefendCache.DEFENDER_3;
	}

	public getWaitPoint(bossCode:number):any{
		let str:string = this.waitPointMap[bossCode];
		let points:string[] = str.split("|");
		let a:string[];
		if(points.length==2){ //女神挂机点; 找离角色最近的点	
			let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
			if(!kingEntity || !kingEntity.entityInfo) {
				a = points[1].split(",");
			}else{
				let minDis:number = -1;
				for(let i:number=0;i<points.length;i++){
					let p:string[] = points[i].split(",");
					let dis:number = App.MathUtils.getDistance(kingEntity.col, kingEntity.row,Number(p[0]), Number(p[1]));
					if(minDis==-1 || dis<minDis ){
						a = p;
						minDis = dis;
					}
				}
			}			
		}else{
			a = str.split(",");	
		}		 	
		return this.createWP(Number(a[0]),Number(a[1]));
	}

	public getEnterPoint():any{
		let idx:number = Math.random()>0.5?1:0;
		let str:string = this.waitPointMap[GuildDefendCache.DEFENDER_3];
		let points:string[] = str.split("|");
		let a:string[] = points[idx].split(",");
		return this.createWP(Number(a[0]),Number(a[1]));
	}

	/**构建挂机等待点信息 */
	private createWP(x:number,y:number):any{
		return {waitPointX:x,waitPointY:y,searchDis:GuildDefendCache.searchDis};
	}

	/**判断某个距离是否是主角距离三个建筑中最近的距离 */
	public isMinDis(tarDis:number,exCode:number=0):boolean{
		let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
		if(!kingEntity || !kingEntity.entityInfo) {
			return false;
		}
		let flag:boolean = true;
		for(let key in this.waitPointMap){
			let code:number = Number(key);
			if(exCode==0 || code!=exCode){
				let wp:any = CacheManager.guildDefend.getWaitPoint(code);			
				let dis:number = App.MathUtils.getDistance(kingEntity.col, kingEntity.row, wp.waitPointX, wp.waitPointY);
				if(dis<tarDis){
					flag = false;
				}
			}			
		}
		return flag;
	}

	/**退出副本需要清空的数据 */
	public truncate():void{
		this._defenderCodes = null;
		this._scopyInfo = null;
	}

}