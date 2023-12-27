/**
 * 多角色选项面板
 */
class RoleItemPanel extends fairygui.GComponent {
	private bgLoader: GLoader;
	private roleList: List;
	private lastSelectedRoleIndex: number = 0;
	private _onChangeFun: Function;
	private _onChangeCaller: any;
	private _listData: Array<any>;
	private _lastIndex: number = -1;
	private _funcRedTipList:boolean[] = [false, false, false];//各自功能红点
	public constructor() {
		super();
	}

	public constructFromXML(xml: any): void {
		super.constructFromXML(xml);
		this.bgLoader = this.getChild("loader_bg") as GLoader;
		this.roleList = new List(this.getChild("list_role").asList);
		this.roleList.list.addEventListener(fairygui.ItemEvent.CLICK, this.clickRoleItem, this);
		this.bgLoader.load(URLManager.getModuleImgUrl("bg/role_avatar_bg.png", PackNameEnum.Common));

		EventManager.addListener(LocalEventEnum.PlayerNewRoleUpdated, this.onOpenNewRole, this);
	}

	/**
	 * 选中改变回调函数
	 */
	public setSelectChangedFun(fun: Function, caller: any) {
		this._onChangeFun = fun;
		this._onChangeCaller = caller;
	}

	public updateRoles(index: number = 0): void {
		this.setRoleList();
		this.roleList.selectedIndex = index;
	}

	public setRoleList(): void {
		this._listData = [
			{ "index": RoleIndexEnum.Role_index0, "isCanOpen": false, "role": CacheManager.role.getSRole(RoleIndexEnum.Role_index0) },
			{ "index": RoleIndexEnum.Role_index1, "isCanOpen": CacheManager.role.isCanOpenRoleByIndex(RoleIndexEnum.Role_index1), "role": CacheManager.role.getSRole(RoleIndexEnum.Role_index1) },
			{ "index": RoleIndexEnum.Role_index2, "isCanOpen": CacheManager.role.isCanOpenRoleByIndex(RoleIndexEnum.Role_index2), "role": CacheManager.role.getSRole(RoleIndexEnum.Role_index2) }];

		this.roleList.data = this._listData;
	}

	/**检测红点 */
	public checkTips(): void {
		let roleItem: RoleItem;
		for (let inf of this._listData) {
			let b: boolean = (inf.role && CacheManager.role.isHasEquipTip(inf.index)) || inf.isCanOpen;
			roleItem = <RoleItem>this.roleList.list._children[inf.index];
			roleItem.showEffect(inf.isCanOpen);
			this.setRoleRedTip(inf.index, b);
		}
	}

	public checkRoleTipsByFn(fn: Function, caller): void {
		for (let inf of this._listData) {
			if (inf.role) {
				let b: boolean = fn.call(caller, inf.index);
				this.setRoleRedTip(inf.index, b);
			}
		}
	}

	public get selectedIndex(): number {
		return this.roleList.selectedIndex;
	}

	public set selectedIndex(selectedIndex: number) {
		this.roleList.selectedIndex = selectedIndex;
	}

	public get selectedData(): any {
		return this.roleList.selectedData;
	}

	public get listData(): Array<any> {
		return this._listData;
	}

	/**
	 * 设置角色红点
	 */
	public setRoleRedTip(roleIndex: number, isTip: boolean): void {
		let roleItem: RoleItem = <RoleItem>this.roleList.list._children[roleIndex];
		CommonUtils.setBtnTips(roleItem, isTip, 75, 64, true);
		this._funcRedTipList[roleIndex] = isTip;
	}

	public getFuncRedTip(roleIndex: number):boolean {
        return this._funcRedTipList[roleIndex];
	}

	public getFirstFuncRedTip():number {
		let roleItem: RoleItem;
        for (let i = 0; i < this._funcRedTipList.length; i++) {
			if (this._funcRedTipList[i]) {
				roleItem = <RoleItem>this.roleList.list._children[i];
				if (roleItem && roleItem.isOpen) {
					return i;
				}
			} 
        }
        return 0;
	}

	private clickRoleItem(e: fairygui.ItemEvent): void {
		let data: any = this.roleList.selectedData;
		if (data["role"] != null) {
			if (this._onChangeFun != null && this._onChangeCaller != null) {
				this._onChangeFun.call(this._onChangeCaller, this.roleList.selectedIndex, this.roleList.selectedData);
			}
			this.lastSelectedRoleIndex = this.roleList.selectedIndex;
		} else {
			this.roleList.selectedIndex = this.lastSelectedRoleIndex;
			EventManager.dispatch(UIEventEnum.ModuleOpen, ModuleEnum.OpenRole);
		}
	}

	/**
	 * 创建了新角色。则选择新角色
	 */
	private onOpenNewRole(sRealRole: any = null): void {
		if (this.onStage) {
			this.updateRoles();
			this.selectedIndex = CacheManager.role.getRoleIndex(sRealRole.career_I);
			this.clickRoleItem(null);
			this.checkTips();
		}
	}
}