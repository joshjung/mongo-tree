var mongo = require('promised-mongo'),
	Q = require('q');

var Adapter = function(settings) {
	this.settings = settings || {};
	this.settings.treeCollection = 'trees';
	this.settings.nodeCollection = 'nodes';
	this.settings.database = 'tree-structure';
};

Adapter.prototype = {
	connect: function(url) {
		this.db = mongo(url, [this.settings.treeCollection, this.settings.nodeCollection]);
	},
	disconnect: function() {
		this.db = undefined;
	},
	find: function(treeId) {
		if (!this.db)
			throw Error('Need to connect!');

		var that = this;
		var tree = undefined;

		var deferred = Q.defer();

		var promise = this.db[this.settings.treeCollection].find({
			'_id': treeId
		}).toArray().then(function(t) {
			tree = t[0];
			return that.db[that.settings.nodeCollection].find({
				'_id': {
					$in: tree.nodeIds
				}
			}).toArray().then(function(nodes) {
				deferred.resolve({
					tree: tree,
					nodes: nodes
				});
			});
		}, function(err) {
			deferred.reject(err);
		});

		return deferred.promise;
	},
	insert: function(tree) {
		if (!this.db)
			throw Error('Need to connect!');
		var treeDoc = tree.decouple();
		var that = this;
		return this.db[this.settings.treeCollection].insert(treeDoc.tree).then(function() {
			return that.db[that.settings.nodeCollection].insert(treeDoc.nodes);
		}, function(err) {
			throw Error(err);
		});
	},
	drop: function() {
		if (!this.db)
			throw Error('Need to connect!');
		var that = this;
		return this.db[this.settings.treeCollection].drop().then(function() {
			return that.db[that.settings.nodeCollection].drop();
		});
	},
	remove: function() {
		if (!this.db)
			throw Error('Need to connect!');
	}
};

module.exports = Adapter;