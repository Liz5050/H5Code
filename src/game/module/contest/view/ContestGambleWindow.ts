class ContestGambleWindow extends BaseWindow {

    private item0: ContestGambleItem;
    private item1: ContestGambleItem;
    private numTxt: fairygui.GTextField;
    private minusBtn: fairygui.GButton;
    private addBtn: fairygui.GButton;
    private betBtn: fairygui.GButton;
    private _betNum: number;
    private lastSelectItem: ContestGambleItem;
    private maxBetNum: number;
    private pairInfo: any;
    private oddsTxt: fairygui.GRichTextField;
    private maxBtn: fairygui.GButton;

    public constructor() {
        super(PackNameEnum.Contest, "ContestGambleWindow");
    }

    public initOptUI(): void {
        this.item0 = this.getGObject("item_0") as ContestGambleItem;
        this.item0.addClickListener(this.onClick, this);
        this.item1 = this.getGObject("item_1") as ContestGambleItem;
        this.item1.addClickListener(this.onClick, this);
        this.numTxt = this.getGObject("txt_num").asTextField;
        this.oddsTxt = this.getGObject("txt_odds").asRichTextField;
        this.minusBtn = this.getGObject("btn_minus").asButton;
        this.minusBtn.addClickListener(this.onClick, this);
        this.addBtn = this.getGObject("btn_add").asButton;
        this.addBtn.addClickListener(this.onClick, this);
        this.betBtn = this.getGObject("btn_bet").asButton;
        this.betBtn.addClickListener(this.onClick, this);
        this.maxBtn = this.getGObject("btn_max").asButton;
        this.maxBtn.addClickListener(this.onClick, this);

        let betDate:any = ConfigManager.const.getByPk("ContestBetPercent");
        this.oddsTxt.text = HtmlUtil.colorSubstitude(LangContest.LANG21, betDate.constValue/100, betDate.constValueEx/100);
    }

    public updateAll(data:simple.ISContestPair): void {
        this.pairInfo = data;
        this.item0.update(this.pairInfo.player1, 0);
        this.selectItem(this.item0);
        this.item1.update(this.pairInfo.players2.data[0], 1);
        this.maxBetNum = Math.min(CacheManager.role.getMoney(EPriceUnit.EPriceUnitGold), ConfigManager.contest.getBetMax(CacheManager.contest.curRound));
        this.betNum = this.maxBetNum;
    }

    private onClick(e:egret.TouchEvent):void{
        let btn: any = e.target;
        switch (btn) {
            case this.minusBtn:
                let r:number;
                if (this._betNum > 0) {
                    r = this._betNum - 100;
                    if (r < 100) r = 100;
                    this.betNum = r;
                }
                break;
            case this.addBtn:
                r = this._betNum + 100;
                if (r > this.maxBetNum/**角色最大筹码*/) r = this.maxBetNum;
                this.betNum = r;
                break;
            case this.betBtn:
                if (this.betNum <= 0) {
                    // Tip.showTip(LangPeak.GAMBLE13);
                    if (!MoneyUtil.checkEnough(EPriceUnit.EPriceUnitGold, this.maxBetNum, true))
                        return;
                }
                let pairId:number = this.pairInfo.pairId_I;
                let betWin:boolean = this.lastSelectItem.name == 'item_0';
                EventManager.dispatch(LocalEventEnum.ContestReqBet, pairId, betWin, this.betNum);//下注
                this.hide();
                break;
            case this.maxBtn:
                this.betNum = this.maxBetNum;
                break;
            default:this.selectItem(btn as ContestGambleItem);break;
        }
    }

    get betNum(): number {
        return this._betNum;
    }

    set betNum(value: number) {
        if(this._betNum != value) {
            this._betNum = value;
            this.numTxt.text = value + "";
        }
    }

    private selectItem(item: ContestGambleItem) {
        this.lastSelectItem && (this.lastSelectItem.select = false);
        this.lastSelectItem = item;
        item.select = true;
    }

}