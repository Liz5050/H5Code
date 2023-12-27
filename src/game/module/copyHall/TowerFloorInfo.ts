/**
 * 
 * @author zhh
 * @time 2018-09-10 20:33:31
 */
class TowerFloorInfo extends BaseView{
    private imgLeft:fairygui.GImage;
    private imgRight:fairygui.GImage;
    private imgPass:fairygui.GImage;
    private txtFloor:fairygui.GTextField;
    private arrowAni:fairygui.Transition;
    private effCnt:fairygui.GComponent;
    private lockCnt:fairygui.GComponent;
    private openEff:UIMovieClip;
    private lockEff:UIMovieClip;

	public constructor(view:fairygui.GComponent) {
		super(view)
	}
	public initOptUI():void{
        //---- script make start ----
        this.arrowAni = this.view.getTransition("t0");
        this.effCnt = this.getGObject("eff_cnt").asCom;
        this.lockCnt = this.getGObject("lock_cnt").asCom;
        this.imgLeft = this.getGObject("img_left").asImage;
        this.imgRight = this.getGObject("img_right").asImage;
        this.imgPass = this.getGObject("img_pass").asImage;
        this.txtFloor = this.getGObject("txt_floor").asTextField;
        //---- script make end ----

	}
	public updateAll(data?:any):void{
		this.txtFloor.text = `第${data.floor}层`;
        let topFloor:number = ConfigManager.mgRuneCopy.MAX_FLOOR;
        let isTop:boolean = data.curPassFloor==topFloor && data.floor==topFloor;
        let isShowLock:boolean = data.floor > data.tarFloor;
        let isOpen:boolean =  data.floor == data.tarFloor;        
        this.clearEff();
       if(!isTop){
            if(isShowLock){
                this.addLockEff();
            }
            if(isOpen){
                this.addOpenEff();
                this.arrowAni.play(null,null,null,-1);
            }else{
                this.arrowAni.stop();
            }
        }
        this.imgPass.visible = isTop;
        this.imgLeft.visible = this.imgRight.visible = isOpen && !isTop;


	}

    public addOpenEff():void{
        if(!this.openEff){
            this.openEff = UIMovieManager.get(PackNameEnum.MCTower);
        }
        this.effCnt.addChild(this.openEff);
    }
    public addLockEff():void{
        if(!this.lockEff){
            this.lockEff = UIMovieManager.get(PackNameEnum.MCLock);
        }
        this.lockCnt.addChild(this.lockEff);
    }
    private clearEff():void{
        if(this.openEff){
            this.openEff.destroy();
            this.openEff = null;
        }
        if(this.lockEff){
            this.lockEff.destroy();
            this.lockEff = null;
        }
    }


}