/**
 * Created by vpease on 22/11/14.
 */
var control = angular.module('controllers',[]);

control.controller('LoginController',['estadoFactory','creds',
    function(estadoFactory,creds){
        var regs = creds;
        this.usuario = { user: '', pass:'',fecha: ''};
        if (typeof regs =='undefined'){
            estadoFactory.setNoUser(this.usuario,true);
            console.log('No hay Usuario guardado');
        } else {
            var tempAr=[];
            for(var i=0;i< regs.length;i++){
                var temp = {fecha:'',user:'',pass:''};
                temp.fecha = regs[i].syncdate;
                temp.user = regs[i].usuario;
                temp.pass = regs[i].pass;
                tempAr.push(temp);
            };
            if (tempAr.length>0){
                var temp = {fecha:'',user:'',pass:''};
                temp = {
                    user: tempAr[0].user,
                    fecha: tempAr[0].fecha,
                    pass: tempAr[0].pass
                };
                estadoFactory.setNoUser(temp,false);
                this.usuario = temp;
            };
            console.log('Usuario ya guardado');
        }
        console.log('Usuario ingresado es:' + this.usuario.user);
        this.checkUser = function () {
            var res = estadoFactory.login2(this.usuario.user, this.usuario.pass);
        }
    }]);
control.controller('DateController',
    ['estadoFactory',
        function(estadoFactory){
            this.usuario = { fechatran: '' };
            this.usuario.fechatran = new Date();
            this.ingresar = function() {
                estadoFactory.setFecha(this.usuario.fechatran);
            }
        }]);
control.controller('DataController',['$state','$ionicActionSheet','estadoFactory',
    function($state,$ionicActionSheet,estadoFactory){
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
                    else if (index==1) $state.go('data');
                }
            });
        };
        this.salir = function(){
            estadoFactory.salir();
        };
        this.getFecha = function(){
            return this.usuario.fecha;
        };
        this.getUsuario = function(){
            return this.usuario;
        };
        this.opciones = function(){
            this.showMenu();
        };
        this.hayData = function(){
            return estadoFactory.hayData()
        };
        this.checkDataToSend = function(){
            return estadoFactory.checkDataToSend();
        };
        this.descargar = function(){
            estadoFactory.getdata();
            console.log('Datos llamados');
        };
        this.irInicio = function(){
            estadoFactory.irInicio();
        };
    }]);
control.controller('HoraController',['$scope','estadoFactory',
    function($scope,estadoFactory){
        this.usuario = estadoFactory.getUser();
        $scope.horarios = [];
        this.irInicio = function(){
            estadoFactory.irInicio();
        };
        estadoFactory.getHorarios().then(function(horarios){
            $scope.horarios = horarios;
        });
        this.getFecha = function(){
            return this.usuario.fecha;
        };
        this.getFechaTran = function(){
            return this.usuario.fechatran;
        };
        this.getUsuario = function(){
            return this.usuario;
        };
        this.hayData = function(){
            return estadoFactory.hayData();
        };
        this.checkDataToSend = function(){
            return estadoFactory.checkDataToSend();
        };
        this.select = function(idHorario,nombre,cancha){
            estadoFactory.selectHorario(idHorario,nombre,cancha);
        };
    }]);

control.controller('AccionesController',['$scope','estadoFactory',
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
    }]);
control.controller('AsistenciaController',['$scope','estadoFactory',
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
    }]);
control.controller('EvaluaController',['$scope','estadoFactory',
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
    }]);
control.controller('EvalAlumnoController',['$scope','estadoFactory',
    function($scope,estadoFactory){
        this.horario = estadoFactory.getHorario();
        this.notas = estadoFactory.getNotas();
        this.alumno = estadoFactory.getAlumno();
        this.eval = [];
        $scope.valores = [];
        var evals;
        evals = estadoFactory.getEvaluacion(this.alumno.idInscripcion);


        if (evals.length == 0 || typeof evals.length === 'undefined')
            estadoFactory.getValores(this.horario.idHorario)
                .then(function(valores){
                    var res = valores;
                    var tempAr=[];
                    for(i=0;i< valores.length;i++){
                        var temp = {
                            idEvalua:'',
                            idValorhorario:'',
                            res:0,
                            nombre:''
                        }
                        temp.idValorhorario = valores[i].idValorhorario;
                        temp.nombre = valores[i].nombre;
                        temp.res = 5;
                        tempAr.push(temp);
                    }
                    $scope.valores = tempAr;
                });
        else $scope.valores = evals;

        this.enviar = function(){
            for (i=0;i< $scope.valores.length; i++){
                estadoFactory.insEvaluacion(
                    $scope.valores[i].idEvalua,
                    $scope.valores[i].idValorhorario,
                    this.alumno.idInscripcion,
                    $scope.valores[i].res,
                    $scope.valores[i].nombre);
            }

            estadoFactory.irInicio();
        };
        this.alerta = function(indice){
            var val = $scope.valores[indice].res;
            val = val + 5;
            if (val>20) val=5;
            console.log('El valor de val es:'+ val);
            $scope.valores[indice].res=val;
        };
    }]);