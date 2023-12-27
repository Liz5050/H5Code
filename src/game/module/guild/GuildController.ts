/**
 * 仙盟
 */
class GuildController extends BaseController {
    private module: GuildModule;
    private noticeWindow: GuildNoticeWindow;
    private applySetWindow: GuildApplySetWindow;
    private donateWindow: GuildDonateWindow;
    private propGetWindow: GuildPropGetWindow;

    private needShowModule: boolean;
    private isMyGuildInfo: boolean;//是否查询我的仙盟信息

    public constructor() {
        super(ModuleEnum.Guild);
    }

    public initView(): GuildModule {
        this.module = new GuildModule(this.moduleId);
        return this.module;
    }

    public addListenerOnInit(): void {
        /*
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGuildUpdateInfo], this.onGuildInfoUpdate, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGuildPurposeNoticeNum], this.onGuildNoticeNum, this);

        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetGuildInfo], this.onGuildInfo, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameCreateGuild], this.onCreateGuild, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameDealApply], this.onDealApply, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameChangeGuildPurpose], this.onChangeNotice, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameMemberOper], this.onMemberOper, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateVeinInfo], this.onVeinInfo, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGuildVeinNew], this.onVeinNew, this);

        //仓库相关
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateNewGuildWarehouseItems], this.onWarehouseItems, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateNewGuildWarehouseItemAdd], this.onWarehouseItemAdd, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateNewGuildWarehouseItemDel], this.onWarehouseItemDel, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateNewGuildWarehouseRecords], this.onWarehouseRecords, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateNewGuildWarehouseRecordOne], this.onWarehouseRecordOne, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateNewGuildWarehouseItems], this.onWarehouseItems, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameDonateEquip], this.onDonateEquip, this);

        //神兽相关
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetBeastGodInfo], this.onBeastGodInfo, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameDonateBeastGodFood], this.onDonateBeastGodFood, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGuildBeastGodOpenInfo], this.onGuildBeastGodOpenInfo, this);

        this.addListen0(UIEventEnum.GuildClickIcon, this.clickIcon, this);
        this.addListen0(UIEventEnum.GuildNoticeOpen, this.openNoticeWindow, this);
        this.addListen0(UIEventEnum.GuildPropGetWindownOpen, this.openPropGetWindown, this);

        this.addListen0(LocalEventEnum.GuildCreate, this.createGuild, this);
        this.addListen0(LocalEventEnum.GuildGetInfo, this.getGuildInfo, this);
        this.addListen0(LocalEventEnum.GuildGetApplyList, this.getGuildApplyList, this);
        this.addListen0(LocalEventEnum.GuildGetMemberList, this.getGuildMemberList, this);
        this.addListen0(LocalEventEnum.GuildSearch, this.searchGuild, this);
        this.addListen0(LocalEventEnum.GuildSaveNotice, this.saveNotice, this);
        this.addListen0(LocalEventEnum.GuildGetNoticeNum, this.getGuildNoticeNum, this);
        this.addListen0(LocalEventEnum.GuildDealApply, this.dealApply, this);
        this.addListen0(LocalEventEnum.GuildExit, this.exitGuild, this);
        this.addListen0(LocalEventEnum.GuildUpgrade, this.upgradeGuild, this);
        this.addListen0(LocalEventEnum.GuildGetDailyReward, this.getDailyReward, this);

        this.addListen0(LocalEventEnum.GuildVeinUpgrade, this.veinUpgrade, this);
        this.addListen0(NetEventEnum.entityInfoUpdate, this.onEntityInfoUpdate, this);
        this.addListen0(NetEventEnum.packPosTypeBagChange, this.onPackChange, this);
        this.addListen0(NetEventEnum.packBackPackItemsChange, this.onPackChange, this);
        */
    }

    public addListenerOnShow(): void {
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetApplyList], this.onGetApplyList, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetGuildPlayerInfo], this.onGetGuildPlayers, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameSearchGuilds], this.onSearchGuild, this);


        this.addListen1(UIEventEnum.GuildApplySetOpen, this.applySetOpen, this);
        this.addListen1(LocalEventEnum.GuildApplySetSave, this.applySetSave, this);
        this.addListen1(LocalEventEnum.GuildApplyAutoAgreeSave, this.autoAgreeSave, this);

        //成员管理相关
        this.addListen1(LocalEventEnum.GuildKickOut, this.kickOut, this);
        this.addListen1(LocalEventEnum.GuildTransferLeader, this.transferLeader, this);
        this.addListen1(LocalEventEnum.GuildPromoteDeputyLeader, this.promoteDeputyLeader, this);
        this.addListen1(LocalEventEnum.GuildPromotePresbyter, this.promotePresbyter, this);
        this.addListen1(LocalEventEnum.GuildRelieveDeputyLeader, this.relieveDeputyLeader, this);
        this.addListen1(LocalEventEnum.GuildRelievePresbyter, this.relievePresbyter, this);

        //仓库相关
        this.addListen1(LocalEventEnum.GuildWarehouseGetData, this.getWarehouseData, this);
        this.addListen1(LocalEventEnum.GuildDonateEquip, this.donateEquip, this);
        this.addListen1(LocalEventEnum.GuildChangeEquip, this.changeEquip, this);
        this.addListen1(LocalEventEnum.GuildChangeItem, this.changeItem, this);
        this.addListen1(LocalEventEnum.GuildDestroyEquip, this.destroyEquip, this);
        this.addListen1(UIEventEnum.GuildDonateWindownOpen, this.openDonateWindown, this);

        //神兽相关
        this.addListen1(LocalEventEnum.GuildBeastGodInfoGet, this.getBeastGodInfo, this);
        this.addListen1(LocalEventEnum.GuildBeastGodFoodDonate, this.donateBeastGodFood, this);
        this.addListen1(LocalEventEnum.GuildBeastGodOpen, this.openBeastGod, this);


    }

    private clickIcon(): void {
        //判断开启
        if (!ConfigManager.mgOpen.isOpenedByKey("Guild")) {
            return;
        }
        if (CacheManager.guild.isJoinedGuild()) {
            this.show();
        } else {
            EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.GuildApply);
        }
    }

    private openNoticeWindow(): void {
        if (this.noticeWindow == null) {
            this.noticeWindow = new GuildNoticeWindow();
        }
        this.noticeWindow.show();
        EventManager.dispatch(LocalEventEnum.GuildGetNoticeNum);
    }

    /**
     * 打开令牌获取窗口
     */
    private openPropGetWindown(): void {
        if (this.propGetWindow == null) {
            this.propGetWindow = new GuildPropGetWindow();
        }
        this.propGetWindow.show();
    }

    private createGuild(data: any): void {
        if (data != null) {
            ProxyManager.guild.create(data.name, data.flag, data.purpose);
        }
    }

    private getGuildInfo(data: any): void {
        if (data != null) {
            if (data.guildId == 0) {
                this.isMyGuildInfo = true;
            }
            ProxyManager.guild.getGuildInfo(data.guildId);
        }
    }

    /**
     * 获取仙盟申请列表
     */
    private getGuildApplyList(data: any): void {
        if (data != null) {
            ProxyManager.guild.getApplyList(data.guildId);
        }
    }

    /**
    * 获取仙盟成员列表
    */
    private getGuildMemberList(data: any): void {
        if (data != null) {
            ProxyManager.guild.getMemberList(data.guildId);
        }
    }

    private searchGuild(data: any): void {
        if (data != null) {
            ProxyManager.guild.search(data.name, data.includeFull);
        }
    }

    /**保存公告 */
    private saveNotice(data: any): void {
        ProxyManager.guild.saveNotice(data.content, data.isNotice, data.isCost);
    }

    /**
	 * 获取公告通知次数
	 */
    private getGuildNoticeNum(): void {
        ProxyManager.guild.getNoticeNum();
    }

    /**
     * 处理申请
     */
    private dealApply(data: any): void {
        ProxyManager.guild.dealApply(data.playerId, data.isAgree);
    }

    /**
     * 我的仙盟信息更新
     */
    private onGuildInfoUpdate(data: any): void {
        if (CacheManager.guild.playerGuildInfo != null && CacheManager.guild.playerGuildInfo.guildId_I == 0 && data.guildId_I > 0) {
            //新加入或创建仙盟
            this.needShowModule = true;
            EventManager.dispatch(UIEventEnum.ModuleClose, ModuleEnum.GuildApply);
        }
        //处理贡献增加提示
        if (CacheManager.guild.playerGuildInfo != null) {
            let addContribution: number = data.contribution_I - CacheManager.guild.playerGuildInfo.contribution_I;
            if (addContribution > 0) {
                Tip.showTip("贡献增加" + addContribution);
            }
        }
        CacheManager.guild.playerGuildInfo = data;
        if (this.needShowModule) {
            this.show();
            this.needShowModule = false;
        }
        if (this.isShow) {//重新获取我的仙盟信息
            let tabIndex: number = this.module.getMainTabIndex();
            if (tabIndex == 0) {
                EventManager.dispatch(LocalEventEnum.GuildGetInfo, { "guildId": 0 });
            } else if (tabIndex == 1) {//仓库积分更新
                this.module.updateWarehouseScore();
            }
        }

        //更新红点
        EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, ModuleEnum.Guild, CacheManager.guild.isNeedNotice);
        if (this.isShow) {
            this.module.updateVeinBtn();
        }
    }


    /**
     * 仙盟公告本周已通知次数
     */
    private onGuildNoticeNum(data: any): void {
        CacheManager.guild.noticeNum = data.intSeq.data_I;
        if (this.noticeWindow != null && this.noticeWindow.isShow) {
            this.noticeWindow.updateAll();
        }
    }

    private onCreateGuild(data: any): void {
        if (data.success) {
            Tip.showTip("创建仙盟成功");
        }
        this.needShowModule = true;
    }

    /**
     * 搜索仙盟返回S2C_SSearchGuilds
     */
    private onSearchGuild(data: any): void {
        this.module.updateGuilds(data);
    }

    /**
     * 背包更新了
     */
    private onPackChange(): void {
        if (this.isShow) {
            this.module.updateActiveBtn();
            this.module.updateBeastBtn();
        }
        EventManager.dispatch(LocalEventEnum.HomeSetBtnTip, ModuleEnum.Guild, CacheManager.guild.isNeedNotice);
    }

    /**
     * 获取仙盟信息返回
     */
    private onGuildInfo(data: any): void {
        if (this.isMyGuildInfo) {
            this.isMyGuildInfo = false;
            CacheManager.guild.guildInfo = data.guildInfo;
            this.module.updateByGuildInfo(data.guildInfo);
        }
    }

    /**
     * 申请列表返回
     */
    private onGetApplyList(data: any): void {
        let publicMiniPlayers: Array<any> = data.guildApplys.data;
        this.module.updateApplyList(publicMiniPlayers);
    }

    /**
     * 成员列表返回
     */
    private onGetGuildPlayers(data: any): void {
        let guildPlayers: Array<any> = data.guildPlayers.data;
        this.module.updateMembers(guildPlayers);
    }

    /**
     * 处理申请返回。重新查询申请列表
     */
    private onDealApply(): void {
        this.getGuildApplyList({ "guildId": 0 });
    }

    /**
     * 更新公告成功。需要重新获取仙盟信息。
     */
    private onChangeNotice(data: any): void {
        let doNotice: boolean = data.doNotice;
        Tip.showTip("仙盟公告保存成功");
        this.getGuildInfo({ "guildId": 0 });
    }

    /**
     * 成员操作返回。重新获取成员列表
     * @param data S2C_SMemberOper
     */
    private onMemberOper(data: any): void {
        let playerGuildInfo: any = CacheManager.guild.playerGuildInfo;
        if (playerGuildInfo.guildId_I > 0) {
            this.getGuildMemberList({ "guildId": 0 });
        }
    }

    /**
     * 心法返回
     * @param data SVeinInfo
     */
    private onVeinInfo(data: any): void {
        CacheManager.guild.vienInfo = data;
    }

    /**
     * 心法更新
     * @param data SDictIntInt
     */
    private onVeinNew(data: any): void {
        CacheManager.guild.vienNew = data;
        if (this.module && this.module.isShow) {
            this.module.updateSkill();
        }
    }

    /**
     * 仓库物品返回
     * @param data SSeqPlayerItem
     */
    private onWarehouseItems(data: any): void {
        let sPlayerItems: Array<any> = data.playerItem.data;
        CacheManager.guild.updateWarehouseItems(sPlayerItems, false, true);
        if (this.isShow) {
            this.module.updateWarehouseItems();
        }
    }

    /**
     * 仓库物品增加
     * @param data SSeqPlayerItem
     */
    private onWarehouseItemAdd(data: any): void {
        let sPlayerItems: Array<any> = data.playerItem.data;
        CacheManager.guild.updateWarehouseItems(sPlayerItems, true, false);
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
        if (this.isShow) {
            this.module.removeWarehouseItems(sPlayerItems);
        }
        CacheManager.guild.updateWarehouseItems(sPlayerItems, false, false);
    }

    /**
     * 仓库记录返回
     * @param data SSeqPlayerItem
     */
    private onWarehouseRecords(data: any): void {
        //SNewGuildWarehouseRecord
        let records: Array<any> = data.list.data;
        CacheManager.guild.updateWarehouseRecords(records, true);
        if (this.isShow) {
            this.module.updateWarehouseRecords();
        }
    }

    /**
     * 仓库记录增加
     * @param data SSeqPlayerItem
     */
    private onWarehouseRecordOne(data: any): void {
        //SNewGuildWarehouseRecord
        let records: Array<any> = data.list.data;
        CacheManager.guild.updateWarehouseRecords(records, false);
        if (this.isShow) {
            this.module.updateWarehouseRecords();
        }
    }

    /**
     * 捐献装备返回
     * @param data S2C_SDonateEquip
     */
    private onDonateEquip(data: any): void {
        let uid: string = data.uid;
        if (this.donateWindow && this.donateWindow.show) {
            this.donateWindow.removeItem(null);
        }
    }

    /**
     * 仙盟神兽信息返回
     * @param data S2C_SGetBeastGodInfo
     */
    private onBeastGodInfo(data: any): void {
        CacheManager.guild.beastGodInfo = data;
        this.module.updateBeastGodTimes();
        this.module.updateBeastGodFood();
    }

    /**
     * 捐献兽粮返回
     * @param data S2C_SDonateBeastGodFood
     */
    private onDonateBeastGodFood(data: any): void {
        CacheManager.guild.beastGodInfo.totalVal = data.totalVal;
        this.module.updateBeastGodFood();
    }

    /**
     * 神兽开启返回
     * @param data SGuildBeastGodOpen
     */
    private onGuildBeastGodOpenInfo(data: any): void {
        CacheManager.guild.beastGodOpenInfo = data;
    }

    /**
     * 退出仙盟
     */
    private exitGuild(): void {
        let tip: string = "";
        let isLeader: boolean = CacheManager.guild.isLeader;
        if (isLeader) {
            tip = "盟主退盟后将解散仙盟，确定要退出仙盟么？\n提示：退出后仙盟修炼等级将保留，但贡献将被清空。"
        } else {
            tip = "确定要退出仙盟么？\n提示：退出后仙盟修炼等级将保留，但贡献将被清空。"
        }
        Alert.info(tip, () => {
            if (isLeader) {
                ProxyManager.guild.disband();
            } else {
                ProxyManager.guild.exit();
            }
            this.hide();
        }, this);
    }

    /**
     * 升级仙盟
     */
    private upgradeGuild(): void {
        ProxyManager.guild.upgradeGuild();
    }

    /**
     * 领取每日奖励
     */
    private getDailyReward(): void {
        ProxyManager.guild.getDailyReward();
    }

    /**
     * 升级心法
     */
    private veinUpgrade(data: any): void {
        if (data != null) {
            ProxyManager.guild.upgradeVein(data.level, data.attrType);
        }
    }

    /**
     * 人物属性更新
     */
    private onEntityInfoUpdate(): void {
        if (this.isShow) {
            let tabIndex: number = this.module.getMainTabIndex();
            if (tabIndex == 2) {//心法
                this.module.updateSkill();
            }
        }
    }

    /**
     * 打开申请设置窗口
     */
    private applySetOpen(): void {
        if (this.applySetWindow == null) {
            this.applySetWindow = new GuildApplySetWindow();
        }
        this.applySetWindow.show();
    }

    /**
     * 保存申请设置
     */
    private applySetSave(data: any): void {
        ProxyManager.guild.saveApplySet(data.level, data.fight);
    }

    /**
     * 自动批准保存
     */
    private autoAgreeSave(data: any): void {
        ProxyManager.guild.saveAutoAgree(data.isAutoAgree);
    }

    /**
     * 踢出仙盟
     * @param data SGuildPlayer
     */
    private kickOut(data: any): void {
        if (data != null) {
            let miniPlayer: any = data.miniPlayer;
            let playerId: number = miniPlayer.entityId.id_I;
            Alert.info(`进行此操作会导致仙盟繁荣损失，你确定要把<font color='#01ab24'>${miniPlayer.name_S}</font>踢出仙盟吗？`, function () {
                ProxyManager.guild.memberOper(playerId, EGuildPosition.EGuildNotMember);
            });
        }
    }

    /**
     * 转让盟主
     */
    private transferLeader(data: any): void {
        ProxyManager.guild.memberOper(data.toPlayerId, EGuildPosition.EGuildLeader);
    }

    /**
     * 升级为副盟主
     */
    private promoteDeputyLeader(data: any): void {
        ProxyManager.guild.memberOper(data.toPlayerId, EGuildPosition.EGuildDeputyLeader);
    }

    /**
     * 升级为长老
     */
    private promotePresbyter(data: any): void {
        ProxyManager.guild.memberOper(data.toPlayerId, EGuildPosition.EGuildPresbyter);
    }

    /**
     * 解除副盟主
     */
    private relieveDeputyLeader(data: any): void {
        ProxyManager.guild.memberOper(data.toPlayerId, EGuildPosition.EGuildMember);
    }

    /**
     * 解除长老
     */
    private relievePresbyter(data: any): void {
        ProxyManager.guild.memberOper(data.toPlayerId, EGuildPosition.EGuildMember);
    }

    /**
     * 获取仓库数据
     */
    private getWarehouseData(): void {
        ProxyManager.guild.getWarehouseData();
    }

    /**
     * 捐献装备
     */
    private donateEquip(itemData: ItemData): void {
        ProxyManager.guild.donateEquip(itemData);
    }

    /**
     * 兑换装备
     */
    private changeEquip(itemData: ItemData): void {
        ProxyManager.guild.changeEquip(itemData);
    }

    /**
     * 兑换物品
     */
    private changeItem(data: any): void {
        ProxyManager.guild.changeItem(data.itemData, data.num);
    }

    /**
     * 销毁装备
     */
    private destroyEquip(uids: Array<string>): void {
        ProxyManager.guild.destroyEquip(uids);
    }

    /**
     * 打开捐献窗口
     */
    private openDonateWindown(): void {
        if (this.donateWindow == null) {
            this.donateWindow = new GuildDonateWindow();
        }
        this.donateWindow.show();
    }

    /**
     * 获取神兽信息
     */
    private getBeastGodInfo(): void {
        ProxyManager.guild.getBeastGodInfo();
    }

    /**
     * 捐献兽粮
     */
    private donateBeastGodFood(num: number): void {
        ProxyManager.guild.donateBeastGodFood(num);
    }

    /**
     * 挑战神兽
     */
    private openBeastGod(): void {
        ProxyManager.guild.openGuildBeastGod();
    }

}