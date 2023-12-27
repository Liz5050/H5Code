class ObjectUtil {
	public constructor() {
	}

	/**
	 * 对象复制
	 */
	public static copy(source, dest) {
		for (let key in dest) {
			if (source.hasOwnProperty(key)) {
				dest[key] = source[key];
			}
		}
	}

	/**
	 * 把原生对象属性值复制到引用属性 (srcObj的属性值复制到tarRef)
	 * @param srcObj 原生obj
	 * @param tarRef 任意类引用
	 * @param isForce 是否强制复制 true时 会即时为tarRef创建srcObj的属性
	 */
	public static copyProToRef(srcObj:any,tarRef:any,isForce:boolean=false):void{
		for(var key in srcObj){
			if(isForce || tarRef.hasOwnProperty(key)){
				tarRef[key] = srcObj[key]; 
			}
		}
	}
	/**
	 * 合并两个原生对象的属性值(进行加操作)
	 * @param toObj 合并对象
	 * @param fromObj 被合并对象 
	 * @param asNum 是否强制转换成number后进行加操作
	 */
	public static mergeObj(toObj:any,fromObj:any,asNum:boolean=true):void{
		for(var key in fromObj){
			let val:any = asNum?Number(fromObj[key]):fromObj[key];
			if(toObj.hasOwnProperty(key)){
				toObj[key] = asNum?Number(toObj[key])+val:toObj[key]+val;
			}else{
				toObj[key] = val;
			}
		}
	}

	/**
	 * 删除字典的所有key
	 */
	public static emptyObj(obj:any):void{
		for(var key in obj){
			delete obj[key];
		}
	}
	/**解析服务器返回的dict解析成js的obj */
	public static dictToJsObj(e: any, tar: any=null,valueKey:string="value_I",dictKey:string="key_I"): any {
		var keys: number[] = e[dictKey];
		!tar?tar = {}:null;
		for (var i: number = 0; i < keys.length; i++) {
			tar[keys[i]] = e[valueKey][i];
		}
		return tar;
	}
	/**
	 * 获取对象的属性 如果不存在并且指定了noneRet则返回noneRet否则返回0
	 */
	public static getConfigVal(cfgInf:any,varName:string,noneRet:any=null):any{
		let ret:number = 0;
		if(cfgInf[varName]){
			ret = cfgInf[varName];
		}else if(noneRet){
			ret = noneRet;
		}
		return ret;
	}

}