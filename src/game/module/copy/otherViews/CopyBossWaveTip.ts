/**
 * 副本通用第几波歌词秀效果
 * @author zhh
 * @time 2019-01-11 19:43:17
 */
class CopyBossWaveTip extends BaseContentView {
    private groupTips:fairygui.GGroup;
    private loaderTip:GLoader;
    private txtTip:fairygui.GTextField;
    private _curRing:number = 0;
	public constructor() {
		super(PackNameEnum.Copy2,"CopyBossWaveTip")
	}
	public initOptUI():void{
        //---- script make start ----
        this.groupTips = this.getGObject("group_tips").asGroup;
        this.loaderTip = <GLoader>this.getGObject("loader_tip");
        this.txtTip = this.getGObject("txt_tip").asTextField;

        //---- script make end ----
        this.loaderTip.load(URLManager.getModuleImgUrl("sec_desc4.png",PackNameEnum.Copy));
        if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}
        this.touchable = false;
        
	}

	public updateAll(data?:any):void{
        if(this._curRing!=data){
            this._curRing = data;
            this.txtTip.text = data+"";
            this.showStory();  
        }
		  
	}

    private showStory(delay:number = 4000):void{
		this.groupTips.alpha = 0;			
        TweenUtils.to(this.groupTips,{alpha:1},200,()=>{
            App.TimerManager.doDelay(delay,this.onShowStoryEnd,this);
        },this);
		
	}

    private onShowStoryEnd():void{        
		TweenUtils.to(this.groupTips,{alpha:0},200,()=>{
            this.hide();
        },this);			
	}

    public get curRing():number{
        return this._curRing;
    }
    public clearData():void{
        this._curRing = 0;
    }
    public hide(param: any = null, callBack: CallBack = null): void {
        super.hide(param,callBack);   
    }


}