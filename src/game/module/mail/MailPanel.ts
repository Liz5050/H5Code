/**
 * 邮件面板
 */
class MailPanel extends BaseTabView{
	private mailList: List;
	private deleteBtn: fairygui.GButton;
	private readBtn: fairygui.GButton;
	private receiveBtn: fairygui.GButton;

	public constructor() {
		super();
	}

	public initOptUI(): void{
		this.mailList = new List(this.getGObject("list_mail").asList);
		this.getGObject("btn_allDelete").addClickListener(this.clickDeleteBtn, this);
		this.getGObject("btn_allRead").addClickListener(this.clickReadBtn, this);
		this.getGObject("btn_allReceive").addClickListener(this.clickReceiveBtn, this);
	}

	public updateAll(): void{
		EventManager.dispatch(LocalEventEnum.MailQuery);
	}

	/**点击一键删除 */
	private clickDeleteBtn(): void{
		let item: MailItem;
		let ids: Array<any> = [];
		if(this.mailList.list.numItems == 0){
			Tip.showTip("没有可删除的邮件");
			return;
		}
		for (let i = 0; i < this.mailList.list.numItems; i++) {
			item = <MailItem>this.mailList.list.getChildAt(i);
			if(Number(item.attachment) != EMailAttach.EMailAttachYes){
				ids.push(item.mailId);
			}
		}
		if(ids.length > 0){
			ProxyManager.mail.removeMail({"data_L64": ids});
		}
		else{
			Tip.showTip("有附件的邮件无法删除");
		}
	}

	/**点击一键阅读 */
	private clickReadBtn(): void{
		let item: MailItem;
		let ids: Array<any> = [];
		for (let i = 0; i < this.mailList.list.numItems; i++) {
			item = <MailItem>this.mailList.list.getChildAt(i);
			if(Number(item.status) == EMailStatus.EMailStatusUnRead){
				ids.push(item.mailId);
			}
		}
		if(ids.length > 0){
			for(let id of ids){
				ProxyManager.mail.readMail(id);
			}
		}
		else{
			Tip.showTip("没有可阅读的邮件");
		}
	}

	/**点击一键领取 */
	private clickReceiveBtn(): void{
		let item: MailItem;
		let ids: Array<any> = [];
		for (let i = 0; i < this.mailList.list.numItems; i++) {
			item = <MailItem>this.mailList.list.getChildAt(i);
			if(Number(item.attachment) == EMailAttach.EMailAttachYes){
				ids.push(item.mailId);
			}
		}
		if(ids.length > 0){
			for(let id of ids){
				ProxyManager.mail.readMail(id);
			}
			ProxyManager.mail.batchMailAttachment({"data_L64": ids});
		}
		else{
			Tip.showTip("没有可领取的附件");
		}
	}

	/**更新邮件列表 */
	public updateMailList(data: Array<any>): void{
		this.mailList.data = data;
	}

	/**更新邮件某一项（阅读） */
	public updateMailListItem(data: any): void{
		let item: MailItem;
		for (let i = 0; i < this.mailList.list.numItems; i++) {
			item = <MailItem>this.mailList.list.getChildAt(i);
			if(Number(item.mailId) == Number(data.mailId_L64)){
				this.mailList.updateListItem(i, data);
				break;
			}
		}
		this.updateMailIcon();
	}

	/**更新邮件附件的状态 */
	public updateMailAttachment(data: any): void{
		let item: MailItem;
		for (let i = 0; i < this.mailList.list.numItems; i++) {
			item = <MailItem>this.mailList.list.getChildAt(i);
			if(data[Number(item.mailId)]){
				if(item.attachment == EMailAttach.EMailAttachYes){
					item.attachment = EMailAttach.EMailAttachHadGet;
					this.mailList.updateListItem(i, item.getData());
				}
			}
		}
		this.updateMailIcon();
	}

	/**删除邮件 */
	public deleteMailItem(data: Array<any>): void{
		let item: MailItem;
		for (let i = 0; i < this.mailList.list.numItems; i++) {
			item = <MailItem>this.mailList.list.getChildAt(i);
			if(data[Number(item.mailId)]){
				this.mailList.deleteListItem(i);
				i--;
			}
		}
		// EventManager.dispatch(UIEventEnum.MailIcon, true);
		this.updateMailIcon();
		ProxyManager.mail.queryMail(EQueryCondition.EQueryConditionByType, 0, 0, 0, 0, true);
	}

	private updateMailIcon(): void{
		let item: MailItem;
		let isShow: boolean = false;
		for (let i = 0; i < this.mailList.list.numItems; i++) {
			item = <MailItem>this.mailList.list.getChildAt(i);
			if(item.attachment == EMailAttach.EMailAttachYes || item.status == EMailStatus.EMailStatusUnRead){
				isShow = true;
				break;
			}
		}
		EventManager.dispatch(UIEventEnum.MailIconUpdate, isShow);
	}
}