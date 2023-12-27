/**
 * 个人boss列表item
 * @author zhh
 * @time 2018-06-05 12:01:53
 */
class PersonnalBossItem extends ListRenderer {
    private c1:fairygui.Controller;
    private c2:fairygui.Controller;
    private imgCover:fairygui.GImage;
    private imgUnopened:fairygui.GImage;
    private btnBossselect:fairygui.GButton;
    private _isOpen:boolean;
    private _isSecret:boolean;
    private _isMask:boolean = false;
	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.c2 = this.getController("c2");
        this.imgCover = this.getChild("img_cover").asImage;
        this.imgUnopened = this.getChild("img_unopened").asImage;
        this.btnBossselect = this.getChild("btn_bossSelect").asButton;

        //this.btnBossselect.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;//mgGameBoss or {typeIndex:1} typeIndex==1是秘境boss 2是暗之boss
        if(data && data.typeIndex){
            this.c2.setSelectedIndex(data.typeIndex);
            this.c1.setSelectedIndex(0);
            return;
        }
        this.c2.setSelectedIndex(0);
		this.itemIndex = index;
        let bossInf:any = ConfigManager.boss.getByPk(this._data.bossCode);
        let copyInf:any = ConfigManager.copy.getByPk(this._data.copyCode);
        let enterMinLevel:number = copyInf.enterMinLevel?copyInf.enterMinLevel:0;        
        let nameFix:string = ConfigManager.mgGameBoss.getBossFixName(this._data);     

        let isCan:boolean;//true表示可以挑战
        let idx:number = 0;
        this._isMask = false;
        switch(copyInf.copyType){
            case ECopyType.ECopyMgPersonalBoss:
                this._isSecret = false;
                isCan = CacheManager.copy.isEnterNumOk(this._data.copyCode);
                this._isOpen = CacheManager.bossNew.isPersonalOpen(this._data);
                this.btnBossselect.text = bossInf.name+"·"+nameFix;
                if(!isCan){
                    //已挑战
                    this._isMask = true;
                    idx = 1;
                }else if(!this._isOpen){
                    idx = 2; //未开启                                         
                }
                break;
            case ECopyType.ECopyMgSecretBoss:
            case ECopyType.ECopyMgDarkSecretBoss:
                this._isSecret = true;
                isCan = !CacheManager.bossNew.isBossCd(this._data.bossCode);
                this._isOpen = isCan;
                if(isCan){
                    idx = 3;
                }else{
                    idx = 1;
                    this._isMask = true;
                }
                this.updateSecretBossName();
                break;
        }
        this.c1.setSelectedIndex(idx);
        this.setSelectStatus(false);
        
	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnBossselect:
                break;

        }
    }

    public setSelectStatus(value:boolean):void{
        this.btnBossselect.selected = value;
        this.updateSecretBossName();
        if(this._isMask){
            let idx:number = 4;
            if(!value){
                idx = 1;
            }
            this.c1.setSelectedIndex(idx);
        }
        
    }

    public updateSecretBossName():void{
        if(this._data.bossCode && this._isSecret){
            let selected:boolean = this.btnBossselect.selected;
            let nameSelClr:string = "#fcf9d7";
            let nameNotClr:string="#ad906b";
            let nameClr:string = selected?nameSelClr:nameNotClr;
            let timeSelClr:string = "#853d07";
            let timeClr:string = nameClr;//selected?nameSelClr:Color.BASIC_COLOR_3;
            
            let bossInf:any = ConfigManager.boss.getByPk(this._data.bossCode);
            let dt: number = CacheManager.bossNew.getBossDt(this._data.bossCode);
            let serTime: number = CacheManager.serverTime.getServerTime();
            let sec:number = dt - serTime;
            let nameFix:string = sec > 0 ?App.DateUtils.formatSeconds(sec,DateUtils.FORMAT_SECONDS_3):"已经刷新";
            this.btnBossselect.text = HtmlUtil.html(bossInf.name,nameClr)+HtmlUtil.brText+HtmlUtil.html(nameFix,timeClr); 
        }
        
    }

}