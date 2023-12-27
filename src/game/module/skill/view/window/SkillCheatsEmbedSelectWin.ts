/**
 * 秘境镶嵌选择界面
 * @author zhh
 * @time 2018-09-03 16:28:05
 */
class SkillCheatsEmbedSelectWin extends BaseWindow {
    private cheatItem:SkillCheatsItem;
    private txtName:fairygui.GRichTextField;
    private txtDesc:fairygui.GRichTextField;
    private btnAdd:fairygui.GButton;
    private btnPath:fairygui.GButton;
    private listItem:List;
    private _data:any;
    private _curSelectItem:CheatsSelectWinItem;
	public constructor() {
		super(PackNameEnum.SkillCheats,"SkillCheatsEmbedSelectWin")

	}
	public initOptUI():void{
        //---- script make start ----
        this.cheatItem = <SkillCheatsItem>this.getGObject("baseItem");
        this.cheatItem.isShowName = false;
        this.cheatItem.setNameVisible(false);
        this.txtName = this.getGObject("txt_name").asRichTextField;
        this.txtDesc = this.getGObject("txt_desc").asRichTextField;
        this.btnAdd = this.getGObject("btn_add").asButton;
        this.btnPath = this.getGObject("btn_path").asButton;
        this.listItem = new List(this.getGObject("list_item").asList,{isSelectStatus:true});

        this.btnAdd.addClickListener(this.onGUIBtnClick, this);
        this.btnPath.addClickListener(this.onGUIBtnClick, this);
        this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----

	}

	public updateAll(data?:any):void{
        this._data = data;
		let items:ItemData[] = CacheManager.pack.propCache.getByC(ECategory.ECategoryCheats);
        let roleIndex:number = this._data.roleIndex;
        CacheManager.cheats.sortCheats(items,roleIndex);
        //还要排序
        let dataInfos:any[] = [];
        for(let i:number=0;i<items.length;i++){
            dataInfos.push({roleIndex:this._data.roleIndex,item:items[i]});
        }
        this.listItem.setVirtual(dataInfos);
        if(items.length>0){
            this._curSelectItem =<CheatsSelectWinItem>this.listItem.list.getChildAt(0);
            if(this._curSelectItem){
                this._curSelectItem.selected = true;
            }            
            this.selectCheatItem(items[0]);
        }else{
            this.selectCheatItem(null);
        }

	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnAdd:
                let itemData:ItemData = this.cheatItem.getData();
                if(itemData && !CacheManager.cheats.isEmbed(this._data.roleIndex,itemData.getType(),itemData.getColor())){
                    EventManager.dispatch(LocalEventEnum.CheatsAddToEmned,itemData);
                    this.hide();
                }                
                break;
            case this.btnPath:
                HomeUtil.open(ModuleEnum.PropGet,false,{itemCode:ItemCodeConst.showCheats});
                this.hide();
                break;

        }
    }
    private selectCheatItem(itemData:ItemData):void{
        let isData:boolean = itemData!=null;
        this.cheatItem.visible = isData;
        this.txtName.visible = isData;
        this.txtDesc.visible = isData;
        let lbl:string = "加  入";
        let enabled:boolean = true;
        if(itemData){
            this.cheatItem.setData(itemData,0);
            this.txtName.text = itemData.getName(true);
            this.txtDesc.text = itemData.getDesc();
            let isEmbed:boolean = CacheManager.cheats.isEmbed(this._data.roleIndex,itemData.getType(),itemData.getColor());
            if(isEmbed){
                enabled = false;
                lbl = "已学习";
            }
        }
        //this.btnAdd.enabled = enabled;
        App.DisplayUtils.grayButton(this.btnAdd,!enabled,!enabled);
           
    }
    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            let data:any = item.getData();
            this.selectCheatItem(data.item);
            this._curSelectItem = <CheatsSelectWinItem>item;
        }  
    }
    public hide(param: any = null, callBack: CallBack = null):void {
        super.hide(param,callBack);
        this.cheatItem.setData(null,0);
        this.txtName.text = "";
        this.txtDesc.text = "";
        if(this._curSelectItem){
            this._curSelectItem.selected = false; 
        }
        
    }


}