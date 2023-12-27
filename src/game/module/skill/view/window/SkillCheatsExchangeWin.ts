/**
 * 秘境置换界面
 * @author zhh
 * @time 2018-09-03 16:27:48
 */
class SkillCheatsExchangeWin extends BaseWindow {
    private baseitemTar:SkillCheatsItem;
    private btnExchange:fairygui.GButton;
    private listFrom:List;
    private listItem:List;
    private fromItems:ItemData[];
    private dfFromData:ItemData[];
    private countDict:any;
    private uidDict:any;
	public constructor() {
		super(PackNameEnum.SkillCheats,"SkillCheatsExchangeWin");
        this.dfFromData = [null,null,null];
        this.fromItems = this.dfFromData.concat();
        this.countDict = {};
        this.uidDict = {};
	}
	public initOptUI():void{
        //---- script make start ----
        this.baseitemTar = <SkillCheatsItem>this.getGObject("baseItem_tar");
        this.btnExchange = this.getGObject("btn_exchange").asButton;
        this.listFrom = new List(this.getGObject("list_from").asList,{isShowName:false});
        this.listItem = new List(this.getGObject("list_item").asList,{enableToolTip:false});

        this.btnExchange.addClickListener(this.onGUIBtnClick, this);
        this.listFrom.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----

	}

	public updateAll(data?:any):void{
		this.updateList();
	}

    public updateByEchange(retItemCode:number):void{
        this.baseitemTar.setData(new ItemData(retItemCode),0);        
        this.clearFromInfo();
        this.updateList();
    }

    private updateList():void{
        let items:ItemData[] = CacheManager.pack.propCache.getByC(ECategory.ECategoryCheats);
        CacheManager.cheats.sortCheats(items,-1);
        this.listItem.setVirtual(items);
        this.listFrom.data = this.fromItems;
    }
    private addToCheat(item:BaseItem):void{
        let itemData:ItemData =  item.itemData;
        if(itemData){
            let uids:string = itemData.getUid();
            if(this.countDict[uids] && this.countDict[uids]>=itemData.getItemAmount()){
                Tip.showTip(LangSkill.LANG8);
                return;
            }
            for (var index = 0; index < this.fromItems.length; index++) {
                if(!this.fromItems[index]){
                    let item:ItemData = new ItemData(itemData.getCode());                    
                    this.uidDict[index] = itemData.getUid();                    
                    if(this.countDict[uids]){
                        this.countDict[uids]++;
                    }else{
                        this.countDict[uids] = 1;
                    }
                    this.fromItems[index] = item;
                    break;
                }
                
            }
            this.listFrom.data = this.fromItems;
        } 
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnExchange:
                let isCan:boolean = true;
                if(this.fromItems){//置换
                    let itemNames:string[] = [];
                    for(let i:number = 0;i<this.fromItems.length;i++){
                        if(this.fromItems[i]){
                            itemNames.push(this.fromItems[i].getName());
                        }
                    }
                    if(itemNames.length==this.dfFromData.length){
                        let tips:string = App.StringUtils.substitude(LangSkill.LANG9,itemNames);
                        Alert.alert(tips,()=>{
                            EventManager.dispatch(LocalEventEnum.CheatsReqExchange,this.fromItems);
                        },this);
                    }else{
                        isCan = false;
                    }
                    
                }else{
                    isCan = false;
                }
                if(!isCan){
                    Tip.showLeftTip(App.StringUtils.substitude(LangSkill.LANG10,this.dfFromData.length));
                }
                break;

        }
    }
    
    protected onGUIListSelect(e:fairygui.ItemEvent):void{        
        var list: any = e.target;
        switch (list) {
            case this.listFrom.list:
                let cheat:SkillCheatsItem = <SkillCheatsItem>e.itemObject;
                let itemData:ItemData = cheat.getData();
                if(itemData){                    
                    let idx:number = this.fromItems.indexOf(itemData);
                    let uids:string = this.uidDict[idx];
                    if(uids && this.countDict[uids]){
                        this.countDict[uids]--;
                    }
                    this.fromItems.splice(idx,1,null);
                    this.listFrom.data = this.fromItems;
                }
                break;
            case this.listItem.list:       
                let item:BaseItem =<BaseItem>e.itemObject;  
                this.addToCheat(item);
                this.baseitemTar.setData(null,0); 
                break;

        }
    }
    private clearFromInfo():void{
        this.fromItems = this.dfFromData.concat();
        this.countDict = {};
        this.uidDict = {};
    }
    public hide(param: any = null, callBack: CallBack = null):void {
		super.hide(param,callBack);
        this.baseitemTar.setData(null,0);
        this.clearFromInfo();
    }

}