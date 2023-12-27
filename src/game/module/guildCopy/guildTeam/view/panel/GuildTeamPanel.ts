class GuildTeamPanel extends BaseTabView{
	private c1:fairygui.Controller;
	private list_copy:List;
	private txt_copy_name:fairygui.GTextField;
	private createBtn: fairygui.GButton;
    private fastJoinBtn: fairygui.GButton;
    private quitBtn: fairygui.GButton;
    private startBtn: fairygui.GButton;

	private rankRewardList:List;
    private btn_guildRank:fairygui.GButton;

	private autoFastJoinCb: fairygui.GButton;
	private autoStartCb: fairygui.GButton;
    private autoFullStartCb: fairygui.GButton;

	private teamList:List;
	private noTeamsTipTxt:fairygui.GTextField;
    private earningsTxt:fairygui.GRichTextField;

	private autoFastJoinCD:number;//自动加入cd
    private autoStartCD:number;//自动开启副本cd
    private autoFullStartCD:number;//满员自动开始副本cd
	private stepCount:number = 0;
	private isFullMem: boolean;
	private state:ETeam2State;

	private teamInfo:any;
	private copys:any[];
	private curIndex:number = -1;
	private rankRewards:any[];
    private activityIsOpen:boolean;
	public constructor() {
		super();
	}

	public initOptUI():void {
		this.c1 = this.getController("c1");
		this.list_copy = new List(this.getGObject("list_copy").asList);
		this.list_copy.list.addEventListener(fairygui.ItemEvent.CLICK,this.onSelectItemChange,this);
		this.txt_copy_name = this.getGObject("txt_copy_name").asTextField;

		this.createBtn = this.getGObject("btn_create").asButton;
        this.fastJoinBtn = this.getGObject("btn_fastjoin").asButton;
        this.quitBtn = this.getGObject("btn_quit").asButton;
        this.startBtn = this.getGObject("btn_start").asButton;

		this.rankRewardList = new List(this.getGObject("list_reward").asList);
        this.btn_guildRank = this.getGObject("btn_guildRank").asButton;
        this.btn_guildRank.addClickListener(this.onOpenRankHandler,this);

		this.autoFastJoinCb = this.getGObject("cb_auto_fastjoin").asButton;
		this.autoStartCb = this.getGObject("cb_auto_start").asButton;
		this.autoFullStartCb = this.getGObject("cb_auto_full_start").asButton;

        this.createBtn.addClickListener(this.onClick, this);
        this.fastJoinBtn.addClickListener(this.onClick, this);
        this.quitBtn.addClickListener(this.onClick, this);
        this.startBtn.addClickListener(this.onClick, this);

		this.autoFastJoinCb.addClickListener(this.onClick, this);
		this.startBtn.addClickListener(this.onClick, this);
		this.autoFullStartCb.addClickListener(this.onClick, this);

		this.teamList = new List(this.getGObject("list_team").asList);
		this.noTeamsTipTxt = this.getGObject("txt_no_teamlist_tip").asTextField;
        this.earningsTxt = this.getGObject("txt_earnings").asRichTextField;
	}

	public updateAll():void {
		ProxyManager.team2.getGuildTeamRankInfo();
		CacheManager.sysSet.autoCopy = false;

		if(!this.copys) {
            let list:any[] = ConfigManager.copy.getCopysByType(ECopyType.ECopyGuildTeam);
            this.copys = [list[0]];//固定开简单模式
		}
		this.list_copy.data = this.copys;
		this.list_copy.selectedIndex = 0;
		this.txt_copy_name.text = this.getCopyModeStr(1);
        this.updateRankInfo();
        this.updateOpenInfo();
        this.updateEarnings();
	}

    public updateOpenInfo():void {
        this.activityIsOpen = CacheManager.guildCopy.isOpen;
        if(this.activityIsOpen) {
            this.updateTeamInfo(true);
            App.TimerManager.doTimer(1000, 0, this.onCountdown, this);
        }
        else {
            if(CacheManager.team2.teamInfo && CacheManager.team2.curTeamCopyCfg.copyType == ECopyType.ECopyGuildTeam) {
				EventManager.dispatch(LocalEventEnum.ExitTeamCross);
			}
            this.teamList.data = null;
            this.setState(ETeam2State.Team_NONE);
            this.noTeamsTipTxt.text = "活动暂未开启";
            App.TimerManager.remove(this.onCountdown, this);
            this.stepCount = 0;
        }
    }

    public updateRankInfo():void {
        if(!this.rankRewards) {
			this.rankRewards = ConfigManager.team.getGuildRankRewards();
		}
		this.rankRewardList.data = this.rankRewards;
    }

	public updateTeamInfo(isOpen:boolean = false):void {
        this.teamInfo = CacheManager.team2.teamInfo;
        if (this.teamInfo) { //有自己的队伍
			if(CacheManager.team2.curTeamCopyCfg.copyType != ECopyType.ECopyGuildTeam) {
				//当前队伍信息不是仙盟组队副本，先退出队伍
				EventManager.dispatch(LocalEventEnum.ExitTeamCross);
			}
            let memList:any[] = this.teamInfo.players.data;
            this.teamList.data = memList;
            this.isFullMem = memList.length >= this.teamInfo.maxPlayer_BY;
            this.selectCb(this.autoFullStartCb, this.autoFullStartCb.selected);
            if (CacheManager.team2.captainIsMe) {
                this.setState(ETeam2State.Team_Leader);
                if (isOpen) {
                    this.selectCb(this.autoStartCb, true);
                    this.selectCb(this.autoFullStartCb, true);
                }
            } else {
                this.setState(ETeam2State.Team_Member);
            }
            this.noTeamsTipTxt.text = "";

			let copyCfg:any = this.list_copy.selectedData;
            if (copyCfg && copyCfg.code != this.teamInfo.copyCode_I) {//加入队伍时发现和自己当前选中不一致，再次选中
                let copys: any[] = this.list_copy.data;
                for (let i = 0; i < copys.length; i++) {
                    if (copys[i].code == this.teamInfo.copyCode_I) {
						this.list_copy.selectedIndex = i;
                        this.selectCopy();//选中
                        break;
                    }
                }
            }
        } else {
            this.setState(ETeam2State.Team_NONE);
            this.reqGetList(this.list_copy.selectedData);
        }
    }

	public updateTeamList():void {
        if(!this.activityIsOpen) return;
        if (this.state == ETeam2State.Team_NONE) {
			let list:any[] = CacheManager.team2.teamList;
			if (!list || list.length <= 0) {
				this.teamList.data = [];
				this.noTeamsTipTxt.text = LangTeam2.LANG3;
			} 
			else {
				this.teamList.data = list;
				this.noTeamsTipTxt.text = "";
			}
		}
	}

    private updateEarnings():void {
        let copyCfg:any = ConfigManager.copy.getByPk(CopyEnum.CopyGuildTeam);
        let pCopy:any = CacheManager.copy.getPlayerCopyInf(copyCfg.code);
        let left:number = pCopy ? copyCfg.numByDay - pCopy.todayEnterNum_I : copyCfg.numByDay;
        let color:string = '#09c735';
        if (left <= 0) {
            left = 0;
            color = Color.Color_4;
        }
        this.earningsTxt.text = App.StringUtils.substitude(LangTeam2.LANG1, left, copyCfg.numByDay, color);
    }

	private onCountdown():void {
        this.stepCount++;
		if(this.stepCount % 30 == 0) {
			ProxyManager.team2.getGuildTeamRankInfo();//30秒请求一次排行榜信息
		}
        switch (this.state) {
            case ETeam2State.Team_NONE:
                if (this.stepCount % 2 == 0) {//2秒定时请求一次队伍列表
					let copyCfg:any = this.list_copy.selectedData;
                    copyCfg && this.reqGetList(copyCfg);
                }
                this.countdownCb(this.autoFastJoinCb);
                break;
            case ETeam2State.Team_Leader:
                this.countdownCb(this.autoStartCb);
                this.countdownCb(this.autoFullStartCb);
                break;
        }
    }

	private onSelectItemChange():void {
		this.selectCopy();
	}

	private selectCopy():void {
		if (this.state == ETeam2State.Team_NONE) {
            let data:any = this.list_copy.selectedData;
            let mode:number = Math.ceil(data.code / 10000);
            this.txt_copy_name.text = this.getCopyModeStr(mode);
            this.reqGetList(data);
            this.updateTeamList();
        }
	}

	private countdownCb(cb:fairygui.GButton):void {
        let content:string = "";
        let cd:number;
        switch (cb) {
            case this.autoFastJoinCb:
                if (this.autoFastJoinCb.selected && this.autoFastJoinCD) {
                    cd = --this.autoFastJoinCD;
                    content = LangTeam2.LANG2;
                    if (cd <= 0) {//倒计时结束
                        if (!PackUtil.checkOpenSmelt()) {
                            if (!CacheManager.copy.isInCopy) {//发送快速加入
                                EventManager.dispatch(LocalEventEnum.QuickJoinTeamCross, this.list_copy.selectedData.code);
                            } 
							else {
                                this.selectCb(this.autoFastJoinCb, false);
                            }
                        } 
						else {
                            this.selectCb(this.autoFastJoinCb, false);
                        }
                    }
                }
                break;
            case this.autoStartCb:
                if (this.autoStartCb.selected && !(this.autoFullStartCb.selected && this.isFullMem) && this.autoStartCD) {
                    cd = --this.autoStartCD;
                    content = LangTeam2.LANG6;
                    if (cd <= 0) {//倒计时结束
                        EventManager.dispatch(LocalEventEnum.EnterCopyCross);
                    }
                }
                break;
            case this.autoFullStartCb:
                if (this.autoFullStartCb.selected && this.isFullMem && this.autoFullStartCD) {
                    cd = --this.autoFullStartCD;
                    content = LangTeam2.LANG6;
                    if (cd <= 0) {//倒计时结束
                        EventManager.dispatch(LocalEventEnum.EnterCopyCross);
                    }
                }
                break;
        }
        if (cd) {
            cb.text = App.StringUtils.substitude(content, cd);
        }
    }

	private setState(state:ETeam2State):void {
        if (this.state != state) {
            this.state = state;
            this.c1.selectedIndex = state;

            switch (state) {
                case ETeam2State.Team_NONE:
                    this.selectCb(this.autoFastJoinCb, true);
                    break;
                case ETeam2State.Team_Member:
                    break;
                case ETeam2State.Team_Leader:
                    this.selectCb(this.autoStartCb, true);
                    this.selectCb(this.autoFullStartCb, true);
                    break;
            }
        }
    }

	private selectCb(cb:fairygui.GButton, isSelect:boolean):void {
        cb.selected = isSelect;

        let content:string = "";
        let cd:number;
        switch (cb) {
            case this.autoFastJoinCb:
                content = LangTeam2.LANG2;
                cd = this.autoFastJoinCD = ConfigManager.team.getFastJoinCountTime();
                break;
            case this.autoStartCb:
                content = LangTeam2.LANG6;
                let autoStartCD:number = CacheManager.team2.getEnterCopyAutoCount();
                if (autoStartCD < 0) autoStartCD = ConfigManager.team.getAutoStartCountTime();
                cd = this.autoStartCD = autoStartCD;
                break;
            case this.autoFullStartCb:
                content = cb.selected && this.isFullMem ? LangTeam2.LANG6 : LangTeam2.LANG10;
                let autoFullStartCD:number = CacheManager.team2.getEnterCopyAutoCount();
                if (autoFullStartCD < 0 || autoFullStartCD > ConfigManager.team.getFullStartCountTime()) autoFullStartCD = ConfigManager.team.getFullStartCountTime();
                cd = this.autoFullStartCD = autoFullStartCD;
                break;
        }
        if (cd) {
            cb.text = App.StringUtils.substitude(content, cd);
        }
    }

	private onClick(e:egret.TouchEvent):void {
        if(!this.activityIsOpen) {
            Tip.showTip("活动暂未开启");
            return;
        }
        let btn: any = e.target;
        switch (btn) {
			case this.createBtn:
				this.crateTeam();
			    break;
            case this.fastJoinBtn:
				this.joinTeam();
				break;
			case this.quitBtn:
				EventManager.dispatch(LocalEventEnum.ExitTeamCross);
				break;
			case this.startBtn:
				EventManager.dispatch(LocalEventEnum.EnterCopyCross);
				break;
			case this.autoFastJoinCb:
                this.selectCb(this.autoFastJoinCb, this.autoFastJoinCb.selected);
                break;
            case this.autoStartCb:
                this.selectCb(this.autoStartCb, this.autoStartCb.selected);
                break;
            case this.autoFullStartCb:
                this.selectCb(this.autoFullStartCb, this.autoFullStartCb.selected);
                break;
		}
	}

    private onOpenRankHandler():void {
        EventManager.dispatch(UIEventEnum.GuildTeamCopyRankOpen);
    }

	private crateTeam():void {
		if (!PackUtil.checkOpenSmelt()) {
			if (!CacheManager.copy.isInCopy) {//发送创建
				EventManager.dispatch(LocalEventEnum.CreateTeamCross, this.list_copy.selectedData.code);
			}
			else {
                if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)) {
				    Tip.showTip(LangTeam2.LANG11);
                }
			}
		}
	}

	private joinTeam():void {
		if (!PackUtil.checkOpenSmelt()) {
			if (!CacheManager.copy.isInCopy) {//发送快速加入
				EventManager.dispatch(LocalEventEnum.QuickJoinTeamCross, this.list_copy.selectedData.code);
			} 
			else {
				if(!CacheManager.copy.isInCopyByType(ECopyType.ECopyCheckPoint)) {
				    Tip.showTip(LangTeam2.LANG11);
                }
			}
		}
	}

	private reqGetList(copy:any): void {
        if (this.state == ETeam2State.Team_NONE && this.activityIsOpen) {
            EventManager.dispatch(LocalEventEnum.GetTeamListCross, copy.code);
        }
    }

	private getCopyModeStr(mode:number):string {
		switch(mode) {
			case 1:
				return "简单模式";
			case 2:
				return "困难模式";
			case 3:
				return "地狱模式";
		}
	}

	private getAutoStartCount():number {
        if (CacheManager.team2.hasTeam && !CacheManager.copy.isInCopy) {
            if (CacheManager.team2.captainIsMe) {
                if (this.autoStartCb.selected && !(this.autoFullStartCb.selected && this.isFullMem)) {//队长，有倒计时
                    return this.autoStartCD;
                } else if (this.autoFullStartCb.selected && this.isFullMem) {//队长，有倒计时
                    return this.autoFullStartCD;
                }
                return Team2Cache.COUNT_NO_CD;//队长，没勾选倒计时
            }
            return Team2Cache.COUNT_NO_LEADER;//队员
        }
        return Team2Cache.COUNT_NO_TEAM;//没队
    }

	public hide():void {
		super.hide();
		CacheManager.sysSet.autoCopy = true;
        //关闭界面则退出队伍
        EventManager.dispatch(LocalEventEnum.TeamCrossHide, this.getAutoStartCount());
        App.TimerManager.remove(this.onCountdown, this);
        this.stepCount = 0;
        this.state = undefined;
	}
}