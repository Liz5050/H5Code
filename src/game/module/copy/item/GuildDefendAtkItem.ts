/**
 * 攻击目录列表item
 * @author zhh
 * @time 2019-01-27 10:35:40
 */
class GuildDefendAtkItem extends ListRenderer {
    private c1:fairygui.Controller;
    private loaderHead:GLoader;
    private imgBg:fairygui.GImage;
    private txtName:fairygui.GRichTextField;
    private mcClick:UIMovieClip;
    private cnt:fairygui.GComponent;
	private lifeBar:UIProgressBar;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderHead = <GLoader>this.getChild("loader_head");
        this.imgBg = this.getChild("img_bg").asImage;
        this.txtName = this.getChild("txt_name").asRichTextField;
        this.cnt = this.getChild("cnt").asCom;
		this.lifeBar = <UIProgressBar>this.getChild("progressBar");
		this.lifeBar.setStyle(URLManager.getPackResUrl(PackNameEnum.Common,"progressBar_6"),URLManager.getPackResUrl(PackNameEnum.Common,"bg_8"),105,12,2,0);		
		this.lifeBar.labelType = BarLabelType.None;
        this.addClickListener(this.onClickHandler,this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let bossInfo:any = ConfigManager.boss.getByPk(this._data.code_I);
		this.txtName.text = bossInfo.name; 
        this.loaderHead.load(URLManager.getBossHeadIcon(this._data.code_I));
		this.lifeBar.setValue(this._data.life_L64,this._data.maxLife_L64);	
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

}