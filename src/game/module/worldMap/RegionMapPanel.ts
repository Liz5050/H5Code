/**
 * 区域地图面板
 * 632、555界面宽高
 */
class RegionMapPanel extends BaseTabPanel {
    private typeController: fairygui.Controller;
    private mapContainer: fairygui.GComponent;
    private mapLoader: GLoader;
    private roleImg: fairygui.GImage;
    private footImg: fairygui.GImage;
    private bossList: List;
    private npcList: List;
    private flyBtn: fairygui.GButton;
    private proposePanel: MapProposePanel;

    private mapInfo: MapInfo;
    private smallMapScaleRatio: number;//小地图缩放比例
    private mapWidth: number;
    private mapHeight: number;
    private uiWidth: number = 588;//地图容器宽度
    private uiHeight: number = 448;//地图容器高度
    private isTimerStarted: boolean = false;
    private entitys: Array<MapEntity> = [];
    private mapId: number;
    private lastMapId: number;//上一次地图id
    private lastClickBoss: any;
    private clickBossTimes: number = 0;
    private isMainCity: boolean = false;

    public initOptUI(): void {
        this.typeController = this.view.getController("c1");
        this.mapContainer = this.getGObject("container_map").asCom;
        this.mapLoader = this.mapContainer.getChild("loader_map") as GLoader;
        this.roleImg = this.mapContainer.getChild("role").asImage;
        this.footImg = this.mapContainer.getChild("foot").asImage;
        this.footImg.setPivot(0.5, 0.5, true);
        // this.npcList = new List(this.getGObject("list_npc").asList);
        // this.bossList = new List(this.getGObject("list_boss").asList);
        // this.flyBtn = this.getGObject("btn_fly").asButton;
        // this.flyBtn.addClickListener(this.clickFly, this);
        this.mapLoader.addClickListener(this.clickMap, this);
        // this.npcList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickNpc, this);
        // this.bossList.list.addEventListener(fairygui.ItemEvent.CLICK, this.onClickBoss, this);
        // this.showFlyButton(false);
        // this.proposePanel = <MapProposePanel>this.getGObject("panel_propose");
    }

    public updateAll(data?: any): void {
        this.clearEntity(MapEntityType.PATH);
        if (data == null) {
            this.mapId = CacheManager.map.mapId;
            this.roleImg.visible = true;
        } else {
            this.roleImg.visible = data == CacheManager.map.mapId
            this.mapId = data;
        }
        this.startTimer();
        //已经在寻路中，直接画
        let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
        if (kingEntity != null) {
            let pathNodes: PathNode[] = kingEntity.path;
            if (pathNodes) {
                this.drawPath(pathNodes);
            }
        }

        if (this.mapId == this.lastMapId) {
            return;
        }
        this.clearEntity();
        this.mapInfo = ConfigManager.map.getMapInfo(this.mapId);
        if (this.mapInfo != null) {
            this.mapLoader.load(this.mapInfo.getSmallMapRes());
            this.smallMapScaleRatio = this.mapInfo.getByKey("smallMapScaleRatio");
            this.mapWidth = Math.floor(this.mapInfo.getByKey("totalWidth") * this.smallMapScaleRatio);
            this.mapHeight = Math.floor(this.mapInfo.getByKey("totalHeight") * this.smallMapScaleRatio);
            this.isMainCity = MapUtil.isMainCity(this.mapId);
            if (this.isMainCity) {
                // this.npcList.data = this.mapInfo.getNpcs();
                this.typeController.selectedIndex = 1;
            } else {
                // this.initBossPoint();
                this.typeController.selectedIndex = 0;
            }
            this.initNpc();
            // this.initPassPoint();
        } else {
            this.mapLoader.clear();
        }
        // this.npcList.selectedIndex = -1;
        // this.bossList.selectedIndex = -1;
        // this.proposePanel.visible = false;
        // this.showFlyButton(false);
        // this.startTimer();
        // if (!this.isMainCity) {
        // 	this.checkBestPropose();
        // }
        this.lastMapId = this.mapId;
    }

    public drawPath(pathNodes: PathNode[]): void {
        this.clearEntity(MapEntityType.PATH);
        if (pathNodes != null) {
            let i: number = 0;
            for (let node of pathNodes) {
                i++;
                if (i % 2 == 0) {
                    continue;
                }
                let pathEntity: MapEntity = new MapEntity(MapEntityType.PATH);
                //格子坐标转像素坐标
                let bigPoint: egret.Point = RpgGameUtils.convertCellToXY(node.x, node.y);
                let smallPoint: egret.Point = this.convertToSmallPoint(bigPoint.x, bigPoint.y);
                pathEntity.setXY(smallPoint.x, smallPoint.y);
                this.mapContainer.addChild(pathEntity);
                this.entitys.push(pathEntity);
            }
        }
    }

    public clearClickBossTimes(): void {
        this.clickBossTimes = 0;
    }

    protected onTabChanged(e: any): void {
        super.onTabChanged(e);
        if (this.index == this.controller.selectedIndex) {
            this.startTimer();
        } else {
            this.stopTimer();
        }
    }

    private startTimer(): void {
        if (!this.isTimerStarted) {
            App.TimerManager.doFrame(3, 0, this.update, this);
            this.isTimerStarted = true;
        }
    }

    public stopTimer(): void {
        App.TimerManager.remove(this.update, this);
        this.isTimerStarted = false;
    }

    /**
     * 帧更新
     */
    private update(): void {
        this.updateRolePos();
    }

    /**
     * 更新人物坐标
     */
    private updateRolePos(): void {
        let kingEntity: MainPlayer = CacheManager.king.leaderEntity;
        if (kingEntity) {
            let point: egret.Point = this.convertToSmallPoint(kingEntity.x, kingEntity.y);
            this.roleImg.setXY(point.x - 12, point.y - 31);//图标默认中心点在左上角
            if (!kingEntity.isMoving()) {
                this.footImg.visible = false;
            }
        }
    }

    /**
     * 初始化npc
     */
    private initNpc(): void {
        for (let npc of this.mapInfo.getNpcs()) {
            let npcEntity: MapEntity = new MapEntity(MapEntityType.NPC, npc.name);
            //格子坐标转像素坐标
            let bigPoint: egret.Point = RpgGameUtils.convertCellToXY(npc.point.x, npc.point.y);
            let smallPoint: egret.Point = this.convertToSmallPoint(bigPoint.x, bigPoint.y);
            npcEntity.setXY(smallPoint.x, smallPoint.y);
            this.mapContainer.addChild(npcEntity);

            this.entitys.push(npcEntity);
        }
    }

    /**
     * 初始化刷怪点
     */
    private initBossPoint(): void {
        let proposes: Array<any> = ConfigManager.mgHookPropose.getProposes(this.mapId);
        proposes.sort((a: any, b: any) => {
            return a.order - b.order
        });
        let bossName: string;
        for (let p of proposes) {
            let boss: any = ConfigManager.boss.getByPk(p.bossCode);
            if (boss != null) {
                let color: string = "#df22e7";
                if (p.color != null) {
                    color = p.color;
                }
                bossName = `<font color='${color}'>[${boss.name}]</font>`;
            }
            let bossEntity: MapEntity = new MapEntity(MapEntityType.BOSS, bossName);
            //格子坐标转像素坐标
            let bigPoint: egret.Point = RpgGameUtils.convertCellToXY(p.mapX, p.mapY);
            let smallPoint: egret.Point = this.convertToSmallPoint(bigPoint.x, bigPoint.y);
            bossEntity.setXY(smallPoint.x, smallPoint.y);
            this.mapContainer.addChild(bossEntity);
            this.entitys.push(bossEntity);
        }
        this.bossList.data = proposes;
    }

    /**
     * 检测是否为最佳挂机点
     */
    private checkBestPropose(): void {
        let bestPropose: any = ConfigManager.mgHookPropose.getBestPropose();
        if (bestPropose != null) {
            let propose: any;
            let bossListItem: MapBossListItem;
            for (let i in this.bossList.data) {
                propose = this.bossList.data[i];
                bossListItem = <MapBossListItem>this.bossList.list._children[i];
                if (bestPropose.mapId == propose.mapId && propose.order == bestPropose.order) {
                    this.bossList.scrollToView(Number(i));
                    this.bossList.selectedIndex = Number(i);
                    this.onClickBoss(null);
                    bossListItem.isRecommend = true;
                } else {
                    bossListItem.isRecommend = false;
                }
            }
        }
    }

    /**
     * 初始化传送点
     */
    private initPassPoint(): void {
        for (let pp of this.mapInfo.getPassPoints()) {
            let ppEntity: MapEntity = new MapEntity(MapEntityType.PASSPOINT);
            //格子坐标转像素坐标
            let bigPoint: egret.Point = RpgGameUtils.convertCellToXY(pp.point.x, pp.point.y);
            let smallPoint: egret.Point = this.convertToSmallPoint(bigPoint.x, bigPoint.y);
            ppEntity.setXY(smallPoint.x, smallPoint.y);
            this.mapContainer.addChild(ppEntity);

            this.entitys.push(ppEntity);
        }
    }

    // private loadMap(url: string): void {
    // 	if (url != null && url != "") {
    // 		let self: any = this;
    // 		RES.getResByUrl(url, function (texture: egret.Texture): void {
    // 			if (url.indexOf(self.mapId + "") != -1) {//防止加载多次导致地图显示不对的问题
    // 				this.mapLoader.texture = texture;
    // 			}
    // 		}, this, RES.ResourceItem.TYPE_IMAGE);
    // 	} else {
    // 		this.mapLoader.texture = null;
    // 	}
    // }

    /**
     * 大图坐标转小地图坐标
     */
    private convertToSmallPoint(x: number, y: number): egret.Point {
        let smallX: number = Math.floor(x * this.smallMapScaleRatio);
        let smallY: number = Math.floor(y * this.smallMapScaleRatio);
        let rx: number = smallX + Math.floor((this.uiWidth - this.mapWidth) / 2);//地图是居中显示的，圆点在loader左上角
        let ry: number = smallY + Math.floor((this.uiHeight - this.mapHeight) / 2);
        return new egret.Point(rx, ry);
    }

    private clearEntity(type: MapEntityType = -1): void {
        for (let entity of this.entitys) {
            if (type == -1 || entity.type == type) {
                entity.removeFromParent();
            }
        }
    }

    /**
     * 点击地图
     */
    private clickMap(e: egret.TouchEvent): void {
        let stageX: number = e.stageX;
        let stageY: number = e.stageY;
        let localPoint = this.mapLoader.globalToLocal(stageX, stageY);
        let gotoX: number = localPoint.x / this.smallMapScaleRatio;
        let gotoY: number = localPoint.y / this.smallMapScaleRatio;
        let targetPoint = RpgGameUtils.convertXYToCell(gotoX, gotoY);

        let kingEntityNew: MainPlayer = CacheManager.king.leaderEntity;
        if (kingEntityNew != null) {
            CacheManager.king.stopKingEntity();
            targetPoint = PathUtils.getNearestUnreachablePoint(kingEntityNew.col, kingEntityNew.row, targetPoint.x, targetPoint.y);

            let pathNodes: PathNode[] = kingEntityNew.getPathNodesInSameMap(targetPoint.x, targetPoint.y);
            if (pathNodes) {
                this.drawPath(pathNodes);
                this.footImg.visible = true;
                let node: PathNode = pathNodes[pathNodes.length - 1];
                let bigPoint: egret.Point = RpgGameUtils.convertCellToXY(node.x, node.y);
                let smallPoint: egret.Point = this.convertToSmallPoint(bigPoint.x, bigPoint.y);
                this.footImg.setXY(smallPoint.x, smallPoint.y);
            }
            let mainControlComponent: MainControlComponent = kingEntityNew.getComponent(ComponentType.MainControl) as MainControlComponent;
            mainControlComponent.clickGround(gotoX, gotoY);
        }
    }

    private clickFly(): void {
        let callBack: CallBack;
        let point: egret.Point;
        if (this.typeController.selectedIndex == 0) {//野外
            let propose: any = this.bossList.selectedData;
            if (propose != null) {
                point = new egret.Point(propose.mapX, propose.mapY);
            }
            callBack = new CallBack(() => {
                EventManager.dispatch(EventManager.dispatch(LocalEventEnum.AutoStartFight));
            }, this);
        } else {
            let npc: any = this.npcList.selectedData;
            if (npc != null) {
                point = npc.point;
            }
            callBack = null;
        }
        if (point) {
            EventManager.dispatch(LocalEventEnum.SceneConvey, {
                "mapId": this.mapId,
                "conveyType": EConveyType.EConveyTypeTask,
                "point": point,
                "callBack": callBack
            });
        }
    }

    private onClickNpc(e: fairygui.ItemEvent): void {
        this.showFlyButton(true);
        //寻路到npc
        let npc: any = this.npcList.selectedData;
        if (npc != null) {
            EventManager.dispatch(LocalEventEnum.SceneRouteToNpc, {"npcId": npc.npcId});
        }
    }

    private onClickBoss(e: fairygui.ItemEvent): void {
        this.showFlyButton(true);
        //寻路到boss点
        let propose: any = this.bossList.selectedData;
        if (propose != this.lastClickBoss) {
            this.clickBossTimes = 1;
        } else {
            this.clickBossTimes++;
        }
        this.proposePanel.update(propose);
        this.proposePanel.visible = true;
        if (this.clickBossTimes == 2) {
            EventManager.dispatch(LocalEventEnum.WorldMapGotoPropose, propose);
            this.clickBossTimes = 0;
        }
        this.lastClickBoss = propose;
    }

    private showFlyButton(isShow: boolean): void {
        // this.flyBtn.visible = isShow;
    }
}