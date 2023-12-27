class TimeLimitBossResult extends BaseWindow {
	private c1:fairygui.Controller;
	private txt_killTime:fairygui.GRichTextField;
	// private baseItem:BaseItem;
	private list_item:List;

	private txtRanks:fairygui.GTextField[][];
	private txt_killer:fairygui.GTextField;
	private killTimeStr:string;

	private timeTxt:fairygui.GRichTextField;

	private leftTime:number;
	private curTime:number;
	public constructor() {
		super(PackNameEnum.CopyResult,"TimeLimitBossResult");
	}

	public initOptUI():void {
		let loader:GLoader = this.getGObject("loader_bg") as GLoader;
		loader.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));
		this.c1 = this.getController("c1");
		this.txt_killTime = this.getGObject("txt_killTime").asRichTextField;
		this.txtRanks = [];
		for(let i:number = 0; i < 3; i++) {
			let txtName:fairygui.GTextField = this.getGObject("txt_name_" + i).asTextField;
			let txtScore:fairygui.GTextField = this.getGObject("txt_score_" + i).asTextField;
			this.txtRanks.push([txtName,txtScore]);
		}
		this.txt_killer = this.getGObject("txt_killer").asTextField;
		this.killTimeStr = HtmlUtil.html("击杀BOSS耗时：","#f2e1c0");
		// this.baseItem = this.getGObject("baseItem") as BaseItem;
		this.list_item = new List(this.getGObject("list_item").asList);
		this.timeTxt = this.getGObject("timeTxt").asRichTextField;		
		this.closeObj.visible = true;
	}

	public updateAll(data:any):void {
		// 	optional int32 bossCode_I = 1;
    // optional string bossName_S = 2;
    // optional int32 useTime_I = 3;
    // optional SeqSPeaceFieldHurt hurtList = 4;
    // optional SeqReward rewards = 5;
		let hurtList:any[] = data.hurtList.data;
		let killer:any;
		if(hurtList) {
			for(let i:number = 0; i < hurtList.length; i++) {
				if(i > 2) break;
				this.txtRanks[i][0].text = hurtList[i].name_S;
				this.txtRanks[i][1].text = App.MathUtils.formatNum64(hurtList[i].hurt_L64,false);
			}
		}
		this.txt_killer.text = "虚位以待";
		if(data.useTime_I <= 0) {
			this.txt_killTime.text = "击杀失败，混沌帝江逃窜到各地继续作恶";
		}
		else {
			this.txt_killTime.text = this.killTimeStr + App.DateUtils.getTimeStrBySeconds(data.useTime_I,DateUtils.FORMAT_5);
			if(hurtList && hurtList.length > 1) {
				killer = hurtList.pop();
				this.txt_killer.text = killer.name_S;
			}
		}
		this.c1.selectedIndex = hurtList.length;

		let rewards:any[] = data.rewards.data;
		let itemData:ItemData[] = [];
		if(rewards && rewards.length > 0) {
			for(let i:number = 0; i < rewards.length; i ++) {
				itemData.push(RewardUtil.getRewardBySReward(rewards[i]));
			}
		}
		this.list_item.data = itemData;
		if(itemData.length > 0) this.list_item.scrollToView(0);

		this.leftTime = 20;
		this.curTime = egret.getTimer();
		this.timeTxt.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green2) + "后自动关闭)";
		if(!App.TimerManager.isExists(this.onTimeUpdate,this)){
			App.TimerManager.doTimer(1000,0,this.onTimeUpdate,this);
		}
	}

	private onTimeUpdate():void {
		let time:number = egret.getTimer();
		this.leftTime -= Math.round((time - this.curTime)/1000);
		if(this.leftTime < 0) {
			this.hide();
			return;
		}
		this.timeTxt.text = "(" + HtmlUtil.html(this.leftTime + "秒",Color.Green2) + "后自动关闭)";
		this.curTime = time;
	}

	public hide():void {
		App.TimerManager.remove(this.onTimeUpdate,this);
		this.leftTime = 20;
		super.hide();
	}
}