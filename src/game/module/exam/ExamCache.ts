class ExamCache implements ICache {
	private info: any;
	private openInfo: any;
	public isChecked: boolean = false;
	public lastChampion: string = "";
	public _showIcon: boolean = false;
	private singleTime: number = 20;

	public constructor() {
	}

	public updateInfo(data: any): void {
		this.info = data;
	}

	public updatOpenInfo(data: any): void{
		this.openInfo = data;
	}

	public updateAnswer(data: any): void{
		this.info.myScore_I = data.myScore_I;
		this.info.rightNum_I = data.rightNum_I;
		this.info.answerOpt_I = data.answerOpt_I;
	}

	public updateRank(data: any): void{
		if(this.info){
			this.info.rankList = data.rankList;
			this.info.myRank_I = data.myRank_I;
		}
	}

	public set showIcon(isShow: boolean){
		this._showIcon = isShow;
	}

	public get showIcon(): boolean{
		if(this._showIcon){
			this._showIcon = this.leftEndTime > 0;
		}
		return this._showIcon;
	}

	//距离开始时间
	public get leftOpenTime():number {
		if(!this.openInfo) {
			return 0;
		}
		return this.openInfo.openDt_DT - CacheManager.serverTime.getServerTime();
	}

	/**距离结束时间 */
	public get leftEndTime():number {
		if(!this.openInfo) {
			return 0;
		}
		return this.openInfo.endDt_DT - CacheManager.serverTime.getServerTime();
	}

	public isExamStart(): boolean{
		// return true;
		return this.leftEndTime > 0 && this.leftOpenTime < 0 && ConfigManager.mgOpen.isOpenedByKey(MgOpenEnum.Question, false);
	}

	public get totalNum(): number {
		if (this.info) {
			return this.info.total_I;
		}
		return 0;
	}

	public get curNo(): number {
		if (this.info) {
			return this.info.curNo_I;
		}
		return 0;
	}

	public get rightNum(): number {
		if (this.info) {
			return this.info.rightNum_I;
		}
		return 0;
	}

	public get myScore(): number {
		if (this.info) {
			return this.info.myScore_I;
		}
		return 0;
	}

	public get myRank(): number {
		if (this.info) {
			return this.info.myRank_I;
		}
		return 0;
	}

	public get rankList(): Array<any> {
		if (this.info) {
			return this.info.rankList.data;
		}
		return [];
	}

	public get countDown(): number {
		if (this.info) {
			return this.info.endCountdownSec_I - (this.totalNum - this.curNo) * this.singleTime;
			// return (this.info.endCountdownSec_I) % 25;
		}
		return 0;
	}

	public set selOpt(opt: number){
		this.info.curSelOpt_I = opt;
	}

	public get selOpt(): number {
		if (this.info && this.info.curSelOpt_I >= 0) {
			return this.info.curSelOpt_I;
		}
		return -1;
	}

	public get answerOpt(): number {
		if (this.info) {
			return this.info.answerOpt_I;
		}
		return -1;
	}

	public getQuesData(curQuesNum: number): any {
		let quesIndex: number = curQuesNum - this.curNo;
		let quesData: any = null;
		if (this.info) {
			let answer: Array<any> = [];
			let quesInfo: any = this.info.questionList.data[quesIndex];
			let quesCfg: any;
			if(quesInfo){
				quesCfg = ConfigManager.questionLib.getByPk(quesInfo.questionId_I);
				quesData = {};
				quesData["quesId"] = quesInfo.questionId_I;
				quesData["ques"] = quesCfg.question;
				for (let num of quesInfo.optList.data_I) {
					answer.push({ "answer": quesCfg[`option${num}`] });
				}
				quesData["answer"] = answer;
			}
		}
		return quesData;
	}

	public clear(): void {

	}
}