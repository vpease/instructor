/**
 * Created by vpease on 22/11/14.
 */
var service = angular.module('services',['db']);

service.factory('estadoFactory',['$http','$state','Consultas',
    function($http,$state,Consultas){
        var self = this;
        var cambiarUser = false;
        var credDb = {
            user: '',
            pass: '',
            fecha:''
        };
        var userDb = {
            user:'',
            fecha:''
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
            pass:'',
            fecha:'',
            fechatran:''
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
        var olduser;
        var dataOk = false;
        var dataToSend = false;
        var dataOkEvaluacion = false;
        var fecha='';
        var factory = {};
        var valido=false;
        var server ='http://www.bocajuniors.com.pe/app/bocarest/index.php';
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
            credDb.user = '';
            credDb.pass = '';
            credDb.fecha = '';
            olduser ='';
            dataOk = false;
            userDb = {user:'',fecha:''};
            this.usuario = {idInstructor:'',idOperador: '',nombre: '',user: '',idLocal:'',pass:'',fecha:'',fechatran:''};
            $state.go('login');
        };
        factory.getUserDatos = function(){
            return userDb;
        };
        factory.setNoUser = function(pusuario,state){
            olduser = pusuario.user;
            userDb = pusuario;
            dataOk = !state;
            console.log('Ya cambio el userDB a :'+userDb.user);
        };
        factory.getNoUser = function(){
            return dataOk;
        };
        factory.checkData = function(){
            console.log('llamando a Checkdata y getsynced');
            Consultas.getSynced()
                .then(function(usuarios){
                    if (typeof usuarios =='undefined'){
                        dataOk = false;
                        console.log('No hay Usuario guardado');
                    } else {
                        var tempAr=[];
                        for(i=0;i< usuarios.length;i++){
                            var temp = {fecha:'',usuario:''};
                            temp.fecha = usuarios[i].syncdate;
                            temp.usuario = usuarios[i].usuario;
                            tempAr.push(temp);
                        };
                        if (tempAr.length>0){
                            credDb = {
                                user: tempAr[0].usuario,
                                fecha: tempAr[0].fecha,
                                pass: tempAr[0].pass
                            };
                            dataOk= true;
                        } else {
                            dataOk = false;
                        }
                        console.log('Usuario ya guardado');
                    }
                });
            return credDb;
        };
        factory.hayData = function () {
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
        factory.setFecha = function(pDate) {
            usuario.fechatran = pDate;
            $state.go('data');
        };
        factory.login2 = function(puser,ppass){
            var res='';
            var url=server+'/usuario/instructor.json';
            /*if (this.credDb.user == puser){
                if (this.credDb.pass == ppass){
                    console.log('usuario conocido, que pase');
                    //Consultas.init();
                    res = true;
                    $state.go('data');
                } else {
                    alert('Usuario inválido: '+ puser + '/'+ ppass +'vs:'+ this.credenciales.user +'/'+ this.credenciales.pass);
                };
            } else {*/
            var pusuario = {
                idInstructor: '',
                idOperador: '',
                nombre: '',
                user: '',
                idLocal: '',
                pass: '',
                fecha: '',
                fechatran:''
            };
            $http({url: url,method: "GET",params: {usuario: puser, clave: ppass}})
                .success(function (data) {
                    console.log('Ya llamé a instructor.json');
                    res = data;
                    valido = true;
                    if (res !== '"NO"' && res.length > 0 && res !== '0') {
                        var result = res.substr(1, res.length - 2).split(":");
                        pusuario.idInstructor = result[0];
                        pusuario.idOperador = result[1];
                        pusuario.user = result[2];
                        pusuario.nombre = result[3];
                        pusuario.fecha = result[4];
                        pusuario.fechatran = result[4];
                        pusuario.idLocal = result[5];
                        if (typeof userDb.fecha !='undefined' | userDb.fecha != ''){
                            pusuario.fechatran = userDb.fecha;
                        };
                        usuario = pusuario;
                        console.log('voy a comparar si hay cambio de usuario');
                        console.log('el userDb es:'+olduser);
                        if (olduser != puser) {
                            console.log('Si hay cambio de usuario');
                            cambiarUser = true;
                            userDb = {
                                user: puser,
                                pass: ppass,
                                fecha: result[4]
                            };
                            Consultas.deleteAll();
                            console.log('Ya mandé a borrar todo');
                            dataOk=false;
                            $state.go('date');
                        } else {
                            console.log('No hay cambio de usuario');
                            cambiarUser = false;
                            $state.go('data');
                        };
                        console.log('Ya llame a init y ahora voy por getsynced');
                    } else {
                        usuario = pusuario;
                        alert('Usuario inválido: '+ puser + '/'+ ppass);
                    };
                });
            //};
            return res;
        };
        factory.getdata = function(){
            var res='';
            var url=server+'/usuario/tablas.json';
            $http({url:url,
                method:"GET",
                params:{idInstructor:usuario.idInstructor, idLocal: usuario.idLocal, fecha: usuario.fechatran}})
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
                            alumno.nombre,
                            alumno.asiste,
                            alumno.deuda);
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
                    Consultas.insSync(usuario.fechatran,usuario.user,usuario.pass)
                        .then(function(result){
                            dataOk = true;
                            dataToSend = true;
                            console.log("Hay datos para envair");
                            $state.go('horarios');
                        },function(error){
                            dataOk = false;
                            dataToSend = false;
                            console.log('No hay datos para enviar');
                            $state.go('horarios');
                        });
                })
                .error(function(data){
                    dataOk = false;
                });
            return res;
        };
        factory.senddata = function(){
            var res='';
            var url = server+'/usuario/tablas.json';
            var pDatos = Consultas.getAsistencias().
                then(function(result){
                    //var asis = JSON.stringify(result);
                    //var asisObj = JSON.parse(asis);
                    var datos = { fecha: usuario.fechatran, Asistencias: result };
                    $http.post(url,datos)
                    .success(function(){
                        alert('Ya se envió todo');
                        res =result;
                    }).error(function (result){
                        alert('Error');
                        res = result;
                    })
                });
            return res;
        };
        factory.dbInit = function() {
            Consultas.init()
                .then(function(result){
                   /* Consultas.getSynced()
                        .then(function(result){
                            var res = false;
                            if (result.length()>0)
                                res = true;
                            else
                                res = false;
                            dataOk = res;
                            $state.go('data');
                        });*/
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
        factory.getEvaluacion = function(idInscripcion) {
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

service.factory('Consultas', function(DB,$q) {
    var self = this;
    self.init= function(){
        DB.init();
    };
    self.execTx = function(lista){
        if (!DB.db) {
            DB.init();
        }
        DB.db.transaction(function(tx){
            for (var i = 0; i < lista.length; i++){
                tx.executeSql(lista[i]),[],
                    function(tx,res){
                        console.log(lista[i]+' exito');
                    },
                    function(tx,error){
                        console.log(lista[i]+' fallo');
                    };
            };
        });
        console.log('Todos los comandos ejecutados');
    };
    self.deleteAll = function(){
        if (!DB.db) {
            DB.init();
        }
        DB.db.transaction(function(tx){
            /*tx.executeSql('delete from asistencia',[],
                function(tx,res){
                    console.log('asistencia borrado');
                },
                function(tx,error){
                    console.log('Error al borrar asistencia:'+error.details);
                });*/
            tx.executeSql('delete from horario',[],
                function(tx,res){
                    console.log('horario borrado');
                },
                function(tx,error){
                    console.log('Error en horario:'+error.toString());
                });
            tx.executeSql('delete from alumno',[],
                function(tx,res){
                    console.log('alumno borrado');
                },
                function(tx,error){
                    console.log('Error en alumno:'+error.toString());
                });
            tx.executeSql('delete from valor',[],
                function(tx,res){
                    console.log('valor borrado');
                },
                function(tx,error){
                    console.log('Error en valor:'+error.toString());
                });
            tx.executeSql('delete from evaluacion',[],
                function(tx,res){
                    console.log('evaluacion borrado');
                },
                function(tx,error){
                    console.log('Error en evaluacion:'+error.toString());
                });
            tx.executeSql('delete from sync',[],
                function(tx,res){
                    console.log('sync borrado');
                },
                function(tx,error){
                    console.log('Error en sync:'+error.toString());
                });
        });
        console.log('Todos los datos borrados');
    };
    self.getAsistencias = function(){
        if (!DB.db) {
            DB.init();
        }
        return DB.query('select idInscripcion as ins,asiste as asis from alumno')
            .then(function(result){
                return DB.fetchAll(result);
            });
    };
    self.getHorarios = function() {
        if (!DB.db) {
            DB.init();
        }
        return DB.query('select idHorario,nombre,cancha FROM horario')
            .then(function(result){
                console.log('Horarios ok');
                return DB.fetchAll(result);
            });
    };
    self.getAlumnos = function(idHorario) {
        if (!DB.db) {
            DB.init();
        }
        return DB.query('select idJugador,idInscripcion,nombre,deuda,asiste from alumno where idHorario= ?',[idHorario])
            .then(function(result){
                console.log('Alumnos ok');
                return DB.fetchAll(result);
            });
    };
    self.getValores = function(idHorario) {
        if (!DB.db) {
            DB.init();
        }
        return DB.query('select idValorhorario,idValor,nombre from valor where idHorario= ?',[idHorario])
            .then(function(result){
                console.log('Valores ok');
                return DB.fetchAll(result);
            },function(error){
                console.log('Error en getValores:'+error.toString());
            });
    };
    self.getEvaluacion = function(idInscripcion) {
        if (!DB.db) {
            DB.init();
        }
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
       if (!DB.db) {
            DB.init();
        }
        var dfd = $q.defer();
        var res;
        DB.query('SELECT * FROM sync')
            .then(
            function(result){
                console.log('Ya revisé sync!!');
                res = DB.fetchAll(result);
                dfd.resolve(res);
            });
        return dfd.promise;
    };
    self.insSync = function(fecha,user,pass) {
        if (!DB.db) {
            DB.init();
        }
        console.log('insertando fecha de sync');
        var synced = fecha;
        return DB.query('insert into sync (syncdate,usuario,pass) values (?,?,?)', [synced,user,pass])
            .then(function(result){
                console.log('Ya inserte la fecha de sync');
                console.log("Sync insertId: " + result.insertId + " -- probably 1");
                console.log("Sync rowsAffected: " + result.rowsAffected + " -- should be 1");
            },function(error){
                console.log(error.detail );
            });
    };
    self.insHorario = function(idHorario,nombre,cancha) {
        if (!DB.db) {
            DB.init();
        }
        return DB.query('insert into horario values (?,?,?)',
            [idHorario,nombre,cancha])
            .then(function(result){
                console.log("insertId: " + result.insertId + " -- probably 1");
                console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
            });
    };
    self.insAlumnos = function(idJugador,idHorario,idInscripcion,nombre,asiste,deuda) {
        if (!DB.db) {
            DB.init();
        }
        return DB.query('insert into alumno(idJugador,idHorario,idInscripcion,nombre,asiste,deuda) values (?,?,?,?,?,?)',
            [idJugador,idHorario,idInscripcion,nombre,asiste,deuda])
            .then(function(result){
                console.log("insertId: " + result.insertId + " -- probably 1");
                console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
            })
            .then(function(error){
                if (typeof error != "undefined")
                console.log("El error es: "+error.toString());
                return false;
            });
    };
    self.updAsiste = function(idJugador,idHorario,asiste) {
        if (!DB.db) {
            DB.init();
        }
        return DB.query('update alumno set asiste =? where idJugador=? and idHorario=?',
            [asiste,idJugador,idHorario])
            .then(function(result){
                console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
            });
    };
    self.insValores = function(idValorHorario,idValor,idHorario,nombre) {
        if (!DB.db) {
            DB.init();
        }
        return DB.query('insert into valor(idValorhorario,idValor,idHorario,nombre) values (?,?,?,?)',
            [idValorHorario,idValor,idHorario,nombre])
            .then(function(result){
                console.log("insertId: " + result.insertId + " -- probably 1");
                console.log("rowsAffected: " + result.rowsAffected + " -- should be 1");
            });
    };
    self.insEvaluacion = function(idValorHorario,idJugador,res,nombre) {
        if (!DB.db) {
            DB.init();
        }
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