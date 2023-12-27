class Welfare2ButtonItem extends ListRenderer {
    private c1:fairygui.Controller;
    private iconLoader:GLoader;
    public constructor() {
        super();
    }

    protected constructFromXML(xml:any):void {
        super.constructFromXML(xml);
        this.c1 = this.getController("c1");
        this.iconLoader = this.getChild("icon_loader") as GLoader;
    }

    public setData(data:any):void {
        this._data = data;
        let typeName:string = PanelTabType[data];
        this.iconLoader.load(URLManager.getModuleImgUrl("icon/" + typeName + ".png",PackNameEnum.Welfare2));
    }

    public set btnSelected(value:boolean) {
        this.c1.selectedIndex = value ? 1 : 0;
        // this.btn.selected = value;
    }

    public get hasTip():boolean {
        let flag: boolean = false;
        switch(this._data){
            case PanelTabType.SignIn:
                flag = CacheManager.welfare2.checkSignTips();
                break;
            case PanelTabType.LoginReward:
                flag = CacheManager.welfare2.checkLoginRewardTips();
                break;
            case PanelTabType.PrivilegeCard:
                flag = CacheManager.welfare2.privilegeRewardFlag;
                break;
            case PanelTabType.OnlineReward:
                flag = CacheManager.welfare2.checkOnlineRewardTips();
                break;
        }
		return flag;
	}
}