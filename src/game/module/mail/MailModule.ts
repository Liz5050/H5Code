/**
 * 好友
 */
class MailModule extends BaseTabModule{

	public constructor(moduleId: ModuleEnum) {
		super(ModuleEnum.Mail, PackNameEnum.Mail);
	}

	public initOptUI(): void{
		super.initOptUI();
		this.className = {
			[PanelTabType.FriendMail]:["MailPanel", MailPanel]
		};

	}

	public updateAll(): void{
		this.checkAllTabBtn();
	}

	public checkAllTabBtn(): void{
		this.updateMailPanelTips();
	}

	/**邮件红点 */
	public updateMailPanelTips():void {
		this.setBtnTips(PanelTabType.FriendMail, CacheManager.mail.isShowMail);
	}

	/**更新邮件数据 */
	public updateMail(data: Array<any>): void{
		if(this.curPanel instanceof MailPanel){
			this.curPanel.updateMailList(data);
		}
	}

	/**更新邮件某一项数据 */
	public updateMailItem(data: any): void{
		if(this.curPanel instanceof MailPanel){
			this.curPanel.updateMailListItem(data);
		}
	}

	/**更新附件状态 */
	public updateAttachment(data: any): void{
		if(this.curPanel instanceof MailPanel){
			this.curPanel.updateMailAttachment(data);
		}
	}

	/**删除邮件 */
	public deletMail(data: any): void{
		if(this.curPanel instanceof MailPanel){
			this.curPanel.deleteMailItem(data);
		}
	}
}