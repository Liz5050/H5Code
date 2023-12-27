
class MailController extends BaseController {
    private module: MailModule;
    private mailWindow: MailWindow;

    public constructor() {
        super(ModuleEnum.Mail);

        // this.friendView = new FriendView(this, LayerManager.UI_Popup);
        // App.ViewManager.register(ViewConst.Friend, this.friendView);
    }

    public initView(): BaseGUIView{
        this.module = new MailModule(this.moduleId);
        return this.module;
    }

    public addListenerOnInit(): void {
        // this.addMsgListener(EGateCommand[EGateCommand.ECmdGateMailNotice], this.onMailNotice, this);
        // this.addMsgListener(ECmdGame[ECmdGame.ECmdGameQueryMail], this.onQueryMail, this);
        // this.addMsgListener(ECmdGame[ECmdGame.ECmdGameReadMail], this.onReadMail, this);
        // this.addMsgListener(ECmdGame[ECmdGame.ECmdGameBatchMailAttachment], this.onBatchMailAttachment, this);
        // this.addListen0(UIEventEnum.MailIcon, this.updateMailTip, this);
        // this.addListen0(LocalEventEnum.MailQuery, this.mailQuery, this);
    }

    public addListenerOnShow(): void {
        // this.addListen1(UIEventEnum.MailDetailOpen, this.mailDetailOpen, this);
    }

    /**
     * 打开邮件详情窗口
     */
    private mailDetailOpen(data: any): void{
        if (!this.mailWindow) {
			this.mailWindow = new MailWindow();
		}
		this.mailWindow.show();
        this.mailWindow.updateDetail(data);
    }

    private updateMailTip(value: boolean): void{
        CacheManager.mail.isShowMail = value;
        if(this.isShow){
            this.module.updateMailPanelTips();
        }
    }

    /**
     * 查询邮件
     */
    private mailQuery():void{
        ProxyManager.mail.queryMail(EQueryCondition.EQueryConditionByType, 0, 0, 0, 0, true);
    }


    /**
	 * 邮件通知
	 * @param data SMailNotice
	 */
    private onMailNotice(data: any): void{
        let type: number = data.type_I;
        CacheManager.mail.isShowMail = true;
        EventManager.dispatch(UIEventEnum.MailIconUpdate, true);
        Log.trace(Log.UI, "*******************************收到邮件通知，邮件图标显示*******************************");
    }


    /**
	 * 查询邮件返回
	 * @param data S2C_SQueryMail
	 */
    private onQueryMail(data: any): void{
        if(this.isShow){
            let mails: Array<any> = data.outMails.data;//每一个mail都是一个SMail结构体
            let startIndex: number = data.outStartIndex;// 返回的下标
            let totalCount: number = data.outTotalCount;// 返回的总邮件数
            if(mails.length > 0){
                this.module.updateMail(mails);
                return;
            }
        }
        CacheManager.mail.isShowMail = false;
        EventManager.dispatch(UIEventEnum.MailIconUpdate, false);
    }


    /**
	 * 阅读邮件返回
	 * @param data S2C_SReadMail
	 */
    private onReadMail(data: any): void{
        // let mail: any = data.mail;//SMail结构体
        if(data != null && this.module){
            this.module.updateMailItem(data.mail);
            // EventManager.dispatch(UIEventEnum.MailDetailOpen, data.mail);
        }
    }


    /**
	 * 批量提取附件返回
	 * @param data S2C_SBatchMailAttachment
	 */
    private onBatchMailAttachment(data: any): void{
        let mailIds: any = {};
        if(data.getAttachmentMailIds != null && data.getAttachmentMailIds.data_L64.length > 0){  // 真正提取了附件的邮件id列表
            for(let id of data.getAttachmentMailIds.data_L64){
                mailIds[Number(id)] = true;
            }
            this.module.updateAttachment(mailIds);
        }
        if(this.mailWindow && this.mailWindow.isShow){
            this.mailWindow.updateAttachment(Number(data.getAttachmentMailIds.data_L64[0]));
        }
    }
}