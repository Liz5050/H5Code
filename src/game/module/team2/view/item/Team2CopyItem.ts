class Team2CopyItem extends ListRenderer {
    private c1: fairygui.Controller;//0通关1首通
    private nameTxt: fairygui.GTextField;
    private headIcon: GLoader;
    private c2: fairygui.Controller;//0未选中1选中
    private condTxt: fairygui.GRichTextField;
    private star_loader : GLoader;
    private bg_loader : GLoader;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.c1 = this.getController('c1');
        this.c2 = this.getController('c2');
        this.headIcon = this.getChild("loader_head") as GLoader;
        this.nameTxt = this.getChild("txt_name").asTextField;
        this.condTxt = this.getChild("text_lvl").asRichTextField;
        this.star_loader = <GLoader>this.getChild("loader_star");
        this.bg_loader = <GLoader>this.getChild("loader_bg");
    }

    public setData(data: any, index: number): void {
        this._data = data;
        this.itemIndex = index;

        this.nameTxt.text = data.name;
        // let rewards:ItemData[] = RewardUtil.getStandeRewards(data.reward);
        // this.itemList.data = rewards;
        this.bg_loader.load(URLManager.getModuleImgUrl(data.code+"_bg.jpg",PackNameEnum.Team));
        this.headIcon.load(URLManager.getModuleImgUrl(data.code+".png",PackNameEnum.Team));

        this.c1.selectedIndex = 1;
        this.c2.selectedIndex = 0;
        if(this.CheckCopyHasS(data.code)) {
            this.c1.selectedIndex = 0;
        }
        else {
            var next = ConfigManager.copy.getLastTeamCopy(data.code);
            if(next&& next!=null) {
                if(!this.CheckCopyHasS(next.code)||(!this.canCopy(data))) {
                    this.c1.selectedIndex = 2;
                }
            }
        }

        if (this.c1.selectedIndex == 0 || this.c1.selectedIndex == 1 ) {
            this.setStar(data.code);
        }
        else if( this.c1.selectedIndex == 2 ) {
             this.condTxt.text = App.StringUtils.substitude(LangTeam2.LANG13,
                    data.enterMinRoleState > 0 ? data.enterMinRoleState + LangTeam2.LANG8  : data.enterMinLevel + LangTeam2.LANG9 );
        } else {
            if (!this.canCopy(data)) {
                this.c1.selectedIndex = 2;
                this.condTxt.text = App.StringUtils.substitude(LangTeam2.LANG13,
                    data.enterMinRoleState > 0 ? data.enterMinRoleState + LangTeam2.LANG8  : data.enterMinLevel + LangTeam2.LANG9);
            }
        }

        this.setSelect(data.code == Team2Panel.curSelectCode);
    }

    private canCopy(copy:any):boolean {
        let roleLevel:number = CacheManager.role.getRoleLevel();
        let roleState:number = CacheManager.role.getRoleState();
        if (copy.enterMinRoleState ) {
            if (copy.enterMinRoleState <= roleState) return true;
        } else if (copy.enterMinLevel <= roleLevel) {
            return true;
        }
        return false;
    }

    public setSelect(value:boolean):void {
        this.c2.selectedIndex = value ? 1 : 0;
    }

    private onClickKick() {

    }

    private onClickJoin() {

    }
    //检查是否有S级评价
    private CheckCopyHasS(code : number) : boolean {
        let pCopy:any = CacheManager.copy.getPlayerCopyInf(CopyEnum.CopyCrossTeam);
        if (pCopy) {
            if (pCopy.starDict && pCopy.starDict.key_I) {
                let copyCode:number;
                for (let i = 0; i < pCopy.starDict.key_I.length; i++) {
                    copyCode = pCopy.starDict.key_I[i];
                    if (copyCode == code && pCopy.starDict.value_I[i] == 3) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private setStar(code : number) {
        let pCopy:any = CacheManager.copy.getPlayerCopyInf(CopyEnum.CopyCrossTeam);
        if (pCopy) {
            if (pCopy.starDict && pCopy.starDict.key_I) {
                let copyCode:number;
                for (let i = 0; i < pCopy.starDict.key_I.length; i++) {
                    copyCode = pCopy.starDict.key_I[i];
                    if (copyCode == code ) {
                        this.star_loader.load(ConfigManager.copy.getCopyStarUrl(pCopy.starDict.value_I[i]));
                    }
                }
            }
        }
        return false;
    }
}