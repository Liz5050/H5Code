/**九幽副本 */
class CopyHallExpPanel extends BaseCopyTabPanel {	
	
	private btn_check: fairygui.GButton;
	
	private btn_single: fairygui.GButton;
	
	private txt_number: fairygui.GRichTextField;	
	private txt_news: fairygui.GRichTextField;
	private txt_title: fairygui.GTextField;
	private list_reward: List;

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}
	public initOptUI(): void {
		super.initOptUI();
		//this.txt_time = this.getGObject("txt_time").asRichTextField;
		//this.btn_time = this.getGObject("btn_time").asButton;
		//this.btn_buy = this.getGObject("btn_buy").asButton;
		this.btn_check = this.getGObject("btn_check").asButton;
		
		this.btn_single = this.getGObject("btn_single").asButton;
		this.txt_number = this.getGObject("txt_number").asRichTextField
		
		this.txt_news = this.getGObject("txt_news").asRichTextField;
		this.txt_title = this.getGObject("txt_title").asTextField;

		this.list_reward = new List(this.getGObject("list_reward").asList);

		this.btn_time.addClickListener(this.onBtnClick, this);
		this.btn_auto.addClickListener(this.onBtnClick, this);
		this.btn_single.addClickListener(this.onBtnClick, this);
		this.btn_team.addClickListener(this.onBtnClick, this);

	}
	

	public onTimeRun(arg?:any):void{
		super.onTimeRun(arg);
		//在controller中判断有cd才执行该函数
		var cdT:number = CacheManager.copy.getCopyCdTime(CopyEnum.CopyExp);
		var svt:number = CacheManager.serverTime.getServerTime(); 
		var cdSec:number = cdT-svt;
		var ts:string = App.DateUtils.getFormatBySecond(cdSec,3);
		this.btn_time.text = "冷却中:"+ts;
		if(cdSec<=0){
			this.btn_time.visible = false;
		}
	}

	public updateAll(): void {
		var code: number = CopyEnum.CopyExp;
		this.copyInf = ConfigManager.copy.getByPk(code);		
		this.updateEnterCount(this.copyInf);
		var needPropNum: number = CopyUtils.getExpCopyItemCount(this.copyInf.needProp);
		var needStr: string = needPropNum + "";
		if (needPropNum <= 0) {
			needStr = HtmlUtil.html(needStr, Color.Red);
		}
		this.txt_number.text = needStr + "/1"; //通行证数量显示 1/3
		this.updateStaticInf();		

	}

	private updateStaticInf(): void {
		if (!this.isUpdated) {
			this.isUpdated = true;
			this.txt_title.text = this.copyInf.name;
			var intr: string = this.copyInf.introduction ? this.copyInf.introduction : "";
			var desc: string = HtmlUtil.html("等级限制:", Color.Yellow, false);
			desc += HtmlUtil.html(this.copyInf.enterMinLevel + "级以上", Color.Yellow2, true);
			desc += HtmlUtil.html("活动说明:", Color.Yellow, false);
			desc += HtmlUtil.html(intr, Color.Yellow2, false);
			this.txt_news.text = desc;
			var rewardArr: ItemData[] = CommonUtils.configStrToArr(this.copyInf.reward);
			this.list_reward.data = rewardArr;
		}

	}
	
	protected getCurCopyCode():number{
		return CopyEnum.CopyExp;
	}
	protected getAddNumData():any{
		var data:any = {copyCode:CopyEnum.CopyExp};
		return data;
	}
	private onBtnClick(e: any): void {		
		var code: number = CopyEnum.CopyExp;		
		switch (e.target) {
			case this.btn_time:
				EventManager.dispatch(UIEventEnum.CopyExpClearCd);
				break;			
			case this.btn_single:
				this.enterCopyByModel(CopyEnum.ENTER_MODEL_SINGLE,CopyEnum.CopyExpSingle);
				break;			
		}

	}

	private enterCopyByModel(model: number,enterCode:number): void {
		if (this.copyInf) {
			var code: number = this.copyInf.code;
			var needPropNum: number = CopyUtils.getExpCopyItemCount(this.copyInf.needProp); 
			var leftNum: number = CacheManager.copy.getEnterLeftNum(this.copyInf);
			if (needPropNum > 0) {
				if (leftNum > 0) {
					EventManager.dispatch(UIEventEnum.CopyEnterModle, model, enterCode);
				} else {
					Alert.info("刷本次数不足，提升VIP可购买刷本次数");
				}
			} else {
				Alert.info("通行证不足");
			}
		}
	}



}