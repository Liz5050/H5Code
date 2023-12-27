class ExamAnswerItem extends ListRenderer {
	private answerTxt: fairygui.GTextField;
	private controller: fairygui.Controller;

	private index: number;
	private option: string;

	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.answerTxt = this.getChild("txt_answer").asTextField;
		this.controller = this.getController("c1");
	}

	public setData(data: any, index: number): void {
		this.index = index;
		this.answerTxt.text = `${this.getOption(true)}. ${data.answer}`;

		if(CacheManager.exam.isChecked){
			if(index == CacheManager.exam.answerOpt){
				this.controller.selectedIndex = 1;
			}else{
				this.controller.selectedIndex = 2;
			}
		}else{
			this.controller.selectedIndex = 0;
		}
	}

	public getOption(isGreatLetter: boolean = false): string{
		switch(this.index){
			case 0:
				return "A";
			case 1:
				return "B";
			case 2:
				return "C";
			case 3:
				return "D";
		}
		return "";
	}
}