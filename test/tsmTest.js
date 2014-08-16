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
			debugger;
			adapter.insert(tree).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

	describe('Recouple from DB', function() {
		var tree = new Tree();

		tree.unflatten(flattened());

		it('Should insert the tree into the database', function(done) {
			adapter.insert(tree).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('should read the tree from the db', function(done) {
			adapter.find(tree.id).then(function(treeRecoupled) {
				assert.deepEqual(treeRecoupled.decouple().tree.nodeIds, tree.decouple().tree.nodeIds);
				done();
			}, function(err) {
				done(err);
			});
		});
	});

	describe('Multiple insertion and findAllNodes', function() {
		var tree1 = new Tree(),
			tree2 = new Tree(),
			tree3 = new Tree();

		tree1.unflatten(flattened());
		tree2.unflatten(flattened());
		tree3.unflatten(flattened());

		it('should insert tree1,tree2,tree3 into the database', function(done) {
			adapter.insert(tree1, tree2, tree3).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('should read the three trees above from the database', function(done) {
			adapter.find(tree1.id, tree2.id, tree3.id).then(function(value) {
				assert.notEqual(value, undefined);
				assert.equal(value.length, 3);
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