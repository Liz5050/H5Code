/**
 * 传世装备套装tips
 * @author zhh
 * @time 2018-08-28 14:23:14
 */
class AncientEquipSuitTip extends BaseWindow {
    private c1:fairygui.Controller;
    private windowItemtip:fairygui.GImage;
    private txtTip:fairygui.GObject;
    private txtTitle1:fairygui.GRichTextField;
    private txtPos1:fairygui.GRichTextField;
    private txtAttr1:fairygui.GRichTextField;
    private txtTitle2:fairygui.GRichTextField;
    private txtPos2:fairygui.GRichTextField;
    private txtAttr2:fairygui.GRichTextField;

    private model1:fairygui.GComponent;
    private model2:fairygui.GComponent;

    private modelShow1:ModelShow;
    private modelShow2:ModelShow;

	public constructor() {
		super(PackNameEnum.AncientEquip,"AncientEquipSuitTip")

	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.txtTip = this.getGObject("txt_tip");
        this.txtTitle1 = this.getGObject("txt_title1").asRichTextField;
        this.txtPos1 = this.getGObject("txt_pos1").asRichTextField;
        this.txtAttr1 = this.getGObject("txt_attr1").asRichTextField;
        this.txtTitle2 = this.getGObject("txt_title2").asRichTextField;
        this.txtPos2 = this.getGObject("txt_pos2").asRichTextField;
        this.txtAttr2 = this.getGObject("txt_attr2").asRichTextField;
        this.model1 = this.getGObject("model1").asCom;
        this.model2 = this.getGObject("model2").asCom;
        //---- script make end ----
        this.modelShow1 = new ModelShow(EShape.EAncient);
        this.modelShow2 = new ModelShow(EShape.EAncient);
        this.model1.displayListContainer.addChild(this.modelShow1);
        this.modelShow2.scaleX =  this.modelShow2.scaleY = 0.7; 
        this.modelShow1.scaleX =  this.modelShow1.scaleY = 0.7; 
        this.model2.displayListContainer.addChild(this.modelShow2);


	}

	public updateAll(data?:any):void{
		//{roleIndex:}
        let realSuitLv:number = CacheManager.ancientEquip.getSuitLv(data.roleIndex,true);
        //let cfgSuitLv:number = Math.max(realSuitLv,1);
        //"cultivateType,subtype,level,num"
        let len:number = CacheManager.ancientEquip.dressEquipsType.length;
        let curInfo:any = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},0,${realSuitLv},${len}`);
        if(!curInfo){ //未激活
            this.modelShow1.visible = false;
            this.txtTitle1.text = "当前没有激活套装效果";
            this.txtAttr1.text = "";            
            this.txtPos1.text = "";
        }else{
            this.modelShow1.visible = true;
            this.modelShow1.setData(curInfo.modelId);
            let effectDesc:string = curInfo.effectDesc;
            if(effectDesc){
                effectDesc = HtmlUtil.br(effectDesc);
            }else{
                effectDesc = "";
            }
            this.txtAttr1.text = this.getAttrText2(WeaponUtil.getAttrDict(curInfo.attr),true,Color.Color_6,Color.Color_7,true,true,true)+effectDesc;
            let curPosInfo:any = this.getPosShowInfo(data.roleIndex,realSuitLv);
            this.txtPos1.text = curPosInfo.html;
            this.txtTitle1.text = curInfo.suitName+` (${curPosInfo.num}/${len})`;
        }
        
        let idx:number = 0;
        let nextLv:number = realSuitLv+1;
        let nextInfo:any = ConfigManager.cultivateSuit.getByPk(`${ECultivateType.ECultivateTypeForeverEquip},0,${nextLv},${len}`);
        if(nextInfo){
            let nextClr:string = Color.Color_9;
            let effectDesc:string = nextInfo.effectDesc;
            if(effectDesc){
                effectDesc = HtmlUtil.br(effectDesc);
                effectDesc = effectDesc.replace(/#[0-9A-Za-z]+/g,nextClr);
            }else{
                effectDesc = "";
            }
            this.txtAttr2.text = this.getAttrText2(WeaponUtil.getAttrDict(nextInfo.attr),true,nextClr,nextClr,true,true,true)+effectDesc;
            let nextPosInfo:any = this.getPosShowInfo(data.roleIndex,nextLv);
            this.txtTitle2.text = nextInfo.suitName+` (${nextPosInfo.num}/${len})`;
            this.txtPos2.text = nextPosInfo.html;
            this.modelShow2.setData(nextInfo.modelId); // 
        }else{
            idx = 1;
        }
        this.c1.setSelectedIndex(idx);
        this.view.setSize(this.view.width,this.txtTip.y+this.txtTip.height);
        this.center();
	}

    private getPosShowInfo(roleIndex:number,suitLv:number):any{
        let info:any = {html:"",num:0};
        let html:string = "";
        let dressEquipsType:number[] = CacheManager.ancientEquip.dressEquipsType;
        for(let i:number=0;i<dressEquipsType.length;i++){
            let pos:number = dressEquipsType[i];
            let posName:string = WeaponUtil.getWeaponTypeName(pos); //部位
            let posLv:number = CacheManager.ancientEquip.getPosLevel(roleIndex,pos);
            let clr:string;
            if(posLv>=suitLv){
                clr = Color.Color_7;
                info.num++;
            }else{
                clr = Color.Color_9;
            }
            html+=HtmlUtil.html(posName,clr)+" ";
        }
        info.html = html;
        return info;
    }

    public getAttrText2(dict: any, isHtml: boolean, valueColor: string = null, nameColor: string = null, newLine: boolean = true, needPlus: boolean = true, needName: boolean = true): string {
		var html: string = "";
		for (let key in dict) {
			let type:number = Number(key);
			let num:number = Number(dict[key]);
			let nameStr: string = needName ? CommonUtils.getAttrName(type)+"  ": "";
			let valueStr: string = "";
			if(WeaponUtil.isPercentageAttr(type)){
				let str:string = `${num / 100}%`;
				valueStr = str;
			}else{
				valueStr = dict[key];
			}
            valueStr = "+"+valueStr;
			html += WeaponUtil.fmtAttrStr(nameStr, valueStr, isHtml, valueColor, nameColor, newLine);
		}
		return html;
	}

}