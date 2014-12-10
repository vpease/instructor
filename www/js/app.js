// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('control', ['ionic','ngCordova','services','controllers','pickadate']);

app.constant('DB_CONFIG', {
    name: 'PBoca',
        tables: [
            {
                name: 'horario',
                columns: [
                    {name: 'idHorario', type: 'integer primary key'},
                    {name: 'nombre', type: 'text'},
                    {name: 'cancha', type: 'text'}
                ]
            },
            {
                name: 'alumno',
                columns: [
                    {name: 'idJugador', type: 'integer primary key'},
                    {name: 'idHorario', type: 'integer'},
                    {name: 'idInscripcion', type: 'integer'},
                    {name: 'nombre', type: 'text'},
                    {name: 'asiste', type: 'integer'},
                    {name: 'deuda', type: 'integer'}
                ]
            },
            {
                name: 'valor',
                columns: [
                    {name: 'idValorhorario', type: 'integer primary key'},
                    {name: 'idValor', type: 'integer'},
                    {name: 'idHorario', type: 'integer'},
                    {name: 'nombre', type: 'text'}
                ]
            },
            {
                name: 'evaluacion',
                columns: [
                    {name: 'idEvalua', type: 'integer primary key'},
                    {name: 'idHorario', type: 'integer'},
                    {name: 'idValorhorario', type: 'integer'},
                    {name: 'idInscripcion', type: 'integer'},
                    {name: 'res', type: 'integer'},
                    {name: 'nombre', type: 'text'}
                ]
            },
            {
                name: 'sync',
                columns: [
                    {name: 'syncdate', type: 'text primary key'},
                    {name: 'usuario', type: 'text'},
                    {name: 'pass', type: 'text'}
                ]
            }
        ]
    });
app.filter('getById',function(){
    return function(input,id){
        var i= 0,len=input.length;
        for(;i<len;i++){
            if(+input[i].idValorhorario== +id){
                return input[i];
            }
        }
        return null;
    }
});
app.config(function($httpProvider){
    $httpProvider.interceptors.push(function($rootScope){
        return {
            request: function(config){
                if (config.url.substring(0,1) == 'h') {
                    $rootScope.$broadcast('loading:show');
                    console.log('request interceptado:' + config.method + '/' + config.url);
                }
                console.log(config.url.substring(0,1)+'request :' + config.method + '/' + config.url);
                return config;
            },
            response: function(response){
                $rootScope.$broadcast('loading:hide');
                console.log('Response recibido para: ');
                return response;
            }
        }
    })
});

app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/splash");
    $stateProvider
        .state('splash',{
            url: "/splash",
            templateUrl:'splash.html'
        })
        .state('login',{
            url: "/login",
            templateUrl:"login.html",
            controller: 'LoginController as login',
            resolve: {
                creds: function(Consultas){
                    return Consultas.getSynced();
                }
            }
        })
        .state('date',{
            url: "/date",
            templateUrl:"date.html",
            controller: 'DateController as date'
        })
        .state('data',{
            url: "/data",
            templateUrl:"data.html",
            controller: 'DataController as data'
        })
        .state('horarios',{
            url: "/horarios",
            templateUrl:"horarios.html",
            controller: 'HoraController as hora',
            resolve:{
                horas: function(Consultas){
                    return Consultas.getHorarios1();
                }
            }
        })
        .state('acciones',{
            url:"/acciones",
            templateUrl:"acciones.html",
            controller:'AccionesController as acciones'
        })
        .state('asistencia',{
            url:"/asistencia/:idHora",
            templateUrl:"asistencia.html",
            controller:'AsistenciaController as asiste',
            resolve: {
                alumnos: function($stateParams,Consultas){
                    return Consultas.getAlumnos1($stateParams.idHora)
                }
            }
        })
        .state('evaluacion',{
            url:"/evaluacion/:idHora",
            templateUrl:"evaluacion.html",
            controller:'EvaluaController as eval',
            resolve:{
                alumnos: function($stateParams,Consultas){
                    return Consultas.getAlumnos1($stateParams.idHora)
                }
            }
        })
        .state('evalalumno',{
            url:"/evalalumno/:idHora/:idIns",
            templateUrl:"evalalumno.html",
            controller:'EvalAlumnoController as evalua',
            resolve:{
                vals: function($stateParams,Consultas){
                    return Consultas.getValores($stateParams.idHora)
                },
                evals: function($stateParams,Consultas){
                    return Consultas.getEvaluacion($stateParams.idIns)
                }
            }
        })
});
app.run(function($ionicPlatform,$location,$rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
      console.log('Cordova is ready!!!');
      $location.path('/login');
      $rootScope.$apply();
  });
});
app.run(function($rootScope,$ionicLoading){
    $rootScope.$on('loading:show',function(){
        $ionicLoading.show({template: '<p> Conversando con servidores</p>'});
    });
    $rootScope.$on('loading:hide',function(){
        $ionicLoading.hide();
        console.log('Ocultando fantasmas');
    })
})