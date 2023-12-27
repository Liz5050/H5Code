/**
 * 日常配置
 */
class SwordPoolEventConfig extends BaseConfig {

	/**推荐的组数据{event:[info,...]} */
	private _recommendGroupDict:any;
	private _recommendGroups:number[];
	public constructor() {
		super("t_mg_sword_pool_event", "event");
	}

	public parseByPk(sourceData: any, pk: string): any {
		let data = {};
		this._recommendGroupDict = {};
		this._recommendGroups = [];
		if (sourceData) {
			let key: string = "";
			let pks: Array<string> = pk.split(",");
			for (let d of sourceData) {
				key = "";
				if (pks.length > 1) {//组合主键
					for (let k of pks) {
						if (d[k]) {
							key += d[k] + this.sep;
						} else {
							key += 0 + this.sep;
						}
					}
				} else {
					key = d[pk] ? d[pk] : 0;
				}
				data[key] = this.transform(d, data);
				if(d.recommend){
					if(!this._recommendGroupDict[d.recommend]){
						this._recommendGroupDict[d.recommend] = [];
					}
					this._recommendGroupDict[d.recommend].push(d);
					if(this._recommendGroups.indexOf(d.recommend)==-1){
						this._recommendGroups.push(d.recommend);
					}
				}
			}
		}
		this._recommendGroups.sort();
		this._recommendGroups = this._recommendGroups.reverse();
		return data;
	}

	/**是否需要显示推荐 */
	public isCurRecommendGroup(info:any):boolean{
		if(!info.recommend){
			return false;
		}

		let flag:boolean = false;
		for(let i:number = 0;i<this._recommendGroups.length;i++){
			let rcm:number = this._recommendGroups[i];
			let infos:any[] = this._recommendGroupDict[rcm];
			let b:boolean = false;
			if(infos){
				for(let inf of infos){ //判断该推荐组是否都已经完成
					//如果所有材料副本都能扫荡或者经验副本免费次数用完 表示已经完成 不再推荐
					if(inf.event==ESWordPoolEvent.ESWordPoolEventCopyMgNewExp){
						b = !CacheManager.copy.isExpHasFreeTime();
					}else if(inf.event==ESWordPoolEvent.ESWordPoolEventCopyMgMaterial){
						b = !CacheManager.copy.isMatCopyFreeTimes(); 
					}else{
						b = CacheManager.daily.isEventComplete(inf.event);
					}					
					if(!b){
						break;
					}
				}
			}
			if(!b){
				let isComp:boolean = CacheManager.daily.isEventComplete(info.event);
				let isOpen:boolean = CacheManager.daily.isEventOpen(info.event);
				flag = isOpen && !isComp && info.recommend==rcm;
				if(info.event==ESWordPoolEvent.ESWordPoolEventCopyMgNewExp){
					flag = flag && CacheManager.copy.isExpHasFreeTime();
				}else if(info.event==ESWordPoolEvent.ESWordPoolEventCopyMgMaterial){
					flag = flag && CacheManager.copy.isMatCopyFreeTimes(); 
				}
				break;
			}
		}
		return flag;
	}
	
	/**
	 * 获取排序后的日常列表
	 */
	public getSortedEvents(): Array<any> {
		let sortedEvents: Array<any> = [];
		let dict: any = this.getDict();
		for (let key in dict) {
			sortedEvents.push(dict[key]);
		}
		sortedEvents.sort((a: any, b: any): number => {
			let isCanA:boolean = CacheManager.daily.isEventCanGet(a.event);
			let isCanB:boolean = CacheManager.daily.isEventCanGet(b.event);
			if(isCanA)return -1;
			if(isCanB)return  1;

			let isAOpen: boolean = CacheManager.daily.isEventOpen(a.event);
			let isBOpen: boolean = CacheManager.daily.isEventOpen(b.event);
			
			if (isAOpen && !isBOpen) {
				return -1;
			}
			if (!isAOpen && isBOpen) {
				return 1;
			}

			if (isAOpen && isBOpen) {
				let isAComplete: boolean = CacheManager.daily.isEventComplete(a.event);
				let isBComplete: boolean = CacheManager.daily.isEventComplete(b.event);
				let isCPA:boolean = a.event==ESWordPoolEvent.ESWordPoolEventCopyMgCheckPoint;
				let isCPB:boolean = b.event==ESWordPoolEvent.ESWordPoolEventCopyMgCheckPoint;
				
				if(!isAComplete && !isBComplete){//都没完成 根据推荐组排序
					let isRcmA:boolean = this.isCurRecommendGroup(a);
					let isRcmB:boolean = this.isCurRecommendGroup(b);
					if(isRcmA && isRcmB){
						return a.idx - b.idx;
					}
					if(isRcmA){
						return -1;
					}
					if(isRcmB){
						return 1;
					}
					
				}

				if (isAComplete && !isBComplete) {
					return 1;
				}
				if (!isAComplete && isBComplete) {
					return -1;
				}		
				
				if(isAComplete && isBComplete){
					//关卡放在已完成的前面(因为关卡完成还是显示前往按钮)
					if(isCPA){
						return -1;
					}
					if(isCPB){
						return 1;
					}
				}
			}
			return a.idx - b.idx;

		});
		return sortedEvents;
	}

	

}