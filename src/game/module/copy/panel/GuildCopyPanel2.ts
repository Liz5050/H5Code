/** 7001副本（首领试炼） 7003副本（心魔之乱） */
class GuildCopyPanel2 extends BaseCopyPanel {
	public constructor(copyInf:any) {
		super(copyInf,"GuildCopyPanel2");
	}

	public updateProcess(): void {		
		var str:string = "";
		if(CacheManager.copy.copyRingInf){
			var leftRing:number = CacheManager.copy.copyRingInf.maxRing - CacheManager.copy.copyRingInf.curRing;
			str = HtmlUtil.html(leftRing+"/"+CacheManager.copy.copyRingInf.maxRing,Color.Green);			
		}else{
			str = "0/1";
		}
		this.txt_target.text = `当前波数:${str}`;
		
	}

}