class EncounterPlayerItem extends ListRenderer {
    private headIcon: GLoader;
    private nameTxt: fairygui.GTextField;
    private lvTxt: fairygui.GTextField;
    private challengeBtn: fairygui.GButton;
    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);

        this.headIcon = this.getChild("icon_head") as GLoader;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.lvTxt = this.getChild("txt_lv").asTextField;
        this.challengeBtn = this.getChild("btn_challenge").asButton;
        this.challengeBtn.addClickListener(this.onClickChallenge, this);
    }

    /**
     *
     * @param data:SEncounterPlayer
     */
    public setData(data: any, index:number): void {
        this._data = data;
        this.itemIndex = index;
        this.headIcon.load(URLManager.getPlayerHead(data.career_I));
        let debugFlag:string = "";
        if (App.DebugUtils.isDebug) {
            debugFlag = EntityUtil.isMainPlayerOther(data.entityId) >= 0 ? "##R" : "";
        }
        this.nameTxt.text = data.name_S + debugFlag;
        this.lvTxt.text = data.roleState_I ? `${data.roleState_I}转${data.level_I}级` : `${data.level_I}级`;
        this.challengeBtn.text = !data.fighting_B ? LangArena.LANG31 : LangArena.LANG32;
    }

    public getChallengeBtn(): fairygui.GButton {
        return this.challengeBtn;
    }

    private onClickChallenge() {
        if(CacheManager.map.isInMainCity) {
            Tip.showTip(LangArena.L48);
            return;
        }
        if(!ItemsUtil.checkSmeltTips()){
            let pkScore:number = CacheManager.encounter.info.pkScore_I;
            if (pkScore > EncounterCache.FULL_PK_SCORE - 1) {
                let eliminateScore:number = pkScore - EncounterCache.FULL_PK_SCORE + 1;
                AlertII.show(App.StringUtils.substitude(LangArena.LANG22, pkScore, eliminateScore * 4, eliminateScore), null, this.onAlert, this);
                return;
            }
            if (CacheManager.copy.isInCopyByType(ECopyType.ECopyEncounter)) {
                Tip.showTip(LangArena.LANG33, Color.Red);
                return;
            }
            EventManager.dispatch(LocalEventEnum.ReqEncounterChallenge, this._data.entityId, this.itemIndex);
        }
    }

    private onAlert(type: AlertType) {
        if (type == AlertType.YES) {
            // let pkScore:number = CacheManager.encounter.info.pkScore_I;
            // let eliminateScore:number = pkScore - EncounterCache.FULL_PK_SCORE + 1;
            ProxyManager.arena.encounterClearPk(this.itemIndex);
        }
    }
}