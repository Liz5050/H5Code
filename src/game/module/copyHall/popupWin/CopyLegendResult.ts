class CopyLegendResult extends BaseWindow {
    private c1:fairygui.Controller;

    private leftTime:number;
    private itemList: List;
    private getBtn: fairygui.GButton;
    private assistList: List;
    private c2: fairygui.Controller;
    private nonCapCdTxt: fairygui.GTextField;
    private killerList: List;

    public constructor() {
        super(PackNameEnum.CopyResult,"WindowLegendResult");
    }

    public initOptUI():void {
        let loader:GLoader = this.getGObject("loader_bg") as GLoader;
        loader.load(URLManager.getModuleImgUrl("copy_result_win.png",PackNameEnum.Copy));
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.killerList = new List(this.getGObject("list_kill").asList);
        this.assistList = new List(this.getGObject("list_assist").asList);
        this.itemList = new List(this.getGObject("list_item").asList);
        this.getBtn = this.getGObject("btn_get").asButton;
        this.getBtn.addClickListener(this.onNextHandler, this);
        this.nonCapCdTxt = this.getGObject("txt_cd").asTextField;
        this.closeObj.visible = true;
    }

    public updateAll(data:any):void {
        let result:any = data.data;
        this.killerList.data = result.rewardPlayers.data;//暂时显示一个挑战者
        this.c1.selectedIndex = result.assistPlayers.data && result.assistPlayers.data.length ? 1 : 0;
        this.assistList.data = result.assistPlayers.data;

        if (CacheManager.team.captainIsMe) {
            let code:number = CopyUtils.getFirstStarNoFullCopyCode(CopyEnum.CopyLegend, ECopyType.ECopyLegend);
            if (code > 0) this.c2.selectedIndex = 1;
            else this.c2.selectedIndex = 2;
        } else {
            this.c2.selectedIndex = 0;
        }

        let rewardItems:any = result.rewardItems;
        let itemDatas: Array<ItemData> = [];
        if (rewardItems.key_I.length > 0 && rewardItems.value_I.length > 0) {
            for (let i: number = 0; i < rewardItems.key_I.length; i++) {
                let count:number = rewardItems.value_I[i];
                let idata: ItemData = new ItemData(rewardItems.key_I[i]);
                idata.itemAmount = count;
                itemDatas.push(idata);
            }
        }
        this.itemList.data = itemDatas;

        this.leftTime = 5;
        this.onTimeUpdate();
        App.TimerManager.doTimer(1000,0,this.onTimeUpdate,this);
    }

    private onTimeUpdate():void {
        this.leftTime--;
        if(this.leftTime <= 0) {
            this.onCloseHandler();
            return;
        }
        let str:string = App.StringUtils.substitude(LangLegend.LANG21 + (this.leftTime > 0 ? LangLegend.LANG22 : ""), this.leftTime);
        if (this.c2.selectedIndex == 1)
            (this.closeObj as fairygui.GButton).text = str;
        else
            this.nonCapCdTxt.text = App.StringUtils.substitude(LangLegend.LANG23, this.leftTime);
    }

    protected onNextHandler() {
        let code:number = CopyUtils.getFirstStarNoFullCopyCode(CopyEnum.CopyLegend, ECopyType.ECopyLegend);
        if (code > 0) {
            let copyTarget: any = CacheManager.team.getCopyTarget(ConfigManager.copy.getByPk(code));
            if (!CacheManager.team.hasTeam) {
                this.onCloseHandler();
            } else {//组队打下一关的target
                EventManager.dispatch(LocalEventEnum.TeamTargetChange, copyTarget.type, copyTarget.targetValue, copyTarget.enterMinLevel, copyTarget.enterMaxLevel, false);
                CopyUtils.teamEnter(copyTarget.targetValue);
                this.hide();
            }
        } else {
            this.onCloseHandler();
        }
    }

    protected onCloseHandler():void {
        super.onCloseHandler();
        EventManager.dispatch(LocalEventEnum.CopyReqExit, false);
    }

    public hide():void {
        App.TimerManager.remove(this.onTimeUpdate,this);
        super.hide();
    }
}