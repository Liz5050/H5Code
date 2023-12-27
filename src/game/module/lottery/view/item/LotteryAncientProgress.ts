class LotteryAncientProgress extends fairygui.GComponent{
    private pgBar: UIProgressBar;
    private rewardBoxes: LotteryAncientBox[]=[];
    public constructor(){
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.pgBar = this.getChild("progressBar") as UIProgressBar;
        this.pgBar.setStyle(URLManager.getCommonIcon("progressBar_4"), URLManager.getCommonIcon("bg_6"), 530, 32, 2, 4);
        this.pgBar.labelType = BarLabelType.None;

        let rewardCfgs:any[] = ConfigManager.lotteryReward.getRewardByLotteryCategory(LotteryCategoryEnum.LotteryAncient);
        if (rewardCfgs)
            for(let i:number = 0; i < rewardCfgs.length; i++) {
                let box:LotteryAncientBox = this.getChild("ancient_box" + (i+1)) as LotteryAncientBox;
                if (!box) continue;
                box.updateAll(rewardCfgs[i]);
                this.rewardBoxes.push(box);
            }
    }

    setValue(info:any) {
        let times:number = info ? info.times : 0;
        let boxCfg:any;
        let box:LotteryAncientBox;
        let blocks:number = this.rewardBoxes.length;
        let isSetProgress:boolean;
        for (let i=0;i<blocks;i++) {
            box = this.rewardBoxes[i];
            box.updateInfo(info);
            boxCfg = box.boxData;

            if (!isSetProgress && times <= boxCfg.lotteryTimes) {
                let preCfg:any = this.rewardBoxes[i-1]&&this.rewardBoxes[i-1].boxData;
                let inter:number = preCfg ? boxCfg.lotteryTimes - preCfg.lotteryTimes : boxCfg.lotteryTimes;
                let fakeTotal:number = inter * blocks;
                let fakeTimes:number = preCfg ? inter * i + times - preCfg.lotteryTimes : times;
                this.pgBar.setValue(fakeTimes, fakeTotal);
                isSetProgress = true;
            }
        }
    }
}

class LotteryAncientBox extends fairygui.GComponent{
    private timeTxt: fairygui.GTextField;
    private c1: fairygui.Controller;
    private time: number;
    public boxData: any;
    private info: any;
    public constructor(){
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.timeTxt = this.getChild("txt_time").asTextField;
        this.addClickListener(this.onClickHandler,this);
    }

    public updateInfo(info:any):void {

        let hadGetList:number[] = [];
        let times:number = 0;
        this.info = info;
        if(info) {
            hadGetList = info.hadGetRewards.data_I;
            times = info.times;
        }
        this.c1.selectedIndex = times < this.time ? 0 : 1;
        CommonUtils.setBtnTips(this,false);
        if(hadGetList.indexOf(this.boxData.lotteryTimes) != -1) {
            //已领取
            this.c1.selectedIndex = 0;
            this.timeTxt.text = "已领取";
            this.timeTxt.color = 0x0df14b;
        }
        else {
            if(times >= this.boxData.lotteryTimes) {
                //可领取
                this.c1.selectedIndex = 1;
                this.timeTxt.text = "可领取";
                this.timeTxt.color = 0x0df14b;
                CommonUtils.setBtnTips(this,true);
            }
            else {
                //不可领
                this.c1.selectedIndex = 0;
                this.timeTxt.text = this.boxData.lotteryTimes + "次";
                this.timeTxt.color = 0xf2e1c0;
            }
        }
    }

    updateAll(data: any) {
        this.boxData = data;
        // this.time = data.lotteryTimes;
        // this.timeTxt.text = App.StringUtils.substitude(LangLottery.LANG2, data.lotteryTimes);
    }

    private onClickHandler() {
        if(this.c1.selectedIndex != 1) {
            EventManager.dispatch(UIEventEnum.LotteryNumRewardOpen,{cfg:this.boxData,info:this.info});
            return;
        }
        EventManager.dispatch(LocalEventEnum.LotteryGetCountReward,this.boxData.type,this.boxData.lotteryTimes);
    }
}