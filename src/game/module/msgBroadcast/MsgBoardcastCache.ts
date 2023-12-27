class MsgBoardcastCache implements ICache{
	private rollTip:Array<any>;

	public constructor() {
		this.rollTip = [];
	}

	public addRollTip(tip:string, color:number=Color.White):void{
		this.rollTip.push({"text": tip, "color": color});
	}

	public getRollTip():Array<any>{
		return this.rollTip;
	}

	/**是否剧情广播图片格式 */
	public isStoryImg(data:any):boolean{
		let flag:boolean = false;
		let msg:string = "";
		if(typeof(data)=="string"){
			msg = data;
		}else if(data){
			msg = data.content_S;
		}
		if(msg){
			flag = msg.indexOf("task_")>-1 || msg.indexOf("copy_")>-1 || msg.indexOf("cp_")>-1 || msg.indexOf("skill_")>-1;
		}
		return flag;
	}
	
	public getStoryUrl(imgName:string):string{
		let url:string = URLManager.getModuleImgUrl(`notice/${imgName}.png`,PackNameEnum.MsgBroadcast);
		return url;
	}

	public clear():void{

	}
}