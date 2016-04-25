// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('mBank', ['ionic', 'ngCordova','mBank.controllers', 'mBank.services','mBank.directive','ionic-datepicker'])

    .run(function ($ionicPlatform,$state) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            if(!window.localStorage.hasOwnProperty('mbank')){
                console.log('mbank')
                window.localStorage['mbank'] = '[]';
            }
            if(!window.localStorage.hasOwnProperty('category')){
                console.log('category')
                window.localStorage['category'] = '[]';
            }
            if(!window.localStorage.hasOwnProperty('once')){
                console.log('once');
                window.localStorage['once'] = true;
            }
            if(!window.localStorage.hasOwnProperty('local')){
                window.localStorage['local'] = 'true';
            }
            if(!window.localStorage.hasOwnProperty('theme')){
                window.localStorage['theme'] = 'assertive';
            }
            if(window.localStorage['username']&&window.localStorage['password']){
                $state.go('tab.detail');
                console.log('home')
                return true;
            }else{
                if(window.localStorage['once']=='true'){
                    $state.go('welcome');
//                    localStorage.removeItem ("once")
                }else{
                    $state.go('login');
                }

            }

        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


//        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


        $ionicConfigProvider.tabs.position('bottom');
        $ionicConfigProvider.navBar.alignTitle('center');
        $ionicConfigProvider.platform.isFullScreen = true;
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('bottom');
        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('center');
        $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
        $ionicConfigProvider.platform.ios.views.transition('ios');
        $ionicConfigProvider.platform.android.views.transition('android');
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })

            .state('menu',{
                url:'/menu',
                abstract:true,
                templateUrl:'templates/menu.html'
            })

            //login
            .state('login',{
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })

            .state('welcome',{
                url:'/welcome',
                templateUrl:'templates/welcome.html',
                controller:'WelcomeCtrl'
            })


            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
               cache:false,
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })

            .state('tab.detail', {
                url: '/detail',
               cache:false,
                views: {
                    'tab-detail': {
                        templateUrl: 'templates/tab-detail.html',
                        controller: 'DetailCtrl'
                    }
                }
            })

            .state('tab.accounting', {
                url: '/accounting',
                cache:false,
                views: {
                    'tab-accounting': {
                        templateUrl: 'templates/tab-accounting.html',
                        controller: 'AccountingCtrl'
                    }
                }
            })

            .state('tab.edit_account', {
                url: '/detail/1',
                views: {
                    'tab-detail': {
                        templateUrl: 'templates/tab-accounting.html',
                        controller: 'AccountingCtrl'
                    }
                }
            })
//            .state('tab.chat-detail', {
//                url: '/chats/:chatId',
//                views: {
//                    'tab-chats': {
//                        templateUrl: 'templates/chat-detail.html',
//                        controller: 'ChatDetailCtrl'
//                    }
//                }
//            })

            .state('menu.setting', {
                url: '/setting',
                views:{
                    'menu':{
                        templateUrl: 'templates/tab-my.html',
                        controller: 'SettingCtrl'
                    }
                }
            })

            .state('menu.personalInfo',{
                url:'/personalInfo',
                views:{
                    'menu':{
                        templateUrl: 'templates/personalInfo.html',
                        controller:'PersonalCtrl'
                    }
                }
            })

            .state('menu.edit_pwd',{
                url:'/personalInfo/edit_pwd',
                views:{
                    'menu':{
                        templateUrl: 'templates/edit_pwd.html'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/detail');

    });
var LOCALHOST = 'http://223.202.85.115/';
// var LOCALHOST = 'http://127.0.0.1/';
var API_LOGIN = LOCALHOST+'API/mbank/index.php/login';
var API_REGISTER = LOCALHOST+'API/mbank/index.php/register';
var API_ADDBILL = LOCALHOST+'API/mbank/index.php/addBill';
var API_DETAIL = LOCALHOST+'API/mbank/index.php/list';
var API_SYNC = LOCALHOST+'API/mbank/index.php/sync';
