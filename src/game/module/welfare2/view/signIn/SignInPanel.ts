/**
 * 签到
 */
class SignInPanel extends BaseTabView {
    private rewardList: List;
    private rewardDaysList: List;
    private signBar: UIProgressBar;
    private rewardCfg: Array<any>;

    public constructor() {
        super();
    }

    public initOptUI(): void {
        this.rewardList = new List(this.getGObject("list_reward").asList);
        this.rewardDaysList = new List(this.getGObject("list_days").asList);

        this.signBar = this.getGObject("progressBar") as UIProgressBar;
        this.signBar.setStyle(URLManager.getCommonIcon("progressBar_4"), URLManager.getCommonIcon("bg_4"), 328, 20, 2, 2);
        this.signBar.labelType = BarLabelType.None;
        this.signBar.labelSize = 16;
    }

    public updateAll(): void {
        this.updateList();
        this.updateTotalSign();
    }

    public refreshPanel(): void{
        this.updateList();
        if(this.rewardCfg[this.rewardCfg.length - 1].accDay < CacheManager.welfare2.getSignRewardDay){
            this.updateTotalSign();
        }else{
            this.rewardDaysList.refresh();
            this.updateSignBar();
        }
    }

    /**更新本月签到情况 */
    public updateList(): void {
        let datas: Array<any> = ConfigManager.mgSignDay.getData();
        this.rewardList.data = datas; //不用虚拟列表，否则滚动到某个位置的函数会出问题
        this.rewardList.list.scrollToView(CacheManager.welfare2.currentSignDay);
    }

    private updateTotalSign(): void {
        // let signDays: number = CacheManager.welfare2.signDays;
        // let getRewardArr: Array<any> = CacheManager.welfare2.getSignRewardArr;
        let rewardData: any;
        let str: Array<string>;
        this.rewardCfg = [];
        let maxRewardDay: number = CacheManager.welfare2.hadGetAccDay;
        for (let i = 0; i < 5; i++) {
            // if (getRewardArr[i]) {
            //     rewardData = ConfigManager.mgSignMonth.getRewardData(getRewardArr[i], true);
            //     maxRewardDay = getRewardArr[i];
            // } else {
            //     rewardData = ConfigManager.mgSignMonth.getRewardData(maxRewardDay, false);
            //     maxRewardDay = rewardData.accDay + 1;
            // }
            rewardData = ConfigManager.mgSignMonth.getRewardData(maxRewardDay, false);
            maxRewardDay = rewardData.accDay + 1;
            this.rewardCfg.push(rewardData);
        }
        this.rewardDaysList.data = this.rewardCfg;
        this.updateSignBar();
    }

    private updateSignBar(): void{
        let signDays: number = CacheManager.welfare2.signDays;
        let firstDay: number = this.rewardCfg[0].accDay;
        let lastDay: number = this.rewardCfg[this.rewardCfg.length - 1].accDay;
        this.signBar.setValue(signDays - firstDay, lastDay - firstDay);
    }
}