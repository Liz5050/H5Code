class PeakGambleWindow extends BaseWindow {

    private item0: PeakGamblePlayerItem;
    private item1: PeakGamblePlayerItem;
    private numTxt: fairygui.GTextField;
    private minusBtn: fairygui.GButton;
    private addBtn: fairygui.GButton;
    private betBtn: fairygui.GButton;
    private pairInfo: any;
    private _betNum:number;
    private lastSelectItem: PeakGamblePlayerItem;
    private maxBetNum: number;

    public constructor() {
        super(PackNameEnum.Peak, "PeakGambleWindow");
    }

    public initOptUI(): void {
        this.item0 = this.getGObject("item_0") as PeakGamblePlayerItem;
        this.item0.addClickListener(this.onClick, this);
        this.item1 = this.getGObject("item_1") as PeakGamblePlayerItem;
        this.item1.addClickListener(this.onClick, this);
        this.numTxt = this.getGObject("txt_num").asTextField;
        this.minusBtn = this.getGObject("btn_minus").asButton;
        this.minusBtn.addClickListener(this.onClick, this);
        this.addBtn = this.getGObject("btn_add").asButton;
        this.addBtn.addClickListener(this.onClick, this);
        this.betBtn = this.getGObject("btn_bet").asButton;
        this.betBtn.addClickListener(this.onClick, this);
    }

    public updateAll(data?:any): void {
        this.pairInfo = data;
        this.item0.update(this.pairInfo.player1);
        this.selectItem(this.item0);
        this.item1.update(this.pairInfo.player2);
        this.maxBetNum = Math.min(CacheManager.role.getMoney(EPriceUnit.EPriceUnitJeton), ConfigManager.peak.getBetMaxNum(CacheManager.peak.curState));
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
                    Tip.showTip(LangPeak.GAMBLE13);
                    return;
                }
                let pairId:number = this.pairInfo.pairId_I;
                let betNO:number = Number(this.lastSelectItem.name.split("_")[1]) + 1;
                EventManager.dispatch(LocalEventEnum.PeakBet, pairId, betNO, this.betNum);//下注
                this.hide();
                break;
            default:this.selectItem(btn as PeakGamblePlayerItem);break;
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

    private selectItem(item: PeakGamblePlayerItem) {
        this.lastSelectItem && (this.lastSelectItem.select = false);
        this.lastSelectItem = item;
        item.select = true;
    }
}