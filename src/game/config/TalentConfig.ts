class TalentConfig extends BaseConfig{
	public constructor() {
		super("t_talent","groupId");
	}

	public getTaskDesc(career: number){
		let data: any = this.getByPk(career);
		if(data){
			return data.taskDesc;
		}
	}

	public getHeadName(career: number): string{
		let data: any = this.getByPk(career);
		if(data){
			return data.head;
		}
		return "";
	}
}