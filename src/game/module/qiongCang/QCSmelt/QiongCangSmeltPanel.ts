/**
 * 圣物合成
 * @author zhh
 * @time 2018-10-29 20:05:32
 */
class QiongCangSmeltPanel extends BaseTabView{

    private baseItem3:QCSmeltItem;
    private loaderBg:GLoader;
    private btnSmelt:fairygui.GButton;
    private btnFuse:fairygui.GButton;
    private listItem:List;
    private c1:fairygui.Controller;
    private smeltItems:QCSmeltItem[];
    /**当前选中要合成的数据 */
    private selectItemDict:{[index:number]:ItemData};
    /**已选择的颜色 */
    private selectColors:number[];
    private selectNum:number = 0;

    private countDict:any;
    /**当前列表显示的数据 */
    private listDatas:ItemData[];
    private prodItem:ItemData;
    private imgSel:fairygui.GImage;
    private imgFull:fairygui.GImage;
    private t0:fairygui.Transition;
    private effCnt:fairygui.GComponent;
    private mc:UIMovieClip;
    private btnLeft:fairygui.GButton;
    private btnRight:fairygui.GButton;
    private pageCount:number = 5;
    

	public constructor() {
		super();
        this.selectItemDict = [];
        this.selectColors = [];
        this.countDict = {};
	}

	protected initOptUI():void{
        //---- script make start ----
        this.t0 = this.getTransition('t0');
        this.c1 = this.getController("c1");
        this.smeltItems = [];
        for(let i:number = 0;i<3;i++){
            let item:QCSmeltItem = <QCSmeltItem>this.getGObject("baseItem"+i);
            item.addClickListener(this.onClickItem,this);
            this.smeltItems.push(item);
        }
        this.baseItem3 = <QCSmeltItem>this.getGObject("baseItem3");
        this.baseItem3.isProd = true;
        this.imgSel = this.getGObject("img_sel").asImage;
        this.imgFull = this.getGObject("img_full").asImage;
        this.loaderBg = <GLoader>this.getGObject("loader_bg");
        this.btnSmelt = this.getGObject("btn_smelt").asButton;
        this.btnFuse = this.getGObject("btn_fuse").asButton;
        this.listItem = new List(this.getGObject("list_item").asList);
        this.effCnt = this.getGObject("eff_cnt").asCom;
        this.btnRight = this.getGObject("btn_right").asButton;
        this.btnLeft = this.getGObject("btn_left").asButton;

        this.btnSmelt.addClickListener(this.onGUIBtnClick, this);
        this.btnFuse.addClickListener(this.onGUIBtnClick, this);
        this.btnRight.addClickListener(this.onGUIBtnClick, this);
        this.btnLeft.addClickListener(this.onGUIBtnClick, this);
        this.baseItem3.addClickListener(this.onGUIBtnClick, this);

        this.listItem.list.addEventListener(fairygui.ItemEvent.CLICK,this.onGUIListSelect,this);
        this.listItem.list.scrollPane.addEventListener(fairygui.ScrollPane.SCROLL,this.onScroll,this);
        //---- script make end ----
        this.loaderBg.load(URLManager.getModuleImgUrl("qc_smelt.jpg",PackNameEnum.QiongCang));

	}

	public updateAll(data?:any):void{
        let isProp:boolean = data && data.isProp;        
        this.genListData();
        this.updateChoiceList(true);
        this.c1.setSelectedIndex(this.listDatas.length==0?1:0);
        if(isProp){ //只是道具更新 只需要更新选择列表
            return;
        }        
        if(data && data.genItemcode){ //在线合成成功的更新
            this.selectNum = 0;
            if(!this.prodItem){
                this.prodItem = new ItemData(data.genItemcode);
            }else{
                this.prodItem.data = {itemCode_I:data.genItemcode};
            }
            this.playEff();
        }else{
             this.baseItem3.setData(null,0);
        }
        this.imgSel.visible = false;        
        ObjectUtil.emptyObj(this.selectItemDict);
        App.ArrayUtils.emptyArr(this.selectColors);
        this.updateSmeltItem();
        this.setBtnVisible();
	}

    private playEff():void{
        this.clearEff();
        this.mc = UIMovieManager.get(PackNameEnum.MCBomb,0,0,1,1);
        this.effCnt.addChild(this.mc);
        this.mc.playing = true;
        this.mc.setPlaySettings(0,-1,1,-1,()=>{
            this.baseItem3.setData(this.prodItem,0);
            this.clearEff();
        },this);
    }
    private clearEff():void{
        if(this.mc){
            UIMovieManager.push(this.mc);
            this.mc = null;
        }
    }
    private genListData():void{
        let packItems:ItemData[] = CacheManager.talentCultivate.getTalentSmeltItems();        
        if(!this.listDatas){
            this.listDatas = [];
        }
        if(this.listDatas.length>0){ //删除多余的
            App.ArrayUtils.emptyArr(this.listDatas);
        }
        for(let i:number = 0;i<packItems.length;i++){
            let hadNum:number = packItems[i].getItemAmount();          
            let code:number = packItems[i].getCode();
            let item:ItemData = new ItemData(code);           
            item.itemAmount =  hadNum;
            this.listDatas.push(item);
            this.countDict[code] = hadNum;
        }
         
    }

    private updateChoiceList(isFilter:boolean):void{
        CacheManager.talentCultivate.sortTalantSmeltItems(this.listDatas);
        if(isFilter){ //需要筛选检查同品质不足三个的
            this.fliterList();
        }
        if(this.selectColors.length>0){ //有选择
            for(let i:number = 0;i<this.listDatas.length;i++){
                let clr:number = this.listDatas[i].getColor();
                let code:number = this.listDatas[i].getCode();
                let n:number = this.getNum(code);
                let cn:number = this.getChoiceNum(code);
                if(this.selectColors.indexOf(clr)==-1 || cn>=n){
                    this.listDatas.splice(i,1);
                    i--;
                    continue;
                }                
                this.listDatas[i].itemAmount = n - cn; //实际要显示的数量
            }
        }
        this.listItem.setVirtual(this.listDatas);
        this.setBtnVisible();
    }

    private fliterList():void{
        let c:number = 0;
        let len:number = 0;
        let lastClr:number = -1;
        for(let i:number = 0;i<this.listDatas.length;i++){
            let clr:number = this.listDatas[i].getColor();
            if(lastClr>-1 && clr!=lastClr){                
                if(c<this.smeltItems.length){
                    //删除同品质不足3个的
                    this.listDatas.splice(i-len,len);
                    i-=len;
                }
                c = 0;
                len = 0;
            }
            lastClr = clr;
            c+=this.listDatas[i].getItemAmount();
            len++;
        }
        if(c<this.smeltItems.length){
            this.listDatas.splice(this.listDatas.length-len,len);
        }
    }
    
    private getNum(code:number):number{
        return this.countDict[code];
    }

    private getChoiceNum(code:number):number{
        let c:number = 0;
        for(let key in this.selectItemDict){
            let item:ItemData = this.selectItemDict[key];
            if(item && item.getCode()==code){
                c++;
            }
        }
        return c;
    }

    private delSmeltItem(item:ItemData,index:number):void{
        delete this.selectItemDict[index];
        let clr:number = item.getColor();
        let idx:number = this.selectColors.indexOf(clr);
        if(idx>-1){
            this.selectColors.splice(idx,1);
        }        
        this.selectNum--;
        this.baseItem3.setNameText("");
        this.updateSmeltItem();
        let isFilter:boolean = false;
        if(this.selectNum==0){
            this.genListData();
            isFilter = true;
        }else{            
            let b:boolean = false;
            for(let i:number = 0;i<this.listDatas.length;i++){
                if(this.listDatas[i].getCode()==item.getCode()){ //增加数量
                    let c:number = this.listDatas[i].getItemAmount();
                    this.listDatas[i].itemAmount = c+1;               
                    b = true;
                    break;
                }
            }
            if(!b){
                this.listDatas.push(item);
            }            
        }
        this.updateChoiceList(isFilter);
    }

    private addSmeltItem(item:ItemData):void{
        if(this.baseItem3.getData()){
            this.baseItem3.setData(null,0);
        }        
        if(this.selectNum>=this.smeltItems.length){
            Tip.showLeftTip("物品格已满");
            return;
        }
        let isClr:boolean = this.selectNum==0; //只保留同品质的在列表显示,还有删除当前选中的
        for(let i:number = 0;i<this.listDatas.length;i++){
            if((isClr && this.listDatas[i].getColor()!=item.getColor())){ //不同品质的
                this.listDatas.splice(i,1);
                i--;      
                continue;         
            }          
        }        

        for(let i:number=0;i<this.smeltItems.length;i++){ //按照顺序放上空的位置
            if(!this.selectItemDict[i]){
                this.selectItemDict[i] = item;
                break;
            }
        }
        
        this.selectNum++;
        this.selectColors.push(item.getColor());
        this.updateSmeltItem();
        this.updateChoiceList(false);
        if(this.selectNum>=this.smeltItems.length){
            this.baseItem3.setNameText("随机圣物");
        }else{
            this.baseItem3.setNameText("");
        }
    }
    
    private updateSmeltItem():void{
        for(let i:number=0;i<this.smeltItems.length;i++){
            let item:ItemData = this.selectItemDict[i]?this.selectItemDict[i]:null;
            this.smeltItems[i].setData(item,i);
        }
        let isOk:boolean = this.selectNum==this.smeltItems.length;        
        App.DisplayUtils.grayButton(this.btnSmelt,!isOk,!isOk);
        this.imgFull.visible = isOk;
    }

    private onScroll(e:any):void{
        this.setBtnVisible();
    }

    private setBtnVisible():void{        
        let maxPos:number = this.listItem.list.scrollPane.contentWidth - this.listItem.list.scrollPane.viewWidth;
        let curPos:number = this.listItem.list.scrollPane.posX;
        this.btnLeft.visible = curPos>0;
        this.btnRight.visible = this.listItem.data.length>this.pageCount && curPos!=maxPos;
    }

    private changPage(isRight:boolean):void{
        let tarIdx:number = this.listItem.list.getFirstChildInView();       
        if(isRight){
            tarIdx = Math.min(this.listItem.data.length-1,tarIdx+this.pageCount);
        }else{
            tarIdx = Math.max(tarIdx-this.pageCount,0);
        }
        this.listItem.scrollToView(tarIdx,false,true);
    }

    private onClickItem(e:egret.TouchEvent):void{
        let item:QCSmeltItem = e.target;
        let idx:number = Number(item.name[item.name.length-1]);        
        let itemData:ItemData = item.getData();
        if(itemData){ //有数据
            //卸下数据,更新到下方列表
            this.delSmeltItem(itemData,idx);
        }else{
            //圣物选择栏会显示黄色光圈，引导玩家点击圣物选择栏
            this.imgSel.visible = true;
            this.t0.play();
        }
    }
    protected onGUIBtnClick(e:egret.TouchEvent):void{
        var btn: any = e.target;
        switch (btn) {
            case this.btnSmelt:
                let codes:number[] = [];
                for(let i in this.selectItemDict){
                    if(this.selectItemDict[i]){
                        codes.push(this.selectItemDict[i].getCode());   
                    }                                     
                }
                ProxyManager.compose.smeltTalent(codes);
                break;
            case this.btnFuse:
                break;
            case this.btnLeft:
                this.changPage(false);
                break;
            case this.btnRight:
                this.changPage(true);
                break;
            case this.baseItem3:
                this.baseItem3.setData(null,3);
                break;

        }
    }

    protected onGUIListSelect(e:fairygui.ItemEvent):void{
        var item:ListRenderer = <ListRenderer>e.itemObject;
        if(item){
            this.addSmeltItem(item.getData());
        }   
    }
 
	
    /**
	 * 销毁函数
	 */
	public destroy():void{
		super.destroy();
	}

    public hide():void{ 
        super.hide();      
        ObjectUtil.emptyObj(this.selectItemDict);
        App.ArrayUtils.emptyArr(this.selectColors); 
        ObjectUtil.emptyObj(this.countDict);
        this.selectNum = 0;
        this.updateSmeltItem();  
        this.clearEff();
    }

}