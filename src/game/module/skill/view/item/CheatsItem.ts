/**
 * 秘境界面图标item
 * @author zhh
 * @time 2018-09-03 16:25:31
 */
class CheatsItem extends ListRenderer {
    private loaderIco:GLoader;
    private imgLock:fairygui.GImage;
    private imgFail:fairygui.GImage;
    private txtCond:fairygui.GTextField;
	private effCnt:fairygui.GComponent;
	private eff:UIMovieClip;
	private failAni:fairygui.Transition;
	private isFailInAni:boolean;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
		this.failAni = this.getTransition("t0");
		this.imgFail = this.getChild("img_fail").asImage;
		this.imgFail.visible = false;
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.imgLock = this.getChild("img_lock").asImage;
        this.txtCond = this.getChild("txt_cond").asTextField;
		this.effCnt = this.getChild("eff_cnt").asCom;
        //---- script make end ----
	}

	public setData(data:any,index:number):void{		
		this._data = data;		
		if(!this.isFailInAni){
			this.imgFail.visible = false;
		}
		this.isFailInAni = false;
		this.itemIndex = index;
		let isAct:boolean = CacheManager.cheats.isPosOpen(this._data.roleIndex,this._data.pos);
		this.imgLock.visible = !isAct;
		this.loaderIco.visible = isAct;
		if(!isAct && CacheManager.cheats.isNextOpenPos(this._data.roleIndex,this._data.pos)){ //未激活
			this.txtCond.visible = true;
			let cfg:any = ConfigManager.cheatsPos.getByPk(this._data.pos);
			if(cfg.openRotate){
				this.txtCond.text = App.StringUtils.substitude(LangSkill.LANG7,cfg.openRotate);
			}else{
				this.txtCond.text = App.StringUtils.substitude(LangSkill.LANG7,cfg.openLevel);
			}
			this.loaderIco.clear();
		}else{
			this.txtCond.visible = false;
			let code:number = CacheManager.cheats.getPosItemCode(this._data.roleIndex,this._data.pos);
			if(code){
				let itemData:ItemData = new ItemData(code);
				this.loaderIco.load(itemData.getIconRes());
			}else{
				this.loaderIco.clear();
			}
		}
	}

	public playEffect(isPlay:boolean):void{
		if(isPlay){
			if(!this.eff){
				this.eff = UIMovieManager.get(PackNameEnum.MCCheatSuccee,0,0);
			}
			this.eff.frame = 0;
			this.eff.playing = true;
			this.effCnt.addChild(this.eff);
			this.eff.setPlaySettings(0,-1,1,-1,()=>{
				if(this.eff){
					this.eff.destroy();
					this.eff = null;
				}
			},this);
		}else{
			if(this.eff){
				this.eff.destroy();
				this.eff = null;
			}
		}
		
	}

	public playFailAni(isPlay:boolean,cbFn:Function=null,caller:any=null):void{
		this.imgFail.visible = isPlay;
		this.isFailInAni = isPlay;
		if(isPlay){
			this.failAni.play(()=>{
				this.imgFail.visible = false;
				if(cbFn && caller){
					cbFn.call(caller);
				}
			},this);
		}else{
			this.failAni.stop();
		}		
	}




}