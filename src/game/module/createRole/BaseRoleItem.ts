class BaseRoleItem  extends ListRenderer{
	private avatarLoader: GLoader;
	private nameTxt: fairygui.GTextField;
	private levelTxt: fairygui.GTextField;
	private controller: fairygui.Controller;
	private career: number;
	
	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.avatarLoader = this.getChild("loader_avatar") as GLoader;
		this.nameTxt = this.getChild("txt_name").asTextField;
		this.levelTxt = this.getChild("txt_level").asTextField;
		this.controller = this.getController("c1");
	}

	public setData(data: any):void{
		this._data = data;
		this.nameTxt.text = data.name_S;
		this.levelTxt.text = CareerUtil.getLevelName(data.level_I ? data.level_I : 1, data.career_I);
		let baseCareer: number = CareerUtil.getBaseCareer(data.career_I);
		// if(baseCareer == 1){
		// 	this.controller.selectedIndex = 0;
		// }else if(baseCareer == 2){
		// 	this.controller.selectedIndex = 1;
		// }else if(baseCareer == 4){
		// 	this.controller.selectedIndex = 2;
		// }
		this.avatarLoader.load(URLManager.getModuleImgUrl(`avatar_${baseCareer}.png`, PackNameEnum.CreateRole));
		// this.controller.selectedIndex = CareerUtil.getBaseCareer(data.career_I) - 1;
	}

	public getData(): any{
		return this._data;
	}

	// public getLevelName(level: number, roleCareer: number): string {
	//     let name: string = `${level}级`;
	// 	let rebirthTimes: number = CareerUtil.getRebirthTimes(roleCareer);
	// 	if (rebirthTimes > 0) {
    //         name = `${rebirthTimes}转` + name;
	// 	}
	// 	return name;
	// }
}