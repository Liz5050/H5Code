class ShapeWindowReplace extends BaseWindow {
    private listReplace:List;

    public constructor() {
		super(PackNameEnum.Common,"ShapeWindowReplace");
        this.modal = true;
	}

    public initOptUI():void{
        //---- script make start ----
        this.listReplace = new List(this.getGObject("list_replace").asList);
        this.listReplace.list.addClickListener(this.hidepanel, this);
        //---- script make end ----
	}

    public hidepanel() {
        this.hide();
    }

    public updateAll(data?:any):void{
		var item:ItemData = <ItemData>data.item;
        var roleIndex:number = data.roleIndex;//item.getRoleIndex(); 
        var dressPos:number = data.dressPos;//ItemsUtil.getEqiupPos(item);
               
        var itemDatas:ItemData[] = CacheManager.pack.propCache.getShapeEquipsByPos(data.shape, data.dressPos);
        itemDatas.sort(comp);
        
        let hightEquips:ItemData[] = [];//CacheManager.pack.backPackCache.getEquipByDressPos(dressPos,roleIndex,true);       
        hightEquips.sort(comp);
        function comp(a:ItemData,b:ItemData):number{
            var ret:number = 0;
            var scroeA:number = ConfigManager.item.getByPk(a.getCode()).itemLevel;
            var scroeB:number = ConfigManager.item.getByPk(b.getCode()).itemLevel;
            if(scroeA>scroeB){
                ret = -1; //评分高的在前面
            }else if(scroeA<scroeB){
                ret = 1;
            }
            return ret;
        }
        if(item){
            itemDatas.unshift(item);
        }
        if(hightEquips.length>0){
            itemDatas = itemDatas.concat(hightEquips);
        }        

        var equipInlist = false;
        var equipNow = CacheManager.shape.getEquipNow(data.shape, dressPos, roleIndex);
        if(equipNow) {
            for(let i = 0; i < itemDatas.length; i++) {
                if(itemDatas[i].getCfgCode() == equipNow) {
                    var equipItem = new ItemData(equipNow);
                    itemDatas.unshift(equipItem);
                    equipInlist = true;
                    break;
                }
            }
            if(!equipInlist) {
                var equipItem = new ItemData(equipNow);
                itemDatas.unshift(equipItem);
            }
        }
        
        var listData:any[] = [];
        for(var i:number = 0; i<itemDatas.length;i++){
            listData.push({item:itemDatas[i],roleIndex:roleIndex})
        }
        this.listReplace.setVirtual(listData);
        if(listData.length>0){
            this.listReplace.scrollToView(0);
        }
	}

}