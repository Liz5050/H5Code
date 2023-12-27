class FriendMailItem extends ListRenderer{
	private titleTxt: fairygui.GRichTextField;
	private dateTxt: fairygui.GTextField;
	private attachmentController: fairygui.Controller;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.titleTxt = this.getChild("txt_title").asRichTextField;
		this.dateTxt = this.getChild("txt_date").asTextField;
		this.attachmentController = this.getController("c1");
		this.addClickListener(this.clickItem, this);
	}

	public setData(data: any): void{
		this._data = data;
		let titles: Array<string> = data.title_S.split("#");
		let titleStr: string = titles[1] ? titles[1] : data.title_S;
		if(data.status_I == EMailStatus.EMailStatusUnRead){
			titleStr += `<font color = ${Color.GreenCommon}>(未读)</font>`;
		}else if(data.status_I == EMailStatus.EMailStatusRead){
			titleStr += `<font color = "#979595">(已读)</font>`;
		}
		this.titleTxt.text = titleStr;
		this.dateTxt.text = this.getFormatBySecond(new Date(data.mailDt_DT*1000));
		this.attachmentController.selectedIndex = data.hadAttachment_I == EMailAttach.EMailAttachYes ? 1 : 0;
	}

	private clickItem(): void{
		ProxyManager.friend.readMail(this.mailId);
		EventManager.dispatch(UIEventEnum.MailDetailOpen, this._data);
	}

	public set attachment(value: number){
		this._data.hadAttachment_I = value;
		this.attachmentController.selectedIndex = value;
	}

	/**附件状态 */
	public get attachment(): number{
		return this._data.hadAttachment_I;
	}

	public get mailId(): number{
		if(this._data){
			return this._data.mailId_L64;
		}
		return 0;
	}

	/**时间 year-month-day  hours:minute:second */
	private getFormatBySecond(date: Date): string{
		//  var date: Date = new Date(second);
        let year: number = date.getFullYear();
        let month: number = date.getMonth() + 1; 	//返回的月份从0-11；
        let day: number = date.getDate();
        let hours: number = date.getHours();
        let minute: number = date.getMinutes();
        let second: number = date.getSeconds();
		// let year_S: string;
		let month_S: string;
		let day_S: string;
		let hours_S: string;
		let minute_S: string;
		let second_S: string;
		if(month < 10){
			month_S = "0" + month;
		}else{
			month_S = "" + month;
		}
		if(day < 10){
			day_S = "0" + day;
		}else{
			day_S = "" + day;
		}
		if(hours < 10){
			hours_S = "0" + hours;
		}else{
			hours_S = "" + hours;
		}
		if(minute < 10){
			minute_S = "0" + minute;
		}else{
			minute_S = "" + minute;
		}
		if(second < 10){
			second_S = "0" + second;
		}else{
			second_S = "" + second;
		}
        return year + "-" + month_S + "-" + day_S + "     " + hours_S + ":" + minute_S + ":" + second_S;
	}
}