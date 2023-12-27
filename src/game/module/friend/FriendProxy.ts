class FriendProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 获取好友列表
	 * @param flag 好友所在列表 EFriendFlag
	 */
	public getFriendList(flag: EFriendFlag): void{
		this.send("ECmdGameGetFriendList", {"flag": flag});
	}


	/**
	 * 申请好友
	 * @param player2name 接收申请的玩家名字
	 */
	public friendApply(player2name: string): void{
		this.send("ECmdGameFriendApply", {"player2name": player2name});
	}

	/**
	 * 回复好友申请
	 * @param playerId 发送申请的玩家Id （0 表示所有）
	 * @param result 好友申请结果 EFriendReplyResult
	 * @param type 申请类型(扩展，暂时没有用到)
	 */
	public friendReply(playerId: number, result: EFriendReplyResult, type: number = 0): void{
		this.send("ECmdGameFriendReply", {"playerId": playerId, "result": result, "type": type});
	}

	/**
	 * 删除好友
	 * @param player2Id 好友Id
	 * @param flag 好友所在列表 EFriendFlag
	 */
	public friendRemove(player2Id: number, flag: EFriendFlag): void{
		this.send("ECmdGameFriendRemove", {"player2Id": player2Id, "flag": flag});
	}

	/**
	 * 拉黑玩家
	 * @param playerId 玩家Id
	 */
	public friendAddToBlackList(playerId: number): void{
		this.send("ECmdGameFriendAddToBlackList", {"playerId": playerId});
	}
	/**请求离线消息 C2S_SGetFriendOfflineChatMsgs */
	public getFriendGetOfflineMsg(friendPlayerIds:any):void{
		this.send("ECmdGameGetFriendOfflineChatMsgs",{friendPlayerIds:friendPlayerIds});
	}

	/**
	 * 查询邮件
	 * @param condition 查询条件（或运算）, 见 EQueryCondition ，填 EQueryConditionByType 
	 * @param type 邮件类型，EMailType: 1.系统  2.玩家，填0
	 * @param status 邮件状态，EMailStatus，填0
	 * @param attach 邮件附件，EMailAttach，填0
	 * @param startIndex 起始下标，填0
	 * @param isShowBlack 是否显示黑名单邮件（true 显示,false 不显示)，填true
	 */
	public queryMail(condition: number, type: number, status: number, attach: number, startIndex: number, isShowBlack: boolean): void{
		this.send("ECmdGameQueryMail", {"condition": condition, "type": type, "status": status, "attach": attach, "startIndex": startIndex, "isShowBlack": isShowBlack});
	}

	/**
	 * 阅读邮件
	 * @param mailId 邮件 Id
	 */
	public readMail(mailId: number): void{
		this.send("ECmdGameReadMail", {"mailId": mailId});
	}

	/**
	 * 批量提取附件
	 * @param mailIds 邮件 Id 列表
	 */
	public batchMailAttachment(mailIds: any): void{
		this.send("ECmdGameBatchMailAttachment", {"mailIds": mailIds});
	}

	/**
	 * 一键处理邮件（未读和未领取）
	 * @param mailIds 邮件 Id 列表
	 */
	public batchProcessMail(): void{
		this.send("ECmdGameBatchProcessMail", {});
	}

	/**
	 * 删除邮件
	 * @param mailIds 邮件 Id 列表
	 */
	public removeMail(mailIds: any): void{
		this.send("ECmdGameRemoveMail", {"mailIds": mailIds});
		// {"data_L64": mailIds}
	}

}