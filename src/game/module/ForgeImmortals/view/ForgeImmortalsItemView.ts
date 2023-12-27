class ForgeImmortalsItemView extends BaseView {
	private items:ForgeImmortSoulItem[];
	private itemNum:number;
	private curSelectItem:ForgeImmortSoulItem;
	private roleIndex:number = 0;
	public constructor(view:fairygui.GComponent) {		
		super(view);
		
	}
	protected initOptUI(): void{
		
	}
	private updateItems(infos:any[]):void{
		if(!this.items){
			this.items = [];			
		}
		for(let i:number = 0;i<infos.length;i++){
			let item:ForgeImmortSoulItem;
			if(i <= this.items.length){
				item = <ForgeImmortSoulItem>this.getGObject("item_"+i);
				item.addClickListener(this.clickItem,this);
				this.items.push(item);
			}else{
				item = this.items[i];
			}
			item.setData(infos[i],i);
			let lv:number = CacheManager.forgeImmortals.getImmortalLevel(this.roleIndex,infos[i].info.position);		
			item.setLevel(lv);
		}

		/**新手指引注册 */
        for(let item of this.items){
            if(item.isCanActive){
                GuideTargetManager.reg(GuideTargetName.ForgeImmortalsItemViewForgeImmortSoulItemAct, item, true);
                break;
            }
        }
		for(let item of this.items){
            if(item.isCanUpgrade){
                GuideTargetManager.reg(GuideTargetName.ForgeImmortalsItemViewForgeImmortSoulItemUp, item, true);
                break;
            }
        }
	}
	public updateAll(data?:any):void{
		this.roleIndex = data.roleIndex;
		let infos:any[] = [];
		for(let i:number=0;i<data.infos.length;i++){
			infos.push({roleIndex:this.roleIndex,info:data.infos[i]});
		} 
		this.updateItems(infos);

		EventManager.dispatch(UIEventEnum.ViewOpened, this["__class__"]);
	}

	private clickItem(e:egret.TouchEvent):void{		
		let item:ForgeImmortSoulItem = <ForgeImmortSoulItem>e.target;
		this.selectItem(item);
	}

	private selectItem(item:ForgeImmortSoulItem):void{
		if(this.curSelectItem){
			this.curSelectItem.selected = false;
		}
		this.curSelectItem = item;
		let data:any = {roleIndex:this.roleIndex,info:this.curSelectItem.getData().info};
		HomeUtil.open(ModuleEnum.ForgeImmUpgrade,false,data);
	}

}