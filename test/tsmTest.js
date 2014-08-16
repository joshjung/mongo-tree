var assert = require('assert'),
	treeStructure = require('tree-structure'),
	Tree = treeStructure.Tree,
	TreeNode = treeStructure.TreeNode,
	Adapter = require("../index.js"),
	adapter = new Adapter();

var treeID = 0;

before(function(done) {
	adapter.connect('mongodb://127.0.0.1:27017/test');
	adapter.drop().then(function() {
		done();
	}, function(err) {
		done();
	});
});

describe('TreeStructure', function() {
	describe('Insert into DB should work', function() {
		var tree = new Tree();

		tree.unflatten(flattened());

		it('Should insert the tree into the database', function(done) {
			adapter.insert(tree).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

	describe('Recouple from DB should work', function() {
		var tree = new Tree();

		tree.unflatten(flattened());

		it('Should insert the tree into the database', function(done) {
			adapter.insert(tree).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('Should read the tree from the database', function(done) {
			adapter.find(tree.id).then(function(value) {
				var treeRecoupled = new Tree();
				treeRecoupled.recouple(value.tree, value.nodes);
				console.log(treeRecoupled);
				done();
			}, function(err) {
				done(err);
			});
		});
	});
});

function flattened() {
	treeID += 1000;
	return {
		id: 'some tree' + treeID,
		options: {
			idGenerator: undefined
		},
		root: {
			id: 100 + treeID,
			data: {
				text: "Some data string 100."
			},
			children: [{
				id: 1 + treeID,
				data: {
					text: "Some data string 1."
				}
			}, {
				id: 2 + treeID,
				data: {
					text: "Some data string 2."
				}
			}, {
				id: 3 + treeID,
				data: {
					text: "Some data string 3."
				}
			}]
		}
	};
}