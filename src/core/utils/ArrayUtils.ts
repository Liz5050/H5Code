
class ArrayUtils extends BaseClass {
    /**
     * 遍历操作
     * @param arr
     * @param func
     */
    public forEach(arr: Array<any>, func: Function, funcObj: any): void {
        for (var i: number = 0, len: number = arr.length; i < len; i++) {
            func.apply(funcObj, [arr[i]]);
        }
    }

    public remove(array: Array<any>, element: any) {
        let index = array.indexOf(element);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    /**
     * 清空数组
     * 
     */
    public emptyArr(arr: Array<any>, cbFn: Function = null, caller: any = null): void {
        if(!arr){
            return;
        }
        while (arr.length > 0) {
            var ele: any = arr.splice(0, 1)[0];
            if (cbFn && caller) {
                cbFn.call(caller, ele);
            }
        }
    }

    /**
     * 2D数组转置矩阵
     * 1：可传入number[][]
     * 2：可传入Array<Array<number>>
     */
    public transposeMatrix(matrix: any): any {
        var w = matrix instanceof Array ? matrix.length : 0;
        var h = matrix[0] instanceof Array ? matrix[0].length : 0;

        if (h === 0 || w === 0) {
            return [];
        }

        var i, j, t = [];
        for (i = 0; i < h; i++) {
            t[i] = [];
            for (j = 0; j < w; j++) {
                t[i][j] = matrix[j][i];
            }
        }
        return t;
    }

    /**
     * 获取字典内容个数
     */
    public getDictSize(dict: any): number {
        let size: number = 0;
        if (dict != null) {
            for (let k in dict) {
                size++;
            }
        }
        return size;
    }

    /**
     * 数组排序(可以根据多字段排序)
     * @param arr
     * @param keyName 要排序的字段(多个字段用逗号隔开,无字段传空串,会自动当是字符串或数字数组进行比较排序)
     * @param isDesc  是否降序
     */
    public sortOn(arr: any[], keyName: string = "", isDesc: boolean = false): void {
        var keyArr: string[] = [];
        if (keyName) {
            keyArr = keyName.split(",");
        }
        arr.sort(function (a: any, b: any): number {
            var ret: number = 0;
            var key: string = "";
            for (var i: number = 0; i < keyArr.length; i++) {
                key = keyArr[i];
                if (a.hasOwnProperty(key) && b.hasOwnProperty(key) && a[key] != b[key]) {
                    break;
                } else {
                    key = "";
                }
            }
            var largeRet: number = isDesc ? -1 : 1;
            if (key) { //存在不同值的key                
                a[key] > b[key] ? ret = largeRet * 1 : ret = -1 * largeRet;
            } else if (!keyName) { //当是字符串或数字数组进行比较排序
                a > b ? ret = largeRet * 1 : ret = -1 * largeRet;
            }
            return ret;
        });
    }

    public isEqual(arr1: any[], arr2: any[]): boolean {
        if (arr1 == null || arr2 == null)
            return false;
        if (arr1.length != arr2.length)
            return false;
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i])
                return false;
        }
        return true;
    }

    public static insert(value: any, index: number, array: Array<any>) {
        if (array != null) {
            array.splice(index, 0, value);
        }
    }

    /**
     * 快排，数据量大时使用会极大提高效率
     */
    public static quickSortHoare(arr:any[], start:number, end:number, compareFn: (a: any, b: any) => number) {
        if(start >= end)
            return;
        let p = partitionHoare(arr, start, end);
        ArrayUtils.quickSortHoare(arr, start, p, compareFn);
        ArrayUtils.quickSortHoare(arr, p+1, end, compareFn);

        function partitionHoare(arr, start, end){
            let pivot = arr[start];
            let s = start;
            let e = end;
            while(1){
                while(compareFn(arr[s], pivot) < 0){
                    s ++;
                }
                while(compareFn(arr[e], pivot) > 0){
                    e --;
                }
                if(s == e){
                    return s;
                }else if(s > e){
                    return s-1;
                }
                swap(arr, s, e);
                s++;
                e--;
            }
        }

        function swap(arr, s, e){
            let tmp = arr[s];
            arr[s] = arr[e];
            arr[e] = tmp;
        }
    }

}