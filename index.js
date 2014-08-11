var mongo = require('promised-mongo');

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
		return this.db.find({
			'_id': treeId
		});
	},
	insert: function(tree) {
		var treeDoc = tree.decouple();
		var that = this;
		return this.db[this.settings.treeCollection].insert(treeDoc.tree).then(function() {
			return that.db[that.settings.nodeCollection].insert(treeDoc.nodes);
		}, function(err) {
			throw Error(err);
		});
	},
	drop: function() {
		var that = this;
		return this.db[this.settings.treeCollection].drop().then(function() {
			return that.db[that.settings.nodeCollection].drop();
		});
	},
	remove: function() {

	}
};

module.exports = Adapter;