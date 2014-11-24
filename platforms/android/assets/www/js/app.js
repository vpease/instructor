// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('control', ['ionic','ngCordova','services','controllers']);

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
                    {name: 'asiste', type: 'integer'}
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
                    {name: 'idEvalua', type: 'integer primary key autoincrement'},
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
                    {name: 'usuario', type: 'text'}
                ]
            }
        ]
    });


app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/login");
    $stateProvider
        .state('login',{
            url: "/login",
            templateUrl:"login.html",
            controller: 'LoginController as login'
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
            controller: 'HoraController as hora'
        })
        .state('acciones',{
            url:"/acciones",
            templateUrl:"acciones.html",
            controller:'AccionesController as acciones'
        })
        .state('asistencia',{
            url:"/asistencia",
            templateUrl:"asistencia.html",
            controller:'AsistenciaController as asiste'
        })
        .state('evaluacion',{
            url:"/evaluacion",
            templateUrl:"evaluacion.html",
            controller:'EvaluaController as eval'
        })
        .state('evalalumno',{
            url:"/evalalumno",
            templateUrl:"evalalumno.html",
            controller:'EvalAlumnoController as evalua'
        })
});
app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});