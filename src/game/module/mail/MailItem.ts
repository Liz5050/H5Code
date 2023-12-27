class MailItem extends ListRenderer{
	private readController: fairygui.Controller;
	private attachmentController: fairygui.Controller;
	private titleTxt: fairygui.GTextField;
	private dateTxt: fairygui.GTextField;


	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void{
		super.constructFromXML(xml);
		this.readController = this.getController("c1");
		this.attachmentController = this.getController("c2");
		this.titleTxt = this.getChild("txt_title").asTextField;
		this.dateTxt = this.getChild("txt_date").asTextField;
		this.addClickListener(this.click, this);
	}

	public setData(data: any): void{
		this._data = data;
		this.titleTxt.text = data.title_S;
		// this.dateTxt.text = App.DateUtils.getFormatBySecond(new Date(data.mailDt_DT*1000).getTime(), 2);
		this.dateTxt.text = this.getFormatBySecond(new Date(data.mailDt_DT*1000));
		this.readController.selectedIndex = data.status_I - 1;
		this.attachmentController.selectedIndex = data.hadAttachment_I;
	}

	private click(): void{
		ProxyManager.mail.readMail(this.mailId);
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

	public getData(): any{
		return this._data;
	}

	public get mailId(): number{
		if(this._data){
			return this._data.mailId_L64;
		}
		return 0;
	}

	/**邮件阅读状态 */
	public get status(): number{
		if(this._data){
			return this._data.status_I;
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
        return year + "-" + month_S + "-" + day_S + "       " + hours_S + ":" + minute_S + ":" + second_S;
	}
}