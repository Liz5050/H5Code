/**模式副本 守护仙灵、仙帝宝库 */
class CopyHallModelPanel extends BaseCopyTabPanel{
	
	protected list_item:List;
	protected btn_start:fairygui.GButton;
	protected btn_saodang:fairygui.GButton;
	protected btn_explain:fairygui.GButton;
	protected txt_condition:fairygui.GTextField;	
	protected recordCopyInf:any;
	

	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number,recordCopyCode:number,copyInfArr:any[]) {
		super(view, controller, index);
		this.recordCopyInf = ConfigManager.copy.getByPk(recordCopyCode);
		this.copyInfArr = copyInfArr;
	}

	public initOptUI(): void {
		super.initOptUI();		
		this.list_item = new List(this.getGObject("list_item").asList);
		this.btn_start = this.getGObject("btn_start").asButton;
		this.btn_saodang = this.getGObject("btn_saodang").asButton;
		this.btn_explain = this.getGObject("btn_explain").asButton;
		this.txt_condition = this.getGObject("txt_condition").asTextField;
		
		this.btn_explain.addClickListener(this.onClickBtn,this);
		this.btn_start.addClickListener(this.onClickBtn,this);
		this.btn_saodang.addClickListener(this.onClickBtn,this);
	}

	public updateAll():void{
		super.updateAll();		
		this.setVirtualList();
		this.initSelect();
		this.selectModel(true);
		this.copyInf = this.list_mode.selectedData;
		this.updateEnterCount(this.recordCopyInf);
	}

	protected getAddNumData():any{
		var data:any = {copyCode:this.recordCopyInf.code};
		return data;
	}
	protected checkModelCopyOpen(inf:any):boolean{
		return CopyUtils.isRelateCopyOpen(inf,this.recordCopyInf.code);
	}
	protected onClickBtn(e:egret.TouchEvent):void{
		switch(e.target){
			case this.btn_explain:
			    var tips:string = HtmlUtil.br(this.recordCopyInf.introduction);		
				ToolTipManager.showInfoTip(tips,this.btn_explain);
				break;
			case this.btn_start:
				EventManager.dispatch(LocalEventEnum.CopyReqEnter,this.curSelectModeItem.getData().code);
				EventManager.dispatch(UIEventEnum.ModuleClose,ModuleEnum.CopyHall);
				break;
			case this.btn_saodang:				
				if(this.curSelectModeItem){
					EventManager.dispatch(LocalEventEnum.CopyDelegate,this.curSelectModeItem.getData().code,0,true);
				}				
				break;
		}
		
	}	

	protected selectModel(scrollToSelected:boolean):void{
		super.selectModel(scrollToSelected);
		var rewards:any[] = CommonUtils.configStrToArr(this.curSelectModeItem.getData().reward);
		this.txt_condition.text = this.curSelectModeItem.getData().enterMinLevel+"级以上";
		this.list_item.data = rewards;
	}

}