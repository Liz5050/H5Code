/**
 * 跨服组队副本结算界面
 * @author zhh
 * @time 2018-10-08 10:11:01
 */
class WindowCrossTeamResult extends BaseWindow {
    private c1:fairygui.Controller;
    private loaderResultBg:GLoader;
    private loaderStar:GLoader;
    private txtDiff:fairygui.GTextField;
    private txtTime:fairygui.GRichTextField;
    private btnReward:fairygui.GButton;
    private btnExit:fairygui.GButton;
    private listReward:List;
    protected closeEndTime:number;
    private retData:any;
    /**是否S通关 */
    private isStar:boolean = false;
    public constructor() {
        super(PackNameEnum.CopyResult,"WindowQCCopyResult")

    }
    public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderResultBg = <GLoader>this.getGObject("loader_result_Bg");
        this.loaderStar = <GLoader>this.getGObject("loader_star");
        this.txtDiff = this.getGObject("txt_diff").asTextField;
        this.txtTime = this.getGObject("txt_time").asRichTextField;
        this.btnReward = this.getGObject("btn_reward").asButton;
        this.btnExit = this.getGObject("btn_exit").asButton;
        this.listReward = new List(this.getGObject("list_reward").asList);

        this.btnReward.addClickListener(this.onGUIBtnClick, this);
        this.btnExit.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.loaderResultBg.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));

    }

    public updateAll(data?:any):void{
        this.retData = data;
        let retData:any = data.data;
        let rewardItems:any = retData.rewardItems;
        let rewardMoneys:any = retData.rewardMoneys;
        let rewards:ItemData[] = [];

        rewards = rewards.concat(RewardUtil.getRewardByMoneyDic(rewardMoneys));
        if (retData.rewardExp_L64>0) rewards.push(RewardUtil.fmtReward(ETaskRewardType.Exp, 0, retData.rewardExp_L64));

        if (rewardItems && rewardItems.key_I.length > 0 && rewardItems.value_I.length > 0) {
            for (var i: number = 0; i < rewardItems.key_I.length; i++) {
                let count:number = rewardItems.value_I[i];
                var idata: ItemData = new ItemData(rewardItems.key_I[i]);
                idata.itemAmount = count;
                rewards.push(idata);
            }
        }
        this.listReward.setVirtual(rewards);
        this.loaderStar.load(ConfigManager.copy.getCopyStarUrl(retData.passStar_SH));
        this.txtTime.text = "消耗时间："+HtmlUtil.html(App.DateUtils.formatDate(retData.passTime_I,DateUtils.FORMAT_MM_SS),"#09c73d");
        let idx:number = 0;
        this.isStar = retData.passStar_SH==3;
        if(!this.isStar){
            let info:any = ConfigManager.team.getCopyStarInf(retData.copyCode_I);
            // idx = 1;
            this.txtDiff.text = `(距离S只差${retData.passTime_I - info['star3Time']}秒)`;
        }
        this.c1.setSelectedIndex(2);

    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnReward:
                this.hide();
                break;
            case this.btnExit:
                this.hide();
                break;

        }

    }

    public onShow(data?:any):void{
        super.onShow(data);
        let sec:number = 10;
        if(data && data.data){
            let resultInfo:any = data.data;
            let isDelagate:boolean = data.isDelagate;
            var copyCode:number = isDelagate?resultInfo.copyCode:resultInfo.copyCode_I;
            let copyInfo:any = ConfigManager.copy.getByPk(copyCode);
            var isSuccess:boolean = resultInfo.isSuccess_B;
            this.isStar = data.data.passStar_SH==3;
            // if(this.isStar){
                sec = CopyUtils.getCopyResultSec(copyInfo,isSuccess);
            // }else{
            //     sec = 5*60; //非S通关 固定5分钟
            // }

        }
        this.closeEndTime = sec;
        App.TimerManager.remove(this.onTimerRun,this);
        App.TimerManager.doTimer(1000,0,this.onTimerRun,this);
        this.onTimerRun();
    }

    public onHide():void{
        super.onHide();
        this.isStar = false;
        this.closeEndTime = 0;
        App.TimerManager.remove(this.onTimerRun,this);
        if(CacheManager.copy.isInCopy && CacheManager.copy.isInCopyByCode(this.retData.data.copyCode_I)){
            EventManager.dispatch(LocalEventEnum.CopyReqExit);
        }
        // let ln:number = CacheManager.copy.getEnterLeftNum(CopyEnum.CopyQC);
        // if(ln>0){
        //     egret.setTimeout(()=>{
        //         HomeUtil.open(ModuleEnum.QiongCang,false,{tabType:PanelTabType.QiongCangCopy});
        //     },this,100);
        //
        // }

    }
    protected onTimerRun():void{
        var leftSec:number = this.calLeftSec();
        // if(this.isStar){
            this.btnReward.text = `领取奖励(${HtmlUtil.colorSubstitude(LangCommon.L48, leftSec)})`;
        // }else{
        //     this.btnReward.text = `领取奖励`;
        // }

        if(leftSec<=0){
            this.hide();
        }
    }
    protected calLeftSec():number{
        var leftSec:number = this.closeEndTime;
        this.closeEndTime--;
        return leftSec;
    }
}