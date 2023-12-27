class LocalStorageUtils {
	
	/**不支持本地存储的,存在当前客户端 */
	private static localAlertDict:any = {};

	public static setKey(key: string, value: string): void {
		if(LocalStorageUtils.isLocalStorageSupported()){
			egret.localStorage.setItem(key, value);
		}else{
			LocalStorageUtils.localAlertDict[key] = value;
		}		
	}

	public static isExists(key: any): boolean {
		var c: string = LocalStorageUtils.getItem(key);		
		return c && c != "";
	}

	public static getItem(key: string):string{
		if (!key) {
			return "";
		}
		var c: string;
		if(LocalStorageUtils.isLocalStorageSupported()){
			c = egret.localStorage.getItem(key);
		}else{
			c = LocalStorageUtils.localAlertDict[key];
		}
		return c;
	}

	public static check(key: string, value: string): boolean {
		var c: string = LocalStorageUtils.getItem(key);	
		return c == value;
	}

	/**
	 * 判断 AlertCheckEnum 的某个key是否过期
	 */
	public static isAlertExpire(key: any): boolean {
		var flag: boolean = true;
		var c: string = LocalStorageUtils.getItem(key);	
		var isEx: boolean = (c && c != "");
		if (isEx) {
			var sec: number = Number(c);
			var serSec: number = CacheManager.serverTime.getServerTime();
			flag = App.DateUtils.isSameDay(sec, serSec);
			if (!flag) { //不同一日 删掉这个key
				LocalStorageUtils.remove(key);
			}
			return !flag;
		}

		return flag;
	}

	public static remove(key: string): void {
		egret.localStorage.setItem(key, "");
	}
	public static clear(): void {
		egret.localStorage.clear();
	}

	/**
	 * 判断 是否支持本地存储
	 */
	public static isLocalStorageSupported(): boolean {
		let testKey = "test";
		var flag:boolean = egret.localStorage.setItem(testKey, "testValue");		
		return flag;
	}
}