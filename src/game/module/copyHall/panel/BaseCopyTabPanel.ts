class BaseCopyTabPanel extends BaseTabPanel {
	protected isUpdated:Boolean;
	protected copyInf:any;
	protected txt_time: fairygui.GTextField;
	protected btn_time: fairygui.GButton;
	protected btn_buy: fairygui.GButton;
	protected btn_auto: fairygui.GButton;
	protected btn_team: fairygui.GButton;
	protected list_mode:List;
	protected lastOpenIndex:number;
	protected curSelectModeItem:CopyModeBaseItem;
	protected copyInfArr: any[];
	public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index: number) {
		super(view, controller, index);
	}
	public initOptUI(): void {
		var gobj:fairygui.GObject = this.getGObject("txt_time");
		if(gobj){
			this.txt_time = gobj.asTextField;
		}
		gobj = this.getGObject("btn_time");
		if(gobj){
			this.btn_time = gobj.asButton; 
		}
		gobj = this.getGObject("btn_buy");
		if(gobj){
			this.btn_buy = gobj.asButton;
			this.btn_buy.addClickListener(this.onClickBuyTime,this);
		}
		gobj = this.getGObject("btn_auto");
		if(gobj){
			this.btn_auto = gobj.asButton;
			this.btn_auto.addClickListener(this.onClickTeamBtns,this);
		}
		gobj = this.getGObject("btn_team");
		if(gobj){
			this.btn_team = gobj.asButton;
			this.btn_team.addClickListener(this.onClickTeamBtns,this);
		}
		gobj = this.getGObject("list_mode");
		if(gobj){
			this.list_mode = new List(gobj.asList);
			this.list_mode.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickMode,this);
		}
		
	}

	/**创建扫荡 */
	protected createDelegate():void{
		
	}
	protected setVirtualList():void{
		this.list_mode.setVirtual(this.copyInfArr,this.setItemRenderer,this);
	}
	protected setItemRenderer(index:number,item:fairygui.GObject):void
	{
		if(item["setData"] == undefined) return;
		var itemRender:CopyModeBaseItem = <CopyModeBaseItem>item;
		itemRender.setData(this.copyInfArr[index],index);
		var selected:boolean = index==this.list_mode.selectedIndex;
		itemRender.setSelectStatu(selected);
		if(selected){
			this.curSelectModeItem = itemRender;
		}		
	}

	public updateAll(): void {

	}

	public onTimeRun(arg?:any):void{
		
	}
	
	protected onClickMode(e:fairygui.ItemEvent):void{
		var item:CopyModeBaseItem = <CopyModeBaseItem>e.itemObject;
		if(!item.isOpen){
			this.list_mode.scrollToView(this.lastOpenIndex,false);			
			this.list_mode.list.selectedIndex = this.lastOpenIndex;			
		}
		this.selectModel(true);
	}

	protected selectModel(scrollToSelected:boolean):void{
		if(scrollToSelected){
			this.list_mode.scrollToView(this.list_mode.selectedIndex);	
		}			
		var item:CopyModeBaseItem = <CopyModeBaseItem>this.list_mode.selectedItem; 
		if(this.curSelectModeItem){			
			this.curSelectModeItem.setSelectStatu(false);
		}		
		this.curSelectModeItem = item;		
		this.curSelectModeItem.setSelectStatu(true);		
		
	}
	protected initSelect(): void {
		for (var i: number = 0; i < this.copyInfArr.length; i++) {
			if (!this.checkModelCopyOpen(this.copyInfArr[i])) {
				i--;
				break;
			} 
		}
		this.lastOpenIndex = Math.max(i, 0);
		this.lastOpenIndex = Math.min(this.lastOpenIndex, this.copyInfArr.length - 1);
		this.list_mode.scrollToView(this.lastOpenIndex,false);
		this.list_mode.selectedIndex = this.lastOpenIndex;
	}
	protected checkModelCopyOpen(inf:any):boolean{
		return false;
	}


	protected onClickBuyTime(e:any):void{
		EventManager.dispatch(UIEventEnum.CopyAddTime,this.getAddNumData());
	}

	protected onClickTeamBtns(e:egret.TouchEvent):void{
		switch(e.target){
			case this.btn_auto:				
				this.dealAutoMatch();				
				break;
			case this.btn_team:				
				this.dealTeamEnter(true);				
				break;
		}
	}
	protected dealAutoMatch():void{		
		if(!CacheManager.team.hasTeam || CacheManager.team.captainIsMe){ //队长或者没有队伍才能更改目标
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Team,{copyCode:this.getCurCopyCode(),isMatch:true});
		}else{
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Team);
			Tip.showTip(LangCopyHall.L3);
		}

	}
	protected dealTeamEnter(isCheck:boolean):void{
		if(!CacheManager.team.hasTeam){			
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.Team,{copyCode:this.getCurCopyCode()});
			Tip.showTip(LangCopyHall.L2);
		}else if(CacheManager.team.captainIsMe){
			CopyUtils.teamEnter(this.getCurCopyCode());						
		}else{
			Tip.showTip(LangCopyHall.L3);
		}
	
	}

	protected checkTeam():boolean{
		var flag:boolean = true;
		if(!CacheManager.team.hasTeam){
			Tip.showTip("暂无队伍");
		
		}else if(!CacheManager.team.captainIsMe){
			Tip.showTip("只有队长可开启组队副本");			
		}
		return flag;
	}
	/**子类重写 */
	protected getCurCopyCode():number{
		return 0;
	}

	protected updateEnterCount(copyInf:any):number{
		var leftNum: number = 0;
		if(copyInf){
			var numByDay: number = copyInf.numByDay ? copyInf.numByDay : 0;
			leftNum = CacheManager.copy.getEnterLeftNum(copyInf);
			if(this.btn_time){
				var isInCd: boolean = CacheManager.copy.isCopyInCd(copyInf.code);
				this.btn_time.visible = isInCd;
			}
			if(this.txt_time){				
				var leftNumStr: string = "" + leftNum;
				if (leftNum <= 0) {
					leftNumStr = HtmlUtil.html(leftNumStr, Color.Red);
				}
				this.txt_time.text = leftNumStr + "/" + numByDay; //副本剩余次数显示 1/3
			}
		}
		return leftNum;
	}

	protected getAddNumData():any{
		return {};
	}

}