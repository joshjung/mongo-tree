mongo-tree
==========

This module provides CRUD operation methods for inserting, updating, and removing of entire tree structures to a MongoDB collection.

The module uses the [promised-mongo](https://www.npmjs.org/package/promised-mongo) module.

Requirements
============

- `tree-structure`: [link](https://www.npmjs.org/package/tree-structure)
- MongoDB connection
    - 1 collection for the trees
    - 1 collection for the nodes

Testing
=======

    mocha

Examples
========

**Connecting/Setup**

Connecting is simple:

    var mongoTree = require('mongo-tree');
    mongoTree.connect('mongodb://127.0.0.1:27017/test');

mongo-tree requires two collections, which can be set up like this:

    var mongoTree = require('mongo-tree');
    mongoTree.connect('mongodb://127.0.0.1:27017/test', {
      nodeCollection: 'myNodesCollectionName',
      treeCollection: 'myTreesCollectionName',
    });

**Inserting**

    var Tree = require('tree-structure').Tree;
    var MongoTree = require('mongo-tree');
    var mongoTree = new MongoTree();

    // Create a new tree object.
    var tree = new Tree();

    // Convert a JSON tree (with children nodes) into a tree structure in memory. See documentation on tree-structure.
    tree.unflatten(
      {
        id: 'my test tree!',
        options: {
          childrenField: 'children'
        },
        root: {
          id: 1,
          data: 'this is the root data'
          children: [{
            id: 2,
            data: 'this is the child nodes (2) data'
          }, {
            id: 3,
            data: 'this is the child nodes (3) data'
          }, {
            id: 4,
            data: 'this is the child nodes (4) data'
          }]
        }
      }
    );

    mongoTree.connect('mongodb://127.0.0.1:27017/test');

    mongoTree.insert(tree); // Will create 1 tree document and 4 node documents.

Multiple inserts can be performed at a time, like this:

    var tree1 = new Tree(),
      tree2 = new Tree(),
      tree3 = new Tree();
    ...
    mongoTree.insert(tree1, tree2, tree3).then(function () {
        console.log('success!');
      });

**Retrieving**

Trees are retrieved by the tree id:

    var Tree = require('tree-structure').Tree;
    var MongoTree = require('mongo-tree');
    var mongoTree = new MongoTree();

    mongoTree.connect('mongodb://127.0.0.1:27017/test');

    var treeId = 'some tree id to find';

    mongoTree.find(treeId).then(function (tree) {
        console.log('The recoupled tree is: ', tree);
      });

**Removing**

Trees are removed from the database by their tree id:

    var Tree = require('tree-structure').Tree;
    var MongoTree = require('mongo-tree');
    var mongoTree = new MongoTree();

    mongoTree.connect('mongodb://127.0.0.1:27017/test');
    
    var treeId = 'some tree id to delete';

    mongoTree.remove(treeId).then(function () {
        console.log('Deleted.');
      });

**Removing Orphaned Nodes**

TODO: right now removing a tree simply removes the structure, but not the nodes as each code can technically be referenced
by multiple parent trees. As a result, a method will need to be built to ensure removal of orphaned nodes.

License
=======

The MIT License (MIT)

Copyright (c) 2014 Joshua Jung

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


