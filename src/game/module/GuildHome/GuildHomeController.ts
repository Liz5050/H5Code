/**
 * 仙盟主界面
 */
class GuildHomeController extends BaseController {
    private module: GuildHomeModule;

    private allotWindow:GuildStorePropAllotWindow;
    private selectedMember:AllotMemberSelectedWindow;
    private scoreWarehouse:GuildScoreWareHouseWindow;
    public constructor() {
        super(ModuleEnum.GuildHome);
    }

    protected initView(): any {
        this.module = new GuildHomeModule();
        return this.module;
    }

    protected addListenerOnInit(): void {
        //仓库相关
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateNewGuildWarehouseItems], this.onWarehouseItems, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateNewGuildWarehouseItemAdd], this.onWarehouseItemAdd, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateNewGuildWarehouseItemDel], this.onWarehouseItemDel, this);
        
        //积分兑换仓库
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGuildCreditWarehouseItems], this.onScoreWarehouseItems, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGuildCreditWarehouseItemUpdate], this.onScoreWarehouseItemUpdate, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGuildCreditWarehouseItemAdd], this.onScoreWarehouseItemAdd, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGuildCreditWarehouseItemDel], this.onScoreWarehouseItemDel, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGuildCreditWarehouseRecords], this.onScoreWarehouseRecords, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGuildCreditWarehouseRecordOne], this.onScoreWarehouseRecordsUpdate, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameDonateEquip],this.onDonateUpdateHandler,this);
        
        this.addListen0(NetEventEnum.moneyCoinBindUpdate, this.checkRedTip, this);
        this.addListen0(LocalEventEnum.GuildNewPlayerGuildInfoUpdate, this.checkRedTip, this);
        this.addListen0(NetEventEnum.packPosTypePropChange, this.checkRedTip, this);
        this.addListen0(UIEventEnum.GuildAllotRewardOpen,this.openAllotWindow,this);
        this.addListen0(UIEventEnum.AllotMemberSelectedOpen,this.openMemberSelectedWindow,this);
        this.addListen0(LocalEventEnum.GuildReqAllocateItem,this.onAllocateItem,this);
        this.addListen0(UIEventEnum.GuildScoreWarehouseOpen,this.onOpenWarehouseHandler,this);
        
    }

    protected addListenerOnShow(): void {
        this.addListen1(UIEventEnum.ModuleOpened, this.checkModuleShow, this);
        this.addListen1(UIEventEnum.ModuleClosed, this.checkModuleShow, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetGuildPlayerInfo], this.onGetGuildPlayers, this);
    }


    protected afterModuleShow(data?: any): void {
        super.afterModuleShow(data);
        EventManager.dispatch(LocalEventEnum.GuildNewReqGuildMember, {guildId: 0});
        this.getWarehouseData();
    }

    /**
     * 获取仓库数据
     */
    private getWarehouseData(): void {
        ProxyManager.guild.getWarehouseData();
    }

    private checkRedTip(): void {
        if (this.isShow) {
            this.module.updateAll();
        }
        if (CacheManager.guildNew.isJoinedGuild()) {
            EventManager.dispatch(LocalEventEnum.HomeIconSetTip, IconResId.GuildNew, CacheManager.guildNew.checkTips());
        }
    }

    /**
     * 检测模块显示，保证GuildHome不能挡住仙盟和仙盟活动等界面
     */
    private checkModuleShow(): void {
        let isShowModule: boolean;
        let keys: Array<ModuleEnum> = [ModuleEnum.GuildActivity, ModuleEnum.GuildNew,ModuleEnum.GuildBattle,ModuleEnum.GuildCopy];
        for (let key of keys) {
            if (UIManager.isShow(key)) {
                isShowModule = true;
                break;
            }
        }
        this.module.visible = !isShowModule;
    }

    /**
     * 成员列表返回 S2C_SGetGuildPlayerInfo
     */
    private onGetGuildPlayers(data: any): void {
        let rankData: Array<any> = data.guildPlayers.data;
        rankData.sort(function (a: any, b: any): number {
            return b.contributionDay_I - a.contributionDay_I;
        });
        if (rankData.length > 3) {
            this.module.updateRankList(rankData.slice(0, 3));
        } else {
            this.module.updateRankList(rankData.slice(0, 3));
        }

        if(this.selectedMember && this.selectedMember.isShow) {
            this.selectedMember.updateMember(rankData);
        }
    }

     /**
     * 仓库物品返回
     * @param data SSeqPlayerItem
     */
    private onWarehouseItems(data: any): void {
        let sPlayerItems: Array<any> = data.playerItem.data;
        CacheManager.guildNew.updateWarehouseItems(sPlayerItems, false, true);
        if (this.isShow) {
            this.module.updateWarehouseItems();
        }
        if(this.allotWindow && this.allotWindow.isShow) { 
            this.allotWindow.updateAll();
        }
    }

    /**
     * 仓库物品增加
     * @param data SSeqPlayerItem
     */
    private onWarehouseItemAdd(data: any): void {
        let sPlayerItems: Array<any> = data.playerItem.data;
        CacheManager.guildNew.updateWarehouseItems(sPlayerItems, true, false);
        if (this.isShow) {
            this.module.updateWarehouseItems();
        }
    }

    /**
     * 仓库物品删除
     * @param data SSeqPlayerItem
     */
    private onWarehouseItemDel(data: any): void {
        let sPlayerItems: Array<any> = data.playerItem.data;
        // if (this.isShow) {
        //     this.module.removeWarehouseItems(sPlayerItems);
        // }
        CacheManager.guildNew.updateWarehouseItems(sPlayerItems, false, false);
        if (this.isShow) {
            this.module.updateWarehouseItems();
        }

        if(CacheManager.guildNew.warehouseItems.length == 0) {
            if(this.allotWindow && this.allotWindow.isShow) { 
                this.allotWindow.hide();
            }
            if(this.selectedMember && this.selectedMember.isShow) { 
                this.selectedMember.hide();
            }
        }
        else {
            if(this.allotWindow && this.allotWindow.isShow) { 
                this.allotWindow.updateAll();
            }
        }
    }


    /**
     * 积分仓库物品更新
     * SSeqPlayerItem
     */
    private onScoreWarehouseItems(data: any):void {
        let sPlayerItems: Array<any> = data.playerItem.data;
        CacheManager.guildNew.updateScoreWarehouseItems(sPlayerItems, false, true);
    }

    /**
     * 积分仓库单个物品更新
     * SSeqPlayerItem
     */
    private onScoreWarehouseItemUpdate(data: any):void {
        let sPlayerItems: Array<any> = data.playerItem.data;
        CacheManager.guildNew.updateScoreWarehouseItem(sPlayerItems);
    }

    /**
     * 积分仓库物品增加
     * SSeqPlayerItem
     */
    private onScoreWarehouseItemAdd(data:any):void {
        let sPlayerItems: Array<any> = data.playerItem.data;
        CacheManager.guildNew.updateScoreWarehouseItems(sPlayerItems, true, false);
    }

    /**
     * 积分仓库物品删除
     * SSeqPlayerItem
     */
    private onScoreWarehouseItemDel(data:any):void {
        let sPlayerItems: Array<any> = data.playerItem.data;
        CacheManager.guildNew.updateScoreWarehouseItems(sPlayerItems, false, false);
    }

    /**
     * 积分仓库日志列表
     * SNewGuildWarehouseRecordList
     */
    private onScoreWarehouseRecords(data:any):void {
        CacheManager.guildNew.updateScoreWarehouseRecord(data.list.data);
    }

    /**
     * 单个日志更新
     * SNewGuildWarehouseRecordList
     */
    private onScoreWarehouseRecordsUpdate(data:any):void {
        CacheManager.guildNew.updateScoreWarehouseRecord(data.list.data,true);
    }

    /**
     * 捐献成功返回
     */
    private onDonateUpdateHandler(data:any):void {
        Tip.showTip(App.StringUtils.substitude(LangGuildNew.L22,data.addCredit));
    }

    private openAllotWindow():void {
        if(!this.allotWindow) {
            this.allotWindow = new GuildStorePropAllotWindow();
        }
        this.allotWindow.show();
    }

    private openMemberSelectedWindow(uid:string):void {
        if(!this.selectedMember) {
            this.selectedMember = new AllotMemberSelectedWindow();
        }
        this.selectedMember.show(uid);
    }

    private onAllocateItem():void {
        let allocateInfos:any[] = CacheManager.guildNew.allocateInfos;
        if(allocateInfos.length == 0) {
            Tip.showRollTip("未选择分配成员");
            return;
        }
        ProxyManager.guild.allocateItem(allocateInfos);
        CacheManager.guildNew.clearAllocateInfo();
    }

    private onOpenWarehouseHandler():void {
        if(!ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.GuildWarehouse)) return;
        if(!this.scoreWarehouse) {
            this.scoreWarehouse = new GuildScoreWareHouseWindow();
        }
        this.scoreWarehouse.show();
    }
}