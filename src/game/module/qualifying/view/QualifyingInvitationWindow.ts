class QualifyingInvitationWindow extends BaseWindow {
    private inviteList: List;

    public constructor() {
        super(PackNameEnum.Qualifying, "QualifyingInvitationWindow");
    }

    public initOptUI(): void {
        this.inviteList = new List(this.getGObject("list_Invite").asList);
    }

    public updateAll(data:any = null): void {
        if (!data) {
            let friendList: any[] = CacheManager.friend.friendList;
            let idSeq: any[] = [];
            for (let f of friendList) {
                idSeq.push(f.entityId);
            }
            EventManager.dispatch(LocalEventEnum.QualifyingReqFriendList, idSeq);
        } else {
            let onlineFriends:any[] = [];
            let infoList:any[] = data && data.infos ? data.infos.data : [];
            for (let fi of infoList) {
                if (CacheManager.friend.isFriendOnline(fi.entityId)) onlineFriends.push(fi);
            }
            this.inviteList.data = onlineFriends;
        }
    }

}