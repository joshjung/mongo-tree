var assert = require('assert'),
	treeStructure = require('tree-structure'),
	Tree = treeStructure.Tree,
	TreeNode = treeStructure.TreeNode,
	Adapter = require("../index.js"),
	adapter = new Adapter();

beforeEach(function() {
	adapter.connect('mongodb://127.0.0.1:27017/test');
	return adapter.drop();
})

describe('TreeStructure', function() {
	describe('connect to DB should work', function() {
		var tree = new Tree();

		var flattened = {
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

		tree.unflatten(flattened);



		it('Should succeed', function(done) {
			adapter.insert(tree).then(function() {
				console.log('insert complete');
				done();
			}, function(err) {
				done(err);
			});
		});
	});
});