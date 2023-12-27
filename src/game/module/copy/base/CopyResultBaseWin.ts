class CopyResultBaseWin extends BaseResultRewardWin {
	public static Cindex_Normal:number = 0;//通用副本
	public static Cindex_Tower:number = 1;//诛仙塔
	protected CLOSE_TIME:number = 10;

	protected btn_toBoss:fairygui.GButton;
	protected btn_recharge:fairygui.GButton;
	protected btn_tofaqi:fairygui.GButton;
	protected btn_torefine:fairygui.GButton;
	protected btn_txt:fairygui.GButton;

	/**符文资源 */
	//protected txt_hj:fairygui.GTextField;
	/**符文经验 */
	protected txt_runeExp:fairygui.GTextField;

	protected txt_tips:fairygui.GRichTextField;
	protected txt_exp:fairygui.GRichTextField;
	protected closeEndTime:number;	
	protected c1:fairygui.Controller;
	protected txt_noReward:fairygui.GTextField;
	protected loaderBg:GLoader;
	protected retData:any;
    private timeIdx: number;
	public constructor(contentName:string,packName:string=PackNameEnum.Copy) {
		super(packName,contentName,null,LayerManager.UI_Popup);
		this.isPopup = false;
	}

	public initOptUI():void{		
		this.txt_tips = this.getGObject("txt_tips").asRichTextField;
		this.txt_tips.visible = false;
		this.c1 = this.getController("c1");
		let com:fairygui.GObject = this.getGObject("txt_noReward");
		if(com) {
			this.txt_noReward = com.asTextField;
		}
		this.loaderBg = <GLoader>this.frame.getChild("loader_result_Bg");
		
	}

	public updateAll(data?:any):void{
		this.retData = data;
		var isDelagate:boolean = data.isDelagate;
		if(this.txt_noReward) {
			this.txt_noReward.visible = false;
		}
		if(isDelagate){
			this.updateByDelegate(data.data);
		}else{
			this.updateResult(data.data);
		}		
		
	}

	protected updateByDelegate(data:any):void{
		
	}

	protected updateResult(data:any):void{
		var isSuccess:boolean = data.isSuccess_B;
		var rewardItems:any = data.rewardItems;
		var rewardMoneys:any = data.rewardMoneys;
		var rewardExp_L64:any = data.rewardExp_L64;
		this.txt_exp.text = ""+App.MathUtils.formatNum64(rewardExp_L64,false);		
		var copyCode:number = data.copyCode_I;
		var copyType:number = ConfigManager.copy.getCopyType(copyCode);
		
		if(isSuccess && copyType==ECopyType.ECopyMgPersonalBoss){
			this.c1.setSelectedIndex(3);
			this.closeObj.visible = true;	
		}else{
			if(copyType==ECopyType.ECopyMgRune){ //诛仙塔
				this.c1.setSelectedIndex(1);
				this.closeObj.visible = !isSuccess; //失败依然用失败界面
			}else{
				this.c1.setSelectedIndex(0);			
				this.closeObj.visible = true;
			}
		}
		
		
	}

	public onShow(data?:any):void{
		super.onShow(data);		
			
		this.closeEndTime = this.getCloseEndTime(data);
		// App.TimerManager.remove(this.onTimerRun,this);
		// App.TimerManager.doTimer(1000,0,this.onTimerRun,this);
		this.timeIdx = egret.setInterval(this.onTimerRun, this, 1000);
		this.onTimerRun();
	}
	
	protected getCloseEndTime(data):number{
		let sec:number = this.CLOSE_TIME;
		if(data && data.data){
			let resultInfo:any = data.data;
			let isDelagate:boolean = data.isDelagate;
			var copyCode:number = isDelagate?resultInfo.copyCode:resultInfo.copyCode_I;
			let copyInfo:any = ConfigManager.copy.getByPk(copyCode);
			var isSuccess:boolean = resultInfo.isSuccess_B;
			sec = CopyUtils.getCopyResultSec(copyInfo,isSuccess);
			sec==0?sec = this.CLOSE_TIME:null;
		}
		return sec;
	}

	public onHide():void{
		super.onHide();
		this.closeEndTime = 0;
		// App.TimerManager.remove(this.onTimerRun,this);
		egret.clearInterval(this.timeIdx);
        this.timeIdx = -1;
	}

	protected onTimerRun():void{
		var leftSec:number = this.calLeftSec();
		if(leftSec<=0){
			this.hide();			
		}
	}
	protected calLeftSec():number{		
		var leftSec:number = this.closeEndTime;
		this.txt_tips.text = `<font size='22' color='${Color.Green}'>(${App.DateUtils.timeToLongStr(leftSec)}秒后自动关闭)</font>`;
		this.setCloseBtnText(leftSec);
		this.closeEndTime--;
		return leftSec;
	}
	protected setCloseBtnText(leftSec:number):void{

	}
	
	

}