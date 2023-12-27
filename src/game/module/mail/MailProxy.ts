class MailProxy extends BaseProxy{
	public constructor() {
		super();
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
		// this.send("ECmdGameQueryMail", {"condition": condition, "type": type, "status": status, "attach": attach, "startIndex": startIndex, "isShowBlack": isShowBlack});
	}

	/**
	 * 阅读邮件
	 * @param mailId 邮件 Id
	 */
	public readMail(mailId: number): void{
		// this.send("ECmdGameReadMail", {"mailId": mailId});
	}


	/**
	 * 批量提取附件
	 * @param mailIds 邮件 Id 列表
	 */
	public batchMailAttachment(mailIds: any): void{
		// this.send("ECmdGameBatchMailAttachment", {"mailIds": mailIds});
	}

	/**
	 * 删除邮件(已屏蔽)
	 * @param mailIds 邮件 Id 列表
	 */
	public removeMail(mailIds: any): void{
		// this.send("ECmdGameRemoveMail", {"mailIds": mailIds});
		// {"data_L64": mailIds}
	}
	
}