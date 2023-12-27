/**扫荡询问窗 */
class CopySweepWindow extends CopyBasePopupWin {
	private txt_desc:fairygui.GRichTextField;
	private item:BaseItem;
	public constructor() {
		super(PackNameEnum.Copy, "WindowCopySweep");
	}

	public initOptUI(): void {
		super.initOptUI();
		this.item = <BaseItem>this.getGObject("baseItem");
		var itemData:ItemData = new ItemData(CopyEnum.DelegateItem);
		this.item.itemData = itemData;
		
		this.txt_desc = this.getGObject("txt_desc").asRichTextField;
		var html:string = HtmlUtil.html("3星",Color.Green);
		var desc:string = App.StringUtils.substitude("您通关该副本的最高评级是{0}，继续扫荡将得到{1}评级奖励",html,html);
		this.txt_desc.text = desc;
	}

	protected onBtnClick(isOk:boolean):void{
		super.onBtnClick(isOk);
		if(isOk){
			var callFn:Function = this._data.callFn;
			var caller:any =  this._data.caller;
			if(callFn && caller){
				callFn.call(caller,this._data.code,this._data.key1);
			}
			this.hide();
		}
	}

	public updateAll(data:any = null):void{
		super.updateAll(data);
		this.updateItemCount();
	}	
	public updateItemCount():void{
		var s:string = CacheManager.pack.backPackCache.getItemCountByCode(CopyEnum.DelegateItem)+"/"+CopyEnum.DelegateItemCost;
		this.item.updateNum(s);
	}

}