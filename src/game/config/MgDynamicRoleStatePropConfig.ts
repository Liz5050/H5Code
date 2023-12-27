class MgDynamicRoleStatePropConfig extends BaseConfig {
	public constructor() {
		super("t_mg_dynamic_role_state_prop", "code,roleState");
	}

	public getRoleExp(code: number, roleState: number): number{
		let cfg: any = this.getByPk(`${code},${roleState}`);
		if(cfg){
			return cfg.roleExp;
		}
		return 0;
	}
}