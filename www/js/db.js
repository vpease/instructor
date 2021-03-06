/**
 * Created by vpease on 22/11/14.
 */
var db = angular.module('db',['ngCordova']);

db.factory('DB',function($q, $cordovaSQLite,DB_CONFIG) {
    var self = this;
    self.db = null;
    self.init = function() {
        if (!self.db) {
            console.log('database is closed');
           if (window.sqlitePlugin !== undefined){
                console.log('database sqlite plugin si existe');
                self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name});
            } else {
                console.log('database sqlite plugin no existe');
                self.db = window.openDatabase(DB_CONFIG.name,"1.0",DB_CONFIG,1024*1024);
            };
            //self.db = $cordovaSQLite.openDB({name: DB_CONFIG.name, bgType: 1});

            if (!self.db){
                console.log('falló ngCordova sqlite');
            } else {
                console.log('DB abierta');
            }
            self.tablas();
            console.log('Tablas creadas');
        }
    };
    self.tablas = function(){
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
            transaction.executeSql(query, bindings,
                function(transaction, result) {
                    console.log("Todo ok en : "+query + "//"+ bindings);
                    deferred.resolve(result);
                },
                function(transaction, error) {
                    console.log("Todo ko en : "+query + "//"+ bindings);
                    deferred.reject(error);
                });
        });
        return deferred.promise;
    };
    self.queryArray = function(queries){
        self.db.transaction(function(transaction){
            angular.forEach(queries,function(query){
                transaction.executeSql(query.sql, query.bindings,
                    function(transaction,result){
                        console.log("Todo Ok en : "+query.sql+ "//"+query.bindings);
                    },
                    function(transaction,error){
                        console.log("Todo ko en: "+query.sql+ "//"+query.bindings);
                    })
            })
        })
    }
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