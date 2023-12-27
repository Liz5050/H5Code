class CopyHurtListView extends BaseContentView {
	private txt_myHurt:fairygui.GTextField;
	private txt_first_name:fairygui.GTextField;
	private txt_first_hurt:fairygui.GTextField;
	private list_rank:List;
	private btn_switch:fairygui.GButton;
	public constructor() {
		super(PackNameEnum.Copy,"CopyHurtListView");
	}

	public initUI():void {
		super.initUI();
		if (this.view) {
			this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
			this.view.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Size);
		}
	}

	public initOptUI():void {
		this.txt_myHurt = this.getGObject("txt_myHurt").asTextField;
		this.txt_first_name = this.getGObject("txt_first_name").asTextField;
		this.txt_first_hurt = this.getGObject("txt_first_hurt").asTextField;
		this.list_rank = new List(this.getGObject("list_rank").asList);
		this.btn_switch = this.getGObject("btn_switch").asButton;
	}

	public updateAll():void {
		this.updateHurtList();
		this.updateMyHurt();
	}

	public updateHurtList():void {
		let firstHurt:any = CacheManager.copy.firstHurt;
		if(firstHurt) {
			this.txt_first_name.text = firstHurt.name_S + "：";
			this.txt_first_hurt.text = App.MathUtils.formatNum2(Number(firstHurt.hurt_L64));
		}
		else {
			this.txt_first_name.text = "";
			this.txt_first_hurt.text = "";
		}
		this.list_rank.data = CacheManager.copy.hurtList;
	}

	public updateMyHurt():void {
		this.txt_myHurt.text = App.MathUtils.formatNum2(CacheManager.copy.myHurt);
	}
}