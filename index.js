var mongo = require('promised-mongo'),
	Q = require('q'),
	Tree = require('tree-structure').Tree;

require('q-foreach')(Q);

var Adapter = function(settings) {
	this.settings = settings || {};
	this.settings.treeCollection = 'trees';
	this.settings.nodeCollection = 'nodes';
};

Adapter.prototype = {
	connect: function(url) {
		this.db = mongo(url, [this.settings.treeCollection, this.settings.nodeCollection]);
	},
	disconnect: function() {
		this.db = undefined;
	},
	find: function() {
		if (!this.db)
			throw Error('Need to connect!');

		var deferred = Q.defer();
		var all = [];

		Q.forEach(arguments, function(treeId) {
			var that = this;

			return this.db[this.settings.treeCollection].find({
				'_id': treeId
			}).toArray().then(function(t) {
				tree = t[0];
				return that.db[that.settings.nodeCollection].find({
					'_id': {
						$in: tree.nodeIds
					}
				}).toArray().then(function(n) {
					all.push({
						tree: tree,
						nodes: n
					});
				});
			}, function(err) {
				deferred.reject(err);
			});
		}, this).then(function() {
			for (var i = 0; i < all.length; i++) {
				var tree = new Tree();
				tree.recouple(all[i].tree, all[i].nodes);
				all[i] = tree;
			}
			deferred.resolve(all.length > 1 ? all : all[0]);
		});

		return deferred.promise;
	},
	insert: function() {
		if (!this.db)
			throw Error('Need to connect!');

		return Q.forEach(arguments, function(tree) {
			var that = this;
			var treeDoc = tree.decouple();
			return this.db[this.settings.treeCollection].insert(treeDoc.tree).then(function(value) {
				return that.db[that.settings.nodeCollection].insert(treeDoc.nodes);
			}, function(err) {
				throw Error(err);
			});
		}, this);
	},
	drop: function() {
		if (!this.db)
			throw Error('Need to connect!');
		var that = this;
		return this.db[this.settings.treeCollection].drop().then(function() {
			return that.db[that.settings.nodeCollection].drop();
		});
	},
	findAllNodes: function() {
		return this.db[this.settings.treeCollection].find({}, {
			nodeIds: true,
			rootId: true
		}).toArray();
	},
	remove: function(treeOrTreeId) {
		var treeId = (treeOrTreeId.hasOwnProperty('constructor') && treeOrTreeId.constructor === Tree) ? treeOrTreeId : treeOrTreeId.id;
		if (!this.db)
			throw Error('Need to connect!');

		return this.db[this.settings.treeCollection].remove({
			_id: treeId
		});
	}
};

module.exports = Adapter;