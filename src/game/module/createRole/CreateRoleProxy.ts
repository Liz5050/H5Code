class CreateRoleProxy extends BaseProxy{
	public constructor() {
		super();
	}

	/**
	 * 请求登录服务端login服务器，进行登录验证
	 */
	public login():void{
		console.log("请求登录服务端login服务器，进行登录验证,username: "+ Sdk.username
			+ ", password: " + Sdk.password
			+ ", userId: " + Sdk.userId + ", server: "+ Sdk.server 
			+ ", platformCode: " + Sdk.platformCode
			+ ", flag: " + Sdk.flag
			+ ", ip: " + Sdk.loginIp
			+ ", loginTime: " + Sdk.time
			+ ", ex: " + Sdk.ex);
		this.send("ECmdGameLogin",{
			"username": Sdk.username,
			"userId": Sdk.userId, 
			"server": Sdk.server, 
			"flag": Sdk.flag, 
			"isAdult": Sdk.isAdult, 
			"platformCode": Sdk.platformCode, 
			"password": Sdk.password, 
			"loginIp": Sdk.loginIp, 
			"loginTime": Sdk.time,
			"ex": Sdk.ex
		});
	}

	/**
	 * 创角请求
	 * @param sex 性别：男1，女2
	 * @param career 职业：男1，女2
	 */
	public createRole(name: string, camp: number, sex: number, career: number, gateIp: string, server: string, platformCode: string):void{
        if (Sdk.is_new) {
            Sdk.logStep(Sdk.LogStepNew[6]);
        }
		this.send("ECmdGameCreateRole",{"name": name, "camp": camp, "sex": sex, "career": career, "gateIp": gateIp, "server": server, "platformCode": platformCode});
	}

	/**
	 * 角色登录请求
	 */
	public loginRole(playerId: number):void{
		this.send("ECmdGameLoginRole",{"playerId": playerId});
	}

	/**
	 * 登录进入游戏请求
	 */
	public loginGame(playerId: number, username: string, name: string, loginId: number, sessionStr: string, version: string, fromAddress: string, ex: string, macAddress: string):void{
		// Sdk.add_log_message("发送协议：ECmdGameLoginGame");
		this.send("ECmdGameLoginGame",{"playerId": playerId, "username": username, "name": name, "loginId": loginId, "sessionStr": sessionStr, "version": version, "fromAddress": Sdk.loginIp, "ex": Sdk.ex, "macAddress": macAddress});
	}
}