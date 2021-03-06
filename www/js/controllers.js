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
            var temp = new Date();
            this.usuario.fechatran = temp.getFullYear()+'-'+(temp.getMonth()+1)+'-'+temp.getDate();
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
        this.enviar = function(){
            estadoFactory.senddata1();
        };
    }]);
control.controller('HoraController',['$scope','estadoFactory','horas',
    function($scope,estadoFactory,horas){
        $scope.horarios= horas;
        this.usuario = estadoFactory.getUser();
        this.irInicio = function(){
            estadoFactory.irInicio();
        };
        /*estadoFactory.getHorarios().then(function(horarios){
            $scope.horarios = horarios;
        });*/
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
        this.enviar = function(){
            estadoFactory.senddata();
        };
    }]);

control.controller('AccionesController',['$scope','estadoFactory',
    function($scope,estadoFactory){
        this.horario = estadoFactory.getHorario();
        this.getHorario = function(){
        //return this.horario;
        };
        this.irAsistencia = function(){
            estadoFactory.irAsistencia(this.horario.idHorario);
        };
        this.irEvaluacion = function(){
            estadoFactory.irEvaluacion(this.horario.idHorario);
        };
        this.checkEvaluacion = function(){
            return estadoFactory.checkEvaluacion();
        };
    }]);
control.controller('AsistenciaController',['$scope','estadoFactory','alumnos',
    function($scope,estadoFactory,alumnos){
        this.horario = estadoFactory.getHorario();
        $scope.alumnos = alumnos;
        /*estadoFactory.getAlumnos(this.horario.idHorario)
            .then(function(alumnos){
                var res = alumnos;
                $scope.alumnos = res;
            });*/
        this.fecha = estadoFactory.getFecha();
        this.getFecha = function(){
            return this.fecha;
        };
        this.updAsiste = function(index){
            var temp = $scope.alumnos[index];
            var asiste;
            if (temp.asiste) asiste = 2;
            else asiste = 1;
            estadoFactory.updAsiste(temp.idJugador,this.horario.idHorario,asiste);
        };
    }]);
control.controller('EvaluaController',['$scope','estadoFactory','alumnos',
    function($scope,estadoFactory,alumnos){
        this.horario = estadoFactory.getHorario();
        $scope.alumnos = alumnos;
        /*estadoFactory.getAlumnos(this.horario.idHorario)
            .then(function(alumnos){
                var res = alumnos;
                $scope.alumnos = res;
            });*/
        this.Evaluar = function (idJugador,nombre,idInscripcion){
            estadoFactory.Evaluar1(idJugador,nombre,idInscripcion,this.horario.idHorario);
        };
    }]);
control.controller('EvalAlumnoController',['$scope','$filter','estadoFactory','vals','evals',
    function($scope,$filter,estadoFactory,valores,evals){
        this.horario = estadoFactory.getHorario();
        this.notas = estadoFactory.getNotas();
        this.alumno = estadoFactory.getAlumno();
        this.evals = evals;
        $scope.valores = valores;

        for(i=0;i<evals.length;i++){
            temp = $filter('getById')($scope.valores,this.evals[i].idValorhorario);
            this.evals[i].valor = temp.nombre;
        }
        console.log('evals actualizado');

        /*if (evals.length == 0 || typeof evals.length === 'undefined')
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
        else $scope.valores = evals;*/

        this.enviar = function(){
            for (i=0;i< this.evals.length; i++){
                estadoFactory.updEvaluacion(
                    this.evals[i].idEvalua,
                    this.horario.idHorario,
                    this.evals[i].idValorhorario,
                    this.alumno.idInscripcion,
                    this.evals[i].res,
                    this.evals[i].nombre);
            }

            estadoFactory.irInicio();
        };
        this.alerta = function(indice){
            var val = this.evals[indice].res;
            val = val + 5;
            if (val>20) val=5;
            console.log('El valor de val es:'+ val);
            this.evals[indice].res=val;
        };
    }]);