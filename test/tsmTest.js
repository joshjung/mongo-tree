var assert = require('assert'),
	treeStructure = require('tree-structure'),
	Tree = treeStructure.Tree,
	TreeNode = treeStructure.TreeNode,
	Adapter = require("../index.js"),
	adapter = new Adapter();

beforeEach(function() {
	adapter.connect('mongodb://127.0.0.1:27017/test');
});

describe('TreeStructure', function() {
	describe('Insert into DB should work', function() {
		var tree = new Tree();

		tree.unflatten(flattened());

		it('Should insert the tree into the database', function(done) {
			adapter.insert(tree).then(function() {
				console.log('insert complete');
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
				console.log('insert complete');
				done();
			}, function(err) {
				done(err);
			});
		});

		it('Should read the tree from the database', function(done) {
			adapter.find(tree.id).then(function(value) {
				console.log(value);
				done();
			}, function(err) {
				done(err);
			});
		});
	});
});

function flattened() {
	return {
		id: 'some tree',
		options: {
			idGenerator: undefined
		},
		root: {
			id: 100,
			data: {
				text: "Some data string 100."
			},
			children: [{
				id: 1,
				data: {
					text: "Some data string 1."
				}
			}, {
				id: 2,
				data: {
					text: "Some data string 2."
				}
			}, {
				id: 3,
				data: {
					text: "Some data string 3."
				}
			}]
		}
	};
}