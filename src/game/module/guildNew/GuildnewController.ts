/**
 * 模块控制器
 * @author zhh
 * @time 2018-07-16 21:51:45
 */
class GuildnewController extends BaseController {
	//工具生成的类名称不对就手动改吧
	private _moduleView:GuildNewModule;
    private _aplyWin:GuildNewAplyListPanel;
    private _isShowAplyWin:boolean;
	private _searchListWin:GuildNewSearchListWin;
	private _createWin:GuildNewCreateWin;
    private _modifyWin:GuildNewModifyNoticeWin;
    private _donateWin:GuildNewDonateWin;
    private _isInfoInit:boolean = false;
    /**是否请求日志;只请求一次，在线产生的日志服务器会主动追加 */
    private _isReqLogs:boolean = false;
    private _isShowSearchWin:boolean = false;
	public constructor() {
		super(ModuleEnum.GuildNew);
	}

	public initView(): any {
		if (!this._moduleView) {
			this._moduleView = new GuildNewModule();
		}
		return this._moduleView;

	}

	
    public addListenerOnInit(): void {
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGuildUpdateInfo], this.onGuildInfoUpdate, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGuildPurposeNoticeNum], this.onGuildNoticeNum, this);
        this.addMsgListener(EPublicCommand[EPublicCommand.ECmdPublicGuildApplyNum], this.onGuildAplyNum, this);

        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetGuildInfo], this.onGuildInfo, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameCreateGuild], this.onCreateGuild, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameDealApply], this.onDealApply, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameApplyGuild], this.onApplyGuild, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameChangeGuildPurpose], this.onChangeNotice, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameMemberOper], this.onMemberOper, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateVeinInfo], this.onVeinInfo, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateGuildVeinNew], this.onVeinNew, this);      
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateSGuildLogAppend], this.onGuildAppendLog, this);      
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameSearchGuilds], this.onSearchGuild, this);
		this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetGuildLogs], this.onGuildLogInfos, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameBatchApplyGuild], this.onBatchApplyGuild, this);

		this.addListen0(LocalEventEnum.GuildNewOpenSearchWin,this.onOpenSearch,this);
		this.addListen0(LocalEventEnum.GuildNewReqAplyJoin,this.onReqAplyJoin,this);
		this.addListen0(LocalEventEnum.GuildNewOpenCreate,this.onOpenCreate,this);
		this.addListen0(LocalEventEnum.GuildNewReqCreate,this.createGuild,this);
		this.addListen0(LocalEventEnum.GuildNewReqGuildInfo,this.onReqGetGuildInfo,this);
		this.addListen0(LocalEventEnum.GuildNewReqGuildMember,this.onReqGetGuildMember,this);
		this.addListen0(LocalEventEnum.GuildNewReqGuildAplyList,this.onReqGetGuildApplyList,this);
		this.addListen0(LocalEventEnum.GuildNewReqApplySetSave,this.onReqApplySetSave,this);
		this.addListen0(LocalEventEnum.GuildNewReqAutoAgree,this.onReqAutoAgreeSave,this);
		this.addListen0(LocalEventEnum.GuildNewReqDealAply,this.onPlayerDealApply,this);
		this.addListen0(LocalEventEnum.GuildNewReqExit,this.onReqExitGuild,this);
		this.addListen0(LocalEventEnum.GuildNewReqSearch,this.onReqSearchGuild,this);			
		this.addListen0(LocalEventEnum.GuildApplyOneKey, this.applyOneKeyGuild, this);
        
    }

    public addListenerOnShow(): void {
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetApplyList], this.onGetApplyList, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetGuildPlayerInfo], this.onGetGuildPlayers, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameDonateMoney], this.onDonateMoney, this);
        
        this.addListen1(LocalEventEnum.GuildNewReqSaveNotice,this.onReqSaveNotice,this);
        this.addListen1(LocalEventEnum.GuildNewOpenModifyNotice,this.onOpenModifyNotice,this);
        this.addListen1(LocalEventEnum.GuildNewOpenDonateWin,this.onOpenDonate,this);
        this.addListen1(LocalEventEnum.GuildNewReqDonate,this.onReqDonate,this);
        this.addListen1(LocalEventEnum.GuildNewReqChangePosition,this.onReqChangePosition,this);
        this.addListen1(LocalEventEnum.GuildNewReqUpgradeGuild,this.onReqUpgradeGuild,this);
        this.addListen1(LocalEventEnum.GuildNewOpenLookupAply,this.onOpenLookupAply,this);
        this.addListen1(LocalEventEnum.GuildNewReqGuildLog,this.onReqGuildLog,this);	
        this.addListen1(NetEventEnum.moneyCoinBindUpdate, this.checkDonateTip, this);
    }
    private applyOneKeyGuild(): void {
		ProxyManager.guild.applyOneKey();
	}
    private createGuild(data: any): void {
        if (data != null) {
            ProxyManager.guild.create(data.name, data.flag,data.option,data.purpose);
        }
    }

	private onReqGetGuildMember(data:any):void{
        if (data != null) {           
            ProxyManager.guild.getMemberList(data.guildId);
        }
    }

    private onReqGetGuildInfo(data: any): void {
        if (data != null) {           
            ProxyManager.guild.getGuildInfo(data.guildId);
        }
    }

    /**
     * 获取仙盟申请列表
     */
    private onReqGetGuildApplyList(data: any): void {
        if (data != null) {
            ProxyManager.guild.getApplyList(data.guildId);
        }
    }

    /**
	 * 一键申请返回
	 */
	private onBatchApplyGuild(): void {
		this.onReqSearchGuild({name:"",includeFull:true});
	}

    /**
    * 获取仙盟成员列表
    */
    private getGuildMemberList(data: any): void {
        if (data != null) {
            ProxyManager.guild.getMemberList(data.guildId);
        }
    }
	/**搜索仙盟 */
    private onReqSearchGuild(data: any): void {
        this._isShowSearchWin = true;
        if (data != null) {
            ProxyManager.guild.search(data.name, data.includeFull);
        }
    }
    /**请求仙盟日志 */
    private onReqGuildLog(pageSize:number,pageIndex:number):void{
        if(!this._isReqLogs){
            this._isReqLogs = true;
            ProxyManager.guild.getGuildLogs(pageSize,pageIndex);
        }        
    }

    /**保存公告 */
    private onReqSaveNotice(data: any): void {
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
    private onPlayerDealApply(data: any): void {
        ProxyManager.guild.dealApply(data.playerId, data.isAgree);
    }
    /**
     * 请求捐献
     */
    private onReqDonate(option:number,num:number):void{
        ProxyManager.guild.donateMoney(option,num);
    }

    /**
     * 打开捐献窗口
     */
    private onOpenDonate():void{
        if(!this._donateWin){
            this._donateWin = new GuildNewDonateWin();
        }
        this._donateWin.show();
    }

    private onOpenModifyNotice():void{
        if(!this._modifyWin){
            this._modifyWin = new GuildNewModifyNoticeWin();
        }
        this._modifyWin.show();
    }

    /**
     * 我的仙盟信息更新
     */
    private onGuildInfoUpdate(data: any): void {
        let isJoiNow:boolean = false;
        let isJoinOld:boolean = CacheManager.guildNew.isJoinedGuild();
        CacheManager.guildNew.playerGuildInfo = data;
        let isJoin:boolean = CacheManager.guildNew.isJoinedGuild();
        isJoiNow = this._isInfoInit && !isJoinOld &&  isJoin;
        if(isJoiNow){
            CacheManager.guildNew.setOpenRedTip(false,true);
            HomeUtil.open(ModuleEnum.GuildHome);
            this._isShowSearchWin = false;
            if(this._searchListWin && this._searchListWin.isShow){
                this._searchListWin.hide();
            }
        }
        if(this._isInfoInit && isJoinOld && !isJoin ){//解散仙盟,或者被踢出
            HomeUtil.close(ModuleEnum.GuildHome);
            HomeUtil.close(ModuleEnum.GuildNew);
            CacheManager.guildNew.clearAplyJoin();
            CacheManager.chat.clearChanelMsg(EChatType.EChatTypeGuild);
            CacheManager.guildNew.setGuildLog([]);
            if(CacheManager.guildDefend.isInTravel()){
                CacheManager.guildDefend.updateOpenInfo(null); //删除守护仙盟图标
            }
            
        }
        if(this.isShow){
            this._moduleView.updateBasics();
            this._moduleView.updateManagerPanel();
            if(this._moduleView.isTypePanel(PanelTabType.GuildNewBasics)){
                this.onReqGetGuildMember({guildId:0});
            }
        }
        this._isInfoInit = true;
        EventManager.dispatch(LocalEventEnum.GuildNewPlayerGuildInfoUpdate);
    }

    /**
     * 仙盟人数
     * SGuildApplyNum
     */
    private onGuildAplyNum(data:any):void{
        CacheManager.guildNew.setGuildApplyNum(data.num_I);
        EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.GuildNew,CacheManager.guildNew.checkTips());
        if(this.isShow){
            this._moduleView.updateTips();
        }
    }

    /**
     * 仙盟公告本周已通知次数
     */
    private onGuildNoticeNum(data: any): void {
        CacheManager.guildNew.noticeNum = data.intSeq.data_I;
       
    }

    private onCreateGuild(data: any): void {
        if (data.success) {
            Tip.showTip("创建仙盟成功");
        }
        if(this._createWin && this._createWin.isShow){
            this._createWin.hide();
        }
    }
    /**
     * 仙盟日志
     * S2C_SGetGuildLogs
     */
    private onGuildLogInfos(data:any):void{
        CacheManager.guildNew.setGuildLog(data.logs.data);
        if(this.isShow){
            this._moduleView.updateLogs();
        }
    }   

    /**
     * 服务器追加仙盟日志
     * SGuildLog
     */
    private onGuildAppendLog(data:any):void{
        CacheManager.guildNew.appendLog(data);     
        if(this.isShow){
            this._moduleView.updateLogs();
        } 
    }

    /**
     * 搜索仙盟返回S2C_SSearchGuilds
     */
    private onSearchGuild(data: any): void {
        let guilds:any[] = data.guilds.data;
        App.ArrayUtils.sortOn(guilds,"rank_I");
		
        if(this._isShowSearchWin && !CacheManager.guildNew.isJoinedGuild()){
            this._isShowSearchWin = false;
            if(!this._searchListWin){
                this._searchListWin = new GuildNewSearchListWin();
            }
            if(this._searchListWin.isShow){
                this._searchListWin.updateAll(guilds);   
            }else{
                this._searchListWin.show(guilds);   
            }
                     
        }

        if(this.isShow){
            this._moduleView.updateList(guilds);
        }
    }

    /**
     * 背包更新了
     */
    private onPackChange(): void {
        
    }

    /**
     * 获取仙盟信息返回 S2C_SGetGuildInfo
     */
    private onGuildInfo(data: any): void {
        CacheManager.guildNew.guildInfo = data.guildInfo;
        let isMy:boolean = CacheManager.guildNew.isMyGuild(data.guildInfo.guildId_I);
        if(this.isShow){
            this._moduleView.updateBasics();   
                      
        }
        if(this._donateWin && this._donateWin.isShow){
            this._donateWin.updateAll();
        }        
    }

    /**
     * 申请列表返回 S2C_SGetApplyList
     */
    private onGetApplyList(data: any): void { 
        let guildApplys:any[] = data.guildApplys.data;  // data.guildApplys[i].data SPublicMiniPlayer       
        if(this._aplyWin && this._aplyWin.isShow){
            if(guildApplys.length==0 && !this._isShowAplyWin){
                this._aplyWin.hide(); //处理完所有申请了 关闭界面
            }else{
                this._aplyWin.updateAll(guildApplys);
            }
        }
        this._isShowAplyWin  = false;
        if(this.isShow){
            this._moduleView.updateBasicsLookupEff(guildApplys.length>0);
        }
    }
    /**
     * 捐献金钱返回 S2C_SDonateMoney
     */
    private onDonateMoney(data:any):void{
        this.onReqGetGuildInfo({ "guildId": 0 });   
    }

    /**
     * 成员列表返回 S2C_SGetGuildPlayerInfo
     */
    private onGetGuildPlayers(data: any): void {
        if(this.isShow){
            let guildPlayers:any[] = data.guildPlayers.data;
            
            this._moduleView.upateMember(guildPlayers);
        }
    }

    /**
     * 处理申请返回。重新查询申请列表
     */
    private onDealApply(): void {
        this.onReqGetGuildApplyList({ "guildId": 0 });
    }

    /**
     * S2C_SApplyGuild
     */
    private onApplyGuild(data:any):void{
        Tip.showTip(LangGuildNew.L10);
    }

    /**
     * 更新公告成功。需要重新获取仙盟信息。
     */
    private onChangeNotice(data: any): void {
        let doNotice: boolean = data.doNotice;
        Tip.showTip("仙盟公告保存成功");        
        this.onReqGetGuildInfo({ "guildId": 0 });
    }

    /**
     * 成员操作返回。重新获取成员列表
     * @param data S2C_SMemberOper
     */
    private onMemberOper(data: any): void {
        let playerGuildInfo: any = CacheManager.guildNew.playerGuildInfo;
        if (playerGuildInfo.guildId_I > 0) {
            this.getGuildMemberList({ "guildId": 0 });
        }
    }

    /**
     * 心法返回
     * @param data SVeinInfo
     */
    private onVeinInfo(data: any): void {
        CacheManager.guildNew.vienInfo = data;
    }
    /**
     * 请求申请加入仙盟
     */
    private onReqAplyJoin(guildId:number):void{
        if(ConfigManager.mgOpen.isOpenedByKey(IconResId[IconResId.GuildNew],true)){
            ProxyManager.guild.apply(guildId);
            //CacheManager.guildNew.addAplyJoinId(guildId);
            // if(this._searchListWin && this._searchListWin.isShow ){
            //     this._searchListWin.updateAll();
            // }
        }
        
    }

	private onOpenSearch(needTips:boolean = false):void{        
        if(ConfigManager.mgOpen.isOpenedByKey(ModuleEnum[ModuleEnum.GuildNew],true)) {
            if(needTips) {
                Tip.showTip("请先加入仙盟");
            }
            this.onReqSearchGuild({ "name": "", "includeFull": true });	
        }
	}
    
	private onOpenCreate():void{
		if(!this._createWin){
			this._createWin = new GuildNewCreateWin();
		}
		this._createWin.show();
	}

    /**
     * 心法更新
     * @param data SDictIntInt
     */
    private onVeinNew(data: any): void {
        CacheManager.guildNew.vienNew = data;
        
    }
        

    /**
     * 退出仙盟
     */
    private onReqExitGuild(): void {
        let tip: string = "";
        let isLeader: boolean = CacheManager.guildNew.isLeader;
        if (isLeader) {
            tip = "盟主退盟后将解散仙盟，确定要退出仙盟么？\n提示：退出后仙盟修炼等级将保留，但贡献将被清空。"
        } else {
            tip = "确定要退出仙盟么？\n提示：退出后仙盟修炼等级将保留，但贡献将被清空。"
        }
        Alert.alert(tip, () => {
            if (isLeader) {
                ProxyManager.guild.disband();
            } else {
                ProxyManager.guild.exit();
            }
            this.hide();
        }, this);
    }
    /**打开查看申请列表 */
    private onOpenLookupAply():void{
        if(!this._aplyWin){
            this._aplyWin = new GuildNewAplyListPanel();
        }
        this._aplyWin.show();
        this._isShowAplyWin = true;
        this.onReqGetGuildApplyList({guildId:0});
    }

    /**
     * 升级仙盟
     */
    private onReqUpgradeGuild(): void {
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
     * 保存申请设置
     */
    private onReqApplySetSave(data: any): void {
        ProxyManager.guild.saveApplySet(data.level, data.fight);
    }

    /**
     * 自动批准保存
     */
    private onReqAutoAgreeSave(data: any): void {
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

    /**请求改变职位 */
    private onReqChangePosition(data):void{
        let miniPlayer:any = data.miniPlayer;
        let toPlayerId:number = miniPlayer.entityId.id_I;
        let alerTips:string = "";
        let nameClr:string = Color.Color_6;
        switch(data.opt){
            case EGuildPosition.EGuildLeader: //禅让                 
                alerTips = `是否禅让盟主给[<font color='${nameClr}'>${miniPlayer.name_S}</font>]`;
                break;
            case EGuildPosition.EGuildDeputyLeader: //升职  [玩家名]
                alerTips = `是否提升[<font color='${nameClr}'>${miniPlayer.name_S}</font>]为副盟主`;
                break;
            case EGuildPosition.EGuildMember: //降职
                alerTips = `是否将副盟主[<font color='${nameClr}'>${miniPlayer.name_S}</font>]降职为普通成员`;
                break;
            case EGuildPosition.EGuildNotMember: //踢出
                alerTips = `是否将[<font color='${nameClr}'>${miniPlayer.name_S}</font>]踢出仙盟？`;
                break;
        }
        if(alerTips!=""){
            Alert.alert(alerTips,()=>{
                ProxyManager.guild.memberOper(toPlayerId,data.opt);
            },this);
        }else{
            ProxyManager.guild.memberOper(toPlayerId,data.opt);
        }
        
    }

    private checkDonateTip():void {
        if(this.isShow){
            this._moduleView.updateTips();
        }
        if(this._donateWin && this._donateWin.isShow) {
            this._donateWin.checkTips();
        }
    }
}