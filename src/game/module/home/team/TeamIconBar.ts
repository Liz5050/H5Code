class TeamIconBar extends fairygui.GComponent {
    private countTxt: fairygui.GTextField;

    public constructor() {
        super();
    }

    protected constructFromXML(xml: any): void {
        super.constructFromXML(xml);
        this.countTxt = this.getChild("txt_count").asTextField;
        this.addClickListener(this.onClick, this);

        // this.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        // this.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
    }

    public updateAll():void {
        this.updateCount();
    }

    public updateCount():void {
        let count:number = CacheManager.team2.getEnterCopyAutoCount();
        if (count >= 0) {
            this.countTxt.text = App.StringUtils.substitude(LangTeam2.LANG14, count);
        } else if (count == Team2Cache.COUNT_HAD_INVITE){
            this.countTxt.text = LangTeam2.LANG23;
        }else if (count == Team2Cache.COUNT_NO_CD) {
            this.countTxt.text = LangTeam2.LANG15;
        } else {
            this.countTxt.text = LangTeam2.LANG16;
        }
    }

    private onClick(e:egret.TouchEvent):void{
        let count:number = CacheManager.team2.getEnterCopyAutoCount();
        if(count==Team2Cache.COUNT_HAD_INVITE && CacheManager.team2.curInviteInfo){
            let info:any = CacheManager.team2.curInviteInfo;
            let copy:any = ConfigManager.copy.getByPk(info.copyCode_I);
            //邀请状态
            let msg:string = HtmlUtil.colorSubstitude(LangTeam2.LANG24,info.fromPlayer.name_S,copy.name);
            Alert.alert(msg,(isCheck:boolean)=>{
                //申请加入队伍                
                ChatUtils.applyTeam(info.copyCode_I,info.groupId);
            },this,(isCheck:boolean)=>{
                //添加到忽略列表
                if(isCheck){
                    CacheManager.team2.setIgnoreInvite(info.fromPlayer.entityId);
                }
            },LangTeam2.LANG25,"",LangTeam2.LANG26,Alert.YES|Alert.NO,["接受","拒绝"]);
            CacheManager.team2.curInviteInfo = null;   
            CacheManager.team2.setEnterCopyAutoCount(Team2Cache.COUNT_NO_TEAM);         
        }else{
            this.onOpenTeam2Window();
        }
    }

    private onOpenTeam2Window() {
        let teamCopyCfg:any = CacheManager.team2.curTeamCopyCfg;
        if(teamCopyCfg) {
            if(teamCopyCfg.copyType == ECopyType.ECopyGuildTeam) {
                EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.GuildCopy,{tabType:PanelTabType.GuildTeam});
            }
            else if(teamCopyCfg.copyType == ECopyType.ECopyCrossTeam){
                EventManager.dispatch(UIEventEnum.ModuleOpen,ModuleEnum.CopyHall,{tabType:PanelTabType.Team2});
            }
        }
    }
}