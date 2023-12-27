/**
 * 诛仙榜
 * @author zhh
 * @time 2018-08-10 18:00:30
 */
class TowerRankWindow extends BaseWindow {
    private txtFloor:fairygui.GTextField;
    private txtRank:fairygui.GTextField;
    private listRank:List;

	public constructor() {
		super(PackNameEnum.CopyTower,"TowerRankWindow");

	}
	public initOptUI():void{
        //---- script make start ----
        this.txtFloor = this.getGObject("txt_floor").asTextField;
        this.txtRank = this.getGObject("txt_rank").asTextField;
        this.listRank = new List(this.getGObject("list_rank").asList);

        this.listRank.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        //---- script make end ----
        //this.titleIcon = "tower_rank";

	}

	public updateAll(data?:any):void{
        if(data){
            var floor: number = CacheManager.copy.getCopyProcess(CopyEnum.CopyTower);
            this.txtFloor.text = floor+"层"; 
            this.listRank.setVirtual(data);
            let myRank:number = 0;
            for(let i:number = 0;i<data.length;i++){
                if(CacheManager.role.entityInfo.entityId.id_I==data[i].entityId_I){
                    myRank = data[i].rank_I;
                    break;
                }
            }
            let rankStr:string = myRank>0?""+myRank:HtmlUtil.html("未上榜","#ec422e");
            this.txtRank.text = "我的排名:"+rankStr;
        }
        
	}

    

    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            
        }

        var list: any = e.target;
        switch (list) {
            case this.listRank.list:
                break;

        }
               
    }


}