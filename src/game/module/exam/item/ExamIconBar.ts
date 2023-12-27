class ExamIconBar extends fairygui.GComponent {
	private countTxt: fairygui.GTextField;
	private mc:UIMovieClip;

	private count: number;
	public desc: string = "";

	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.countTxt = this.getChild("txt_count").asTextField;
		this.addClickListener(this.onOpenExamWindow, this);

	}

	public updateAll(): void {
		this.updateStatus();
	}

	private updateStatus(): void{
		App.TimerManager.remove(this.countDown, this);
		this.countTxt.text = "";
		this.removeEffect();
		if(!CacheManager.exam.isExamStart()){
			this.count = CacheManager.exam.leftOpenTime;
			this.desc = "{0}开启";
		}else{
			this.count = CacheManager.exam.leftEndTime;
			this.desc = "{0}结束";
			this.showEffect();

			//更新日常红点
			EventManager.dispatch(LocalEventEnum.HomeSetTrainRedTip, CacheManager.train.checkTips());
			EventManager.dispatch(UIEventEnum.ExamBtnTips);
			EventManager.dispatch(UIEventEnum.ExamEnter);
		}
		if(this.count >= 0){
			this.updateTxt();
			App.TimerManager.doTimer(1000, 0, this.countDown, this);
		}
	}

	public countDown(): void {
		this.count --;
		if(this.count <= 0){
			this.updateStatus();
		}
		this.updateTxt();
	}

	private updateTxt(): void{
		let timeStr: string = App.DateUtils.getTimeStrBySeconds(this.count, DateUtils.FORMAT_5);
		this.countTxt.text = App.StringUtils.substitude(this.desc, timeStr);
	}


	private onOpenExamWindow() {
		EventManager.dispatch(UIEventEnum.ExamEnter);
	}

	public showEffect():void {
		if(!this.mc) {
			this.mc = UIMovieManager.get(PackNameEnum.MCHomeIcon);
			this.mc.setScale(0.97, 0.97);	
			this.mc.x = 12;
			this.mc.y = -32;
			this.addChild(this.mc);
		}
	}

	public removeEffect():void {
		if(this.mc) {
			this.mc.destroy();
			this.mc = null;
		}
	}
}