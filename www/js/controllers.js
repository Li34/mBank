angular.module('mBank.controllers', [])

  .controller('AppCtrl', ['$rootScope', '$state', '$ionicPopup', 'SyncService', 'localService', '$ionicHistory', '$ionicLoading', '$timeout', function ($rootScope, $state, $ionicPopup, SyncService, localService, $ionicHistory, $ionicLoading, $timeout) {
    $rootScope.isLogin = function () {
      if (window.localStorage['username'] && window.localStorage['password']) {
        $state.go('tab.accounting');
        console.log('home')
        return true;
      }
      $state.go('login')
      console.log('login')
//            return false;
    };
    $rootScope.showAlert = function (title, template) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: template
      }).then(function () {
        console.log('ooo')
      })
    };
    $rootScope.showConfirm = function (title, template) {
      var confirmPopup = $ionicPopup.show({
        title: title,
        template: template,
        buttons: [
          {
            text: '取消',
            onTap: function (e) {
              return false;
            }
          },
          {
            text: '确认',
            type: 'button-positive',
            onTap: function (e) {
              return true;
            }
          }
        ]
      });
      return confirmPopup;

    };
    $rootScope.isInArray = function (array, val) {
      for (var i = 0; i < array.length; i++) {
        if (array[i] == val) {
          return true;
        }
      }
      return false;
    };
    $rootScope.loadShow = function () {
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 500
      });
    };
    $rootScope.loadHide = function () {
      $ionicLoading.hide();
    };
    $rootScope.syncData = function () {
      this.loadShow();
//            $timeout(function () {
//                $ionicLoading.hide();
//            }, 2000);
      SyncService.syncData(localService.getNewData())
        .success(function (req) {
          console.log(typeof req);
          localService.updateNewData(req);
          $ionicLoading.hide();
        })
        .error(function (data, status) {
          $ionicLoading.hide();
          $rootScope.showAlert('温馨提示', '<b>同步数据失败,请检查网络!</b>');
          console.log(data);
          console.log(status);
        })
    };
    $rootScope.dateFormat = function (date) {
      var month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
      var day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();

      return date.getFullYear() + '-' + month + '-' + day;
    };
    $rootScope.backPage = function () {
      console.log('back');
//            $ionicHistory.goBack(-1);
      $state.go('tab.detail');
//            $ionicNavBarDelegate.changeTitle('aaa');
      console.log($ionicHistory.viewHistory());
    };
    $rootScope.settings = {
      localStorage: JSON.parse(window.localStorage['local']),
      theme: window.localStorage['theme']
    };

//        $rootScope.showAlert('aa','bbb');
  }])

  //欢迎页
  .controller('WelcomeCtrl', function ($scope, $state, $timeout) {
    $scope.slideHasChanged = function (index) {
      console.log(index)
      if (index == 3) {
        $scope.loadShow();
        window.localStorage['once'] = false;
        $timeout(function () {
          $scope.loadHide();
          $scope.isLogin();
        }, 1000);

      }
    }
  })

  //登录
  .controller('LoginCtrl', ['$rootScope', '$scope', 'LoginService', '$ionicActionSheet', '$ionicSideMenuDelegate', '$cordovaCamera', '$cordovaFileTransfer', '$cordovaFileOpener2', function ($rootScope, $scope, LoginService, $ionicActionSheet, $cordovaCamera, $cordovaFileTransfer, $cordovaFileOpener2) {

    $scope.user = {};
    $scope.isShow = false;
    $scope.error = {
      name: '用户名不能为空',
      pwd: '密码不能为空'
    };
//        $ionicSideMenuDelegate.canDragContent(false);
    $scope.doLogin = function () {

      if (this.user.username != undefined && this.user.password != undefined) {
        LoginService.login(this.user).success(function (rep) {
          if (rep.code == 200) {
            console.log(rep)
            window.localStorage['username'] = rep.data.username;
            window.localStorage['password'] = rep.data.password;
            window.localStorage['user_id'] = rep.data.id;
          } else {
            console.log('login-error');
          }
          console.log('islogin')
          $scope.isLogin();
        }).error(function (data, status) {
          console.log('网络错误');
        })
      }

    };
    $scope.loginByQQ = function () {
      var checkClientIsInstalled = 1;//default is 0,only for iOS
      YCQQ.ssoLogin(function (args) {
        alert(args.access_token);
        alert(args.userid);
      }, function (failReason) {
        alert(failReason);
      }, checkClientIsInstalled);
    };

    $scope.doRegister = function () {

      if (this.isShow) {
        console.log('open-re');

        var win = function (r) {
          console.log(r);
          alert("win");
        };
        var fail = function (error) {
          alert("An error has occurred: Code = " + error.code);
        };
        LoginService.register(this.user, $scope.imageSrc, win, fail);

      }
      if (!this.isShow) {
        this.user = {};
        this.isShow = true;
      }
      console.log(this.user);
    };
    $scope.cancelRegister = function () {
      this.isShow = false;
      this.user = {};
    };
    $scope.uploadHead = function () {
      $ionicActionSheet.show({
        cancelOnStateChange: false,
        cssClass: 'action_s',
        titleText: "请选择获取图片方式",
        buttons: [
          {text: '相机'},
          {text: '图库'}
        ],
        cancelText: '取消',
        cancel: function () {
          return true;
        },
        buttonClicked: function (index) {
          console.log(index);
          switch (index) {
            case 0:
              $scope.takePhoto();
              break;
            case 1:
              $scope.pickImage();
              break;
            default:
              break;
          }
          return true;
        }
      })
    };
    // $scope.imageSrc = './img/ben.png';
    $scope.takePhoto = function () {
//            var options = {
//                quality: 100,
//                allowEdit: true,
//                destinationType: Camera.DestinationType.FILE_URI,//Choose the format of the return value.
//                sourceType: Camera.PictureSourceType.CAMERA,//资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
//                targetWidth: 150,//头像宽度
//                targetHeight: 150//头像高度
//
//            };alert('takephoto');
//            console.log($cordovaCamera);
//            $cordovaCamera.getPicture(options)
//                .then(function (imageURI) {
//                    alert('camera1');
//                    $scope.imageSrc = imageURI;
//                }, function (err) {
//                    // Error
//                    alert('error1')
//                });
      navigator.camera.getPicture(onSuccess, onFail,
        {
          quality: 50,
          allowEdit: true,
          destinationType: Camera.DestinationType.FILE_URI
        });

      function onSuccess(imageURI) {
        var image = document.getElementById('head-pic');
        angular.element(image).css({'background': 'url(' + imageURI + ')', 'background-size': '100% 100%'})
        $scope.imageSrc = imageURI;
      }

      function onFail(message) {
        alert('Failed because: ' + message);
      }
    };
//选择照片
    $scope.pickImage = function () {
//            var options = {
//                quality: 100,
//                destinationType: Camera.DestinationType.FILE_URI,//Choose the format of the return value.
//                sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,//资源类型：CAMERA打开系统照相机；PHOTOLIBRARY打开系统图库
//                targetWidth: 150,//头像宽度
//                targetHeight: 150//头像高度
//            };
//               alert('pic');
//            $cordovaCamera.getPicture(options)
//                .then(function (imageURI) {
//                    alert('camera2')
//                    $scope.imageSrc = imageURI;
//                }, function (err) {
//                    // Error
//                    alert('error2');
//                });

      var cameraPopoverHandle = navigator.camera.getPicture(onSuccess, onFail,
        {
          destinationType: Camera.DestinationType.FILE_URI,
          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
          popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
        });

// Reposition the popover if the orientation changes.
      window.onorientationchange = function () {
        var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
        cameraPopoverHandle.setPosition(cameraPopoverOptions);
      }
      function onSuccess(imageURI) {
        var image = document.getElementById('head-pic');
        angular.element(image).css({'background': 'url(' + imageURI + ')', 'background-size': '100% 100%'})
        $scope.imageSrc = imageURI;
      }

      function onFail(message) {
        alert('Failed because: ' + message);
      }
    };


  }])

  //    .controller('PictureCtrl', function($scope, $cordovaCamera) {
  //
  //        document.addEventListener("deviceready", function () {
  //
  //            var options = {
  //                quality: 50,
  //                destinationType: Camera.DestinationType.DATA_URL,
  //                sourceType: Camera.PictureSourceType.CAMERA,
  //                allowEdit: true,
  //                encodingType: Camera.EncodingType.JPEG,
  //                targetWidth: 100,
  //                targetHeight: 100,
  //                popoverOptions: CameraPopoverOptions,
  //                saveToPhotoAlbum: false,
  //                correctOrientation:true
  //            };
  //
  //            $cordovaCamera.getPicture(options).then(function(imageData) {
  //                var image = document.getElementById('myImage');
  //                image.src = "data:image/jpeg;base64," + imageData;
  //            }, function(err) {
  //                // error
  //            });
  //
  //        }, false);
  //    })

  //    .controller('LoadingCtrl', function ($scope,$ionicLoading) {
  //        $scope.loadShow = function () {
  //            $ionicLoading.show({
  //                template:'Loading...'
  //            });
  //        };
  //        $scope.loadHide = function () {
  //            $ionicLoading.hide();
  //        }
  //    })

  .controller('DatepickerCtrl', function ($scope) {
    var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    var weekDaysList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    $scope.datepickerObject = {
      titleLabel: '日期',    //Optional
      todayLabel: '今天',    //Optional
      closeLabel: '关闭',    //Optional
      setLabel: '设定',    //Optional
      setButtonType: 'button-assertive',  //Optional
      todayButtonType: 'button-assertive',  //Optional
      closeButtonType: 'button-assertive',  //Optional
      inputDate: new Date(),    //Optional
      mondayFirst: true,    //Optional
//            disabledDates: disabledDates,    //Optional
      weekDaysList: weekDaysList,    //Optional
      monthList: monthList,    //Optional
      templateType: 'popup', //Optional
      modalHeaderColor: 'bar-positive', //Optional
      modalFooterColor: 'bar-positive', //Optional
      from: new Date(2012, 8, 2),    //Optional
      to: new Date(2018, 8, 25),    //Optional
      callback: function (val) {    //Mandatory
        if (typeof(val) === 'undefined') {
          console.log('No date selected');
        } else {
          if ($scope.myBill) {
            $scope.myBill.date = val;
          }
          if ($scope.dashDate) {
            $scope.dashDate.from = val;
          }

          console.log('Selected date is : ', val);
          this.inputDate = val;
        }
      }
    };
    $scope.preDay = function () {
      var day = $scope.datepickerObject.inputDate.getDate();
      var month = $scope.datepickerObject.inputDate.getMonth() + 1;
      var year = $scope.datepickerObject.inputDate.getFullYear();

      var DAY_MAX = [1, 3, 5, 7, 8, 10, 12];

      if (--day < 1) {
        if (--month < 1) {
          console.log('year')
          year--;
          month = 12;
        }
        switch (true) {
          case $scope.isInArray(DAY_MAX, month):
            day = 31;
            break;
          case month == 2:
            if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
              day = 29;
            } else {
              day = 28;
            }
            break;
          default :
            day = 30;
        }
      }
      $scope.datepickerObject.inputDate = new Date(year + '-' + month + '-' + day);
    };
    $scope.nextDay = function () {
      var day = $scope.datepickerObject.inputDate.getDate();
      var month = $scope.datepickerObject.inputDate.getMonth() + 1;
      var year = $scope.datepickerObject.inputDate.getFullYear();

      var DAY_MAX = [1, 3, 5, 7, 8, 10, 12];

      switch (true) {
        case $scope.isInArray(DAY_MAX, month):
          if (++day > 31) {
            day = 1;
            if (++month > 12) {
              month = 1;
              year++;
            }
          }
          break;
        case 2:
          if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
            if (++day > 29) {
              day = 1;
              month++;
            }
          } else {
            if (++day > 28) {
              day = 1;
              month++;
            }
          }
          break;
        default :
          if (++day > 30) {
            day = 1;
            month++;
          }
      }
      $scope.datepickerObject.inputDate = new Date(year + '-' + month + '-' + day);
    }

  })
  .controller('DetailCtrl', function ($scope, DetailService, $filter, $ionicScrollDelegate) {
    $scope.detailService = DetailService;

//        DetailService.getPostAllData({'user_id':'3'}).success(function (res) {
//            console.log(res);
//        }).error(function (data,status) {
//            console.log(status);
//        });

    var monthList = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    var weekDaysList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    var temp = 0;
    $scope.datepickerObject = {
      titleLabel: '日期',    //Optional
      todayLabel: '今天',    //Optional
      closeLabel: '关闭',    //Optional
      setLabel: '设定',    //Optional
      setButtonType: 'button-assertive',  //Optional
      todayButtonType: 'button-assertive',  //Optional
      closeButtonType: 'button-assertive',  //Optional
      inputDate: new Date(),    //Optional
      mondayFirst: true,    //Optional
//            disabledDates: disabledDates,    //Optional
      weekDaysList: weekDaysList,    //Optional
      monthList: monthList,    //Optional
      templateType: 'popup', //Optional
      modalHeaderColor: 'bar-positive', //Optional
      modalFooterColor: 'bar-positive', //Optional
      from: new Date(2012, 8, 2),    //Optional
      to: new Date(2018, 8, 25),    //Optional
      callback: function (val) {    //Mandatory
        if (typeof(val) === 'undefined') {
          console.log('No date selected');
        } else {
          //选择展示数据
          updateDetail(val);
          temp = 0;
          console.log('Selected date is : ', val);
          this.inputDate = val;
        }
      }
    };
    var dObj = {};
    if ($scope.settings.localStorage) {
      dObj = DetailService.getOneMonth($filter('date')($scope.datepickerObject.inputDate, 'yyyy-MM'));
      $scope.tableObj = {
        middleLabel: '总收入',
        rightLabel: '总支出',
        inComeTotal: dObj.total.income,
        payTotal: dObj.total.pay
      };
      //默认当前月的数据
      $scope.items = dObj.nowArr;
    } else {
      var param = {};
      param.month = $filter('date')($scope.datepickerObject.inputDate, 'yyyy-MM');
      DetailService.getPostOneData(param)
        .success(function (req) {
          dObj = req;
          $scope.tableObj = {
            middleLabel: '总收入',
            rightLabel: '总支出',
            inComeTotal: dObj.total.income,
            payTotal: dObj.total.pay
          };
          //默认当前月的数据
          $scope.items = dObj.nowArr;
        })
        .error(function (req, status) {
          console.log(status);
        });
//            dObj = DetailService.getOneMonth($filter('date')($scope.datepickerObject.inputDate,'yyyy-MM'));
    }
//        $scope.tableObj = {
//            middleLabel:'总收入',
//            rightLabel:'总支出',
//            inComeTotal:dObj.total.income,
//            payTotal:dObj.total.pay
//        };
//        //默认当前月的数据
//        $scope.items = dObj.nowArr;

    $scope.isActive = function (e, index) {
      if (e.date == $filter('date')($scope.datepickerObject.inputDate, 'yyyy-MM-dd')) {
        if (!temp) {
          temp = index;
          $ionicScrollDelegate.scrollTo(0, 53 * (temp - 1), true);
        }
        return true;
      } else {
        if (!temp)$ionicScrollDelegate.scrollTo(0, 0, false);
        return false;
      }
    };
    $scope.choiceMonth = function (e) {
      return $filter('date')($scope.datepickerObject.inputDate, 'yyyy-MM') == e.date.substr(0, 7);
    };
    $scope.editBill = function (item) {

    };
    $scope.removeBill = function (item) {
      $scope.showConfirm('温馨提示', '确认删除该条数据？').then(function (res) {
        if (res) {
          DetailService.removeOneData(item);
          $scope.items.splice($scope.items.indexOf(item), 1);
        }

      });
    };
    function updateDetail(val) {
      if ($scope.settings.localStorage) {
        var obj = DetailService.getOneMonth($filter('date')(val, 'yyyy-MM'));
      } else {
        var param = {};
        param.month = $filter('date')($scope.datepickerObject.inputDate, 'yyyy-MM');
        DetailService.getPostOneData(param)
          .success(function (req) {
            console.log(req);
          })
          .error(function (req, status) {
            console.log(status);
          });
        var obj = DetailService.getOneMonth($filter('date')(val, 'yyyy-MM'));
      }
      $scope.items = obj.nowArr;
      $scope.tableObj.inComeTotal = obj.total.income;
      $scope.tableObj.payTotal = obj.total.pay;
      console.log('update')
    }

  })

  .controller('DashCtrl', function ($scope, DashService, $ionicSideMenuDelegate) {
    require.config({
      paths: {
        echarts: './js/dist'
      }
    });
    $ionicSideMenuDelegate.canDragContent(true);
    $scope.dashDate = {
      from: new Date(),
      to: new Date()
    };
    $scope.isShowDate = false;
    $scope.changeNum = 0;
    $scope.drawLine = function (obj, label) {
      require(
        [
          'echarts',
          'echarts/chart/line'
        ],
        function (ec) {
          var myChart = ec.init(document.getElementById('main'));
          var option = {
//                        backgroundColor:'red',
            tooltip: {
              trigger: 'axis'
            },
//                        calculable: false,
            grid: {
              x: 45,
              y: 20,
              width: 270,
              height: 210
            },
            xAxis: [
              {
                type: 'category',
//                                name:'月份',
//                                nameLocation:'start',
                boundaryGap: false,
                data: label
              }
            ],
            yAxis: [
              {
                type: 'value',
                name: '消费（￥）',
                show: true,
                axisLabel: {
//                                    rotate:45,
//                                    formatter:'{value}'+'$'
                }
              }
            ],
            series: [
              {
                name: '支出',
                type: 'line',
                stack: 'TARGET',
                symbol: 'circle',
                smooth: true,
                data: obj,
                itemStyle: {normal: {color: 'rgb(246,179,69)'}}
              }
            ]
          };


          myChart.setOption(option);
        }
      )
    };
    $scope.changeData = function (index) {
      var obj = [];
      var label = [];
      var now = new Date();
      var year = now.getFullYear();
      var month = now.getMonth() + 1 >= 10 ? now.getMonth() + 1 : '0' + (now.getMonth() + 1);
      var day = now.getDate();
      var week = now.getDay() == 0 ? 7 : now.getDay();
      var start = day - (week - 1);
      var start_week = new Date($scope.dateFormat(new Date(now.setDate(start))));
      var end_week = new Date($scope.dateFormat(new Date(now.setDate(start + 6))));
      for (var i = start; i <= start + 6; i++) {
        var date = $scope.dateFormat(new Date(new Date().setDate(i))).substr(5, 5);
        label.push(date);
      }
      switch (index) {
        case 0:
          obj = DashService.getFullYearData(year);
          label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          this.drawLine(obj, label);
          break;
        case 1:
          obj = DashService.getFullMonthData(year + '-' + month);
          label = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
          this.drawLine(obj, label);
          break;
        case 2:
          obj = DashService.getFullWeekData(start_week, end_week);
//        label = ['周一','周二','周三','周四','周五','周六','周日'];
          label = label;
          this.drawLine(obj, label);
          break;
        case 3:
          obj = DashService.getPayData();
          this.drawPie(obj);
          break;
        case 4:
          obj = DashService.getPayData();
          this.drawPie(obj);
          break;
        case 5:
          obj = DashService.getPayData();
          this.drawPie(obj);
          break;
        case 6:
          obj = DashService.getPayData();
          if ($scope.changeNum == 0) {
            $scope.changeNum = 3;
            this.drawPie(obj);
          } else {
            $scope.changeNum = 0;
            obj = DashService.getFullYearData(year);
            label = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            this.drawLine(obj, label);
          }
          break;
      }

    };
    $scope.changeData(0);

    $scope.drawPie = function (obj) {
      var data = [], category = [];
      for (var i = 0; i < obj.length; i++) {
        var temp = {};
        temp.value = obj[i].money;
        temp.name = obj[i].category.name;

        var tag = category.indexOf(obj[i].category.name);
        if (tag == -1) {
          category.push(obj[i].category.name)
          data.push(temp);
        } else {
          data[tag].value = parseFloat(data[tag].value) + parseFloat(temp.value)
        }
      }
      require(
        [
          'echarts',
          'echarts/chart/pie'
        ],
        function (ec) {
          var myChart = ec.init(document.getElementById('main'));
          var option = {
            calculable: false,
            series: [
              {
                type: 'pie',
                selectedMode: 'single',
                radius: ['50%', '90%'],
                itemStyle: {
                  normal: {
                    label: {
                      position: 'inner',
                      formatter: function (params) {
//                                                return params.value+ '%';
                        return params.percent + '%';
                      },
                      textStyle: {
                        baseline: 'top'
                      },
                      show: true
                    },
                    labelLine: {
                      show: false
                    }
                  },
                  emphasis: {
                    label: {
                      show: true,
                      position: 'center',
                      textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                      }
                    }
                  }
                },

                data: data
              }
            ]
          };


          // 为echarts对象加载数据
          myChart.setOption(option);

          //listen on pie chart
          var ecConfig = require('echarts/config');

          myChart.on(ecConfig.EVENT.PIE_SELECTED, function (param) {
            var selected = param.selected;
            console.log(param);
            console.log(this)
            var serie;
            for (var idx in selected) {
              serie = option.series[idx];
              for (var i = 0, l = serie.data.length; i < l; i++) {
                // if (selected[idx][i]) {
                //   console.log(serie.name);
                //   console.log(serie.data[i].id);
                //   var id = serie.data[i].id;
                //   var tdb = serie.data[i].tdb;
                //   //change table background when you click pie
                //   $('.' + id).parent().addClass(tdb);
                // } else {
                //   $('.' + serie.data[i].id).parent().removeClass();
                // }
              }
            }
          });
        })
    };
  })

  .controller('AccountingCtrl', function ($scope, AccountService, $ionicPopup, $state) {
    var date = new Date();

    $scope.myActiveSlide = 0;
    $scope.categorys = AccountService.getCategory();
    $scope.myBill = {
      bill_id: '',
      user_id: '',
      isincome: false,
      money: 0,
      date: date,
      category: {},
      remark: '',
      isdelete: false,
      isupdate: false,
      isnew: true
    };
    $scope.clearInput = function () {
      if (this.myBill.money === 0) {
        this.myBill.money = '';
      }
    };
    $scope.payBtn = function () {
      if ($scope.myBill.isincome) $scope.myBill.isincome = !$scope.myBill.isincome;
      console.log($scope.myBill.isincome)
    };
    $scope.incomeBtn = function () {
      if (!$scope.myBill.isincome) $scope.myBill.isincome = !$scope.myBill.isincome;
      console.log($scope.myBill.isincome)
    };
//        $scope.activeClass = "{active:"+$scope.myBill.isIncome+"}";
    $scope.myCategory = {};
    $scope.addCategory = function () {
      $scope.myCategory = {};
      var myCategory = $ionicPopup.show({
        templateUrl: './templates/categoryTemplate.html',
        title: '添加分类',
        scope: $scope,
        buttons: [
          {text: '关闭', type: 'button-assertive'},
          {
            text: '<b>确认</b>',
            type: 'button-assertive',
            onTap: function (e) {
              if (!$scope.myCategory.name || !$scope.myCategory.icon) {
                $scope.showAlert('温馨提示', '请正确填写')
                e.preventDefault();
              } else {
                return $scope.myCategory.name;
              }
            }
          }
        ]
      }).then(function (res) {
        $scope.myCategory.name = res;
        $scope.myCategory.c_id = make_uuid(16, 8);
        if ($scope.myCategory.name && $scope.myCategory.icon)
          AccountService.saveCategory($scope.myCategory);

        $scope.categorys = AccountService.getCategory();
      })
    };

    $scope.saveData = function () {
      var param = {};
      for (var i in this.myBill) {
        if (this.myBill.hasOwnProperty(i)) {
          console.log(this.myBill[i])
          param[i] = this.myBill[i];
        }
      }
      param.date = this.dateFormat(param.date);
      param.bill_id = make_uuid(16, 16);
      param.user_id = window.localStorage['user_id'];
      console.log(param)
      if (!param.money) {
        $scope.showAlert('温馨提示', '<b>请填写金额！</b>');
      } else if (!param.category.name) {
        $scope.showAlert('温馨提示', '<b>请选择分类！</b>');
      } else {
        if ($scope.settings.localStorage) {
          AccountService.saveBill(param);
        } else {
          AccountService.savePostBill(param)
            .success(function (rep) {
              console.log(rep);
            })
            .error(function (rep, status) {
              console.log(status);
            })
        }
        return true;
      }

//            AccountService.savePost(param).success(function(res){
//                console.log(res);
//            }).error(function(data,status){
//                console.log(status);
//            });
    };
    $scope.saveDone = function () {
      var result = this.saveData();
      if (result) {
        $state.go('tab.detail');
      }
    };
    $scope.cancelData = function () {
      console.log('cancel');
      $scope.myBill = {
        isincome: false,
        money: 0,
        date: date,
        category: {},
        remark: '',
        isdelete: false,
        isupdate: false,
        isnew: true
      };
    };
    $scope.againDone = function () {
      this.saveData();
      $scope.myBill = {
        isincome: false,
        money: 0,
        date: date,
        category: {},
        remark: '',
        isdelete: false,
        isupdate: false,
        isnew: true
      };
    };

    $scope.dateFormat = function (date) {
      var month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
      var day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate();

      return date.getFullYear() + '-' + month + '-' + day;
    }

  })

  .controller('SettingCtrl', function ($scope, $rootScope, $ionicPopover) {
//        $scope.settings.localStorage = window.localStorage['localStorage'];
    $scope.quit = function () {
      window.localStorage['username'] = '';
      window.localStorage['password'] = '';
      $scope.isLogin();
    };
//        $scope.popover = $ionicPopover.fromTemplateUrl('my-popover.html', {
//            scope: $scope
//        });
    $ionicPopover.fromTemplateUrl('my-popover.html', {
      scope: $scope
    }).then(function (popover) {
      $scope.popover = popover;
    });
    $scope.changeTheme = function ($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function () {
      $scope.popover.hide();
    };
    // 清除浮动框
    $scope.$on('$destroy', function () {
      $scope.popover.remove();
    });
    // 在隐藏浮动框后执行
    $scope.$on('popover.hidden', function () {
      // 执行代码
      window.localStorage['theme'] = $scope.settings.theme;
      window.location.reload();
    });
    // 移除浮动框后执行
    $scope.$on('popover.removed', function () {
      // 执行代码
    });
    $scope.themeList = [
      {text: "默认", value: 'assertive'},
      {text: "黑", value: 'dark'},
      {text: "绿", value: 'balanced'}
    ];
    $scope.changeLocal = function () {
      window.localStorage['local'] = $scope.settings.localStorage;
    }

  })

  .controller('PersonalCtrl', function ($scope) {
    $scope.personalInfo = {
      username: 'admin',
      email: 'admin@admin.com',
      phone: 13145311,
      address: 'STR to 22'
    }
  })
