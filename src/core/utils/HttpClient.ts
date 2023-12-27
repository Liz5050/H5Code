/**
 * ajax请求，get和post调用
 */
class HttpClient {
    public responseType: string;
    public returnFunc: Function;
    public target: any;
    public request: egret.HttpRequest;
    private serverUrl: string = Sdk.phpapi_url;

    public constructor(serverUrl = null) {
        if (serverUrl) {
            this.serverUrl = serverUrl;
        }
    }

    private paramsBuilder(data: any): string {
        var params = [];
        if (typeof (data) == 'object') {
            var key;
            for (key in data) {
                params.push(key + '=' + data[key])
            }
            return params.join('&');
        } else if (typeof (data) == 'string') {
            return data;
        }
        return '';
    }

    public send(method: string, callback: Function, target: any, data: any) {
        this.returnFunc = callback;
        this.target = target;
        this.request = new egret.HttpRequest();

        var req = this.request;
        var params = this.paramsBuilder(data);

        var origin = req.getResponseHeader("Origin");
        req.setRequestHeader("Access-Control-Allow-Origin", origin);
        req.setRequestHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
        req.setRequestHeader("Access-Control-Max-Age", "3600");
        req.setRequestHeader("Access-Control-Allow-Headers", "x-requested-with,Authorization");
        req.setRequestHeader("Access-Control-Allow-Credentials", "true");
        
        if (method == egret.HttpMethod.POST) {
            req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        } else {
            this.serverUrl += '?' + params;
            params = '';
        }

        // alert("serverUrl: " + this.serverUrl);
        Log.trace(Log.GAME, "serverUrl:" + this.serverUrl);

        req.responseType = egret.HttpResponseType.TEXT;
        req.open(this.serverUrl, method);
        req.send(data);

        req.addEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
        req.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        req.addEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);
    }

    private onGetComplete(event: egret.Event): void {
        var request = <egret.HttpRequest>event.currentTarget;
        var data: any = this.responseType == 'JSON' ? JSON.parse(request.response) : request.response;
        if (this.returnFunc != null) {
            this.returnFunc.call(this.target, data);
        }
        this.destory();
    }

    private onGetIOError(event: egret.IOErrorEvent): void {
        console.log("get error : " + event);
        this.destory();
    }

    private onGetProgress(event: egret.ProgressEvent): void {
        console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    }

    private destory(): void {
        var req = this.request;

        req.removeEventListener(egret.Event.COMPLETE, this.onGetComplete, this);
        req.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onGetIOError, this);
        req.removeEventListener(egret.ProgressEvent.PROGRESS, this.onGetProgress, this);

        this.returnFunc = null;
        this.request = null;
    }

    public static get(callback: Function, target: any, data: any, responseType: string = "JSON"): void {
        var client = new HttpClient();

        client.responseType = responseType;
        client.send(egret.HttpMethod.GET, callback, target, data);
        // console.warn(data);
    }

    public static getByUrl(serverUrl, callback: Function, target: any, data: any, responseType: string = "JSON"): void {
        var client = new HttpClient(serverUrl);

        client.responseType = responseType;
        client.send(egret.HttpMethod.GET, callback, target, data);
        // console.warn(data);
    }

    public static post(callback: Function, target: any, data: any, responseType: string = "JSON"): void {
        var client = new HttpClient();

        client.responseType = responseType;
        client.send(egret.HttpMethod.POST, callback, target, data);
    }
}