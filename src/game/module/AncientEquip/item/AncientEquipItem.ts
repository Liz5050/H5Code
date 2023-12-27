/**
 * 装备item
 * @author zhh
 * @time 2018-08-24 16:01:37
 */
class AncientEquipItem extends ListRenderer {
    public isNeedGray:boolean = true;
    private loaderIco:GLoader;
    private loaderLv:GLoader;
    private imgBg:fairygui.GImage;
    private imgSelect:fairygui.GImage;
    private txtName:fairygui.GTextField;
    private mcContainer:fairygui.GComponent;   
    private effMc:UIMovieClip;
    
	public constructor() {
		super();
		
	}

	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderIco = <GLoader>this.getChild("loader_ico");
        this.loaderLv = <GLoader>this.getChild("loader_lv");
        this.imgBg = this.getChild("img_bg").asImage;
        this.imgSelect = this.getChild("img_select").asImage;
        this.txtName = this.getChild("txt_name").asTextField;
        this.mcContainer = this.getChild("mc_container").asCom;
        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
        let itemData:ItemData = <ItemData>this._data.item;
        if(itemData){
            this.loaderIco.load(itemData.getIconRes());
            this.txtName.text = itemData.getName();
        }
        let lv:number = CacheManager.ancientEquip.getPosLevel(this._data.roleIndex,this._data.type);
        let isAct:boolean = lv>0; 
        
        if(this.isNeedGray){
            this.loaderIco.grayed = !isAct;
        }else{
            this.loaderIco.grayed = false;
        }

        if(isAct){
            this.loaderLv.load(URLManager.getModuleImgUrl("level_"+lv+".png",PackNameEnum.AncientEquip));     
        }else{
            this.loaderLv.clear();
        }
        this.addEffect(isAct);
                   
	}

    private addEffect(isAdd:boolean):void{
        if(isAdd){
            if(!this.effMc){
                this.effMc = UIMovieManager.get(PackNameEnum.MCItemColor6);
            }
            this.mcContainer.addChild(this.effMc);
            this.effMc.x = 0;
            this.effMc.y = 0;
            this.effMc.playing = true;
            this.effMc.frame = 0;
            this.effMc.setPlaySettings(0,-1,0,-1);
        }else if(this.effMc){
            this.effMc.destroy();
            this.effMc = null;
        }
    }

    public setSelect(isSelect:boolean):void{
        this.imgSelect.visible = isSelect; 
    }

    public setNameVisible(value:boolean):void{
        this.txtName.visible = value;
    }

    public checkTips():void{
        let isTip:boolean = CacheManager.ancientEquip.isPosCanUp(this._data.roleIndex,this._data.type);
        if(!isTip){
            isTip = CacheManager.ancientEquip.isPosCanTransfer(this._data.roleIndex,this._data.type)//判断合成
        }
        if(!isTip){
            isTip = CacheManager.ancientEquip.isPosCanTransfer(this._data.roleIndex,this._data.type,true)//判断分解
        }
        CommonUtils.setBtnTips(this,isTip);
    }

    public set icoUrl(value:string){
        this.loaderIco.load(value);
    }


}