class OtherRoleItem extends fairygui.GComponent {
	private c1: fairygui.Controller;
	private c2: fairygui.Controller;
	private img_select:fairygui.GImage;
	private avatarLoader: GLoader;
	private openTxt: fairygui.GTextField;
	private role: any;
	public constructor() {
		super();
	}

	protected constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.c1 = this.getController("c1");
		this.c2 = this.getController("c2");
		this.avatarLoader = <GLoader>this.getChild("loader_avatar");
		this.openTxt = this.getChild("txt_open").asTextField;
		this.img_select = this.getChild("img_select").asImage;
		this.selected = false;
	}

	public setData(data:any):void {
		this.role = data;
		if(!data) {
			//未激活
			this.c1.setSelectedIndex(0);
			this.c2.setSelectedIndex(3);
			this.openTxt.text = "无";
			this.avatarLoader.clear();
			this.selected = false;
		}
		else {
			let career:number = CareerUtil.getBaseCareer(this.role.career_SH);
			this.c1.setSelectedIndex(1);
			this.openTxt.text = "";
			this.avatarLoader.load(URLManager.getPlayerHead(career));
			if(career == 4) {
				this.c2.setSelectedIndex(2);
			}
			else {
				this.c2.setSelectedIndex(career - 1);
			}
		}
	}

	public set selected(value:boolean) {
		this.img_select.visible = value;
	}

	public get roleData():any {
		return this.role;
	}
}