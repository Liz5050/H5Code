class ExamProxy extends BaseProxy {
	public constructor() {
		super();
	}

	/**
	 * 获取科举信息
	 */
	public getQuestionInfo() {
		this.send("ECmdPublicGetQuestionInfo", {});
	}

	/**
	 * 科举答题
	 * @param questionId 回答问题id
	 * @param opt 问题选项 [0-3] 未答题则发送-1
	 */
	public answerQuestion(questionId: number, opt: number = -1) {
		this.send("ECmdPublicAnswerQuestion", {"questionId_I": questionId, "opt_I": opt});
	}
}