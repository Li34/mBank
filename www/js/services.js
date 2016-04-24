angular.module('mBank.services', [], function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
})

    .factory('LoginService', function ($http) {
        return {
            login: function (param_json) {
                return $http.post(API_LOGIN,{mBank:JSON.stringify(param_json),req:'login'});
            },
//            register: function (param_json) {
//                return $http.post(API_REGISTER,{mBank:JSON.stringify(param_json),req:'register'});
//            }
            register: function (param_json,imageSrc,win,fail) {
                var options = new FileUploadOptions();
                options.fileKey = "file";
                var fileURL = imageSrc;
                options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
                options.mimeType = "image/jpeg";
                options.params = {mBank:JSON.stringify(param_json)};

                var ft = new FileTransfer();
                ft.upload(fileURL, encodeURI(API_REGISTER), win, fail, options);
            }
        }
    })

    .factory('SyncService', function ($http) {
        return {
            syncData: function (param_json) {
                return $http.post(API_SYNC,{mBank:JSON.stringify(param_json),req:'sync'});
            }
        }
    })

    .factory('DashService', function ($http,localService) {
        return {
            getPayData: function () {
                var obj = [];
                var allData = localService.getFromLocal();
                for(var i=0;i<allData.length;i++){
                    if(!allData[i].isincome&&!allData[i].isDelete){
                        obj.push(allData[i]);
                    }
                }
                return obj;
            },
            getIncomeData: function () {
                var obj = [];
                var allData = localService.getFromLocal();
                for(var i=0;i<allData.length;i++){
                    if(allData[i].isincome&&!allData[i].isDelete){
                        obj.push(allData[i]);
                    }
                }
                return obj;
            },
            getFullYearData: function (year) {
                var obj = [];
                var payData = this.getPayData();
                for(var i=1;i<=12;i++){
                    var total = 0;
                    for(var j=0;j<payData.length;j++){
                        var arr = payData[j].date.split('-');
                        if(arr[0] == year && arr[1] == i ){
                            total += parseFloat(payData[j].money);
                            payData.splice(j,1);
                        }
                    }
                    total = total?total:'0';
                    obj.push(total);
                }
                return obj;
            },
            getFullMonthData: function (month) {
                var obj = [];
                var payData = this.getPayData();
                for(var i=1;i<=31;i++){
                    var total = 0;
                    for(var j=0;j<payData.length;j++){
                        var date = payData[j].date.substr(0,7);
                        var arr = payData[j].date.split('-');
                        if(date == month && arr[2]==i){
                            total += parseFloat(payData[j].money);
                            payData.splice(j,1);
                        }
                    }
                    total = total?total:'0';
                    obj.push(total);
                }console.log(obj);
                return obj;
            },
            getFullWeekData: function (start,end) {
                var obj = [];
                var payData = this.getPayData();
                for(var i=1;i<=7;i++){
                    var total = 0;
                    for(var j=0;j<payData.length;j++){
                        var date = new Date(payData[j].date);
                        var week = date.getDay()==0?7:date.getDay();
                        if(date>=start && date<=end && week==i){
                            total += parseFloat(payData[j].money);
                            payData.splice(j,1);
                        }
                    }
                    total = total?total:'0';
                    obj.push(total);
                }
                console.log(obj)
                return obj;
            }
        }
    })

    .factory('AccountService', function ($http,localService) {
        return {
            savePostBill: function (param_json) {

                return $http.post(API_ADDBILL,{mBank:JSON.stringify(param_json),req:'add_bill'});
            },
            saveBill: function (param_json) {
                localService.saveToLocal(param_json);
            },
            getCategory: function () {
                return localService.getCategory();
            },
            saveCategory: function (param_json) {
                localService.saveCategory(param_json);
            }
        }

    })

    .factory('DetailService', function ($http,localService,$filter) {
        return {
            getPostOneData: function (param_json) {
                return $http.post(API_DETAIL,{mBank:JSON.stringify(param_json),req:'detail'})
            },
            getAllData: function () {
                return $filter('orderBy')(localService.getFromLocal(),'-date');
            },
            getOneMonth: function (month) {
                var objArr = this.getAllData();
                var obj = {
                    nowArr:[],
                    total:{
                        pay:0,
                        income:0
                    }
                };
                for(var i=0;i<objArr.length;i++){
                    if(objArr[i].date.substr(0,7)==month&&!objArr[i].isDelete){
                        obj.nowArr.push(objArr[i]);
                        if(objArr[i].isincome)
                            obj.total.income += parseFloat(objArr[i].money);
                        else
                            obj.total.pay += parseFloat(objArr[i].money);
                    }
                }
                return obj;
            },
            removeOneData: function (item) {
                var allData = localService.getFromLocal();
                for(var i=0;i<allData.length;i++){
                    if(allData[i].bill_id == item.bill_id){
                        allData[i].isDelete = true;
                        break;
                    }
                }
                console.log(allData);
//                allData[allData.indexOf(item)].isDelete = true;
                localService.updateAllData(allData);
                return true;
            }
        }
    })

    .factory('localService', function () {
        return {
            saveToLocal: function (param_josn) {
                var localObj = this.getFromLocal();
                localObj.push(param_josn);
                window.localStorage['mbank'] = JSON.stringify(localObj);
            },
            getFromLocal: function () {
                return JSON.parse(window.localStorage['mbank']);
            },
            getNewData: function () {
                var allData = this.getFromLocal();
                var obj = [];

                for(var i=0;i<allData.length;i++){
                    if(allData[i].isnew){
                        obj.push(allData[i]);
                    }
                }console.log(obj);
                return obj;
            },
            updateNewData: function (arr) {
                var allData = this.getFromLocal();
                console.log(allData.length);
                console.log(arr.length);
                for(var i=0;i<allData.length;i++){
                    for(var j=0;j<arr.length;j++){
                        if(allData[i].bill_id == arr[j]){
                            allData[i].isnew = false;console.log(allData[i]);
                            break;

                        }
                    }
                }
                this.updateAllData(allData);
                return true;
            },
            saveCategory: function (param_josn) {
                var categoryObj = this.getCategory();
                categoryObj.push(param_josn);
                window.localStorage['category'] = JSON.stringify(categoryObj);
            },
            getCategory: function () {
                return JSON.parse(window.localStorage['category']);
            },
            updateAllData: function (param_json) {
                window.localStorage['mbank'] = JSON.stringify(param_json);
            }
        }
    })
