/**
 * 守护仙盟结算
 * @author zhh
 * @time 2019-01-10 14:58:24
 */
class WindowGuildDefendResult extends CopyResultBaseWin {
    private loaderBg2:GLoader;
    private loaderTitle:GLoader;
    private txtMyExp:fairygui.GTextField;
    private txtMyAdd:fairygui.GTextField;
    private txtMyPoint:fairygui.GTextField;
    private txtTotal:fairygui.GTextField;
    private txtCoin:fairygui.GTextField;
    private listRank:List;

	public constructor() {
		super("WindowGuildDefendResult",PackNameEnum.CopyResult);
        this.isShowCloseObj = true;

	}
	public initOptUI():void{
        //---- script make start ----
        this.loaderBg2 = <GLoader>this.getGObject("loader_bg");
        this.loaderTitle = <GLoader>this.getGObject("loader_title");
        this.txtMyExp = this.getGObject("txt_myExp").asTextField;
        this.txtMyAdd = this.getGObject("txt_myAdd").asTextField;
        this.txtMyPoint = this.getGObject("txt_myPoint").asTextField;
        this.txtTotal = this.getGObject("txt_total").asTextField;
        this.txtCoin = this.getGObject("txt_coin").asTextField;
        this.listRank = new List(this.getGObject("list_rank").asList);

        //---- script make end ----
        this.loaderBg2.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));
        this.loaderTitle.load(URLManager.getModuleImgUrl("title_guild_defend.png",PackNameEnum.Copy));
	}

	public updateAll(data?:any):void{
		//SMgGuildDefenseRewardInfo
        this.txtMyExp.text = App.MathUtils.formatNum2(data.killBossExp_L64);
        this.txtMyAdd.text = App.MathUtils.formatNum2(data.aliveExp_L64);
        this.txtMyPoint.text = App.MathUtils.formatNum2(data.starExp_L64);
        this.txtTotal.text = App.MathUtils.formatNum2(data.totalExp_L64);
        this.txtCoin.text = App.MathUtils.formatNum2(data.totalCoin_L64);
        this.listRank.setVirtual(data.ranks.data);
	}
    protected getCloseEndTime(data):number{
		let sec:number = this.CLOSE_TIME;
		if(data){			
			let isSuccess:boolean = data.success_B;
            let copyInfo:any = ConfigManager.copy.getByPk(CopyEnum.GuildDefend);
            let s:number = CopyUtils.getCopyResultSec(copyInfo,isSuccess);		
            s>0?sec =s:null;	
		}        
		return sec;
	}
    protected setCloseBtnText(leftSec:number):void{
        if(this.closeObj){
            this.closeObj.text = `确  定(${HtmlUtil.colorSubstitude(LangCommon.L48, leftSec)})`;
        }
        
	}
    protected calLeftSec():number{		
		var leftSec:number = this.closeEndTime;
		//this.txt_tips.text = `<font size='22' color='${Color.Green}'>(${App.DateUtils.timeToLongStr(leftSec)}秒后自动关闭)</font>`;
		this.setCloseBtnText(leftSec);
		this.closeEndTime--;
		return leftSec;
	}
    public hide(param: any = null, callBack: CallBack = null):void{
        super.hide(param,callBack);
        if(CacheManager.copy.isInCopyByCode(CopyEnum.GuildDefend)){
		 	EventManager.dispatch(LocalEventEnum.CopyReqExit);
		}
    }


}