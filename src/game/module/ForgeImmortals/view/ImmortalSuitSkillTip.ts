/**
 * 套装技能tips
 * @author zhh
 * @time 2018-08-21 14:32:45
 */
class ImmortalSuitSkillTip extends BaseWindow {
    private c1:fairygui.Controller;
    private groupNext:fairygui.GGroup;
    private baseItem:BaseItem;
    private windowItemtip:fairygui.GImage;
    private txtDesc1:fairygui.GTextField;
    private txtTip:fairygui.GTextField;
    private txtCond:fairygui.GTextField;
    private txtDesc2:fairygui.GTextField;
    private txtPro1:fairygui.GRichTextField;
    private txtPro2:fairygui.GRichTextField;
    private listPosName1:List;
    private listPosName2:List;

	public constructor() {
		super(PackNameEnum.ForgeImmortals,"ImmortalSuitSkillTip")

	}
	public initOptUI():void{
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.groupNext = this.getGObject("group_next").asGroup;
        this.baseItem = <BaseItem>this.getGObject("baseItem");
        this.windowItemtip = this.getGObject("window_itemtip").asImage;
        this.txtDesc1 = this.getGObject("txt_desc1").asTextField;
        this.txtTip = this.getGObject("txt_tip").asTextField;
        this.txtCond = this.getGObject("txt_cond").asTextField;
        this.txtDesc2 = this.getGObject("txt_desc2").asTextField;
        this.txtPro1 = this.getGObject("txt_pro1").asRichTextField;
        this.txtPro2 = this.getGObject("txt_pro2").asRichTextField;
        this.listPosName1 = new List(this.getGObject("list_posName1").asList);
        this.listPosName2 = new List(this.getGObject("list_posName2").asList);

        //---- script make end ----

	}

	public updateAll(data?:any):void{
		//{roleIndex:,subType:}
        let curSuitLv:number = CacheManager.forgeImmortals.getSuitLevel(data.roleIndex,data.subType,false);
        let curSuitInfo:any = CacheManager.forgeImmortals.getSuitInfo(data.roleIndex,data.subType,curSuitLv);
        let nextSuitInfo:any = CacheManager.forgeImmortals.getSuitInfo(data.roleIndex,data.subType,curSuitLv+1);

        let itemInfos:any[] = CacheManager.forgeImmortals.getPosItemInfo(data.subType);
        let curPosInfos:any[] = [];
        let nextPosInfos:any[] = [];
        for(let i:number = 0;i<itemInfos.length;i++){
            curPosInfos.push({roleIndex:data.roleIndex,curSuitLv:curSuitLv,isNext:false,info:itemInfos[i]});
            nextPosInfos.push({roleIndex:data.roleIndex,curSuitLv:curSuitLv,isNext:true,info:itemInfos[i]});
        }
        this.listPosName1.data = curPosInfos;
        this.listPosName1.list.setBoundsChangedFlag();
        this.txtDesc1.text = curSuitInfo.effectDesc;
        let curNumInfo:any = CacheManager.forgeImmortals.getSuitTargetInfo(data.roleIndex,data.subType,curSuitLv);
        let clr:string = curNumInfo.num>=curNumInfo.total?Color.Color_6:Color.Color_4;
        this.txtPro1.text = HtmlUtil.html(`(${curNumInfo.num}/${curNumInfo.total})`,clr);
        let idx:number = 0;
        if(!nextSuitInfo){
            //已经满阶
            idx = 1;
        }else{
            this.listPosName2.data = nextPosInfos;
            this.listPosName2.list.setBoundsChangedFlag();
            this.txtDesc2.text = nextSuitInfo.effectDesc;
            let nextNumInfo:any = CacheManager.forgeImmortals.getSuitTargetInfo(data.roleIndex,data.subType,curSuitLv+1);
            clr = nextNumInfo.num>=nextNumInfo.total?Color.Color_6:Color.Color_4;
            this.txtPro2.text = HtmlUtil.html(`(${nextNumInfo.num}/${nextNumInfo.total})`,clr);
            this.txtCond.text = App.StringUtils.substitude(LangForge.L5,curSuitLv+1);
        }

        this.c1.setSelectedIndex(idx);
        this.view.setSize(this.view.width,this.txtTip.y+this.txtTip.height);

        this.baseItem.itemData = null;
        let skillCfg:any = ConfigManager.cltImmortal.getSkillInfo(data.subType);
        let iconUrl:string = URLManager.getIconUrl(skillCfg.skillIcon, URLManager.SKIL_ICON);
        this.baseItem.icoUrl = iconUrl;
        this.baseItem.setNameText(HtmlUtil.html(skillCfg.skillName,"#f3f232"));
	}


}