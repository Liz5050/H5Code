/**
 * 仙盟守护建筑头像item
 * @author zhh
 * @time 2019-01-09 16:54:45
 */
class GuildDefendItem extends ListRenderer {
    private loaderHead:GLoader;
    private imgBg:fairygui.GImage;
    private imgLbl:fairygui.GImage;
	private lifeBar:UIProgressBar;
	private txtName:fairygui.GTextField;
	private mcClick:UIMovieClip;
	private cnt:fairygui.GComponent;
	private c1:fairygui.Controller;
	private imgMask:fairygui.GImage;
	private timeOutId:number = 0;

	private isTween:boolean;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
		this.lifeBar = <UIProgressBar>this.getChild("progressBar");
        this.loaderHead = <GLoader>this.getChild("loader_head");
        this.imgBg = this.getChild("img_bg").asImage;
        this.imgLbl = this.getChild("img_lbl").asImage;
		this.imgMask = this.getChild("img_mask").asImage;
		this.txtName = this.getChild("txt_name").asTextField;
		this.cnt = this.getChild("cnt").asCom;
		this.c1 = this.getController("c1");
        //---- script make end ----
		this.lifeBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Common,"progressBar_6"),URLManager.getPackResUrl(PackNameEnum.Common,"bg_8"),105,12,2,0);		
		this.lifeBar.labelType = BarLabelType.None;
		this.addClickListener(this.onClickHandler,this);
		this.imgMask.visible = false;
	}
	public setData(data:any,index:number):void{
		this._data = data;
		this.itemIndex = index;
		let bossInfo:any = ConfigManager.boss.getByPk(this._data);
		this.txtName.text = bossInfo.name; 
		let entity:EntityInfo = CacheManager.map.getEntityByBossCode(this._data) as EntityInfo;
		let isDead:boolean = true;
		if(entity){
			isDead = entity.life_L64<=0;			
			this.lifeBar.setValue(entity.life_L64,entity.maxLife_L64);	
			let iscg:boolean = CacheManager.guildDefend.isLifeChange(this._data,entity.life_L64);
			CacheManager.guildDefend.setDefenderLife(this._data,entity.life_L64);
			if(entity.life_L64!=entity.maxLife_L64 && iscg  && !isDead){ //受到攻击 && entity.entityInfo.life_L64 < this.lastLife
				if(!this.isTween){
					this.isTween = true;
					this.imgMask.visible = true;
					this.imgMask.alpha=1;			
					egret.Tween.removeTweens(this.imgMask);
					let t:egret.Tween = egret.Tween.get(this.imgMask,{loop:true});					
					let d:number = 1000;					
					t.to({alpha:0},d).to({alpha:1},d).call(()=>{
						this.imgMask.visible = false;
						this.isTween = false;
					},this);
				}			
			}else{
				this.hideMask();
			}
		}

		if(isDead){
			this.hideMask();
		}
		this.lifeBar.visible = !isDead;
		this.imgLbl.visible = isDead;
		this.loaderHead.grayed = isDead;
		this.loaderHead.load(URLManager.getBossHeadIcon(this._data));
		let idx:number = this._data==GuildDefendCache.DEFENDER_3?1:0;
		this.c1.setSelectedIndex(idx);
	}
	
	private hideMask():void{
		egret.Tween.removeTweens(this.imgMask);
		this.imgMask.visible = false;
		this.isTween = false;
	}

	private onClickHandler():void {
		if(!this.mcClick) {
			this.mcClick = UIMovieManager.get(PackNameEnum.MCClick);
			this.mcClick.x = 0;
			this.mcClick.y = 0;
			this.cnt.addChild(this.mcClick);
		}
		this.mcClick.setPlaySettings(0,-1,1,-1,function(){
			this.mcClick.playing = false;	
			this.mcClick.visible = false;	
		},this);
		this.mcClick.visible = true;
		this.mcClick.playing = true;
	}
	public recycleChild():void{
	}
}