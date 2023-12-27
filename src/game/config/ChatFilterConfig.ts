class ChatFilterConfig {
	/**替换敏感词的字符 */
	private static repaceChar:string = "*";
	private filters:string[];
	private replaceCharDict:any;
	public constructor(isStandalone = false) {
		this.replaceCharDict = {};
		if (isStandalone) {
			this.filters  = RES.getRes("filter_config_json");
		} else {
			this.filters  = ConfigManager.Data["filter_config"];
		}
		this.clearSpace();
	}
	private clearSpace():void{
		let len:number = this.filters.length;
		for(let i:number = 0;i<len;i++){
			this.filters[i] = this.filters[i].trim();
		}
	}
	public replace(str:string):string{ //暴力检测 估计会卡 后期要优化
		//var st:number = egret.getTimer();
		var len:number = this.filters.length;
		var len1:number = str.length;
		var oldStr:string = str;	
		for(var i:number=0;i<len;i++){
			let char:string = this.filters[i];
			while(str.indexOf(char)>-1){
				str = str.replace(char,this.getReplaceChar(char.length));	
			}									
		}		
		//var et:number = egret.getTimer()-st;		
		return str;		
	}
	/**判断是否有敏感词 */
	public isHasSensitive(str:string):boolean{
		let flag:boolean = false;
		var len:number = this.filters.length;
		for(let i:number = 0;i<len;i++){
			if(str.indexOf(this.filters[i])>-1){
				return true;
			}
		}
		return flag;
	}
	/**根据字符个数获取替换敏感的字符 */
	public getReplaceChar(len:number):string{		
		if(!this.replaceCharDict[len]){
			let char:string = "";
			for(let i:number = 0;i<len;i++){
				char+=ChatFilterConfig.repaceChar;
			}
			this.replaceCharDict[len] = char;
		}
		return this.replaceCharDict[len];
	}


}