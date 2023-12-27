class SkillTalkComponent extends Component {
    private modelHeight: number;
    private talkItem: SkillTalkItem;

    public constructor() {
        super();
    }

    public start():void {
        super.start();

    }

    public stop():void {
        super.stop();
        this.disappear();
        App.TimerManager.removeAll(this);
    }

    public talk(content:string):void {
        let _avatarCom:AvatarComponent = this.entity.getComponent(ComponentType.Avatar) as AvatarComponent;
        if(!_avatarCom) return;
        let _head:HeadComponent = this.entity.getComponent(ComponentType.Head) as HeadComponent;
        if(_head) this.modelHeight = _head.modelHeight;
        if(!this.modelHeight) this.modelHeight = 155;

        if(!this.talkItem) {
            this.talkItem = fairygui.UIPackage.createObject(PackNameEnum.Scene, "SkillTalkItem") as SkillTalkItem;
            if(!this.talkItem){ //还没加载完
                return;
            }
            this.talkItem.x = -152;
            this.talkItem.y = -this.modelHeight - 92;
        }

        this.talkItem.content = content;
        _avatarCom.bodyTalkLayer.addChild(this.talkItem.displayObject);
        App.TimerManager.doTimer(1000, 1, this.disappear, this);
    }

    private disappear() {
        if (this.talkItem && this.talkItem.displayObject.parent) {
            this.talkItem.displayObject.parent.removeChild(this.talkItem.displayObject);
        }
    }
}