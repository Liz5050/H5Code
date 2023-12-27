/**
 * 私聊联系人item
 * @author zhh
 * @time 2018-09-18 11:24:19
 */
class FriendContactItem extends ListRenderer {
    private loaderIcon:GLoader;
    private imageIcon:fairygui.GImage;
    private txtName:fairygui.GTextField;

	public constructor() {
		super();
		
	}
	protected constructFromXML(xml:any):void{			
		super.constructFromXML(xml);
        //---- script make start ----
        this.loaderIcon = <GLoader>this.getChild("loader_icon");
        this.imageIcon = this.getChild("image_icon").asImage;
        this.txtName = this.getChild("txt_name").asTextField;

        //---- script make end ----


	}
	public setData(data:any,index:number):void{		
		this._data = data;
		this.itemIndex = index;
		let miniPlayer:any = data.player;// 可以不是完整的miniplayer结构体;但是必须有 name_S,career_SH,online_BY entityId 字段
		this.txtName.text =  miniPlayer.name_S;
		this.loaderIcon.load(URLManager.getPlayerHead(miniPlayer.career_SH));
		this.loaderIcon.grayed = !miniPlayer.online_BY;
		this.checkTips();
	}

	public checkTips(force:number=-1):void{
		let isTips:boolean;
		if(force==-1){
			let pId:number = this._data.player.entityId.id_I;
			isTips = CacheManager.friend.isPlayerHasOfflineMsg(pId) || CacheManager.friend.isPlayerOnlineMsg(pId);
		}else{
			isTips = force!=0;
		}		
		CommonUtils.setBtnTips(this,isTips,93,56);
	}
	


}