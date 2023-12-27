/**
 * 更换装备listitem
 * @author zhh
 * @time 2018-05-22 16:38:35
 */
class PlayerReplaceItem extends ListRenderer {
    private c1:fairygui.Controller;
    private baseitem:BaseItem;
    private txtScore:fairygui.GTextField;
    private txtLevel:fairygui.GTextField;
    //private txtName:fairygui.GRichTextField;
    private txtAtt:fairygui.GRichTextField;
    private btnReplace:fairygui.GButton;


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
        this.txtLevel = this.getChild("txt_level").asTextField;
        //this.txtName = this.getChild("txt_name").asRichTextField;
        this.txtAtt = this.getChild("txt_att").asRichTextField;
        this.btnReplace = this.getChild("btn_replace").asButton;

        this.btnReplace.addClickListener(this.onGUIBtnClick, this);
        //---- script make end ----


	}
	public setData(data:any,index:number):void{
        var itemData:ItemData=<ItemData>data.item;
		this._data = data;
		this.itemIndex = index;
        
        this.baseitem.itemData = itemData;       
        this.baseitem.setNameText(itemData.getName(true));        
        this.txtScore.text = "评分："+WeaponUtil.getScoreBase(itemData)+"";
        //this.txtName.text = itemData.getName();
        let dict: any = WeaponUtil.getBaseAttrDict(itemData);
        var dressPos:number = ItemsUtil.getEqiupPos(itemData);
        let roleIndex:number = data.roleIndex;
        var clr:any = "#c8b185";
        var str:string = WeaponUtil.getAttrText2(dict,false,clr,null,true,false);
        //str = HtmlUtil.html("等级："+itemData.getLevel(),clr,true)+str;
        this.txtAtt.text = ""+str;
        
        let curDressEquip:ItemData = CacheManager.pack.rolePackCache.getDressEquipByPos(dressPos,roleIndex);
        var dressScore:number = CacheManager.pack.rolePackCache.getDressEquipScoreByPos(dressPos,roleIndex);
        var curScrore:number = WeaponUtil.getScoreBase(itemData);
        var idx = 0;
        if(WeaponUtil.isCanEquip(itemData,roleIndex)){
            this.btnReplace.visible = true;
            this.txtLevel.text = "等级："+HtmlUtil.html(WeaponUtil.getEquipLevelText(itemData)+"", Color.Color_5);
            if(!CacheManager.pack.rolePackCache.isDressed(itemData)){
                if(curScrore>dressScore){
                    let isReferrer:boolean = (curDressEquip!=null && index==1)||index==0;
                    idx = isReferrer?3:2;
                }else{
                    idx = 1;                    
                }
            }
        }else{
            this.txtLevel.text = "等级："+HtmlUtil.html(WeaponUtil.getEquipLevelText(itemData)+"", Color.Color_4);
            idx = 1;
            this.btnReplace.visible = false;
        }
                
        this.c1.setSelectedIndex(idx);

	}
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnReplace:
                EventManager.dispatch(LocalEventEnum.EquipToRole, this._data.item,this._data.roleIndex);
                break;
        }
    }


}