// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('control', ['ionic','ngCordova']);

app.controller('LoginController',
    ['estadoFactory',
        function(estadoFactory){
            this.usuario= {
                user: '',
                pass: ''
            }
            this.checkUser = function (){
                var res = estadoFactory.login2(this.usuario.user, this.usuario.pass);
            }
        }])

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
                    {name: 'idEvalua', type: 'integer primary key'},
                    {name: 'idValorhorario', type: 'integer'},
                    {name: 'idInscripcion', type: 'integer'},
                    {name: 'res', type: 'integer'},
                    {name: 'nombre', type: 'text'}
                ]
            },
            {
                name: 'sync',
                columns: [
                    {name: 'syncdate', type: 'text primary key'}
                ]
            }
        ]
    });

app.controller('HoraController',
    ['$scope',
        'estadoFactory',
        function($scope,estadoFactory){
            this.irInicio = function(){
                estadoFactory.irInicio();
            };
            this.fecha = estadoFactory.getFecha();
            this.usuario = estadoFactory.getUser();
            $scope.horarios = [];
            estadoFactory.getHorarios().then(function(horarios){
                $scope.horarios = horarios;
            });
            this.getFecha = function(){
                return this.fecha;
            };
            this.getUsuario = function(){
                return this.usuario;
            };
            this.checkData = function(){
                return estadoFactory.checkData();
            };
            this.checkDataToSend = function(){
                return estadoFactory.checkDataToSend();
            };
            this.select = function(idHorario,nombre,cancha){
                estadoFactory.selectHorario(idHorario,nombre,cancha);
            };
        }])
app.controller('DataController',
    ['$scope',
        '$ionicPlatform',
        '$ionicActionSheet',
        'estadoFactory',
        function($scope,$ionicPlatform,$ionicActionSheet,estadoFactory){
            this.fecha = estadoFactory.getFecha();
            this.usuario = estadoFactory.getUser();
            this.showMenu = function() {
                console.log('Voy a mostrar el menu oculto');
                $ionicActionSheet.show({
                    titleText: 'Boca Juniors Perú',
                    buttons:[
                        {text: 'Salir'},
                        {text: 'Cancelar'}
                    ],
                    buttonClicked: function (index){
                        if (index==0) estadoFactory.salir();
                        else if (index==1);
                    }
                });
            };
            this.salir = function(){
                estadoFactory.salir();
            };
            this.getFecha = function(){
                return this.fecha;
            };
            this.getUsuario = function(){
                return this.usuario;
            };
            this.opciones = function(){
                this.showMenu();
            };
            this.checkData = function(){
                return estadoFactory.checkData();
            };
            this.checkDataToSend = function(){
                return estadoFactory.checkDataToSend();
            };
            this.descargar = function(){
                estadoFactory.getdata();
                console.log('Db creada');
            };
            this.irInicio = function(){
                estadoFactory.irInicio();
            };
        }])
app.controller('AccionesController',
    ['$scope',
        'estadoFactory',
        function($scope,estadoFactory){
            this.horario = estadoFactory.getHorario();
            this.getHorario = function(){
                //return this.horario;
            };
            this.irAsistencia = function(){
                estadoFactory.irAsistencia();
            };
            this.irEvaluacion = function(){
                estadoFactory.irEvaluacion();
            };
            this.checkEvaluacion = function(){
                return estadoFactory.checkEvaluacion();
            };
        }])
app.controller('AsistenciaController',
    ['$scope',
        'estadoFactory',
        function($scope,estadoFactory){
            this.horario = estadoFactory.getHorario();
            $scope.alumnos = [];
            estadoFactory.getAlumnos(this.horario.idHorario)
                .then(function(alumnos){
                    var res = alumnos;
                    $scope.alumnos = res;
                });
            this.fecha = estadoFactory.getFecha();
            this.getFecha = function(){
                return this.fecha;
            };
            this.updAsiste = function(index){
                var temp = $scope.alumnos[index];
                var asiste;
                if (temp.asiste) asiste=1;
                else asiste=0;
                estadoFactory.updAsiste(temp.idJugador,this.horario.idHorario,asiste);
            };
        }])
app.controller('EvaluaController',['$scope',
    'estadoFactory',
    function($scope,estadoFactory){
        this.horario = estadoFactory.getHorario();
        $scope.alumnos = [];
        estadoFactory.getAlumnos(this.horario.idHorario)
            .then(function(alumnos){
                var res = alumnos;
                $scope.alumnos = res;
            });
        this.Evaluar = function (idJugador,nombre,idInscripcion){
            estadoFactory.Evaluar(idJugador,nombre,idInscripcion,this.horario.idHorario);
        };
}])
app.controller('EvalAlumnoController',['$scope',
    'estadoFactory',
    function($scope,estadoFactory){
        this.horario = estadoFactory.getHorario();
        this.notas = estadoFactory.getNotas();
        $scope.valores = [];
        estadoFactory.getValores(this.horario.idHorario)
            .then(function(valores){
                var res = valores;
                $scope.valores = res;
            });
    }])
app.config(function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/login");
    $stateProvider
        .state('login',{
            url: "/login",
            templateUrl:"login.html",
            controller: 'LoginController as login'
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
})
app.factory('estadoFactory',
    ['$http',
        '$state',
        'Consultas',
        function($http,$state,Consultas){
    var self = this;
    self.db = null;
    var cambiarUser = false;
    var credenciales = {
        user: '',
        pass: ''
    }
    var local = {
        idLocal:'',
        nombre: ''
    };
    var usuario = {
        idInstructor:'',
        idOperador: '',
        nombre: '',
        user: '',
        idLocal:'',
        pass:''
    };
    var horario = {
        idHorario: '',
        nombre:'',
        cancha: ''
    };
    var valores = {
        idValor:'',
        nombre:''
    };
    var alumno = {
        idJugador:'',
        nombre:'',
        idInscripcion:'',
        asiste:''
    };
    var dataOk = false;
    var dataToSend = false;
    var dataOkEvaluacion = false;
    var fecha='';
    var factory = {};
    var valido=false;
    var server ='http://app.bocajuniors.com.pe/bocarest/index.php';
    //var server ='http://192.168.1.100/bocarest'

    factory.irInicio = function(){
        $state.go('data');
    };

    factory.selectHorario = function(idHorario,nombre,cancha){
        horario.idHorario = idHorario;
        horario.nombre = nombre;
        horario.cancha = cancha;
        $state.go('acciones');
    };
    factory.getHorario = function(){
        return horario;
    };
    factory.salir = function(){
        Consultas.deleteAll();
        credenciales.user = '';
        credenciales.pass = '';
        $state.go('login');
    };
    factory.checkData = function(){
        return dataOk;
    };
    factory.checkDataToSend= function(){
        return dataToSend;
    }
    factory.checkEvaluacion = function(){
        return dataOkEvaluacion;
    };
    factory.getUser = function () {
        return usuario;
    }
    factory.getidLocal = function() {
        return local.idLocal;
    };
    factory.getFecha = function(){
        return fecha;
    };
    factory.getValid = function(){
        return valido;
    };
    factory.irInicio = function(){
        $state.go('horarios');
    };
    factory.irAsistencia = function(){
        dataToSend = true;
        dataOkEvaluacion = true;
        $state.go('asistencia');
    };
    factory.irEvaluacion = function() {
        $state.go('evaluacion');
    };
    factory.Evaluar = function(idJugador,nombre,idInscripcion,idHorario){
        $state.go('evalalumno');
    };
    factory.login2 = function(puser,ppass){
        var res='';
        var url=server+'/usuario/instructor.json';
        if (credenciales.user == puser){
            if (credenciales.pass == ppass){
                console.log('usuario conocido, que pase');
                Consultas.init();
                res = true;
                $state.go('data');
            }
            else {
                alert('Usuario inválido: '+ puser + '/'+ ppass +'vs:'+ credenciales.user +'/'+ credenciales.pass);
            };
        }
        else
        {
            $http({url: url,
                method: "GET",
                params: {usuario: puser, clave: ppass}})
                .success(function (data) {
                    console.log('Ya llamé a instructor.json');
                    res = data;
                    valido = true;
                    if (res !== '"NO"' && res.length > 0 && res !== '0') {
                        var result = res.substr(1, res.length - 2).split(":");
                        usuario = {
                            idInstructor: '',
                            idOperador: '',
                            nombre: '',
                            user: '',
                            idLocal: '',
                            pass: ''
                        };
                        usuario.idInstructor = result[0];
                        usuario.idOperador = result[1];
                        usuario.user = result[2];
                        usuario.nombre = result[3];
                        fecha = result[4];
                        usuario.idLocal = result[5];
                        console.log('voy a comparar si hay cambio de usuario');
                        if (credenciales.user != puser) {
                            console.log('Si hay cambiod de usuario');
                            cambiarUser = true
                            credenciales = {
                                user: puser,
                                pass: ppass
                            };
                            Consultas.deleteAll();
                            console.log('Ya mandé a borrar todo');
                        }
                        else {
                            console.log('No hay cambio de usuario');
                            cambiarUser = false;
                        }
                        Consultas.init();
                        console.log('Ya llame a init y ahora voy por getsynced');
                        Consultas.getSynced()
                            .then(function (result) {
                                var res = false;
                                console.log('getSynced ya se ejecutó');
                                if (result.length > 0)
                                    res = true;
                                else
                                    res = false;
                                dataOk = res;
                                $state.go('data');
                            });
                    }
                    else {
                        alert('Usuario inválido');
                    };
                });
        };
        return res;
    };
    factory.login = function(puser,ppass){
        var res='';
        var url=server+'/usuario/instructor.json';
        $http({url:url,
            method:"GET",
            params:{usuario:puser, clave: ppass}})
            .success(function(data){
                console.log('Ya llamé a instructor.json');
                res = data;
                valido = true;
                if (res !== '"NO"' && res.length > 0 && res!=='0') {
                    var result = res.substr(1,res.length-2).split(":");
                    usuario = {
                        idInstructor:'',
                        idOperador: '',
                        nombre: '',
                        user: '',
                        idLocal:''
                    };
                    usuario.idInstructor = result[0];
                    usuario.idOperador = result[1];
                    usuario.user = result[2];
                    usuario.nombre = result[3];
                    fecha = result[4];
                    usuario.idLocal = result[5];
                    console.log('voy a comparar si hay cambio de usuario');
                    if (credenciales.user != puser)
                    {
                        console.log('Si hay cambiod de usuario');
                        cambiarUser = true
                        credenciales = {
                            user: puser,
                            pass: ppass
                        };
                        Consultas.deleteAll();
                        console.log('Ya mandé a borrar todo');
                    }
                    else {
                        console.log('No hay cambio de usuario');
                        cambiarUser = false;
                    }
                    Consultas.init();
                    console.log('Ya llame a init y ahora voy por getsynced');
                    Consultas.getSynced()
                        .then(function(result){
                            var res = false;
                            console.log('getSynced ya se ejecutó');
                            if (result.length>0) res = true;
                            else res = false;
                            dataOk = res;
                            $state.go('data');
                        });
                }
                else {
                    alert('Usuario inválido');
                };
            });
        return res;
    };
    factory.getdata = function(){
        var res='';
        var url=server+'/usuario/tablas.json';
        $http({url:url,
            method:"GET",
            params:{idInstructor:usuario.idInstructor, idLocal: usuario.idLocal}})
            .success(function(data){
                var horarios = data.Horarios;
                var alumnos = data.Alumnos;
                var valores = data.Valores;
                angular.forEach(horarios,function(horario) {
                    console.log('insertando: ' + horario.idHorario);
                    Consultas.insHorario(
                        horario.idHorario,
                        horario.nombre,
                        horario.cancha);
                });
                angular.forEach(alumnos,function(alumno) {
                    console.log('insertando: ' + alumno.idJugador);
                    Consultas.insAlumnos(
                        alumno.idJugador,
                        alumno.idHorario,
                        alumno.idInscripcion,
                        alumno.nombre);
                });
                angular.forEach(valores,function(valor) {
                    console.log('insertando: ' + valor.idValor);
                    Consultas.insValores(
                        valor.idValorHorario,
                        valor.idValor,
                        valor.idHorario,
                        valor.nombreValor);
                });
                console.log('Ya termine de insertar datos remotos');
                Consultas.insSync()
                    .then(function(result){
                        dataOk = true;
                        dataToSend = true;
                        $state.go('horarios');
                    });
            })
            .error(function(data){
                dataOk = false;
            });
        return res;
    };
    factory.dbInit = function() {
        Consultas.init()
            .then(function(result){
                Consultas.getSynced()
                    .then(function(result){
                        var res = false;
                        if (result.length()>0) res = true;
                        else res = false;
                        dataOk = res;
                        $state.go('data');
                    });
            });
    };
    factory.query = function(query, bindings){
        return Consultas.query(query,bindings);
    };
    factory.fetchAll = function(result) {
        return Consultas.fetchAll(result);
    };
    factory.fetch = function(result) {
        return Consultas.fetch(result);
    };
    factory.getHorarios = function(){
        return Consultas.getHorarios();
    };
    factory.getAlumnos= function(idHorario){
        return Consultas.getAlumnos(idHorario);
    };
    factory.getValores = function(idHorario){
        return Consultas.getValores(idHorario);
    };
    factory.getNotas = function (){
        var res = Consultas.getNotas();
        return res;
    };
    factory.insAsistencia = function(idHorario,idJugador,nombre) {
        var res = Consulta.insAsistencia(
            idHorario,
            idJugador,
            nombre);
        if (res) dataToSend = true;
    };
    factory.insEvaluacion = function(idValorHorario,idJugador,res,nombre) {
        var res = Consulta.insEvaluacion(
            idValorHorario,
            idJugador,
            res,
            nombre);
        if (res) dataToSend = true;
    };
    factory.updAsiste = function(idJugador,idHorario,asiste){
        return Consultas.updAsiste(idJugador,idHorario,asiste);
    };
    return factory;
}])
app.factory('DB',function($q, DB_CONFIG) {
    var self = this;
    self.db = null;
    self.init = function() {
        if (window.sqlitePlugin !== undefined){
            self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name});
        } else {
            self.db = window.openDatabase(DB_CONFIG.name,"1.0",DB_CONFIG,-1);
        };

            angular.forEach(DB_CONFIG.tables, function(table) {
                var columns = [];
                angular.forEach(table.columns, function(column) {
                    columns.push(column.name + ' ' + column.type);
                });
                var query = 'CREATE TABLE IF NOT EXISTS ' + table.name + ' (' + columns.join(',') + ')';
                self.query(query);
                console.log('Table ' + table.name + ' initialized');
            });
        console.log('Terminó el Init de la base de datos');
        };

        self.query = function(query, bindings) {
            bindings = typeof bindings !== 'undefined' ? bindings : [];
            var deferred = $q.defer();

            self.db.transaction(function(transaction) {
                transaction.executeSql(query, bindings, function(transaction, result) {
                    deferred.resolve(result);
                }, function(transaction, error) {
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        };

        self.fetchAll = function(result) {
            var output = [];
            for (var i = 0; i < result.rows.length; i++) {
                var temp = angular.copy(result.rows.item(i));
                output.push(temp);
            }
            return output;
        };

        self.fetch = function(result) {
            return result.rows.item(0);
        };

        return self;
    })

app.factory('Consultas', function(DB) {
    var self = this;
    self.init= function(){
        DB.init();
    };
    self.deleteAll = function(){
        if (DB.db) {
            DB.db.transaction(function(tx){
                tx.executeSql('drop table asistencia',
                    [],
                    function(tx,res){
                        console.log('asistencia borrado');
                },
                    function(tx,error){
                        console.log('Error en asistencia:'+error.toString());
                    });
                tx.executeSql('drop table horario',
                    [],
                    function(tx,res){
                        console.log('horario borrado');
                },
                    function(tx,error){
                        console.log('Error en horario:'+error.toString());
                    });
                tx.executeSql('drop table alumno',
                    [],
                    function(tx,res){
                        console.log('alumno borrado');
                },
                    function(tx,error){
                        console.log('Error en alumno:'+error.toString());
                    });
                tx.executeSql('drop table valor',
                    [],
                    function(tx,res){
                        console.log('valor borrado');
                },
                    function(tx,error){
                        console.log('Error en valor:'+error.toString());
                    });
                tx.executeSql('drop table evaluacion',
                    [],
                    function(tx,res){
                        console.log('evaluacion borrado');
                },
                    function(tx,error){
                        console.log('Error en evaluacion:'+error.toString());
                    });
                tx.executeSql('drop table sync',
                    [],
                    function(tx,res){
                        console.log('sync borrado');
                },
                    function(tx,error){
                        console.log('Error en sync:'+error.toString());
                    });
            });
            console.log('Todos los datos borrados');
        };
    };
    self.getAsistencias = function(){
        return DB.query('select * from asistencia')
            .then(function(result){
                return DB.fetchAll(result);
            });
    };
    self.getHorarios = function() {
        return DB.query('select idHorario,nombre,cancha FROM horario')
            .then(function(result){
                console.log('Horarios ok');
                var res = DB.fetchAll(result);
                return res;
            });
    };
    self.getAlumnos = function(idHorario) {
        return DB.query('select idJugador,idInscripcion,nombre,asiste from alumno where idHorario= ?',[idHorario])
            .then(function(result){
                console.log('Alumnos ok');
                var res = DB.fetchAll(result);
                return res;
            });
    };
    self.getValores = function(idHorario) {
        return DB.query('select idValorhorario,idValor,nombre from valor where idHorario= ?',[idHorario])
            .then(function(result){
                console.log('Valores ok');
                var res = DB.fetchAll(result);
                return res;
            });
    };
    self.getNotas = function () {
        var res = {
            'notas': [
                {
                    'valor': 5,
                    'nota': "malo"
                },
                {
                    'valor': 10,
                    'nota': "regular"
                },
                {
                    'valor':15,
                    'nota': "bueno"
                },
                {
                    'valor':20,
                    'nota': "excelente"
                }
            ]
        };
        return res.notas;
    };
    self.getSynced = function() {
        return DB.query('SELECT * FROM sync')
            .then(function(result){
                if (result){
                    console.log('hay algo en sync!!');
                    return DB.fetchAll(result);
                }
                else {
                    console.log('Sync está vacio');
                    return false;
                }
            },function(error){
                console.log('Error en Sync');
                return false;
            });
    };
    self.insSync = function() {
        console.log('insertando fecha de sync');
        var currentDate = new Date();
        var synced = "synced " +
            currentDate.getDate() +"/"+
            (currentDate.getMonth()+1) +"/" +
            currentDate.getFullYear();
        return DB.query('insert into sync (syncdate) values (?)', [synced])
            .then(function(result){
                console.log('Ya inserte la fecha de sync')
                console.log("Sync insertId: " + result.insertId + " -- probably 1");
                console.log("Sync rowsAffected: " + result.rowsAffected + " -- should be 1");
            },function(error){
                console.log(error.toString());
            });
    };
    self.insHorario = function(idHorario,nombre,cancha) {
        return DB.query('insert into horario values (?,?,?)',
            [idHorario,nombre,cancha])
            .then(function(result){
                console.log("insertId: " + result.insertId + " -- probably 1");
                console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
            });
    };
    self.insAlumnos = function(idJugador,idHorario,idInscripcion,nombre) {
        return DB.query('insert into alumno values (?,?,?,?,0)',
            [idJugador,idHorario,idInscripcion,nombre])
            .then(function(result){
                console.log("insertId: " + result.insertId + " -- probably 1");
                console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
            });
    };
    self.updAsiste = function(idJugador,idHorario,asiste) {
        return DB.query('update alumno set asiste =? where idJugador=? and idHorario=?',
            [asiste,idJugador,idHorario])
            .then(function(result){
                console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
            });
    };
    self.insValores = function(idValorHorario,idValor,idHorario,nombre) {
        return DB.query('insert into valor values (?,?,?,?)',
            [idValorHorario,idValor,idHorario,nombre])
            .then(function(result){
                console.log("insertId: " + result.insertId + " -- probably 1");
                console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
            });
    };
    self.insEvaluacion = function(idValorHorario,idJugador,res,nombre) {
        return DB.query('insert into evaluacion(idValorhorario,idJugador,res,nombre) values (?,?,?,?)',
            [idValorHorario,idJugador,res,nombre])
            .then(function(result){
                console.log("insertId: " + result.insertId + " -- probably 1");
                console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
                return true;
            });
    };
    return self;
});
