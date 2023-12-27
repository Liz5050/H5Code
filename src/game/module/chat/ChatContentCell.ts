/**聊天内容的真正包装器*/
class ChatContentCell extends fairygui.GComponent {
	/**默认的人物名字颜色 */
	public static NAME_CLR:string = "#3894fc";

	private static FACE_W: number = 44;
	private static FACE_H: number = 44;
	private static TEXT_H: number = 30;
	/**这个值不是固定 */
	//public static LINE_MAX_W: number = 600;

	/**固定的 聊天对话框的宽 */
	public static CHATITEM_W: number = 550;
	/**固定的 主界面显示的聊天内容宽 */
	public static CHANELITEM_W: number = 445;
	/**行距 */
	public static LINE_GAP:number = 3;
	/**聊天窗口 系统频道标签和内容的间距 */
	public static LABEL_GAP:number = 0;

	/**为了准确计算文本占的宽度 */
	public static MEASURE_TXT: fairygui.GRichTextField = new fairygui.GRichTextField();
	protected _contentW: number = 0;
	protected _contentH: number = 0;
	protected _curLineW: number = 0;
	protected _curLineH: number = 0;
	protected _lineNum: number = 1;
	/**最大宽度 */
	protected _maxWid:number = 0;
	protected _faceArr: Array<any>;
	protected _RTxtArr: Array<fairygui.GRichTextField>;
	protected _curItemIndex:number = 0;
	protected _msgData:SChatMsg;
	protected _curLineEleDict:any;
	protected _lineHInfDict:any;
	private _labelType:number = 0;
	private _faceScale:number = 1;
	private _vipScale:number = 1;
	private _isOnlyLine:boolean = false;
	private _faceScaleFixW:number = 0;
	private _labelTxt:fairygui.GTextField;
	//private _vipImg:fairygui.GImage;
	private _vipText:fairygui.GTextField;
	

	private _labelImg:fairygui.GImage;
	private _labelWid:number = 0;
	private _headFixW:number = 0;
	/**字体大小 */
	protected _fontSize:number = 22;
	/**自定义的文本颜色 */
	protected _fontColor:number = -1;

	/**名字颜色 */
	private _nameColor:any = ChatContentCell.NAME_CLR;

	private _isLink:boolean = false;
	/**是否有VIP标识 */
	private _isVipFlag:boolean = true;
	/**是否显示角色名 */
	private _isNameFlag:boolean = true;

	private _isHome:boolean = false;

	/** */
	private fixY:number = 10;
	private _sysText:fairygui.GTextField;
	/**私聊的广播 */
	private _pnText:fairygui.GTextField;
	private _faceY:number = Number.MAX_VALUE;

	public constructor(maxWid:number) {
		super();
		this._faceArr = [];
		this._RTxtArr = [];
		this._curLineEleDict = {};
		this._lineHInfDict = {};
		this._maxWid = maxWid;
	}

	public update(data: any): void {
		this.resetContent();
		this._msgData = <SChatMsg>data;
		var chatArr: string[] = App.StringUtils.anlysisMsg(this._msgData.content_S,ChatUtils.FIND_FACE_REG);

		var preTxt: fairygui.GRichTextField;
		var face: ChatFaceItem;
		var curX: number = 0;
		var curY: number = 0;
		var curAddW: number = 0;
		var newLineFlag: boolean = false;
		//聊天界面的显示是 : 综合有标签 系统有标签；有标签的先显示标签，然后VIP、人物名字、聊天内容
		this._labelWid = this.addLabel();
		let vipW:number = this.addVIPImg(this._msgData,this._labelWid);
		curAddW = this._labelWid + vipW +this.addPlayerName(this._msgData,this._labelWid+vipW);
		curX = curAddW;		
		this._headFixW = curAddW; 
		this._maxWid -= curAddW;		
		
		//添加完标签了,如果是系统频道的消息全部渲染成一个文本显示 因为没有表情
		//let isSys:boolean = ChatUtils.isSysChanel(this._msgData);		
		if(this.isTextMsg()){
			//如果系统或者仙盟公告消息 高度固定 只渲染成一个文本
			let sysHtml:string = this.fmtHtml(this._msgData.content_S);
			this.addSysTextField(sysHtml,this._labelWid,this.fixY);
			return;
		}else if(this._sysText && this._sysText.parent){
			this._sysText.parent.removeChild(this._sysText);
		}

		if(this._msgData.isPrivateNotice()){
			chatArr[0] = this.fmtHtml(chatArr[0]);
			preTxt = this.addTextField(curX, curY, chatArr[0]);
			preTxt.width = this._maxWid; 
			preTxt.autoSize = fairygui.AutoSizeType.Height; //自动高度
			this._pnText = preTxt;
			this._pnText.leading = 10;
			this.addLineTxtElement(preTxt,this._lineNum);
			this.layoutAllTxt();
			return;
		}

		let isPreFace:boolean = false;
		//开始解析人物内容
		for (var i: number = 0; i < chatArr.length; i++) {
			var isFace: boolean = ChatUtils.isFaceStr(chatArr[i]);
			curAddW = 0;
			newLineFlag = false;
			let faceGap:number = 0;
			if (isFace) {
				if(isPreFace && this._faceScale!=1){
					faceGap = 5; //连续的表情有间隔
				}
				isPreFace = true;
				var id: string = chatArr[i].slice(1);
				curAddW = ChatContentCell.FACE_W*this._faceScale;
				this._curLineH = Math.max(ChatContentCell.FACE_H*this._faceScale, this._curLineH);				
				newLineFlag = this.isNewLine(curAddW);				
				if (newLineFlag) {
					if(this._isOnlyLine){
						break;
					}								
					this._curLineW = 0;
					this._maxWid += this._headFixW - this._labelWid; //第二行实际宽度
					this._lineNum++;					
					this._contentH += this._curLineH;
					curX = this.getNewLinePox() + faceGap; //this._labelWid
					face = this.addFace(id,curX,this._contentH); //y 不包括当前行高的高	
					curY = face.y;
				} else {
					this._contentH = Math.max(this._curLineH, this._contentH);
					curX += faceGap;
					face = this.addFace(id,curX,curY);				
				}
				curAddW = face.width+faceGap;
				curX = face.x + curAddW;
				this.setLineHInf(this._lineNum,face.height);

			} else {
				var msgStr: string = chatArr[i];
				var srcMsg:string = msgStr;
				var html: string = HtmlUtil.html(msgStr,Color.Blue,false,this._fontSize);
				let addInfo:any = this.getTextW(html);
				curAddW = addInfo.w;
				newLineFlag = this.isNewLine(curAddW); //判断当前文本的宽度是否需要换行
				this._curLineH = Math.max(this._curLineH,addInfo.h);
				this.setLineHInf(this._lineNum,this._curLineH);
				this._contentH = Math.max(this._curLineH, this._contentH);
				//文本需要换行
				if (newLineFlag) {
					//计算当前文本需要多少行
					html = "";
					var reg:RegExp = /\]/g;								
					
					var curCalStr: string = "";
					var curCalIdx: number = 0;
					var itemIdx:number = this._curItemIndex;
					let isBreak:boolean = false;
					for (var j: number = 0; j < msgStr.length; j++) {
						curCalStr = msgStr.slice(curCalIdx, j + 1);
						var link:string=this.cutItemLink(msgStr,j,itemIdx,curCalIdx);
						if(link){
							curCalStr = link;
							itemIdx++;							
						}
						var lw: number = this.getCurLineSpaceW();//剩余宽度
						var tw: number = this.getTextW(HtmlUtil.html(curCalStr, Color.Blue,false,this._fontSize)).w;//当前文本宽度				
						if (tw > lw) { //换行了	
							let txt:string = msgStr.slice(curCalIdx, j);						
							preTxt = this.addTextField(curX, curY,txt); //当前行剩余可以放置的文本内容	
							this.addLineTxtElement(preTxt,this._lineNum);							
							curX = this.getNewLinePox();//this._labelWid; //换行 从0开始
							this._curLineW += preTxt.textWidth;
							this._contentW = Math.max(this._contentW, this._curLineW);
							if(this._isOnlyLine){
								isBreak = true;
								break;
							}

							//重置行宽 计算剩余字符串是否一行可以放得下
							this._curLineW = 0;
							this._maxWid += this._headFixW - this._labelWid; //第二行实际宽度
							this._lineNum++;							
							this._curLineH = Math.max(this._curLineH, ChatContentCell.TEXT_H);
							this.setLineHInf(this._lineNum,this._curLineH);
							curY = Math.max(this._contentH, this._curLineH); //下一行的Y等于当前高							
							this._contentH += this._curLineH;							
							srcMsg = msgStr.slice(j, msgStr.length);							
							if (this.checkLeftLine(srcMsg)) { //剩余的下一行可以放得下了
								curX = this.getNewLinePox();//this._labelWid;
								break;
							} else {
								curCalIdx = j;
							}

						} else {
							srcMsg = curCalStr;
						}
					}
					if(isBreak){
						break;
					}

				} else {
					this._contentH = Math.max(this._curLineH, this._contentH);
					this.setLineHInf(this._lineNum,this._curLineH);
				}
				preTxt = this.addTextField(curX, curY, srcMsg);
				this.addLineTxtElement(preTxt,this._lineNum);
				curAddW = preTxt.textWidth;
				curX = preTxt.x + curAddW;
			}
			this.calSizeW(newLineFlag,curAddW);
		}
		this.layoutAllTxt();
	}

	/**计算当前行的宽或总宽 */
	private calSizeW(newLineFlag:boolean,curAddW:number):void{
		if (!newLineFlag) {
			this._curLineW += curAddW;
		} else {
			this._curLineW = Math.max(this._curLineW, curAddW);
		}
		this._contentW = Math.max(this._contentW, this._curLineW);
	}

	/**检查剩余的行宽度是否可以放得下字符串 */
	private checkLeftLine(srcMsg:string):boolean{		
		var lw:number = this.getCurLineSpaceW(); //当前行剩余宽度
		var html:string = HtmlUtil.html(srcMsg, Color.Blue,false,this._fontSize);							
		var tw:number = this.getTextW(html).w; //目前需要的宽度
		return lw>tw;
	}

	/**查找物品字符串 匹配就截取 */
	private cutItemLink(msgStr:string,j:number,itemIdx:number,curCalIdx:number):string{
		var reg:RegExp = /\]/g;
		var curCalStr:string = "";
		if(msgStr.charAt(j)=="["){ //遇到疑似物品开头
			reg.lastIndex = 0;
			var tempStr:string = msgStr.slice(j,msgStr.length);
			var tempIdx:number = tempStr.search(reg);
			var chatItem:any = CacheManager.chat.getChatItem(this._msgData,itemIdx);
			var endIdx:number = tempIdx + j + 1;
			var itemName:string = msgStr.slice(j+1,endIdx-1);
			if(tempIdx>-1 && chatItem && ItemsUtil.checkName(chatItem.itemCode_I,itemName)){ //判断是否真正的物品
				curCalStr =  msgStr.slice(curCalIdx, endIdx); //包含物品				
			}		
		}
		return curCalStr;
	}
	private isTextMsg():boolean{
		if(!this._msgData){
			return false;
		}
		let isSys:boolean = ChatUtils.isSysChanel(this._msgData);
		return isSys || this._msgData.chatType_I==EChatType.EChatTypeCrossEx || (this._msgData.chatType_I==EChatType.EChatTypeGuild && !this._msgData.fromPlayer);
	}
	/**只添加单行文本 */
	protected addTextField(curX: number, curY: number, srcMsg: string,isNeedFmt:boolean=true): fairygui.GRichTextField {
		var preTxt:fairygui.GRichTextField = ObjectPool.pop("fairygui.GRichTextField");
		this.addChild(preTxt);
		preTxt.setPivot(0,0);
		preTxt.autoSize = fairygui.AutoSizeType.Both; //自动高度
		preTxt.leading = 3;
		var html:string = isNeedFmt?this.fmtHtml(srcMsg):srcMsg;
		preTxt.text = html;
		preTxt.x = curX;
		preTxt.font = "Microsoft YaHei";
		preTxt.y = curY;		
		this._RTxtArr.push(preTxt);
		if(this._isLink && html.indexOf("href")>-1 && !preTxt.hasEventListener(egret.TextEvent.LINK)){
			preTxt.addEventListener(egret.TextEvent.LINK,this.onClickLink,this);
		}		
		return preTxt;
	}

	private getNewLinePox():number{
		return this._labelWid;
	}

	private onClickLink(e:egret.TextEvent):void{		
		CacheManager.chat.isClickLink = true;
		e.stopPropagation();
		EventManager.dispatch(UIEventEnum.ChatClickLink,e.text);
	}

	protected addFace(id: string,px:number,py:number): ChatFaceItem {
		var face:ChatFaceItem = ObjectPool.pop("ChatFaceItem");
		this.addChild(face);
		face.setSize(ChatContentCell.FACE_W*this._faceScale,ChatContentCell.FACE_H*this._faceScale);
		face.setData({id:Number(id)});		
		face.x = this.getFacePox(px);
		face.y = this.getFacePoy(py);
		face.scaleX = face.scaleY = this._faceScale;
		this._faceArr.push(face);
		return face;
	}

	private getFacePox(curX:number):number{
		let tx:number = curX - this._faceScaleFixW; 
		return tx; 
	}

	private getFacePoy(curY:number):number{
		//let ty:number = curY + this._faceScaleFixW; 
		let ty:number = this.getPosYByLine(this._lineNum) + this._faceScaleFixW; 
		return ty; 
	}
	
	protected fmtHtml(srcMsg: string):string{
		var html:string = "";
		var href:string;
		var splitStr:string = "|";
		var clr:string;
		if(this._fontColor>-1){
			clr = "#"+this._fontColor.toString(16);
		}else{
			clr = ChatUtils.getChatChanelColor(this._msgData.chatType_I,false);
		}

		if(ChatUtils.isHasColorTag(srcMsg)){		
			html = ChatUtils.fmtColorTag(srcMsg,clr,this._fontSize,this._isLink);						
		}
		// else if(ChatUtils.isMsgPosStr(srcMsg)){ // 创建坐标链接: <测试地图|601000|1|134>
		// 	srcMsg = srcMsg.slice(1,srcMsg.length-1);
		// 	var arr:string[] = srcMsg.split(splitStr);
		// 	href =  ChatEnum.CHAT_LINK_POS+splitStr+arr.slice(1,arr.length).join(splitStr);
		// 	let posText:string = `${arr[0]}|[${arr[2]},${arr[3]}]`;
		// 	if(this._isLink){
		// 		html = HtmlUtil.html(posText,clr,false,this._fontSize,href,true);
		// 	}else{
		// 		html = HtmlUtil.html(posText,clr,false,this._fontSize);
		// 	}
			
		// }
		else if(ChatUtils.isHasItemMsg(srcMsg)){
			var strArr:string[] = App.StringUtils.anlysisMsg(srcMsg,ChatUtils.FIND_ITEM_REG);
			var len:number = strArr.length;
			var isItem:boolean;
			var str:string;
			for(var i:number = 0;i<len;i++){
				str = strArr[i];
				isItem = ChatUtils.isItemStr(str);
				var playerItem:any = CacheManager.chat.getChatItem(this._msgData,this._curItemIndex);
				if(isItem && playerItem && ItemsUtil.checkName(playerItem.itemCode_I,str.slice(1,str.length-1))){ //创建物品链接
					var itemClr = ItemsUtil.getColorBySPlayerItem(playerItem); //物品 用物品颜色
					href =ChatEnum.CHAT_LINK_ITEM+splitStr+ItemsUtil.sPlayerItemToStr(playerItem)					
					if(this._isLink){
						html += HtmlUtil.html(str,itemClr,false,this._fontSize,href,true);
					}else{
						html += HtmlUtil.html(str,itemClr,false,this._fontSize);
					}
					this._curItemIndex++;
				}else{
					html += HtmlUtil.html(str, clr,false,this._fontSize);
				}
			} 
			
		}else{
			html = HtmlUtil.html(srcMsg,clr,false,this._fontSize);
		}	
		return html;
	}

	/**计算字符串占文本的宽度 */
	protected getTextW(html: string):any {
		var tw: number = 0;
		ChatContentCell.MEASURE_TXT.autoSize = fairygui.AutoSizeType.Both;
		ChatContentCell.MEASURE_TXT.leading = 1;
		ChatContentCell.MEASURE_TXT.fontSize = this._fontSize;
		ChatContentCell.MEASURE_TXT.text = html;
		tw = ChatContentCell.MEASURE_TXT.textWidth;
		let th:number = ChatContentCell.MEASURE_TXT.height;
		return {w:tw,h:th};
	}

	/**根据一个宽度判断 是否需要换行 */
	protected isNewLine(currentW: number): boolean {
		var maxW: number = this._maxWid;
		if (this._curLineW >= maxW || this._curLineW + currentW > maxW) {
			return true;
		}
		return false;
	}

	/**获取当前行剩余的空间 */
	protected getCurLineSpaceW(): number {
		var maxW: number = this._maxWid;
		var w: number = maxW - this._curLineW;
		return w;
	}

	private addSysTextField(htmlMsg:string,px:number,py:number):void{
		if(!this._sysText){
			this._sysText = new fairygui.GRichTextField();
		}
		this._sysText.setPivot(0,0,true);
		this.addChild(this._sysText);
		this._sysText.autoSize = fairygui.AutoSizeType.Height; //自动高度
		this._sysText.width = this._maxWid;
		this._sysText.singleLine=false;	
		if(this._isOnlyLine){ //主界面缩略图渲染成一行
			this._sysText.autoSize = fairygui.AutoSizeType.None;
			this._sysText.height = 30;
			this._sysText.singleLine=true;			
		}
		this._sysText.text = htmlMsg;	
		this._sysText.x = px;	
		this._sysText.y = py;	
		this._sysText.leading = 20;
		if(this._isHome){
			this._sysText.leading = 5;
		}
		if(this._isLink && htmlMsg.indexOf("href")>-1 && !this._sysText.hasEventListener(egret.TextEvent.LINK)){
			this._sysText.addEventListener(egret.TextEvent.LINK,this.onClickLink,this);
		}
	}
	/**记录每一行的文本元素 */
	protected addLineTxtElement(ele:fairygui.GRichTextField,line:number):void{
		if(!this._curLineEleDict[line]){
			this._curLineEleDict[line] = [];
		}
		this._curLineEleDict[line].push(ele);
	}
	/**重新布局排列所有文本的Y坐标 */
	protected layoutAllTxt():void{
		for(var line in this._lineHInfDict){
			this.layoutTxtByLine(Number(line));
		}
	}
	/**重新排列每一行的坐标 */
	protected layoutTxtByLine(line:number):void{
		var txtArr:fairygui.GRichTextField[] = this._curLineEleDict[line];
		if(txtArr){
			for(let txt of txtArr){
				var h:number = this._lineHInfDict[line];
				var t:egret.TextField = <egret.TextField>txt.displayObject;
				txt.y = this.getPosYByLine(line) + this.fixY; //固定Y 每行
			}
		}
	}
	private getPosYByLine(line:number):number{
		let w:number = this._isHome?30:44;
		return (line-1)*w;
	}
	/**添加标签 */
	private addLabel():number{
		let labelW:number = 0;
		switch(this._labelType){
			case ChatEnum.Label_Text:
				let chanelName:string = "["+ChatUtils.getChanelName(this._msgData.chatType_I)+"]"; 
				labelW = this.addLabelTxt(true,chanelName);	
				break;
			case ChatEnum.Label_Img:
				labelW = this.addImgLabel(true,"img_sys");
				break;
			case ChatEnum.Label_None:
				this.addLabelTxt(false,"");
				this.addImgLabel(false,"");
				break;
		}		
		return labelW;
	}

	private addLabelTxt(isAdd:boolean,text:string):number{
		let w:number = 0;
		if(isAdd){
			if(!this._labelTxt){
				this._labelTxt = new fairygui.GTextField();
			}
			this._labelTxt.autoSize = fairygui.AutoSizeType.Both;
			this._labelTxt.fontSize = this._fontSize;
			this._labelTxt.color = 0xff7610;
			this._labelTxt.text = text;
			this.addChild(this._labelTxt);
			this._labelTxt.y = this.fixY;
			this._labelTxt.x = 0;
			w = this._labelTxt.width + ChatContentCell.LABEL_GAP;
		}else if(this._labelTxt && this._labelTxt.parent){
			this._labelTxt.parent.removeChild(this._labelTxt);
		}
		return w;
	}
	/**添加图片频道标签 */
	private addImgLabel(isAdd:boolean,imgName:string):number{
		let w:number = 0;
		if(isAdd){
			if(!this._labelImg){
				this._labelImg = FuiUtil.createObject(PackNameEnum.Chat,"img_sys").asImage;				
			}
			w = this._labelImg.width;
			this.addChild(this._labelImg);
			this._labelImg.x = 0;
			this._labelImg.y = this.fixY;
		}else if(this._labelImg && this._labelImg.parent){
			this._labelImg.parent.removeChild(this._labelImg);
		}				
		return w;
	}

	/**添加角色名称 */
	private addPlayerName(msg:SChatMsg,px:number):number{
		let w:number = 0;
		if(this._isNameFlag && msg.fromPlayer){
			let isLinkName:boolean = this._isLink;
			var nameStr:string = "";
			if(msg.chatType_I==EChatType.EChatTypePrivate){
				nameStr = msg.fromPlayer.name_S+":";
				isLinkName = false;
			}else{
				nameStr = ChatUtils.getPlayerName(msg.fromPlayer);
			}

			let href:string = "";
			if(isLinkName){
				href = ChatEnum.CHAT_LINK_PLAYER+"|"+ChatUtils.entityIdToStr(msg.fromPlayer.entityId);
			}
			nameStr = HtmlUtil.html(nameStr,this._nameColor,false,this._fontSize,href);
			let nameTxt:fairygui.GRichTextField = this.addTextField(px,0,nameStr,false);
			this.addLineTxtElement(nameTxt,this._lineNum);
			w+=this.getTextW(nameStr).w;				

		}
		return w; 
	}

	/**添加VIP图片标识 */
	private addVIPImg(msg:SChatMsg,curWid:number):number{
		let w:number = 0;
		let isVip:boolean = this._msgData.fromPlayer && this._msgData.fromPlayer.vipLevel_BY > 0;
		if(this._isVipFlag && isVip){

			/*
			if(!this._vipImg){
				let vipImg:fairygui.GImage = FuiUtil.createObject(PackNameEnum.Common,"VIP").asImage;				
				this._vipImg = vipImg;
			}
			w = this._vipImg.width + ChatEnum.VIP_GAP;
			this.addChild(this._vipImg);
			this._vipImg.x = curWid;
			this._vipImg.y = this.fixY;
			this._vipImg.scaleX = this._vipImg.scaleY = this._vipScale;
			*/

			if(!this._vipText){
				this._vipText = new fairygui.GTextField();
				this._vipText.font = URLManager.getNumFont('vip2');
			}
			this._vipText.autoSize = fairygui.AutoSizeType.Both;			
			this._vipText.text=`VIP`;//${this._msgData.fromPlayer.vipLevel_BY}
			w = this._vipText.width + ChatEnum.VIP_GAP;
			this.addChild(this._vipText);
			this._vipText.x = curWid;
			this._vipText.y = 7;
		}else{
			this.delVipTxt();
		}		
		
		return w*this._vipScale;
	}

	/**记录每行的行高(最高的) */
	protected setLineHInf(line:number,h:number):void{
		let oldH:number = this._lineHInfDict[line]?this._lineHInfDict[line]:0;
		h = Math.max(oldH,h);
		this._lineHInfDict[line] = h;
	}

	/**设置最大宽度 */
	public setMaxWid(maxWid:number):void{
		this._maxWid = maxWid;
	}
	/**频道标签类型 */
	public setLabelType(value:number):void{
		this._labelType = value;
	}
	/**设置表情的缩放 */
	public setFaceScale(value:number):void{
		this._faceScale = value;		
		this._faceScaleFixW = (1-this._faceScale)*ChatContentCell.FACE_W/2;
	}
	/**
	 * 设置VIP图标的缩放
	 */
	public setVipScale(value:number):void{
		this._vipScale = value;
	}

	/**设置是否只有一行的标识 */
	public setOnlyLineFlag(value:boolean):void{
		this._isOnlyLine = value;
	}

	public setHome(value:boolean):void{
		this._isHome = value;
	}

	public setLinkFlag(value:boolean):void{
		this._isLink = value;
	}
	/**设置字体大小 */
	public setFontSize(value:number):void{
		this._fontSize = value;
	}

	public setVipFlag(value:boolean):void{
		this._isVipFlag = value;
	}

	public setNameFlag(value:boolean):void{
		this._isNameFlag = value;
	}
	/**设置名字颜色 */
	public setNameColor(color:any):void{
		this._nameColor = color;
	}

	public setFontColor(value:number):void{
		this._fontColor = value;
	}

	public get contentW(): number {
		return this._contentW;
	}
	public get contentH(): number {
		let h:number = 35;		
		if(this._msgData && this.isTextMsg() && this._sysText && this._sysText.parent){
			h = this._sysText.y + this._sysText.height;
		}else if(this._msgData.isPrivateNotice() && this._pnText){
			h = this._pnText.y + this._pnText.height; 
		}else{
			let lineH:number = this._isHome?32:42;
			h = this._lineNum*lineH;
		}
		return h;
		//return this._contentH;
	}

	public get lineNum(): number {
		return this._lineNum;
	}

	private delVipTxt():void{
		if(this._vipText && this._vipText.parent){
			/*
			this._vipImg.parent.removeChild(this._vipImg);
			*/
			this._vipText.parent.removeChild(this._vipText);
			this._vipText

		}		
	}

	/**
	 * 重置
	 */
	public resetContent(): void {
		while (this._faceArr.length > 0) {
			let faceItem:ChatFaceItem = this._faceArr.splice(0, 1)[0];
			faceItem.destroy();
			ObjectPool.push(faceItem);
		}
		while (this._RTxtArr.length > 0) {
			var rtxt:fairygui.GRichTextField = <fairygui.GRichTextField>this._RTxtArr.splice(0, 1)[0];
			ObjectPool.push(rtxt);
			if(rtxt.hasEventListener(egret.TextEvent.LINK)){
				rtxt.removeEventListener(egret.TextEvent.LINK,this.onClickLink,this);
			}
		}		
		this.removeChildren();
		this.delVipTxt();
		this._contentW = 0;
		this._contentH = 0;
		this._curLineW = 0;
		this._curLineH = 0;
		this._lineNum = 1;		
		this._curItemIndex = 0;
		ObjectUtil.emptyObj(this._curLineEleDict);
		ObjectUtil.emptyObj(this._lineHInfDict);
		this._pnText = null;
	}

}