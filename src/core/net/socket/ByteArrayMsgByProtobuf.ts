class ByteArrayMsgByProtobuf extends ByteArrayMsg {
    private msgClass:any = null;
    private protoConfig:any = null;

    /** key:string, ProtoConfig, 客户端发给服务端，即C2S，第一索引是协议名key */
    private protoConfigC2S:any = null;
    /** msgID:number, ProtoConfig, 服务端回复客户端，即S2C，即C2S，第一索引是数字 */
    private protoConfigS2C:any = null;

    /** 映射服务端唯一ecmdid, key是EcmdXXXXXXX */
    private ECmd_StringKey:any = null;
    /** 映射服务端唯一ecmdid, key是数字，也是字符串 */
    private ECmd_IdKey:any = null;

    /**
     * 构造函数
     */
    public constructor() {
        super();
        this.msgClass = {};
        this.protoConfig = App.ProtoConfig;

        this.protoConfigC2S = {};
        this.protoConfigS2C = {};

        if (this.protoConfig && this.protoConfig.C2S && this.protoConfig.S2C)
        {
            let c2s:any = this.protoConfig.C2S;
            for(let key in c2s) {
                this.protoConfigC2S[key] = c2s[key];
            }
            
            let s2c:any = this.protoConfig.S2C
            for(let key in s2c) {
                this.protoConfigS2C[key] = s2c[key];
            }
        }

        this.ECmd_StringKey = {};
        this.ECmd_IdKey = {};

        let arrCmd:Array<string> = this.protoConfig.CommonCommands;
        for(let i:number=0, len:number=arrCmd.length; i<len; i++){
            let cmdObject:any = this.getMsgClass(arrCmd[i]);
            // console.log("新proto调试, this.protoConfig: ", this.protoConfig);
            for(let key in cmdObject) {
                let value = cmdObject[key];
                if (egret.NumberUtils.isNumber(value)) {
                    this.ECmd_StringKey[key] = value;
                    this.ECmd_IdKey[value] = key;
                }
            }
        }
        
        // console.log("新proto调试, this.protoConfig: ", this.protoConfig);
        // console.log("新proto调试, this.protoConfigC2S: ", this.protoConfigC2S);
        // console.log("新proto调试, this.ECmd_StringKey: ", this.ECmd_StringKey);
        // console.log("新proto调试, this.ECmd_IdKey: ", this.ECmd_IdKey);
    }

    /**
     * 获取msgID对应的类
     * @param key
     * @returns {any}
     */
    private getMsgClass(key:string):any {
        key = "simple." + key;
        var cls:any = this.msgClass[key];
        if (cls == null) {
            // cls = App.ProtoFile.build(key);
            cls = egret.getDefinitionByName(key);
            this.msgClass[key] = cls;
        }
        return cls;
    }

    /**
     * 获取msgKey，通过协议号取S2C协议名
     * @param msgID
     * @returns {any}
     */
    private getMsgKeyS2C(msgID:number) {
        return this.protoConfigS2C[this.ECmd_IdKey[msgID.toString()]];
    }

    /**
     * 获取msgKey，通过协议cmd号取C2S协议名
     * @param msgID
     * @returns {any}
     */
    private getMsgKeyC2S(msgID:string): string {
        return this.protoConfigC2S[msgID];
    }

    /**
     * 消息解析
     * @param msg
     */
    public decode(msg:egret.ByteArray):any {
        var size: number = msg.readUnsignedByte();
        if (size == 255) {
            size = msg.readInt();
        }
        msg.readByte();    //flag size     
        msg.readByte();    //messagetype
        var data: egret.ByteArray = new egret.ByteArray;
        msg.readBytes(data, 0, size - 2);
        data.endian = egret.Endian.LITTLE_ENDIAN;
        var msgID: number = data.readUnsignedByte();
        if (msgID == 255) {
            msgID = data.readInt();
        }
        data.readByte();    //fromIds 
        data.readByte();    //toIds
        data.readByte();    //bUseBuffer  
        // var serverNum: number = data.readByte();

        //旧的
        // var msgBuff: ArrayBuffer;
        // var clientData: egret.ByteArray = new egret.ByteArray;
        // data.readBytes(clientData);
        // var len = clientData.buffer.byteLength;
        // var dataView = new DataView(clientData.buffer);
        // var pbView = new DataView(new ArrayBuffer(len));
        // for (var i: number = 0; i < len; i++) {
        //     pbView.setInt8(i, dataView.getInt8(i));
        // }
        // msgBuff = pbView.buffer;
        // msgBuff = new Uint8Array(msgBuff);


        //新的
        var msgBuff: Uint8Array;
        var clientData: egret.ByteArray = new egret.ByteArray;
        data.readBytes(clientData);
        msgBuff = clientData.bytes;


        var obj:any = {};
        obj.msgID = msgID;
        obj.key = this.getMsgKeyS2C(msgID);
        obj.cmd = this.ECmd_IdKey[msgID.toString()];

        if (obj.key == undefined) {
            // Log.trace("!!!收到协议号为" + msgID + "在resource.proto未定义字段");
            return null;
        }

        // if (obj.key == "SEntityLeft") {
        //     Log.trace("SEntityLeftSEntityLeftSEntityLeft:", msg);
        // }

        // console.log("receive：", "obj.key是[ " + obj.key + "]", obj.body);
        App.DebugUtils.start("Protobuf Decode: " + obj.key);
        if ("" != obj.key) {
            // obj.key = "simple." + obj.key;
            // console.log("新proto调试, 收到解析的ByteArray: ", msgBuff);
            obj.body = this.getMsgClass(obj.key).decode(msgBuff);
        }
        // console.log("新proto调试, decode的obj: ", obj);
        App.DebugUtils.stop("Protobuf Decode: " + obj.key,obj.body);

        // var filterLogArr:Array<number> = [ECmdBroadCast.ECmdBroadcastEntityMoveInfo, EGateCommand.ECmdGateBag];
        // if (filterLogArr.indexOf(msgID) == -1)
        //     Log.trace(Log.GAME, "receive收到数据：", "["+ msgID + ", " + obj.cmd + ", " + obj.key + "]", obj.body);

        // if (obj.body == null) {
        //     Log.trace("!!!!! decode failed, msgID:" + msgID + ", " + obj.cmd + ", " + obj.key);
        //     return null;
        // }
        return obj;
    }

    /**
     * 消息封装
     * @param msg
     */
    public encode(msg:any):any {
        var msgID = this.ECmd_StringKey[msg.cmd];
        var key = this.getMsgKeyC2S(msg.cmd);
        //var msgID = this.getMsgID(key);

        if (msgID == undefined) {
            Log.trace(Log.GAME, "!!!发送协议字段为" + key + "在resource.proto未定义协议号");
            return null;
        }

        var bodyBytes:egret.ByteArray = new egret.ByteArray();
        if ("" != key) {
            //旧的
            // var msgBody = new (this.getMsgClass(key))(msg.body);
            //新的
            var msgClass = this.getMsgClass(key);
            var msgBody = msgClass.fromObject(msg.body);
            var msgBuffer = msgClass.encode(msgBody).finish();

            App.DebugUtils.start("Protobuf Encode: " + key);
            // var arraybuffer: ArrayBuffer = msgBuffer.buffer;
            // console.log("新proto调试, 发送封装的ByteArray, Uint8Array: ", msgBuffer);
            // bodyBytes = new egret.ByteArray(msgBody.toArrayBuffer());
            bodyBytes = new egret.ByteArray(msgBuffer);
            App.DebugUtils.stop("Protobuf Encode: " + key,msg.body);
        }

        // var filterLogArr:Array<number> = [ECmdGame.ECmdGameMove, ECmdGame.ECmdGameFight, ECmdGame.ECmdGameKeepActive];
        var filterLogArr:Array<number> = [ECmdGame.ECmdGameMove, ECmdGame.ECmdGameFight, ECmdGame.ECmdGameKeepActive];
        if (filterLogArr.indexOf(msgID) == -1)
            Log.trace(Log.GAME, "send发送数据：", "["+ msgID + ", " + msg.cmd + ", " + key + "]", msg.body);

        var clientBytes: egret.ByteArray = new egret.ByteArray();
        clientBytes.endian = egret.Endian.LITTLE_ENDIAN;    // littleEndian
        // message head
        // command: 0-254 writeByte; >= 255 writeByte(255) then writeInt
        if (msgID > 255) {
            clientBytes.writeByte(255);
            clientBytes.writeInt(msgID);
        }
        else {
            clientBytes.writeByte(msgID);
        }
        // 服务器用
        clientBytes.writeByte(0);  //fromIds
        clientBytes.writeByte(0);  //toIds
        clientBytes.writeByte(1);  //bUseBuffer
        // message body
        clientBytes.writeBytes(bodyBytes);
        return clientBytes;
    }
}