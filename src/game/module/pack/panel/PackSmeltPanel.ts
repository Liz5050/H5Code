/**
 * 合成背包界面
 * @author zhh
 * @time 2018-10-09 11:50:17
 */
class PackSmeltPanel extends BaseTabView{
    private listCate:List;
    private listItem:List;
	private curSelectCate:SmeltCateItem;
	private lastCateIdx:number = -1;
	// public constructor(view: fairygui.GComponent, controller: fairygui.Controller, index:number) {
	// 	super(view, controller, index);
	// }

	public initOptUI():void{
        //---- script make start ----
        this.listCate = new List(this.getGObject("list_Cate").asList);		
        this.listItem = new List(this.getGObject("list_item").asList);
        //---- script make end ----
		this.listCate.list.addEventListener(fairygui.ItemEvent.CLICK,this.onClickList,this);

	}
	public updateAll(data?:any):void{		
		this.updateCateList();
		let idx:number = 0;		
		if(this.lastCateIdx==-1 || this.lastCateIdx>=this.listCate.data.length){
			this.extendCate(this.listCate.data[idx]);
		}	
		
	}
	
	public extendCate(data:any):void{		
		let idx:number = this.listCate.data.indexOf(data);
		// if(idx==this.lastCateIdx){
		// 	return;
		// }

		this.lastCateIdx = idx;		
		idx = this.listCate.list.itemIndexToChildIndex(idx);
		if(idx>-1){
			let cateItem:SmeltCateItem = <SmeltCateItem>this.listCate.list.getChildAt(idx);
			if(this.curSelectCate==cateItem){
				this.curSelectCate.selected = !this.curSelectCate.selected;
				this.curSelectCate.setButtonStatu(true);
				if(this.curSelectCate.selected){
					this.onChangeType(this.curSelectCate.getData());
				}
			}else{
				if(this.curSelectCate){
					this.curSelectCate.selected = false;
					this.curSelectCate.setButtonStatu(false);
				}
				this.curSelectCate = cateItem;
				this.curSelectCate.selected = true;
				this.curSelectCate.setButtonStatu(true);
			}
			this.updateCateList();
		}
		
	}

	public onChangeType(data:any):void{
		let datas:any[] = ConfigManager.smeltPlan.getSmelts(data.smeltCategory,data.smeltType);
		this.listItem.setVirtual(datas);
	}

	public hide():void{
		super.hide();
		this.lastCateIdx = -1;
		if(this.curSelectCate){
			this.curSelectCate.selected = false;
		}
		
	}

	private updateCateList():void{
		let cates:any[] = ConfigManager.smeltPlan.getPackSmeltCates().concat();
		for(let i:number = 0;i<cates.length;i++){
			if(cates[i].cateOpenKey && !ConfigManager.mgOpen.isOpenedByKey(cates[i].cateOpenKey,false)){
				cates.splice(i,1);
				i--;
			}
		}		
		this.listCate.setVirtual(cates,this.setItemRenderer,this);		
	}

	private onClickList(e:fairygui.ItemEvent):void{
		let tar:any = e.itemObject;
		let b:boolean = this.listCate.selectedItem==tar;
		console.log("b",b);		
	}

	private setItemRenderer(index: number, item:SmeltCateItem): void {
		if (item["setData"] == undefined) return;
		item["setData"](this.listCate.data[index], index);
		item.setSize(item.width,item.getH());
	}

}