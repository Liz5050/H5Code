class ShapeReplaceItem extends ListRenderer {
    private baseitem : BaseItem; 
    private btnReplace  : fairygui.GButton;
    private c1 : fairygui.Controller;
    private txtLevel : fairygui.GRichTextField;
    private txtAtt : fairygui.GRichTextField;
    private txtScore : fairygui.GTextField;
    private type : number;
    private code : number;
    private shape: EShape;

    public constructor() {
		super();
		
	}

    protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.baseitem = <BaseItem>this.getChild("baseitem");
        this.baseitem.isShowCareerIco = false;
        this.baseitem.isSelectStatus = false;
        this.txtScore = this.getChild("txt_score").asTextField;
        this.txtLevel = this.getChild("txt_level").asRichTextField;
        //this.txtName = this.getChild("txt_name").asRichTextField;
        this.txtAtt = this.getChild("txt_att").asRichTextField;
        this.btnReplace = this.getChild("btn_replace").asButton;

        this.btnReplace.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}


    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnReplace:
                ProxyManager.shape.shapeDressEquip(this.shape, this.type, this.code, this._data.roleIndex);
                break;
        }
    }

    public setData(data:any,index:number):void{
        var itemData:ItemData=<ItemData>data.item;
		this._data = data;
		this.itemIndex = index;
        this.code = itemData.getCode();

        this.baseitem.itemData = itemData;       
        let equipData: any = ConfigManager.mgShapeEquip.getByItemCode(itemData.getCode());
        this.shape = equipData.shape;
		let attrDict: any = WeaponUtil.getAttrDict(equipData.attrList);
		let fight:number = WeaponUtil.getCombat(attrDict);
        this.type = equipData.type;

        this.baseitem.setNameText(itemData.getName(true));        
        this.txtScore.text = "评分："+fight+"";
        //this.txtName.text = itemData.getName();
        
        var dressPos:number = equipData.type;
        let roleIndex:number = data.roleIndex;
        var clr:any = "#c8b185";
        var str:string = WeaponUtil.getAttrText2(attrDict,false,clr,null,true,false);
        //str = HtmlUtil.html("等级："+itemData.getLevel(),clr,true)+str;
        this.txtAtt.text = ""+str;
        
        let curDressEquip:any = ConfigManager.item.getByPk(CacheManager.shape.getEquipNow(equipData.shape,dressPos,roleIndex ));
        var dressScore:number = 0;
        if(curDressEquip) {
            let equipData1: any = ConfigManager.mgShapeEquip.getByItemCode(curDressEquip.code);
            if(equipData1) {
                let attrDict1: any = WeaponUtil.getAttrDict(equipData1.attrList);
		        dressScore = WeaponUtil.getCombat(attrDict1);
            }
        }

        var curScrore:number = fight;
        var idx = 0;
        if(true){
            this.btnReplace.visible = true;
            this.txtLevel.text = "等级："+HtmlUtil.html(WeaponUtil.getEquipLevelText(itemData)+"", Color.Color_5);
            if(!curDressEquip || curDressEquip.code != this.code) {
                if(curScrore > dressScore){
                    if(dressScore != 0) {
                        let isReferrer:boolean = index==0 || index==1;
                        idx = isReferrer ? 3 : 2;
                    }
                    else{
                        let isReferrer:boolean = index==0;
                        idx = isReferrer ? 3 : 2;
                    }
                }else{
                    idx = 1;                    
                }
            }
            else {
                idx = index==0 ? 0 : 1;
            }
        }
        this.c1.setSelectedIndex(idx);
	}

}