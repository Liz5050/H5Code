class FriendMailPanel extends BaseTabView{
	private mailList: List;
	private getRewardBtn: fairygui.GButton;
	private deleteBtn: fairygui.GButton;

	private mailDatas: Array<any>;

	public constructor() {
		super();
		this.isDestroyOnHide = false;
	}

	public initOptUI(): void{
		this.mailList = new List(this.getGObject("list_mail").asList);
		this.getRewardBtn = this.getGObject("btn_getReward").asButton;
		this.deleteBtn = this.getGObject("btn_delete").asButton;

		this.getRewardBtn.addClickListener(this.clickGetRewardBtn, this);
		this.deleteBtn.addClickListener(this.clickDeleteBtn, this);
	}

	public updateAll(): void{
		this.getRewardBtn.visible = false;//更新一键按钮
		if(CacheManager.friend.mailsInfo.length == 0){
			EventManager.dispatch(LocalEventEnum.MailQuery);
		}else{
			this.updateMailList();
		}
	}

	/**点击一键领取 */
	private clickGetRewardBtn(): void{
		ProxyManager.friend.batchProcessMail();
		// let item: MailItem;
		// let ids: Array<any> = [];
		// for (let i = 0; i < this.mailList.list.numItems; i++) {
		// 	item = <MailItem>this.mailList.list.getChildAt(i);
		// 	if(Number(item.attachment) == EMailAttach.EMailAttachYes){
		// 		ids.push(item.mailId);
		// 	}
		// }
		// if(ids.length > 0){
		// 	for(let id of ids){
		// 		ProxyManager.mail.readMail(id);
		// 	}
		// 	ProxyManager.mail.batchMailAttachment({"data_L64": ids});
		// }
		// else{
		// 	Tip.showTip("没有可领取的附件");
		// }
	}

	/**点击一键删除 */
	private clickDeleteBtn(): void{
		let ids: Array<any> = [];
		if(this.mailDatas.length == 0){
			Tip.showTip("没有可删除的邮件");
			return;
		}
		for(let mail of this.mailDatas){
			if(Number(mail.hadAttachment_I) != EMailAttach.EMailAttachYes && mail.status_I != EMailStatus.EMailStatusUnRead){
				ids.push(mail.mailId_L64);
			}
		}
		if(ids.length > 0){
			Alert.alert(`确定删除${ids.length}封邮件，删除后不可恢复`, function(){
				ProxyManager.friend.removeMail({"data_L64": ids});
			}, this);
		}
		else{
			Tip.showTip("有附件或未读的邮件无法删除");
		}
	}

	/**更新邮件列表 */
	public updateMailList(): void{
		this.mailDatas = CacheManager.friend.mailsInfo;
		this.mailList.setVirtual(this.mailDatas);

		let isCanOneKey: boolean = false;
		let titles: Array<string>;
		for(let mail of this.mailDatas){
			if(mail.status_I == EMailStatus.EMailStatusUnRead || mail.hadAttachment_I == EMailAttach.EMailAttachYes){
				titles = mail.title_S.split("#");
				if(!titles[1] || (titles[1] && Number(titles[0]) == 0)){
					isCanOneKey = true;
					break;
				}
			}
		}
		this.getRewardBtn.visible = isCanOneKey;//更新一键按钮

	}

	// /**更新邮件某一项（阅读） */
	// public updateMailListItem(data: any): void{
	// 	let item: FriendMailItem;
	// 	for (let i = 0; i < this.mailList.list.numItems; i++) {
	// 		item = <FriendMailItem>this.mailList.list.getChildAt(i);
	// 		if(Number(item.mailId) == Number(data.mailId_L64)){
	// 			this.mailList.updateListItem(i, data);
	// 			break;
	// 		}
	// 	}
	// 	this.updateMailIcon();
	// }

	// /**更新邮件附件的状态 */
	// public updateMailAttachment(data: any): void{
	// 	let item: FriendMailItem;
	// 	for (let i = 0; i < this.mailList.list.numItems; i++) {
	// 		item = <FriendMailItem>this.mailList.list.getChildAt(i);
	// 		if(data[Number(item.mailId)]){
	// 			if(item.attachment == EMailAttach.EMailAttachYes){
	// 				item.attachment = EMailAttach.EMailAttachHadGet;
	// 				this.mailList.updateListItem(i, item.getData());
	// 			}
	// 		}
	// 	}
	// 	this.updateMailIcon();
	// }

	// private updateMailIcon(): void{
	// 	let item: MailItem;
	// 	let isShow: boolean = false;
	// 	for (let i = 0; i < this.mailList.list.numItems; i++) {
	// 		item = <MailItem>this.mailList.list.getChildAt(i);
	// 		if(item.attachment == EMailAttach.EMailAttachYes || item.status == EMailStatus.EMailStatusUnRead){
	// 			isShow = true;
	// 			break;
	// 		}
	// 	}
	// 	EventManager.dispatch(UIEventEnum.MailIcon, isShow);
	// }
}