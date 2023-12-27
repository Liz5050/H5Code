/**
 * 副本协助面板
 * @author zhh
 * @time 2019-03-14 14:17:20
 */
class CopyAssitView extends BaseContentView {
    private btnLuck:fairygui.GButton;

	public constructor() {
		super(PackNameEnum.CopyAssit,"CopyAssitView",null,LayerManager.UI_Home);
        this.isDestroyOnHide = true;
	}
	public initOptUI():void{
        //---- script make start ----
        this.btnLuck = this.getGObject("btn_luck").asButton;

        this.btnLuck.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----
        this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
	}

	public updateAll(data?:any):void{
		
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnLuck:
                if(CacheManager.copy.isInCopy){
                    let copyCode:number = CacheManager.copy.curCopyCode;
                    let mapId:number =  CacheManager.map.mapId;
                    EventManager.dispatch(LocalEventEnum.copyReqAssit,copyCode,mapId);
                }                
                break;

        }
    }

}