/**
 * 合成大类item
 * @author zhh
 * @time 2018-10-09 11:53:22
 */
class SmeltCateItem extends ListRenderer {
    private btnCate:fairygui.GButton;
    private listType:List;
    private loadTitle:GLoader;
    private lastTypeIdx:number = -1;
    
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.btnCate = this.getChild("btn_cate").asButton;
        this.listType = new List(this.getChild("list_type").asList);

        this.loadTitle = <GLoader>this.btnCate.getChild("loader_title");

        this.btnCate.addClickListener(this.onGUIBtnClick, this);
        this.listType.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        this.loadTitle.load(URLManager.getModuleImgUrl(`${this._data.smeltCategory}.png`,PackNameEnum.Pack));        
        //this.btnCate.selected = this.selected;
        //this.btnCate.touchable = !this.selected;
        this.updateType();
        CommonUtils.setBtnTips(this,CacheManager.pack.isCateSmelt(this._data.smeltCategory),164,0);
	}
    public getH():number{
        if(this.selected){
            return this.listType.list.y + this.listType.list.height; 
        }
        return this.btnCate.y + this.btnCate.height; 
    }

    public setButtonStatu(status:boolean):void{
        this.btnCate.selected = status;
    }

    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnCate:
                this.updateType();
                EventManager.dispatch(LocalEventEnum.PackSmletCate,this._data);                             
                break;
        }
    }
    private updateType():void{        
        if(this.selected){
            this.listType.data = ConfigManager.smeltPlan.getPackSmeltTypes(this._data.smeltCategory);
            this.listType.list.resizeToFit();
            this.lastTypeIdx==-1||this.lastTypeIdx>=this.listType.data.length?this.lastTypeIdx = 0:null;
            this.listType.selectedIndex = this.lastTypeIdx;            
        }
        if((this.selected || this.btnCate.selected) && this.listType.selectedItem){
            this.selectTypeItem(this.listType.selectedItem);
        }
    }
    private selectTypeItem(item:ListRenderer):void{
        if(item){
            EventManager.dispatch(LocalEventEnum.PackSmletType,item.getData());
        }  
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{        
        var item:ListRenderer = <ListRenderer>e.itemObject;
        this.lastTypeIdx = this.listType.selectedIndex;
        this.selectTypeItem(item);
    }


}