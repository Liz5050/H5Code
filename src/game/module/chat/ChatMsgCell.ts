/**聊天内容的真正包装器 */
class ChatMsgCell extends fairygui.GComponent {
	private static ChatNameClr:number = 0x61D3E8; //黄色 副本面板描述用到

	/**一个表情占计算宽度 */
	private static FACE_CAL_W: number = 44;
	private static FACE_W: number = 44;
	private static FACE_H: number = 44;
	private static TEXT_H: number = 30;
	/**修正表情y坐标的偏移量 */
	private static FACE_Y_FIX:number = 7;

	/**聊天窗口 系统频道标签和内容的间距 */
	public static LABEL_GAP:number = 15;
	public static VIP_GAP:number = 5;
	public static NAME_GAP:number = 5;
	/**固定的 聊天对话框的宽 */
	public static CHATITEM_W: number = 530;
	/**固定的 主界面显示的聊天内容宽 */
	public static CHANELITEM_W: number = 345;
	/**行距 */
	public static LINE_GAP:number = 3;

	/**为了准确计算文本占的宽度 */
	private static MEASURE_TXT: fairygui.GRichTextField = new fairygui.GRichTextField();
	protected _contentW: number = 0;
	protected _contentH: number = 0;
	protected _curLineW: number = 0;
	protected _curLineH: number = 0;
	protected _lineNum: number = 1;
	/**最大宽度 */
	protected _maxWid:number = 0;
	protected _secondMaxWid:number = 0;
	protected _faceArr: Array<any>;
	protected _RTxtArr: Array<fairygui.GRichTextField>;
	protected _showRText:fairygui.GRichTextField;
	protected _curItemIndex:number = 0;
	protected _msgData:SChatMsg;	
	protected _curLineEleDict:any;
	protected _lineHInfDict:any;

	/**第一行是否有表情 */
	protected _isFirstFace:boolean;
	protected _html:string;
	protected _fontSize:number;
	protected _fontColor:string;
	protected _strokeColor:number = 0;
	protected _faceSpace:string;
	/**是否前面有标签图片(主界面的) */
	protected _isChanelLabel:boolean;
	/**是否需要添加图片标签(聊天界面的) */
	protected _isAddLabel:boolean;
	/**是否需要添加频道标签文本 */
	protected _isLabelTxt:boolean;
	protected _isHasText:boolean;
	protected _isHasFace:boolean;
	/**主界面标签图片的宽 */
	protected _labelWid:number = 0;
	/**是否有超链接 */
	protected _isLink:boolean = true;
	protected _isOneLine:boolean = true;

	private _labelTxt:fairygui.GTextField;
	private _vipImg:fairygui.GImage;
	private _faceScale:number = 1;
	private _faceScaleFixW:number = 0;

	/**
	 * @param maxWid 最大宽度 换行计算 0表示只有一行 不会换行 全部内容渲染成一行
	 * @param faceSpace 表情占位符
	 * @param fontSize 字体大小
	 * @param fontColor 字体颜色
	 * @param isChanelLabel 是否有频道标签图片
	 * @param isLink 是否有超链接
	 * @param isOneLink 是否只渲染一行的内容 maxWid不是0 但是只渲染maxWid这个宽度内显示的一行内容
	 */
	public constructor(maxWid:number,faceSpace:string,fontSize:number=30,fontColor:string=null,isChanelLabel:boolean=false,isLink:boolean=true,isOneLine:boolean=false) {
		super();
		this._faceArr = [];
		this._RTxtArr = [];
		this._curLineEleDict = {};
		this._lineHInfDict = {};
		this.setMaxWid(maxWid);
		this._html = "";
		this._isChanelLabel = isChanelLabel;
		this._fontSize = fontSize;
		this._fontColor = fontColor;
		this._faceSpace = faceSpace;//22号字体的表情占位符,
		this._isLink = isLink;
		this._isOneLine = isOneLine;

	}
	
	public update(data: any): void {
		this.resetContent();
		this._msgData = <SChatMsg>data;
		var clr:string = this.getColor();
		var chatArr: string[] = App.StringUtils.anlysisMsg(this._msgData.content_S,ChatUtils.FIND_FACE_REG);
		var preTxt: fairygui.GRichTextField;
		var face: ChatFaceItem;
		var curX: number = 0;
		var curY: number = 0;
		var len:number = chatArr.length;
		var curAddW: number = 0;
		var newLineFlag: boolean = false;
		let chanelName:string = "["+ChatUtils.getChanelName(this._msgData.chatType_I)+"]"; 
		
		
		let labelW:number = 0;
		if(this._isChanelLabel){			
			curAddW = this.addChaneLabelFix();
			curX = curAddW;
			this.calSizeW(newLineFlag,curAddW);
		}else{
			labelW = this.addLabelTxt(this._isLabelTxt,chanelName);
			curAddW += labelW;
			curAddW += this.addVIPImg(this._msgData,curAddW);
			let nameW:number = this.addPlayerName(this._msgData);
			this._isHasText = nameW > 0;
			curAddW += nameW;
			curX = curAddW;
			this._secondMaxWid = this._maxWid - this.getContentTFPox();
			this.calSizeW(newLineFlag,curAddW);	
		}

		if(ChatUtils.isSysChanel(this._msgData)){ //目前所有系统频道的消息不会有表情 直接文本自适应显示			
			this._maxWid = this._maxWid - curAddW;
			this._html += this.fmtHtml(this._msgData.content_S);
			this.addLabelTxt(this._isLabelTxt,chanelName);
			let tx:number = 0;
			if(this._isLabelTxt){
				tx = this.getContentTFPox();
			}else if(this._isAddLabel){
				tx = ChatMsgCell.LABEL_GAP;
			}
			this.addText(tx);
			return;
		}

		for (var i: number = 0; i < len; i++) {
			var isFace: boolean = ChatUtils.isFaceStr(chatArr[i]);			
			newLineFlag = false;
			curAddW = 0;
			if (isFace) {
				this._isHasFace = true;				
				var id: string = chatArr[i].slice(1);
				curAddW = ChatMsgCell.FACE_CAL_W*this._faceScale;
				this._curLineH = Math.max(ChatMsgCell.FACE_H+this._faceScale, this._curLineH);
				this.setLineHInf(this._lineNum,this._curLineH);
				newLineFlag = this.isNewLine(curAddW);
				let faceYFix:number = ChatMsgCell.FACE_Y_FIX;					
				if (newLineFlag) {
					if(this._isOneLine){
						break;
					}					
					curX = this.getContentTFPox();
					face = this.addFace(id,this.getFacePox(curX),this._contentH-faceYFix); //y 不包括当前行高的高	 this._contentH+5				
					this._curLineW = 0;
					this._lineNum++;
					this.setLineHInf(this._lineNum,this._curLineH);
					this._contentH += this._curLineH;
					curY = face.y + faceYFix; //这里设置的是真实的Y值 下次设置会减去 这里先加 faceYFix				
					this._html+=HtmlUtil.brText;
					
				} else {
					this._contentH = Math.max(this._curLineH, this._contentH);
					face = this.addFace(id,this.getFacePox(curX),curY-faceYFix);				
				}
				
				curX = face.x + curAddW + this._faceScaleFixW;
				!this._isFirstFace?this._isFirstFace = this._lineNum==1:"";
				this._html+=this._faceSpace;
			} else {
				this._isHasText = true;
				var msgStr: string = chatArr[i];
				var srcMsg:string = msgStr;
				var html: string = HtmlUtil.html(ChatUtils.colorTagToStr(chatArr[i]),clr,false,this._fontSize);
				curAddW = this.getTextW(html);
				newLineFlag = this.isNewLine(curAddW); //判断当前文本的宽度是否需要换行				
				this._curLineH = Math.max(this._curLineH, ChatMsgCell.TEXT_H);
				this.setLineHInf(this._lineNum,this._curLineH);
				this._contentH = Math.max(this._curLineH, this._contentH);
				//文本需要换行
				if (newLineFlag) {
					//计算当前文本需要多少行
					html = "";				
					var curCalStr: string = "";
					var curCalIdx: number = 0;
					var itemIdx:number = this._curItemIndex;
					var lw: number = this.getCurLineSpaceW();
					let isBreak:boolean = false;
					for (var j: number = 0; j < msgStr.length; j++) {
						curCalStr = msgStr.slice(curCalIdx, j + 1);
						var link:string=this.cutItemLink(msgStr,j,itemIdx,curCalIdx);
						if(link){
							curCalStr = link;
							itemIdx++;							
						}						
						var tw: number = this.getTextW(HtmlUtil.html(curCalStr,clr,false,this._fontSize));
						var lw: number = this.getCurLineSpaceW();									
						if (tw > lw) { //换行了											
							preTxt = this.calTextFieldSpace(curX, curY,msgStr.slice(curCalIdx, j)); //当前行剩余可以放置的文本内容								
							//this.addLineTxtElement(preTxt,this._lineNum);
							if (j == 0) { //该文本刚好在新行开始
								curX = labelW;
							}
							this._curLineW += preTxt.textWidth;
							this._contentW = Math.max(this._contentW, this._curLineW);
							if(this._isOneLine){
								isBreak = true;
								break;
							}
							this._lineNum++;							
							this._curLineH = Math.max(this._curLineH, ChatMsgCell.TEXT_H);
							this.setLineHInf(this._lineNum,this._curLineH);
							curY = Math.max(this._contentH, this._curLineH); //下一行的Y等于当前高							
							this._html+=HtmlUtil.brText; //换行
							this._contentH += this._curLineH;
							//重置行宽 计算剩余字符串是否一行可以放得下
							this._maxWid = this._secondMaxWid; //两行文本对齐
							this._curLineW = 0;
							srcMsg = msgStr.slice(j, msgStr.length);							
							if (this.checkLeftLine(srcMsg)) { //剩余的下一行可以放得下了
								curX = labelW;
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
				preTxt = this.calTextFieldSpace(curX, curY, srcMsg);
				//this.addLineTxtElement(preTxt,this._lineNum);
				curAddW = preTxt.textWidth;
				curX = preTxt.x + curAddW;
			}
			this.calSizeW(newLineFlag,curAddW);
		}
		if(this._isHasText){
			let tx:number = this.getContentTFPox();			
			this.addText(tx);
		}		
		//this.layoutAllTxt();
		
	}

	private getFacePox(curX:number):number{
		let tx:number = curX - this._faceScaleFixW; 
		return tx; 
	}

	private getContentTFPox():number{
		let tx:number = 0;
		if(this._labelTxt && this._labelTxt.parent){
			tx = this._labelTxt.x + this._labelTxt.textWidth + ChatMsgCell.LABEL_GAP;  
		}
		// if(this._vipImg && this._vipImg.parent){
		// 	tx += this._vipImg.width + ChatMsgCell.VIP_GAP;
		// }		
		return tx;
	}
	// private getSecondMaxWidFix():number{
	// 	let tx:number = 0;
	// 	if(this._labelTxt && this._labelTxt.parent){
	// 		tx = this._labelTxt.x + this._labelTxt.textWidth + ChatMsgCell.LABEL_GAP;  
	// 	}
	// 	return tx;
	// }
	private addText(px:number=0):void{
		var preTxt:fairygui.GRichTextField = new fairygui.GRichTextField(); //ObjectPool.pop("fairygui.GRichTextField");
		preTxt.setPivot(0,0,true);
		this.addChild(preTxt);
		this.setChildIndex(preTxt,0);
		preTxt.setSize(500,500);	
		preTxt.singleLine=false;		
		preTxt.align = fairygui.AlignType.Left; //设置为左对齐		
		if(this._strokeColor){
			preTxt.stroke = 1;
			preTxt.strokeColor = this._strokeColor;
		}	
		var leading:number = this._isHasFace?23:13; //无表情纯文本:13 有表情 30号字体:13,22号字体:23 
		preTxt.leading = leading;		
		if(ChatUtils.isSysChanel(this._msgData) && this._maxWid<Number.MAX_VALUE){
			preTxt.autoSize = fairygui.AutoSizeType.Height; //自动高度
			preTxt.width = this._maxWid;
			if(this._isOneLine){ //主界面缩略图渲染成一行
				preTxt.autoSize = fairygui.AutoSizeType.None; //
				preTxt.height = 30;
				preTxt.singleLine=true;	
			}					
		}else{
			preTxt.autoSize = fairygui.AutoSizeType.Both; //自动宽高,渲染成一行
		}		
		this._RTxtArr.push(preTxt);
		if(this._html.indexOf("href")>-1 && !preTxt.hasEventListener(egret.TextEvent.LINK)){
			preTxt.addEventListener(egret.TextEvent.LINK,this.onClickLink,this);
		}	
		preTxt.text = this._html;
		
		let ty:number = this._isFirstFace?3:0;
		preTxt.x = px;
		preTxt.y = 0;	
		preTxt.ensureSizeCorrect();
		this._contentH = Math.max(preTxt.height,this._contentH);
		this._contentW = Math.max(preTxt.textWidth,this._contentW);
		this._showRText = preTxt;
	}

	/**主界面 签名有频道标签和名字 */
	private addChaneLabelFix():number{		
		this._isHasText = true;
		this._html = "　　 　   "; //频道按钮的占位符
		var curAddW:number = this._labelWid || 50; //标签图片宽度
		
		var nameStr:string = this._msgData.fromPlayer?this._msgData.fromPlayer.name_S+"：":"";		
		if(nameStr){
			nameStr = HtmlUtil.html(nameStr,ChatMsgCell.ChatNameClr,false,this._fontSize);
			this._html+=nameStr;
			curAddW+=this.getTextW(nameStr);	
		}
		return curAddW;
	}
	private addLabelTxt(isAdd:boolean,text:string):number{
		let w:number = 0;
		if(isAdd){
			if(!this._labelTxt){
				this._labelTxt = new fairygui.GTextField();
			}
			this._labelTxt.autoSize = fairygui.AutoSizeType.Both;
			this._labelTxt.fontSize = 22;
			this._labelTxt.color = 0xff7610;
			this._labelTxt.text = text;
			this.addChild(this._labelTxt);
			w = this._labelTxt.width + ChatMsgCell.LABEL_GAP;
		}else if(this._labelTxt && this._labelTxt.parent){
			this._labelTxt.parent.removeChild(this._labelTxt);
		}
		return w;
	}

	/**添加角色名称 */
	private addPlayerName(msg:SChatMsg):number{
		let w:number = 0;
		if(msg.fromPlayer){
			var nameStr:string = "";
			if(EntityUtil.isCrossPlayer(msg.fromPlayer.entityId)){//跨服玩家
				`[${msg.fromPlayer.name_S}S${msg.fromPlayer.entityId.typeEx_SH}]  `
			}else{
				nameStr = `[${msg.fromPlayer.name_S}]  `;
			}

			let href:string = "";
			if(this._isLink){
				href = ChatEnum.CHAT_LINK_PLAYER+"|"+ChatUtils.entityIdToStr(msg.fromPlayer.entityId);
			}
			nameStr = HtmlUtil.html(nameStr,"#3894fc",false,this._fontSize,href);
			this._html+=nameStr;
			w+=this.getTextW(nameStr); //+ChatMsgCell.NAME_GAP;			

		}
		return w; 
	}	
	/**添加VIP图片标识 */
	private addVIPImg(msg:SChatMsg,curWid:number):number{
		let w:number = 0;
		let isVip:boolean = this._msgData.fromPlayer && this._msgData.fromPlayer.vipLevel_BY > 0;
		if(isVip){
			if(!this._vipImg){
				let vipImg:fairygui.GImage = FuiUtil.createObject(PackNameEnum.Chat,"VIP").asImage;				
				this._vipImg = vipImg;
			}
			w = this._vipImg.width //+ ChatMsgCell.VIP_GAP;
			this.addChild(this._vipImg);
			this._html += "　　　　　";
			this._vipImg.x = curWid;
		}else if(this._vipImg && this._vipImg.parent){
			this._vipImg.parent.removeChild(this._vipImg);
		}				
		return w;
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
		var clr:string = this.getColor();
		var html:string = HtmlUtil.html(srcMsg, Color.Blue,false,this._fontSize);							
		var tw:number = this.getTextW(html); //目前需要的宽度
		return lw>tw;
	}
	/**
	 * 查找自定义链接<XXXX>
	 */
	private cutLink(msgStr:string,j:number,itemIdx:number,curCalIdx:number):any{
		var linkRet:any;
		var reg:RegExp = />/g;
		var regTag:RegExp = /<[^<]+>/g;
		var curCalStr:string = "";
		if(msgStr.charAt(j)=="<"){ //遇到疑似物品开头
			reg.lastIndex = 0;
			var tempStr:string = msgStr.slice(j,msgStr.length);
			var tempIdx:number = tempStr.search(reg);
			if(tempIdx>-1){				
				var excArr:RegExpExecArray = regTag.exec(tempStr);
				if(excArr){
					tempStr = excArr[0];
					tempStr = tempStr.replace(ChatUtils.COLOR_TAG_REPLACE,"");
					var arr:string[] = tempStr.split("|");
					curCalStr = msgStr.slice(curCalIdx,j) +arr[2];
					j = msgStr.indexOf(arr[2]) + arr[2].length+1;
					linkRet = {str:curCalStr,j:j};
				}
			}				
		}
		return linkRet;
	}
	/**
	 * 查找玩家发送的物品字符串 匹配就截取
	 * */
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
	
	/**计算插入聊天字符串时需要的空间和坐标 */
	protected calTextFieldSpace(curX: number, curY: number, srcMsg: string): fairygui.GRichTextField {
		var preTxt:fairygui.GRichTextField = ChatMsgCell.MEASURE_TXT;	
		preTxt.autoSize = fairygui.AutoSizeType.Both;	
		preTxt.leading = 1;
		var html:string = this.fmtHtml(srcMsg);
		this._html +=html;
		preTxt.text = html;		
		preTxt.x = curX;
		preTxt.y = curY;	
		return preTxt;
	}

	private onClickLink(e:egret.TextEvent):void{		
		CacheManager.chat.isClickLink = true;
		e.stopPropagation();
		EventManager.dispatch(UIEventEnum.ChatClickLink,e.text);
	}

	protected addFace(id: string,px:number,py:number): ChatFaceItem {
		var face:ChatFaceItem = ObjectPool.pop("ChatFaceItem");
		this.addChild(face);
		face.setData({id:Number(id)});		
		face.setPivot(0.5,0.5);
		face.x = px;
		face.y = py;		
		face.scaleX = face.scaleY = this._faceScale;
		this._faceArr.push(face);
		return face;
	}

	protected fmtHtml(srcMsg: string):string{
		var html:string = "";
		var href:string;
		var splitStr:string = "|";
		var clr:string = this.getColor();		
		if(ChatUtils.isHasColorTag(srcMsg)){		
			html = ChatUtils.fmtColorTag(srcMsg,clr,this._fontSize,this._isLink);						
		}/*else if(ChatUtils.isMsgPosStr(srcMsg)){ // 创建坐标链接: <测试地图|601000|1|134>
			srcMsg = srcMsg.slice(1,srcMsg.length-1);
			var arr:string[] = srcMsg.split(splitStr);
			href =  ChatEnum.CHAT_LINK_POS+splitStr+arr.slice(1,arr.length).join(splitStr);
			let posText:string = `${arr[0]}|[${arr[2]},${arr[3]}]`;
			if(this._isLink){
				html = HtmlUtil.html(posText,clr,false,this._fontSize,href,true);
			}else{
				html = HtmlUtil.html(posText,clr,false,this._fontSize);
			}
			
		}*/else if(ChatUtils.isHasItemMsg(srcMsg)){
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
	protected getTextW(html: string): number {
		var tw: number = 0;
		ChatMsgCell.MEASURE_TXT.autoSize = fairygui.AutoSizeType.Both;		
		ChatMsgCell.MEASURE_TXT.leading = 1; //最后显示的文本会设置行距这里如果用默认行距计算的宽度会不一致,这里就算行距设置不一样计算宽度也一样
		ChatMsgCell.MEASURE_TXT.text = html;
		tw = ChatMsgCell.MEASURE_TXT.textWidth;
		return tw;
	}

	protected getColor():string{
		var clr:string = this._fontColor;
		return clr;
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
				txt.y = txt.y + (h-ChatMsgCell.TEXT_H)/2;
			}
		}
	}

	/**记录每行的行高 */
	protected setLineHInf(line:number,h:number):void{
		this._lineHInfDict[line] = h;
	}

	/**获取显示文本的高度 */
	public getShowTextH():number{
		var h:number = 0;
		if(this._showRText){
			h = this._showRText.height;
		}
		return h;
	}
	public setLabelWid(value:number):void{
		this._labelWid = value;
	}
	public setLabelFlag(value:boolean):void{
		this._isChanelLabel = value;
	}
	/**是否需要在文本前面添加频道标签图片 */
	public setAddLabel(value:boolean):void{
		this._isAddLabel = value; 
	}
	public setFaceScale(value:number):void{
		this._faceScale = value;		
		this._faceScaleFixW = (1-this._faceScale)*ChatMsgCell.FACE_W/2;
	}
	public setFaceSpace(value:string):void{
		this._faceSpace = value;
	}
	/**是否需要添加频道标签文本 */
	public setLabelTxtFlag(value:boolean):void{
		this._isLabelTxt = value;
	}

	public setFontColor(value:string):void{
		this._fontColor = value;
	}
	
	public setFontSize(value:number):void{
		this._fontSize = value;
	}

	public setStrokeColor(value:number):void{
		this._strokeColor = value;
	}

	/**设置最大宽度 */
	public setMaxWid(maxWid:number):void{
		this._maxWid = maxWid;
		if(this._maxWid<=0){
			this._maxWid = Number.MAX_VALUE;
		}
	}

	public get contentW(): number {
		return this._contentW;
	}
	public get contentH(): number {
		return this._contentH;
	}

	public get lineNum(): number {
		return this._lineNum;
	}

	/**
	 * 重置
	 */
	public resetContent(): void {
		while (this._faceArr.length > 0) {
			ObjectPool.push(this._faceArr.splice(0, 1)[0]);
		}
		while (this._RTxtArr.length > 0) {
			var rtxt:fairygui.GRichTextField = <fairygui.GRichTextField>this._RTxtArr.splice(0, 1)[0];
			ObjectPool.push(rtxt);
			if(rtxt.hasEventListener(egret.TextEvent.LINK)){
				rtxt.removeEventListener(egret.TextEvent.LINK,this.onClickLink,this);
			}
		}
		this.removeChildren();
		this._contentW = 0;
		this._contentH = 0;
		this._curLineW = 0;
		this._curLineH = 0;
		this._lineNum = 1;
		this._curItemIndex = 0;
		this._html = "";
		this._strokeColor = 0;
		this._isHasText = false;
		this._isFirstFace = false;
		this._isHasFace = false;
		this._showRText = null;
		ObjectUtil.emptyObj(this._curLineEleDict);
		ObjectUtil.emptyObj(this._lineHInfDict);
	}

}