/**
 * Created by vpease on 22/11/14.
 */
var service = angular.module('services',['db']);

service.factory('estadoFactory',['$http','$state','Consultas',
    function($http,$state,Consultas){
        var self = this;
        self.db = null;
        var cambiarUser = false;
        var credenciales = {
            user: '',
            pass: ''
        };
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
        //var server ='http://www.bocajuniors.com.pe/app/bocarest/index.php';
        var server ='http://192.168.1.100/bocarest'

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
        };
        factory.checkEvaluacion = function(){
            return dataOkEvaluacion;
        };
        factory.getUser = function () {
            return usuario;
        };
        factory.getidLocal = function() {
            return local.idLocal;
        };
        factory.getFecha = function(){
            return fecha;
        };
        factory.getValid = function(){
            return valido;
        };
        factory.getAlumno = function(){
            return alumno;
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
        factory.Evaluar = function(idJugador,nombre,idInscripcion){
            alumno.idJugador = idJugador;
            alumno.nombre = nombre;
            alumno.idInscripcion = idInscripcion;
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
                } else {
                    alert('Usuario inválido: '+ puser + '/'+ ppass +'vs:'+ credenciales.user +'/'+ credenciales.pass);
                };
            } else {
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
                            } else {
                                console.log('No hay cambio de usuario');
                                cambiarUser = false;
                            }
                            Consultas.init();
                            console.log('Ya llame a init y ahora voy por getsynced');
                            Consultas.getSynced()
                                .then(function (result) {
                                    var res = false;
                                    console.log('getSynced ya se ejecutó');
                                    if (result.length > 0) res = true;
                                    else res = false;
                                    dataOk = res;
                                    $state.go('data');
                                });
                        } else {
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
                        } else {
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
                    } else {
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
                params:{idInstructor:usuario.idInstructor, idLocal: usuario.idLocal, fecha:'2014-11-19'}})
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
                            if (result.length()>0)
                                res = true;
                            else
                                res = false;
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
        self.getEvaluacion = function(idInscripcion) {
            return Consultas.getEvaluacion(idInscripcion);
        };
        factory.insAsistencia = function(idHorario,idJugador,nombre) {
            var res = Consultas.insAsistencia(
                idHorario,
                idJugador,
                nombre);
            if (res) dataToSend = true;
        };
        factory.insEvaluacion = function(idValorHorario,idJugador,res,nombre) {
            var res = Consultas.insEvaluacion(
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
    }]);

service.factory('Consultas', function(DB) {
    var self = this;
    self.init= function(){
        DB.init();
    };
    self.execTx = function(lista){
        if (DB.db){
            DB.db.transaction(function(tx){
                for (var i = 0; i < lista.length; i++){
                    tx.executeSql(lista[i]),
                        [],
                        function(tx,res){
                            console.log(lista[i]+' exito');
                        },
                        function(tx,error){
                            console.log(lista[i]+' fallo');
                        };
                };
            });
            console.log('Todos los comandos ejecutados');
        }
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
        }
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
                return DB.fetchAll(result);
            });
    };
    self.getAlumnos = function(idHorario) {
        return DB.query('select idJugador,idInscripcion,nombre,asiste from alumno where idHorario= ?',[idHorario])
            .then(function(result){
                console.log('Alumnos ok');
                return DB.fetchAll(result);
            });
    };
    self.getValores = function(idHorario) {
        return DB.query('select icdValorhorario,idValor,nombre from valor where idHorario= ?',[idHorario])
            .then(function(result){
                console.log('Valores ok');
                return DB.fetchAll(result);
            });
    };
    self.getEvaluacion = function(idInscripcion) {
        return DB.query('select idEvalua,idValorhorario,res,nombre from valor where idInscripcion= ?',[idInscripcion])
            .then(function(result){
                console.log('Valores ok');
                return DB.fetchAll(result);
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
                console.log('Ya inserte la fecha de sync');
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
    self.insValores = function(idEvalua,idValorHorario,idValor,idHorario,nombre) {
        if (idEvalua=='')
            return DB.query('insert into valor values (?,?,?,?)',
                [idValorHorario,idValor,idHorario,nombre])
                .then(function(result){
                    console.log("insertId: " + result.insertId + " -- probably 1");
                    console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
                    return true;
                });
        else
            return DB.query('insert or ipdate into valor values (?,?,?,?,?)',
                [idEvalua,idValorHorario,idValor,idHorario,nombre])
                .then(function(result){
                    console.log("insertId: " + result.insertId + " -- probably 1");
                    console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
                    return true;
                });

    };
    self.insEvaluacion = function(idValorHorario,idJugador,res,nombre) {
        return DB.query("insert into evaluacion(idEvalua,idValorhorario,idInscripcion,res,nombre) values (NULL,?,?,?,?)",
            [idValorHorario,idJugador,res,nombre])
            .then(function(result){
                console.log("insertId: " + result.insertId + " -- probably 1");
                console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
                return true;
            })
            .then(function(error){
                console.log("El error es: "+error.toString());
                return false;
            })
    };
    return self;
});