class ExamModule extends BaseWindow {
	private questionTxt: fairygui.GTextField;
	private curNumTxt: fairygui.GTextField;
	private countDownTxt: fairygui.GTextField;
	private myRankTxt: fairygui.GTextField;
	private myScoresTxt: fairygui.GTextField;
	private correctTxt: fairygui.GTextField;
	private rankList: List;
	private answerList: List;
	private rankBtn: fairygui.GButton;

	private quesId: number;
	private curQuesNum: number;
	private answerSelected: number;
	private countDown: number;
	private isWait: boolean;

	private timerHandler: number = -1;

	public constructor(moduleId: ModuleEnum = null) {
		super(PackNameEnum.Exam, "ExamModule", moduleId);
	}

	public initOptUI(): void {
		this.questionTxt = this.getGObject("txt_question").asTextField;
		this.curNumTxt = this.getGObject("txt_curNum").asTextField;
		this.countDownTxt = this.getGObject("txt_countDown").asTextField;
		this.myRankTxt = this.getGObject("txt_myRank").asTextField;
		this.myScoresTxt = this.getGObject("txt_myScores").asTextField;
		this.correctTxt = this.getGObject("txt_correct").asTextField;
		this.rankList = new List(this.getGObject("list_rank").asList);
		this.answerList = new List(this.getGObject("list_answer").asList);
		this.rankBtn = this.getGObject("btn_rank").asButton;

		this.rankBtn.addClickListener(this.clickRankBtn, this);
		this.answerList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onSelectAnswer, this);
	}

	public updateAll(){
		CacheManager.sysSet.autoCopy = false;
		// ProxyManager.exam.getQuestionInfo();
		this.updateInfo();
	}

	public hide(): void{
		super.hide();
		// App.TimerManager.remove(this.onCountDown, this);
		this.removeTimer();
		CacheManager.sysSet.autoCopy = true;
	}

	private clickRankBtn(): void{
		EventManager.dispatch(UIEventEnum.ExamRankOpen);
	}

	private onSelectAnswer(): void{
		this.answerSelected = this.answerList.selectedIndex;
		CacheManager.exam.selOpt = this.answerSelected;
		this.answerList.list.touchable = false;
		ProxyManager.exam.answerQuestion(this.quesId, this.answerSelected);
	}

	public updateInfo(): void{
		this.curQuesNum = CacheManager.exam.curNo;
		this.answerSelected = CacheManager.exam.selOpt;
		this.countDown = CacheManager.exam.countDown;
		if(this.countDown > 5){
			this.countDown -= 5;
			this.isWait = false;
		}else{
			this.isWait = true;
		}
		this.updateCountTxt();
		// App.TimerManager.doTimer(1000, 0, this.onCountDown, this);
		if(this.timerHandler == -1){
			this.timerHandler = egret.setInterval(this.onCountDown,this,1000);
		}
		this.updateQuestion();
	}

	public updateQuestion(): void{
		let quesData: any = CacheManager.exam.getQuesData(this.curQuesNum);
		if(quesData){
			this.curNumTxt.text = `第${GameDef.NumberName[this.curQuesNum]}题  (${this.curQuesNum}/${CacheManager.exam.totalNum})`;
			this.questionTxt.text = `    ${quesData.ques}`;
			this.quesId = quesData.quesId;
			this.answerList.data = quesData.answer;
			this.answerList.selectedIndex = this.answerSelected;

			this.updateAnswerStatus();
		}else{
			// App.TimerManager.remove(this.onCountDown, this);
			this.removeTimer();
			this.countDownTxt.text = "";
		}

		this.updateRank();
	}

	public updateAnswerStatus(): void{
		if(this.answerSelected != -1 || this.isWait){
			this.answerList.list.touchable = false;
			CacheManager.exam.isChecked = true;
		}else{
			this.answerList.list.touchable = true;
			CacheManager.exam.isChecked = false;
		}
		this.answerList.refresh();
		this.correctTxt.text = `答对题数： ${CacheManager.exam.rightNum}`;
		this.myScoresTxt.text = `积分：${CacheManager.exam.myScore}分`;
	}

	public updateRank(): void{
		let rankInfo: Array<any> = CacheManager.exam.rankList;
		let data: Array<any> = rankInfo.slice(0, 3);
		this.rankList.data = data;

		this.myRankTxt.text = `排名：${CacheManager.exam.myRank}名`;
	}

	private updateCountTxt(): void{
		this.countDownTxt.text = `${this.isWait ? "准备": "科举比赛"}：${this.countDown}S`;
	}

	private onCountDown(): void{
		this.countDown --;
		if(this.countDown <= 0){
			if(!this.isWait){
				if(this.answerSelected == -1){
					ProxyManager.exam.answerQuestion(this.quesId);
				}
				this.countDown = 5;
				this.isWait = true;
				// this.updateAnswerStatus();
			}else{
				this.countDown = 15;
				this.isWait = false;
				this.answerSelected = -1;
				this.curQuesNum ++;
				this.updateQuestion();
			}
		}
		this.updateCountTxt();
	}

	private removeTimer():void {
        // App.TimerManager.remove(this.onCountDown, this);
		if(this.timerHandler != -1) {
			egret.clearInterval(this.timerHandler);
			this.timerHandler = -1;
		}
    }
}