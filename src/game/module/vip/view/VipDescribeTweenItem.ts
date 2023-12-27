class VipDescribeTweenItem extends fairygui.GComponent{
	private txtInfo: fairygui.GRichTextField;
    private txtInfo2:fairygui.GRichTextField;
    private levelDatas:Array<VipLevelData>;

    private curLv:number;
    private curIndex:number = -1;
    private isTween:boolean;

    private callBack:Function;
    private callObj:any;
    private showLevelData:VipLevelData;
    public constructor()
    {
        super();
    }

    protected constructFromXML(xml: any): void
    {
        super.constructFromXML(xml);
        this.txtInfo = this.getChild("txt_infor").asRichTextField;
        this.txtInfo2 = this.getChild("txt_infor2").asRichTextField;
    }

    public setCallBack(callBack:Function,callObj:any):void {
        this.callBack = callBack;
        this.callObj = callObj;
    }

    public updateAll(data:Array<VipLevelData>,vipLv:number):void {
        this.levelDatas = data;
        this.curLv = vipLv;
        let index:number = vipLv > 0 ? vipLv - 1 : 0;
        this.setIndex(index);
    }

    public leftClick():void {
        let index:number = this.curIndex - 1;
		if(index < 0) index = 0;
        this.setIndex(index);
    }
    
    public rightClick():void {
        let index:number = this.curIndex + 1;
		if(index >= this.levelDatas.length) index = this.levelDatas.length - 1;
        this.setIndex(index);
    }

    private setIndex(index:number):void {
        if(this.curIndex == index) return;
        // if(this.isTween) return;
        // let showIndex:number;
        let posX:number;
		let otherIndex:number = index + 1;
        if(this.curIndex != -1) {
            if(this.curIndex < index) {
                //点击右边按钮，向左滑动
                this.txtInfo.x = 492;
                this.txtInfo2.x = 0;
                posX = -390;
				otherIndex = index - 1;
            }
            else {
                //向右滑动
                this.txtInfo.x = -390;
                this.txtInfo2.x = 0;
                posX = 492;
				otherIndex = index + 1;
            }
			// this.isTween = true;
            // egret.Tween.get(this.txtInfo).to({x:0},500);
            // egret.Tween.get(this.txtInfo2).to({x:posX},500).call(function (){
            //     this.callBack.call(this.callObj);
            //     this.isTween = false;
            // },this);
            this.txtInfo.x = 0;
            this.txtInfo2.x = posX;
        }
        
        if(otherIndex < 0) otherIndex = 0;
        if(otherIndex >= this.levelDatas.length) otherIndex = this.levelDatas.length - 1;
        this.curIndex = index;

        this.showLevelData = this.levelDatas[this.curIndex];
        this.txtInfo.text = this.levelDatas[this.curIndex].desc;
        this.txtInfo2.text = this.levelDatas[otherIndex].desc;
    }

    public get showData():any {
        return this.showLevelData;
    }

    public hide():void {
        this.txtInfo.x = 0;
        this.txtInfo2.x = 492;
        // egret.Tween.removeTweens(this.txtInfo);
        // egret.Tween.removeTweens(this.txtInfo2);
        this.isTween = false;
        this.curIndex = -1;
    }
}