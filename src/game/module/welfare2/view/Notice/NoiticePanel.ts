class NoticePanel extends BaseTabView {

    private notice_list : noticeTxt;

    public constructor(){
        super();
    }

    public initOptUI():void {
        this.notice_list = <noticeTxt>this.getGObject("notice_txt");

    }

    public updateAll(data : any) {
        Sdk.sdkNotice(this.setNotice,this);
        EventManager.dispatch(LocalEventEnum.ChangeNoticeTitle,this);
    }

    public setNotice(data : any) {
        this.notice_list.setTxt(data);
    }

}