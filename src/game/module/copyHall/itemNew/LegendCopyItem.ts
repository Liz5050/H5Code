/**
 * 传奇之路副本项
 * @author Chris
 */
class LegendCopyItem extends ListRenderer {
    private c1: fairygui.Controller;
    private bgLoader: GLoader;
    private lookupBtn: fairygui.GButton;
    private descTxt: fairygui.GTextField;
    private itemList: List;
    private challengeBtn: fairygui.GButton;
    private bossHeadLoader: GLoader;
    private bossNameTxt: fairygui.GTextField;
    private c2: fairygui.Controller;
    private star: number;
    private c3: fairygui.Controller;

    public constructor() {
        super();

    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.c3 = this.getController("c3");
        this.bgLoader = this.getChild("loader_bg") as GLoader;
        this.lookupBtn = this.getChild("btn_lookup").asButton;
        this.lookupBtn.addClickListener(this.onLookup, this);
        this.descTxt = this.getChild("txt_desc").asTextField;
        this.itemList = new List(this.getChild("list_item").asList);
        this.challengeBtn = this.getChild("btn_challenge").asButton;
        this.challengeBtn.addClickListener(this.onClickChallenge, this);
        this.bossHeadLoader = this.getChild("loader_head") as GLoader;
        this.bossNameTxt = this.getChild("txt_boss_name").asTextField;

    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.star = CacheManager.copy.getCopyStar(CopyEnum.CopyLegend, data.code);
        let isFirstNoFull:boolean = CopyUtils.getFirstStarNoFullCopyCode(CopyEnum.CopyLegend, ECopyType.ECopyLegend) == data.code;
        this.c1.selectedIndex = this.star >= 3 || isFirstNoFull ? 1 : 0;
        this.c3.selectedIndex = this.star >= 3 ? 1 : 0;
        CommonUtils.setBtnTips(this.challengeBtn, isFirstNoFull);
        this.itemIndex = index;
        //更新上方数据
        this.descTxt.text = HtmlUtil.br(data.introduction);
        if (CopyHallLegendPanel.showDatas.indexOf(data) == -1) {
            this.c2.selectedIndex = 0;
            this.height = 184;
        } else {
            this.c2.selectedIndex = 1;
            this.height = 383;
            //更新下方数据
            let rewards:ItemData[] = RewardUtil.getStandeRewards(data.reward);
            this.itemList.data = rewards;

            let strategyInf:any[] = ConfigManager.copyLegend.getListByCode(data.code);
            if (strategyInf && strategyInf.length) {
                let bossInf:any = ConfigManager.boss.getByPk(strategyInf[strategyInf.length - 1].bossCode);
                if (bossInf) {
                    let modelId:string = ConfigManager.boss.getAvatarId(bossInf.code);
                    this.bossHeadLoader.load(URLManager.getIconUrl(modelId, URLManager.AVATAR_ICON));
                    this.bossNameTxt.text = bossInf.name;
                }
            }
        }
        this.bgLoader.load(URLManager.getModuleImgUrl("copy_" + data.code+ ".jpg", PackNameEnum.CopyLengend));
    }

    private onClickChallenge(evt:egret.TouchEvent) {
        if(CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)) {
            Tip.showTip(LangCheckPoint.LANG1);
            return;
        }
        evt.stopImmediatePropagation();
        if (this.star >= 3) {
            Tip.showTip(LangLegend.LANG2);
        } else {
            let preCode:number = this._data.code - 10000;
            if (preCode < 0) {
                EventManager.dispatch(LocalEventEnum.CreateTeam, CacheManager.team.getCopyTarget(this._data));
            } else {
                let preStar:number = CacheManager.copy.getCopyStar(CopyEnum.CopyLegend, preCode);
                if (preStar >= 3) {
                    EventManager.dispatch(LocalEventEnum.CreateTeam, CacheManager.team.getCopyTarget(this._data));
                } else {
                    let preCopy:any = ConfigManager.copy.getByPk(preCode);
                    Tip.showTip(App.StringUtils.substitude(LangLegend.LANG3, preCopy.name));
                }
            }
        }
    }

    public isShow() {
        return this.c2.selectedIndex == 1;
    }

    private onLookup(evt:egret.TouchEvent) {
        evt.stopImmediatePropagation();
        EventManager.dispatch(UIEventEnum.CopyLegendStrategedOpen, this._data.code);
    }
}