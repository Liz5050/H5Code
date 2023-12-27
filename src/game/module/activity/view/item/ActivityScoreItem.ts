/**
 * 积分兑换Item
 * @author zhh
 * @time 2018-09-19 19:39:35
 */
class ActivityScoreItem extends ListRenderer {
    private baseItem:BaseItem;
    private txtCount:fairygui.GTextField;
    private txtScore:fairygui.GRichTextField;
    private txtName:fairygui.GRichTextField;
    private btnExc:fairygui.GButton;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.baseItem = <BaseItem>this.getChild("baseItem");
        this.baseItem.isShowName = false;
        this.txtCount = this.getChild("txt_count").asTextField;
        this.txtScore = this.getChild("txt_score").asRichTextField;
        this.txtName = this.getChild("txt_name").asRichTextField;
        this.btnExc = this.getChild("btn_exc").asButton;

        this.btnExc.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let info:ActivityRewardInfo = this._data;
        let needScore:number = info.conds[0];//所需积分
        let excCount:number = info.conds[1];//可兑换次数
        let items:ItemData[] = info.getItemDatas();
        this.baseItem.itemData = items[0];
        let excNum:number = CacheManager.activity.getBossExcNum(info.index);
        let leftNum:number = Math.max(excCount-excNum,0);
        let isUnLimit:boolean = excCount==-1;
        let mySco:number = CacheManager.activity.myBossScore;
        let isScore:boolean = mySco>=needScore;
        this.txtCount.text = isUnLimit?`无限制`:`剩余${leftNum}份`;      
        this.txtName.text =   items[0].getName(true);
        let grayed:boolean = (leftNum>0 || isUnLimit) && isScore; //有次数或者无限制；且积分足够才能点       
        App.DisplayUtils.grayButton(this.btnExc,grayed,grayed);
        this.txtScore.text = HtmlUtil.html(`${mySco}/${needScore}`)
        let clr:any = isScore?Color.GreenCommon:Color.RedCommon;
        this.txtScore.text = HtmlUtil.html(`${mySco}/${needScore}`,clr);

        let isTips:boolean = isScore && (isUnLimit || leftNum>0);
        CommonUtils.setBtnTips(this.btnExc,isTips);
        

	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnExc:
                let info:ActivityRewardInfo = this._data;
                EventManager.dispatch(LocalEventEnum.ExchangeWinShow,info);
                //EventManager.dispatch(LocalEventEnum.ActivityGetReward,info.code,info.index);
                break;

        }
    }


}