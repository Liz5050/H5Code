/**
 * 历练度
 * @author zhh
 * @time 2018-07-04 11:12:58
 */
class TrainExpRewardCom extends BaseView{
    private baseitem:BaseItem;
    private mcCanGet:UIMovieClip;
    private imgGot:fairygui.GImage;
    private txtTrainexp:fairygui.GTextField;
    private _data:any;
    private _isTip:boolean;

	public constructor(view:fairygui.GComponent) {
		super(view)
	}
	public initOptUI():void{
        //---- script make start ----
        this.baseitem = <BaseItem>this.getGObject("baseitem");
        this.baseitem.enableToolTip = false;
        this.imgGot = this.getGObject("img_got").asImage;
        this.txtTrainexp = this.getGObject("txt_trainExp").asTextField;
        this.mcCanGet = UIMovieManager.get(PackNameEnum.MCTrain);
        this.mcCanGet.playing = false;
        this.mcCanGet.visible = false;
        this.mcCanGet.x = -207;
        this.mcCanGet.y = -212;
        this.view.addChild(this.mcCanGet);
        this.view.swapChildren(this.imgGot,this.mcCanGet);
        //---- script make end ----

        this.baseitem.addClickListener(this.onClickItem,this);

	}
	public updateAll(data?:any):void{
		this._data = data;
        this.baseitem.itemData = RewardUtil.getReward(this._data.rewardStr);
        this.baseitem.setNameText("");
        this.txtTrainexp.text = this._data.needExp+"历练";
        this.imgGot.visible = CacheManager.daily.isGetReward(this._data.idx);        
        let isTip:boolean = CacheManager.nobility.isTrainScore(this._data);
        this.mcCanGet.playing = isTip; 
        this.mcCanGet.visible = isTip; 
        CommonUtils.setBtnTips(this.view,isTip,77,0,false);
        this.baseitem.enableToolTip = !isTip;
        this._isTip = isTip;
	}

    private onClickItem(e:any):void{
        if(this._isTip){
            EventManager.dispatch(LocalEventEnum.DailySPGetActivityReward,this._data.idx);
            let gp:egret.Point = this.baseitem.localToGlobal(this.baseitem.x,this.baseitem.y);
            Tip.addTip({x:gp.x,y:gp.y,itemCode:this.baseitem.itemData.getCode()},TipType.PropIcon);
        }
        
    }


}