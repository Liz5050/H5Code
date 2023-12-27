/**
 * 爵位人物列表Item
 * @author zhh
 * @time 2018-07-03 14:23:32
 */
class NoBilityMissionItem extends ListRenderer {
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private txtName:fairygui.GRichTextField;
    private txtTime:fairygui.GRichTextField;
    private txtExp:fairygui.GRichTextField;
    private btnLink:fairygui.GButton;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.txtName = this.getChild("txt_name").asRichTextField;
        this.txtTime = this.getChild("txt_time").asRichTextField;
        this.txtExp = this.getChild("txt_exp").asRichTextField;
        this.btnLink = this.getChild("btn_link").asButton;

        this.btnLink.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data; // t_mg_sword_pool_event
		this.itemIndex = index;
        this.c1.setSelectedIndex((index%2==0?0:1));
        this.txtName.text = this._data.name;
        let time:number = ObjectUtil.getConfigVal(this._data,"time",0);
        let event:number = ObjectUtil.getConfigVal(this._data,"event",0);
        let finishTime:number = CacheManager.daily.getEventTime(event);
        this.txtTime.text = finishTime+"/"+time;
        let exp:number = ObjectUtil.getConfigVal(this._data,"exp",0);
        this.txtExp.text = exp + "历练";
        let isFinish:boolean = finishTime>=time;
        let idx:number = isFinish?1:0;
        this.c2.setSelectedIndex(idx);
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnLink:
                let event:number = ObjectUtil.getConfigVal(this._data,"event",0);
                EventManager.dispatch(LocalEventEnum.DailyGotoEvent,event);
                //EventManager.dispatch(UIEventEnum.ModuleClose,ModuleEnum.Train);                                         
                break;

        }
    }


}