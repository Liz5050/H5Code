/**
 * 特殊装备的tips
 * @author zhh
 * @time 2018-05-31 16:18:10
 */
class ToolTipEquip2 extends ToolTipBase {
    private txtName:fairygui.GRichTextField;
	private skillNameTxt:fairygui.GTextField;
    private skillDescTxt:fairygui.GRichTextField;
    private txtFight:fairygui.GTextField;
    private txt_tip:fairygui.GTextField;
	private btnAct:fairygui.GButton;
	private btnSell:fairygui.GButton;
	private btnRoad1:fairygui.GButton;
	private btnRoad2:fairygui.GButton;
    private listAttr:List;
	private model_container:fairygui.GComponent;
	private itemData: ItemData;
    private extData: any;
	private toolTipSource: ToolTipSouceEnum = ToolTipSouceEnum.None;
	private modelShow:ModelShow;
	private c1:fairygui.Controller;
	private c2:fairygui.Controller;
	private img_bg:fairygui.GImage;
	private load_bg:GLoader;
	//private rewardVipLevel:number = 0;
	public constructor() {
		super(PackNameEnum.Common, "ToolTipEquip2");
	}

	public initUI(): void {
		super.initUI();
        //---- script make start ----
		this.c2 = this.getController("c2");
        this.txtName = this.getGObject("txt_name").asRichTextField;
        this.txt_tip = this.getGObject("txt_tip").asTextField;
		this.skillNameTxt = this.getGObject("txt_skillName").asTextField;
        this.skillDescTxt = this.getGObject("txt_skillDesc").asRichTextField;
		let panel_fight:fairygui.GComponent = this.getGObject("panel_fight").asCom;
		this.txtFight = panel_fight.getChild("txt_fight").asTextField;
		this.btnAct = this.getGObject("btn_act").asButton;
		this.btnSell = this.getGObject("btn_sell").asButton;
		this.btnRoad1= this.getGObject("btn_road1").asButton;
		this.btnRoad2= this.getGObject("btn_road2").asButton;
        this.listAttr = new List(this.getGObject("list_attr").asList);
		this.model_container = this.getGObject("model_container").asCom;
		this.load_bg = <GLoader>this.getGObject("load_bg");
		//this.load_bg.load(URLManager.getModuleImgUrl("bg/equip_tips.png",PackNameEnum.Common));
		this.c1 = this.getController("c1");
		this.img_bg = this.getGObject("img_bg").asImage;
		this.modelShow = new ModelShow(EShape.EShapeMagic);
		this.model_container.displayListContainer.addChild(this.modelShow);
        //---- script make end ----
		this.btnAct.addClickListener(this.onClickBtn,this);
		this.btnSell.addClickListener(this.onClickBtn,this);
		this.btnRoad1.addClickListener(this.onClickBtn,this);
		this.btnRoad2.addClickListener(this.onClickBtn,this);
		this.btnRoad2.text = "神秘商店";
	}

	public setToolTipData(toolTipData: ToolTipData) {
		super.setToolTipData(toolTipData);		
		this.toolTipSource = toolTipData.source;
		this.extData = toolTipData.extData;
		let idxC1:number = 0;
		if (toolTipData) {
			this.itemData = <ItemData>toolTipData.data;
			this.txtFight.text = WeaponUtil.getCombatByItemData(this.itemData)+ "";
			this.txtName.text = this.itemData.getName();
			
			var baseAttrs:any[] = WeaponUtil.getBaseAttrArr(this.itemData);
			this.listAttr.data = baseAttrs;


			let curSkillArr: Array<string> = this.itemData.getAddSkills().split(",");
			this.skillDescTxt.text = "";
			for(let i = 0; i < curSkillArr.length; i++){
				let skillCfg: any = ConfigManager.skill.getByPk(curSkillArr[i]);
				if(i == 0){
					this.skillNameTxt.text = `${skillCfg.skillName}LV.${skillCfg.skillLevel}`;
				}
				this.skillDescTxt.text += skillCfg.skillDescription;
			}
			// this.skillDescTxt.text = this.itemData.getDesc();

			this.modelShow.setData(this.itemData.getModelId());
			this.modelShow.x = 260;
			this.modelShow.y = 200;
			// let isDress:boolean = CacheManager.pack.rolePackCache.isDressed(this.itemData);
			// if(isDress){
			// 	idxC1 = 1;
			// }
			// let pos:number = ItemsUtil.getEqiupPos(this.itemData);
			// let act:boolean = false; 
			// let idxC2:number = 1;
			// if(this.toolTipSource==ToolTipSouceEnum.Role){
			// 	act = CacheManager.pack.backPackCache.isHasEquipByDressPos(pos,this.extData.roleIndex);
			// 	idxC2 = act || isDress?1:0;
			// }else{
			// 	if(this.itemData.getUid() != null && ItemsUtil.isCanSell(this.itemData) && CacheManager.pack.rolePackCache.isDressedAllRolesByPos(pos)){
			// 		idxC2 = 2;
			// 		idxC1 = 2;
			// 	}else{
			// 		idxC2 = 1;
			// 		idxC1 = 2;
			// 	}
			// }
			// this.btnAct.visible =  act && !isDress;
			// this.c2.setSelectedIndex(idxC2);

			//this.rewardVipLevel = this.itemData.getType()==EEquip.EEquipRing?3:5;
			//this.btnRoad1.text = `VIP${this.rewardVipLevel}奖励`;
			this.c2.setSelectedIndex(1);
			this.btnAct.visible = this.toolTipSource == ToolTipSouceEnum.Pack;
		}	
		this.c1.setSelectedIndex(idxC1);
	}
	
	private onClickBtn(e:egret.TouchEvent):void{
		switch(e.target){
			case this.btnAct:
				// EventManager.dispatch(LocalEventEnum.EquipToRole,this.itemData,this.extData.roleIndex);
				HomeUtil.open(ModuleEnum.Player,false);
				this.hide();
				break;
			case this.btnSell:
				ProxyManager.pack.sellItem(EPlayerItemPosType.EPlayerItemPosTypeBag, [this.itemData.getUid()]);
				this.hide();
				break;
			case this.btnRoad1:
				//HomeUtil.open(ModuleEnu.VIP,false,{vipLevel:this.rewardVipLevel});
				HomeUtil.open(ModuleEnum.Lottery,false,{tabType:PanelTabType.LotteryEquip});
				this.hide();
				break;
			case this.btnRoad2:
				//Tip.showTip("敬请期待");				
				HomeUtil.open(ModuleEnum.Shop,false,{tabType:PanelTabType.ShopMystery});
				this.hide();
				break;
		}
		
	}
	
	
}