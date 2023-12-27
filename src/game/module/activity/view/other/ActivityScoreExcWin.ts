/**
 * 积分兑换窗口
 * @author zhh
 * @time 2018-09-19 19:14:00
 */
class ActivityScoreExcWin extends BaseWindow {
    private listItem:List;
	private txtScore:fairygui.GTextField;
	private _cacheData:any;
	public constructor() {
		super(PackNameEnum.ActivityScore,"ActivityScoreExcWin")

	}
	public initOptUI():void{
        //---- script make start ----
        this.listItem = new List(this.getGObject("list_item").asList);
		this.txtScore = this.getGObject("txt_score").asTextField;
        //---- script make end ----

	}

	public updateAll(data?:any):void{		
		if(data){
			this._cacheData = data; 
		}
		let actInfo:ActivityInfo = this._cacheData;
		this.listItem.setVirtual(actInfo.rewardInfos);
		this.txtScore.text = "BOSS积分："+HtmlUtil.html(""+CacheManager.activity.myBossScore,"#fea700");
	}


}