/**
 * 玩家角色项
 */
class RoleItem extends ListRenderer {
	private c1: fairygui.Controller;
	private c2: fairygui.Controller;
	private avatarLoader: GLoader;
	private openTxt: fairygui.GTextField;
	private mc: UIMovieClip;
	private role: any;

	public constructor() {
		super();
		this.enabledSound = true;
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.avatarLoader = <GLoader>this.getChild("loader_avatar");
		this.openTxt = this.getChild("txt_open").asTextField;
	}

	public setData(data: any, index: number): void {
		this._data = data;
		this.itemIndex = index;
		if (data != null) {
			this.role = data["role"];
			if (this.role != null) {
				this.c1.selectedIndex = 2;
				this.c2.selectedIndex = Math.floor(CareerUtil.getBaseCareer(this.role.career_I) / 2);
				this.avatarLoader.load(URLManager.getPlayerHead(this.role.career_I));
			} else {
				if (data["isCanOpen"]) {
					this.c1.selectedIndex = 1;
					this.c2.selectedIndex = 3;
				} else {
					this.c1.selectedIndex = 0;
					this.c2.selectedIndex = 3;
					this.openTxt.text = ConfigManager.mgOpenNewRoleCond.getOpenCondition(index);
				}
			}
		}
	}

	public get isOpen(): boolean {
		return this.role != null;
	}

	public showEffect(isShow: boolean): void {
		if (isShow) {
			if (!this.mc) {
				this.mc = UIMovieManager.get(PackNameEnum.MCHomeIcon);
				this.mc.x = -23;
				this.mc.y = -29;
			}
			this.addChild(this.mc);
		} else {
			if (this.mc) {
				this.mc.removeFromParent();
			}
		}
	}
}