class FashionTitlePanel extends FashionBaseTabView {
	private listTitle:List;
	private titleCfgs:any[];
	public constructor() {
		super();
	}

	public initOptUI():void {
		this.listTitle = new List(this.getGObject("list_title").asList);
		this.listTitle.list.foldInvisibleItems = true;
		this.listTitle.list.scrollItemToViewOnClick = false;
	}

	public updateAll(data:any = null):void {
		this.titleCfgs = ConfigManager.title.getAllList();
		this.listTitle.setVirtual(this.titleCfgs);
		if(data && data.titleCode) {
			let targetCfg:any = ConfigManager.title.getByPk(data.titleCode);
			let index:number = this.titleCfgs.indexOf(targetCfg);
			if(index > -1) {
				this.listTitle.scrollToView(index);
				let childIndex:number = this.listTitle.list.itemIndexToChildIndex(index);
				let item:TitleItemView = this.listTitle.list.getChildAt(childIndex) as TitleItemView;
				item.selectedItem(true);
				this.listTitle.list.refreshVirtualList();
			}
		}
	}

	public updateTitleState():void {
		ConfigManager.title.getAllList();//刷新排序
		this.listTitle.list.refreshVirtualList();
	}

	protected updateRoleIndexView():void {
		CacheManager.title.operationIndex = this.roleIndex;
		this.listTitle.list.refreshVirtualList();
	}

	public hide():void {
		super.hide();
		this.listTitle.list.numItems = 0;
		CacheManager.title.clearShowPropertys();
	}
}