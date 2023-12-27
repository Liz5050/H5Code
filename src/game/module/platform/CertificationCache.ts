class CertificationCache implements ICache {
    public issm : number;			// 实名制数值
	public onlineHour : number;		// 在线小时数（1,2,3，7）
	public onlineTime : number; //在线时间(单位：秒)
	public isGetSmReward : boolean;
	public isSendSm : boolean;

    public constructor() {
        this.issm = 1;
        this.onlineHour = 0;
        this.onlineTime = 0;
        this.isGetSmReward = false;
        this.isSendSm = false;
	}

    public clear() {
        this.issm = 1;
        this.onlineHour = 0;
        this.onlineTime = 0;
        this.isGetSmReward = false;
        this.isSendSm = false;
    }

    public checkShowSMIcon() : boolean {
        if(this.issm == 0) {
            if(Sdk.platform_config_data.is_eissm != 0 && Sdk.platform_config_data.is_eissm != 3 ) {
                return true;
            }
        }
        if(Sdk.platform_config_data.is_eissm == 2) {
            return true;
        }
        return false;
    }

}