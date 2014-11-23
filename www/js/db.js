/**
 * Created by vpease on 22/11/14.
 */
var db = angular.module('db',[]);

db.factory('DB',function($q, DB_CONFIG) {
    var self = this;
    self.db = null;
    self.init = function() {
        if (!self.db) {
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
        }
    };

    self.query = function(query, bindings) {
        bindings = typeof bindings !== 'undefined' ? bindings : [];
        var deferred = $q.defer();

        self.db.transaction(function(transaction) {
            transaction.executeSql(query, bindings, function(transaction, result) {
                console.log("Todo ok en : "+query + "//"+ bindings);
                deferred.resolve(result);
            }, function(transaction, error) {
                console.log("Todo ko en : "+query + "//"+ bindings);
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