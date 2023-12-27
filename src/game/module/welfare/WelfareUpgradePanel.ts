/**
 * 冲级豪礼
 */
class WelfareUpgradePanel extends BaseTabPanel{
	private rewardList: List;
	private datas: Array<any>;


	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}

	public initOptUI(): void{
		this.rewardList = new List(this.getGObject("list_reward").asList);
	}

	public updateAll(): void{
		this.updateDatas();
	}

	public updateDatas(): void{
		let dict: any = ConfigManager.levelReward.getDict();
		this.datas = [];
		for(let key in dict){
			let data: any = dict[key];
			this.datas.push(data);
		}
		this.updateList();
	}

	public updateList(): void{
		this.datas = this.sortLevel(this.datas);
		this.rewardList.data = this.datas;
	}

	/**等级奖励排序 */
	private sortLevel(datas: Array<any>): Array<any>{
		if(datas && datas.length > 0){
			datas.sort((a: any, b: any): number => {
				return (CacheManager.welfare.getLevelStatus(a)*10000+a.level) - (CacheManager.welfare.getLevelStatus(b)*10000+b.level);//可领取的按照等级排序
			});
		}
		return datas;
	} 
}