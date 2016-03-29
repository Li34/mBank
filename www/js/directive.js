angular.module('mBank.directive', [])

    .directive('myCategory', function () {
        return {
            restrict: 'AE',
//            template:'<div class="padding category"><ion-slide-box active-slide="myActiveSlide"><ion-slide><div class="padding"><a class="button button-icon icon ion-ios-baseball" ng-repeat="category in categorys"><span>ww</span></a><a class="button button-icon icon ion-ios-baseball" ><span>ww</span></a><a class="button button-icon icon ion-ios-baseball" ><span>ww</span></a><button class="button icon ion-android-add" ng-click="addCategory()"></button></div></ion-slide></ion-slide-box></div>',
            replace:true,
            scope:true,
            link: function (scope,element,attrs) {
                var parentElement = element.parent();
                element.bind('click', function (e) {
                    parentElement.find('a').removeClass('active');
                    angular.element(this).addClass('active');
                    scope.myBill.category.icon = this.attributes['data-icon'].value;
                    if(this.attributes.hasOwnProperty('data-name'))
                        scope.myBill.category.name = this.attributes['data-name'].value;
                    scope.myBill.category.c_id = this.attributes['data-category'].value;
                    scope.myBill.category_id = this.attributes['data-category'].value;
                    scope.myCategory.icon = this.attributes['data-icon'].value;
                    console.log(scope.myBill.category)
                    console.log(scope.myCategory);
                    console.log(this.attributes)
                })
            }
        }
    })
    .directive('myHeadPic', function () {
        return {
            restrict:'AE',
            replace:true,
            scope:true,
            link: function (scope,element) {
                element.on('click', function (e) {
                    var oDiv = element.parent();
                    e.stopPropagation();
                    element.css('display','none');
                    scope.uploadHead();
//                    oDiv.css({'background':'url('+scope.imageSrc+')','background-size':'100% 100%'});

                    oDiv.on('click',function(){
                        scope.uploadHead();
//                        oDiv.css({'background':'url('+scope.imageSrc+')','background-size':'100% 100%'});
                    })
                })
            }
        }
    })

    .directive('myTable', function ($ionicPopup) {
        return{
            restrict:'AE',
            replace:true,
            scope:{tableObj:"=tableObj",inputObj:"=inputObj"},
            templateUrl:'./templates/myTableTemplate.html',
//            controller: function () {
//                this.myInput = {
//                    titleLabel: '日期',    //Optional
//                    todayLabel: '今天',    //Optional
//                    closeLabel: '关闭',    //Optional
//                    setLabel: '设定',    //Optional
//                    setButtonType : 'button-assertive',  //Optional
//                    todayButtonType : 'button-assertive',  //Optional
//                    closeButtonType : 'button-assertive',  //Optional
//                    inputDate: new Date(),    //Optional
//                    mondayFirst: true,    //Optional
////            disabledDates: disabledDates,    //Optional
////                    weekDaysList: weekDaysList,    //Optional
////                    monthList: monthList,    //Optional
//                    templateType: 'popup', //Optional
//                    modalHeaderColor: 'bar-positive', //Optional
//                    modalFooterColor: 'bar-positive', //Optional
//                    from: new Date(2012, 8, 2),    //Optional
//                    to: new Date(2018, 8, 25),    //Optional
//                    callback: function (val) {    //Mandatory
//                        if (typeof(val) === 'undefined') {
//                            console.log('No date selected');
//                        } else {
//                            if($scope.myBill){
//                                $scope.myBill.date = val;
//                            }
//
//                            console.log('Selected date is : ', val);
//                            this.inputDate = val;
//                        }
//                    }
//                };
//            },
            link: function (scope,element,attrs,accordionController) {
//                element.find('button').on('click', function () {
//                    scope.choiceDate();
//                })
//                console.log(accordionController.myInput)
            }
        }
    })

    .directive('myFold', function () {
        return {
            restrict:'AE',
            replace:true,
            scope:true,
            link: function (scope,element) {
                var tag = 0;
                element.on('click', function () {
                    var dateDiv = element.next();
                    if(!tag){
                        dateDiv.css('display','block');
                        element.removeClass('ion-chevron-down');
                        element.addClass('ion-chevron-up');
                        tag = 1;
                    }else{
                        dateDiv.css('display','none');
                        element.removeClass('ion-chevron-up');
                        element.addClass('ion-chevron-down');
                        tag = 0;
                    }

                });

            }
        }
    })

    .directive('myClick', function () {
        return{
            restrict:'AE',
            replace:true,
            scope:true,
            link: function (scope,element) {
                element.children().on('click',function (e) {
//                    e.stopPropagation();
                    element.children().removeClass('active');
                    angular.element(this).addClass('active');
                });

            }
        }
    })

    .directive('hideTabs', function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                scope.$on('$ionicView.beforeEnter', function() {
                    scope.$watch(attributes.hideTabs, function(value){
                        $rootScope.hideTabs = value;
                    });
                });

                scope.$on('$ionicView.beforeLeave', function() {
                    $rootScope.hideTabs = false;
                });
            }
        };
    })

//    .directive('hideTabs',function($rootScope){
//        return {
//            restrict:'AE',
//            link:function($scope){
//                $rootScope.hideTabs = 'tabs-item-hide';
//                $scope.$on('$destroy',function(){
//                    $rootScope.hideTabs = ' ';
//                })
//            }
//        }
//    }
