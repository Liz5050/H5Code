/**
 * 日常活动配置
 */
class SwordPoolActivityConfig extends BaseConfig {
	private sortedEvents:any[];
	private totalExp:number = 0;
	public constructor() {
		super("t_mg_sword_pool_activity", "idx");
	}

	/**
	 * 获取排序后的活跃列表
	 */
	public getSortedActivities(): Array<any> {
		if(!this.sortedEvents){
			this.sortedEvents = [];
			let dict: any = this.getDict();
			for (let key in dict) {
				this.sortedEvents.push(dict[key]);
			}
			this.sortedEvents.sort((a: any, b: any): number => {
				return a.idx - b.idx;
			});
		}		
		return this.sortedEvents;
	}
	public getTotalExp():number{
		if(this.totalExp==0){
			let events:any [] =this.getSortedActivities();
			for(let info of events ){
				info.needExp > this.totalExp?this.totalExp = info.needExp:null;
			}
		}
		return this.totalExp;

	}
}