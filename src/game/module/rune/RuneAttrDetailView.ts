/**
 * 符文属性详情窗口
 */

class RuneAttrDetailView extends BasePopupView{
	// private modalLayer:fairygui.GGraph;
	private attrTxt: fairygui.GTextField;
	private careerController: fairygui.Controller;
	private roleIndex: number;

	public constructor() {
		super(PackNameEnum.Rune, "RuneAttrDetailView");
	}

	public initUI(): void{
		this.attrTxt = this.getGObject("txt_attr").asTextField;
		this.careerController = this.getController("c1");
		this.careerController.addEventListener(fairygui.StateChangeEvent.CHANGED, this.onTabChanged, this);
	}

	public show(roleIndex: number): void{
		this.roleIndex = roleIndex;
		this.modal = true;
		super.show();
		this.setAttrTxt(this.roleIndex);
		this.setSelectIndex();
	}

	private onTabChanged(): void{
		let career: number;
		let index: number;
		if(this.careerController.selectedIndex == 0){
			career = CareerEnum.CareerWarrior;
		}else if(this.careerController.selectedIndex == 1){
			career = CareerEnum.CareerWizard;
		}else if(this.careerController.selectedIndex == 2){
			career = CareerEnum.CareerTaoist;
		}
		index = CacheManager.role.getRoleIndex(career);
		this.setAttrTxt(index);
	}

	private setAttrTxt(index: number): void{
		let dict: any = CacheManager.rune.getAttrDetailDict(index);
		this.attrTxt.text = CacheManager.rune.getAttrDetailStr(dict);
	}

	private setSelectIndex(): void{
		let career: number = CareerUtil.getBaseCareer(CacheManager.role.getRoleCareerByIndex(this.roleIndex));
		if(career == CareerEnum.CareerWarrior){
			this.careerController.selectedIndex = 0;
		}else if(career == CareerEnum.CareerWizard){
			this.careerController.selectedIndex = 1;
		}else if(career == CareerEnum.CareerTaoist){
			this.careerController.selectedIndex = 2;
		}
	}

	
}