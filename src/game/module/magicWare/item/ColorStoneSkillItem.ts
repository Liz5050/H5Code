/**
 * 五色技能
 * @author zhh
 * @time 2018-10-16 19:11:52
 */
class ColorStoneSkillItem extends ListRenderer {
    private c1:fairygui.Controller;
    private loaderIcon:GLoader;


	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.c1 = this.getController("c1");
        this.loaderIcon = <GLoader>this.getChild("loader_icon");

        //---- script make end ----
		this.loaderIcon.addClickListener(this.onClick,this);

	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let cfg:any = this._data.cfg;
		let skillCfg:any = ConfigManager.skill.getByPk(cfg.openSkill);
		this.loaderIcon.load(ConfigManager.skill.getIconRes(skillCfg.skillIcon));
		let b:boolean = CacheManager.role.getPlayerStrengthenExLevel(cfg.strengthenType,this._data.roleIndex)>=this._data.cfg.strengthenLevel;
		this.c1.setSelectedIndex((b?1:0));
		this.loaderIcon.grayed = !b;
	}

	private onClick(e:any):void{
		EventManager.dispatch(LocalEventEnum.MagicShowCSSkill,this._data.cfg);
	}


}