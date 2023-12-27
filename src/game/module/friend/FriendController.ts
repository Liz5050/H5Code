class FriendController extends BaseController {
    private module: FriendModule;
    private searchFriendWindow: SearchFriendWindow;
    private mailDetailWindow: MailDetailWindow;

    public constructor() {
        super(ModuleEnum.Friend);
    }

    public initView(): BaseGUIView{
        this.module = new FriendModule(this.moduleId);
        return this.module;
    }

    public addListenerOnInit(): void {
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFriendApplyList], this.friendApplyListUpdate, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFriendApplyDel], this.friendApplyDelUpdate, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFriendApply], this.friendApplyUpdate, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFriendReply], this.friendReplyUpdate, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFriendRecord], this.friendRecordUpdate, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFriendOnlineStatus], this.friendOnlineStatusUpdate, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFriendOfflineChatFriendId], this.onOfflineFriendIdList, this);
        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateFriendOfflineChatMsgs],this.onOfflineChatMsgs,this);

        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameGetFriendList], this.onGetFriendList, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameFriendApply], this.onFriendApply, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameFriendReply], this.onFriendReply, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameFriendAddToBlackList], this.onFriendAddToBlackList, this);
        

        this.addMsgListener(EGateCommand[EGateCommand.ECmdGateMailNotice], this.onMailNotice, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameQueryMail], this.onQueryMail, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameReadMail], this.onReadMail, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameBatchMailAttachment], this.onBatchMailAttachment, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameBatchProcessMail], this.onBatchProcessMail, this);
        this.addMsgListener(ECmdGame[ECmdGame.ECmdGameRemoveMail], this.onRemoveMail, this);
        
        this.addListen0(LocalEventEnum.GetFriendListByType, this.getFriendListByTypeHandler, this);
        this.addListen0(LocalEventEnum.FriendRemove, this.friendRemoveHandler, this);
        this.addListen0(LocalEventEnum.FriendAddToBlackList, this.friendAddToBlackListHandler, this);
        this.addListen0(LocalEventEnum.FriendCrossShield, this.onCrossShield, this);

        this.addListen0(LocalEventEnum.MailQuery, this.mailQuery, this);
        this.addListen0(LocalEventEnum.FriendRemoveReadMsgId, this.onRemoveReadId, this);
        // this.addListen0(UIEventEnum.MailIcon, this.updateMailTip, this);

        this.addListen0(UIEventEnum.SearchFriendOpen, this.searchFriendOpen, this);
        this.addListen0(UIEventEnum.MailDetailOpen, this.mailDetailOpen, this);
        this.addListen0(LocalEventEnum.ChatPrivateUpdate,this.onUpdatePrivateChat,this);
        this.addListen0(UIEventEnum.HomeOpened,this.onHomeOpen,this);
        this.addListen0(LocalEventEnum.FriendAddPrivateChat,this.onAddPrivateChatPlayer,this);
    }

    public addListenerOnShow(): void {
        this.addListen1(LocalEventEnum.ChatAppendText,this.onAppendText,this);
        this.addListen1(LocalEventEnum.FriendReqOfflineMsg,this.onReqOfflineMsg,this);       
        this.addListen1(LocalEventEnum.ChatDelPlayerMsg,this.onDelPlayerMsg,this);       
    }

    private onHomeOpen():void{
        this.getFriendListByTypeHandler(EFriendFlag.EFriendFlagFriend);
        this.getFriendListByTypeHandler(EFriendFlag.EFriendFlagBlackList);
    }
    
    private onAppendText(text:string):void{
		if(this.module){
			this.module.appendText(text);		
		}
	}
    /**请求离线聊天数据 */
    private onReqOfflineMsg():void{
        if(CacheManager.friend.offlineReqIds){
            ProxyManager.friend.getFriendGetOfflineMsg(CacheManager.friend.offlineReqIds);
            CacheManager.friend.clearOfflineReqIds();
        }
    }

    private onDelPlayerMsg(data:any):void{
        this.updateModule();
    }

    /**
     * 好友申请列表(登录推送)
     * @param data SApplyMsgList
     */
    private friendApplyListUpdate(data: any): void{
        let applyPlayers: Array<any> = data.msgs.data;//SApplyMsg
        CacheManager.friend.setApplyPlayers(applyPlayers);
        this.updateModule();
    }

    /**
     * 好友申请移除
     * @param data SSeqInt
     */
    private friendApplyDelUpdate(data: any): void{
        for(let id of data.intSeq.data_I){
            CacheManager.friend.delApplyPlayer(id);

        }
        this.updateModule();
    }

    /**
     * 好友申请回复   (用来处理飘字即可)
     * @param data SReplyMsg
     */
    private friendReplyUpdate(data: any): void{
        let applicantId: number = data.applicant.entityId.id_I;
        let replierName: string = data.replier.name_S;
        let isApplicant: boolean = applicantId == CacheManager.role.getPlayerId();
        switch(data.result_I){
            case EFriendReplyResult.EFriendReplyResultAccept:
                if(isApplicant){
                    Tip.showTip(`${replierName}同意了你的好友申请`);
                }
                break;
            case EFriendReplyResult.EFriendReplyResultReject:
                if(isApplicant){
                    Tip.showTip(`${replierName}拒绝了你的好友申请`);
                }
                break;
            case EFriendReplyResult.EFriendReplyApplicantAmountLimit:
                if(isApplicant){
                    Tip.showTip(`你的好友数量已达到上限`);
                }else{
                    Tip.showTip(`对方好友数量已达到上限`);
                }
                break;
            case EFriendReplyResult.EFriendReplyReplierAmountLimit:
                if(isApplicant){
                    Tip.showTip(`对方好友数量已达到上限`);
                }else{
                    Tip.showTip(`你的好友数量已达到上限`);
                }
                break;
            case EFriendReplyResult.EFriendReplyApplicantBacklist:
                if(isApplicant){
                    Tip.showTip(`你已将对方列入黑名单`);
                }else{
                    Tip.showTip(`你已被对方列为黑名单`);
                }
                break;
            case EFriendReplyResult.EFriendReplyReplierBacklist:
                if(isApplicant){
                    Tip.showTip(`你已被对方列为黑名单`);
                }else{
                    Tip.showTip(`你已将对方列入黑名单`);
                }
                break;
            case EFriendReplyResult.EFriendReplyApplicantFriend:
                Tip.showTip(`对方已经是你的好友`);
                break;
            case EFriendReplyResult.EFriendReplyReplierFriend:
                Tip.showTip(`对方已经是你的好友`);
                break;
        }
    }

    /**
     * 好友申请
     * @param data SApplyMsg
     */
    private friendApplyUpdate(data: any): void{
        CacheManager.friend.addApplyPlayer(data.fromPlayer);
        this.updateModule();
    }

    /**
     * 好友记录
     * @param data SFriendRecordMsg
     */
    private friendRecordUpdate(data: any): void{
        if(data.type_I == EFriendFlag.EFriendFlagFriend || data.type_I == EFriendFlag.EFriendFlagBlackList){
            CacheManager.friend.updateFriend(data.type_I, data.friendRecord);
            this.updateModule();
        }
    }

     /**
     * 好友在线状态
     * @param data SFriendOnlineStatusMsg
     */
    private friendOnlineStatusUpdate(data: any): void{
        if(data.flag_I == EFriendFlag.EFriendFlagFriend){
            CacheManager.friend.updateFriendOnlineStatus(data.flag_I, data.fromPlayerId_I, data.onlinestatus_B);
            this.updateModule();
            if(data.onlinestatus_B){
                Tip.showTip(`你的好友${data.fromPlayerName_S}上线了`);
            }else{
                Tip.showTip(`你的好友${data.fromPlayerName_S}下线了`);
            }
        }
    }

    /**离线聊天的玩家id列表,根据该列表请求聊天内容(登录推送) */
    private onOfflineFriendIdList(data:any):void{     
        CacheManager.friend.offlineMsgIds = data;
        this.updateModule();
    }
    /**
	 * 好友离线消息返回 SChatMsgList
	 */
	private onOfflineChatMsgs(data:any):void{		
		for(let msg of data.msgs.data){
            CacheManager.chat.setChatMsg(msg,false,false);
        }
        this.onUpdatePrivateChat();
	}
    
    private onUpdatePrivateChat(data:any=null):void{
        let isSel:boolean = false;
        let entityId:any = data?data.entityId:null;
        let isEntityOk:boolean = entityId && !EntityUtil.isSame(entityId,CacheManager.role.entityInfo.entityId);
        
        if(isEntityOk){
            //设置联系人的聊天时间
            CacheManager.friend.setContactOnline(entityId.id_I,data.talkDt);
        }

        if(this.isShow){           
            this.module.updatePrivateChat();
            if(entityId && this.module.isSelectPlayer(entityId.id_I)){
                isSel = true;
            }
        }

        if(isEntityOk && !isSel){
            CacheManager.friend.dealOnlineMsgId(entityId.id_I,true);
        }
        
        if(this.isShow){
             this.module.updateContactBtnTips();
        }
        this.updateModule();
    }
    /**添加一个玩家到联系人列表顶部 */
    private onAddPrivateChatPlayer(data:any):void{
        CacheManager.friend.setTempContactInfo(data);
        if(this.isShow){
            this.module.updateContactList();
        }        
    }
    private onRemoveReadId(playerId:number):void{
        CacheManager.friend.removeOfflineMsgId(playerId);
        CacheManager.friend.dealOnlineMsgId(playerId,false);
        if(this.isShow){
            this.module.updateContactBtnTips();
        }
        this.setFriendIcoTip();
    }

    /**
     * 获取好友列表返回
     * @param data S2C_SGetFriendList
     */
    private onGetFriendList(data: any): void{
        let friendInfo: Array<any> = data.friendRecords.data;//SFriendRecord
        // CacheManager.friend.friendInfo = friendList;
        CacheManager.friend.updateList(friendInfo);
        this.updateModule();
    }

    /**
     * 好友申请返回
     * @param data S2C_SFriendApply
     */
    private onFriendApply(data: any): void{
        Tip.showTip("好友申请已发送，请耐心等待");
    }

    /**
     * 回复好友申请返回
     * @param data S2C_SFriendReply
     */
    private onFriendReply(data: any): void{

    }

    /**
     * 拉黑玩家返回
     * @param data S2C_SFriendAddToBlackList
     */
    private onFriendAddToBlackList(): void{

    }

    /**
	 * 邮件通知
	 * @param data SMailNotice
	 */
    private onMailNotice(data: any): void{
        let type: number = data.type_I;
        CacheManager.friend.isShowMail = true;
        EventManager.dispatch(UIEventEnum.MailIconUpdate);
        EventManager.dispatch(LocalEventEnum.MailQuery);//查询邮件
        Log.trace(Log.UI, "*******************************收到邮件通知，邮件图标显示*******************************");
    }

    /**
	 * 查询邮件返回
	 * @param data S2C_SQueryMail
	 */
    private onQueryMail(data: any): void{
        // let mails: Array<any> = data.outMails.data;//每一个mail都是一个SMail结构体
        // let startIndex: number = data.outStartIndex;// 返回的下标
        // let totalCount: number = data.outTotalCount;// 返回的总邮件数

        let mails: Array<any> = data.outMails.data;//每一个mail都是一个SMail结构体
        CacheManager.friend.mailsInfo = mails;
        if(this.isShow){
            this.module.updateMail();
        }
    }

    /**
	 * 阅读邮件返回
	 * @param data S2C_SReadMail
	 */
    private onReadMail(data: any): void{
        let mails: Array<any> = CacheManager.friend.mailsInfo;
        for(let mail of mails){
            if(Number(mail.mailId_L64) == Number(data.mail.mailId_L64)){
                mail.status_I = data.mail.status_I;
                break;
            }
        }
        CacheManager.friend.mailsInfo = mails;
        CacheManager.friend.updateMailIcon();
        this.module.updateMail();
        EventManager.dispatch(UIEventEnum.MailIconUpdate);
    }

    /**
	 * 批量提取附件返回
	 * @param data S2C_SBatchMailAttachment
	 */
    private onBatchMailAttachment(data: any): void{
        let mailIds: any = {};
        let mails: Array<any> = CacheManager.friend.mailsInfo;
        if(data.getAttachmentMailIds != null){  // 真正提取了附件的邮件id列表
            for(let id of data.getAttachmentMailIds.data_L64){
                mailIds[Number(id)] = true;
            }
        }
        for(let mail of mails){
            if(mailIds[mail.mailId_L64]){
                mail.hadAttachment_I = EMailAttach.EMailAttachHadGet;
            }
        }
        CacheManager.friend.mailsInfo = mails;
        CacheManager.friend.updateMailIcon();
        this.module.updateMail();
        if(this.mailDetailWindow && this.mailDetailWindow.isShow){
            // this.mailDetailWindow.updateAttachment(Number(data.getAttachmentMailIds.data_L64[0]));//TODO 优化
            this.mailDetailWindow.hide();
        }
        EventManager.dispatch(UIEventEnum.MailIconUpdate);
    }

    /**
     * 一键处理邮件（未读和未领取）
     */
    private onBatchProcessMail(data: any): void{
        let mailIds: any = {};
        let mails: Array<any> = CacheManager.friend.mailsInfo;
        let titles: Array<string>;
        if(data.getAttachmentMailIds != null){  // 真正提取了附件的邮件id列表
            for(let id of data.getAttachmentMailIds.data_L64){
                mailIds[Number(id)] = true;
            }
        }
        for(let mail of mails){
            if(mailIds[mail.mailId_L64]){
                mail.hadAttachment_I = EMailAttach.EMailAttachHadGet;
                mail.status_I = EMailStatus.EMailStatusRead;
            }
            titles = mail.title_S.split("#");
            if(!titles[1] || (titles[1] && Number(titles[0]) == 0)){
                mail.status_I = EMailStatus.EMailStatusRead;
            }
        }
        CacheManager.friend.mailsInfo = mails;
        CacheManager.friend.updateMailIcon();
        EventManager.dispatch(UIEventEnum.MailIconUpdate);
        this.module.updateMail();
    }

    /**
     * 删除邮件返回
     * @param data S2C_SRemoveMail
     */
    private onRemoveMail(data: any): void{
        EventManager.dispatch(LocalEventEnum.MailQuery);//查询邮件
    }

    /**获取好友列表 */
    private getFriendListByTypeHandler(flag: EFriendFlag): void{
        ProxyManager.friend.getFriendList(flag);
    }

    /**删除好友 */
    private friendRemoveHandler(player2Id: number, flag: EFriendFlag): void{
        ProxyManager.friend.friendRemove(player2Id, flag);
    }

    private onCrossShield(playerId:number):void{
        CacheManager.friend.addCrossShield(playerId);
    }

    /**拉黑玩家 */
    private friendAddToBlackListHandler(playerId: number): void{
        if(playerId){
            ProxyManager.friend.friendAddToBlackList(playerId);
        }
    }

    /**
     * 查询邮件
     */
    private mailQuery():void{
        ProxyManager.friend.queryMail(EQueryCondition.EQueryConditionByType, 0, 0, 0, 0, true);
    }

    // /**更新邮件红点 */
    // private updateMailTip(value: boolean): void{
    //     CacheManager.friend.isShowMail = value;
    //     if(this.isShow){
    //         this.module.updateMailBtnTips();
    //     }
    // }

    /**打开好友添加界面 */
    private searchFriendOpen(): void{
        if(!this.searchFriendWindow){
            this.searchFriendWindow = new SearchFriendWindow();
        }
        this.searchFriendWindow.show();
    }

    /**
     * 打开邮件详情窗口
     */
    private mailDetailOpen(data: any): void{
        if (!this.mailDetailWindow) {
			this.mailDetailWindow = new MailDetailWindow();
		}
		this.mailDetailWindow.show();
        this.mailDetailWindow.updateDetail(data);
    }

    private updateModule(): void{
        if(this.isShow){
            this.module.friendListUpdate();
        }
        this.setFriendIcoTip();
    }
    private setFriendIcoTip():void{
        // EventManager.dispatch(LocalEventEnum.HomeIconSetTip,IconResId.Friend,CacheManager.friend.checkTips(),new egret.Point(54, -15));
        EventManager.dispatch(LocalEventEnum.HomeFriendIconUpdate);
    }
}