class ByteArrayMsg implements BaseMsg {
    private _msgBuffer: egret.ByteArray;

    /**
     * 构造函数
     */
    public constructor() {
        this._msgBuffer = new egret.ByteArray();
        this._msgBuffer.endian = egret.Endian.LITTLE_ENDIAN;
    }

    /**
     * 接收消息处理
     * @param msg
     */
    public receive(socket: egret.WebSocket): void {
        socket.readBytes(this._msgBuffer);

        if (this._msgBuffer.bytesAvailable > 0) {
            var protocol: number = this._msgBuffer.readByte();
            var messageSize: number = this._msgBuffer.readUnsignedInt();
            while (this._msgBuffer.bytesAvailable > 0) {
                var obj: any = this.decode(this._msgBuffer);
                // if (obj && obj.body) {
                if (obj) {
                    // Log.trace("receive：", "cmd是[ " + obj.cmd + "]", obj.body);
                    App.MessageCenter.dispatch(obj.cmd, obj.body, obj.msgID);
                }
            }
            this._msgBuffer.clear();
        }
    }

    /**
     * 发送消息处理
     * @param msg
     */
    public send(socket: egret.WebSocket, msg: any): void {
        // console.log("进入send函数");
        var obj: any = this.encode(msg);
        if (obj) {
            var bytes: egret.ByteArray = new egret.ByteArray;
            bytes.endian = egret.Endian.LITTLE_ENDIAN;
            bytes.writeByte(0x10);

            var messageSize: number = obj.length + 3;
            var size: number = obj.length + 2;

            if (size < 255) {
                bytes.writeUnsignedInt(messageSize);
                bytes.writeByte(size);
            }
            else {
                messageSize = messageSize + 4;
                bytes.writeUnsignedInt(messageSize);
                bytes.writeByte(255);
                bytes.writeInt(size);
            }

            //bytes.writeByte(1);
            bytes.writeByte(0);
            bytes.writeByte(4);

            bytes.writeBytes(obj);
            socket.writeBytes(bytes);
            socket.flush();
            // return 0;
        }
    }

    /**
     * 消息解析
     * @param msg
     */
    public decode(msg: any): any {
        Log.trace(Log.GAME, "decode需要子类重写，根据项目的协议结构解析");
        return null;
    }

    /**
     * 消息封装
     * @param msg
     */
    public encode(msg: any): any {
        Log.trace(Log.GAME, "encode需要子类重写，根据项目的协议结构解析");
        return null;
    }
}