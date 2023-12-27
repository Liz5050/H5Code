
class SortComponent extends Component {
    public constructor() {
        super();
    }

    public start(): void {
        super.start();

        this.dealInterval = 100;
    }

    public stop(): void {
        super.stop();
    }

    public update(advancedTime: number): void {
        super.update(advancedTime);

        this.sortGameObjs();
    }

    private sortGameObjs(): void {
        // Log.trace(Log.GAME, "sort--------------------------------------");
        // this.entity.gameView.getGameObjcetLayer().$children.sort(this.sortF);

        let item1:egret.DisplayObject;
        let item2:egret.DisplayObject;
        let objectLayer:egret.DisplayObjectContainer = this.entity.gameView.getGameObjcetLayer();
        let children:Array<egret.DisplayObject> = objectLayer.$children;
        let index:number = 0;
        while (index < children.length - 1)
        {
            item1 = children[index];
            item2 = children[index + 1];
            if (Math.floor(item1.y * 100000) + item1.x > Math.floor(item2.y * 100000) + item2.x)
            {
                children[index] = children[(index + 1)];
                children[(index + 1)] = item1;
            }
            index++;
        }
        let len:number = children.length;
        let childItem:egret.DisplayObject;
        while (len--)
        {
            childItem = children[len];
            if (objectLayer.getChildIndex(childItem) != len
                && len < objectLayer.numChildren)
            {
                objectLayer.setChildIndex(childItem, len);
            }
        }

        //以下是透明遮罩检测
        let entities:{ [entityId: string]: RpgGameObject } = CacheManager.map.entitys;
        let entity: RpgGameObject = CacheManager.king.kingEntity;
        entity && entity.checkOnMask();
        for(let entityId in entities) {
            entity = entities[entityId];
            if (entity.objType == RpgObjectType.MainPlayer
                || entity.objType == RpgObjectType.OtherPlayer
                || entity.objType == RpgObjectType.Pet
                || entity.objType == RpgObjectType.Monster) {
                entity.checkOnMask();
            }
        }
    }

}