class OpenServerActiveListPanel extends BaseView{
	private list_activity:List;
	private activeList:any[];
	public constructor(view:fairygui.GComponent) {
		super(view)
	}
	public initOptUI():void{
		this.list_activity = new List(this.getGObject("list_activity").asList);
		this.list_activity.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickList,this);
		this.activeList = [
			{mId:ModuleEnum.RankRush,name:"开服冲榜"},
			{mId:ModuleEnum.BibleActivity,name:"天书寻主"},
			{mId:ModuleEnum.SevenDays,name:"七天登录"}
		];
		
	}
	public updateAll(data?:any):void{
		var dataArr:any[] = [];
		for(var i:number=0;i<this.activeList.length;i++){
			if(HomeUtil.isModuleOpen(this.activeList[i].mId)){
				var iData:any = {};
				ObjectUtil.copyProToRef(this.activeList[i],iData,true);
				iData.isTip = HomeUtil.checkOpenServerModuleTips(this.activeList[i].mId);
				dataArr.push(iData);
			}
		}
		this.list_activity.setVirtual(dataArr);
		//this.list_activity.data = dataArr;
		this.list_activity.list.resizeToFit();
	}
	public setVisible(value:boolean):void{
		this.view.visible = value; 
	}
	public get isShow():boolean{
		return this.view.visible;
	}
	private onClickList(e:fairygui.ItemEvent):void{		
		var item:OpenServerActiveItem = <OpenServerActiveItem>e.itemObject;
		if(item){
			HomeUtil.open(item.getData().mId);
		}
		this.setVisible(false);
	}
}