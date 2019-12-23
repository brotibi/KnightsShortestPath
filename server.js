// Initialize imports
const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
var server = express();

// Local Host
const hostname = '127.0.0.1';
const port = 3000;

//Setup express root nd body-parser
server.use(express.static(__dirname));
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

// Serves the index.html file
server.get('/', (req, res) => {
    res.sendFile('index.html');
});

// I never used this Lol, but it shows the general structure for when I reference Node
// Node:
// x is an Integer
// y is an Integer
// parent is a Node
class Node {
    constructor(x, y, parent) {
        this.x = x;
        this.y = y;
        this.parent = parent;
    }
}

// Returns the shortest path(as a node) from a chess knights current position to the knights target position
// Integer Integer => Node
function findKnightShortestPath(coordOne, coordTwo) {
    var knightX, knightY, targetX, targetY;
    
    knightX = (coordOne- 1)%8;
    knightY = Math.floor((coordOne-1)/8);

    targetX = (coordTwo - 1)%8;
    targetY = Math.floor((coordTwo-1)/8);
    target = {x: targetX, y: targetY};
    const SIZE = 8;
    var row = [2, 2, -2, -2, 1, 1, -1, -1]
    var col = [-1, 1, 1, -1, 2, -2, 2, -2]
    var visited = [];
    var queue = [];
    
    // Checks if the coordinate is a valid location for a knight
    // Integer Integer => boolean
    function validPiece(x, y) {
        if(x < 0 || y < 0 || x >= SIZE || y >= SIZE){
            return false;
        }

        return true;
    }

    // Checks if two nodes are the same
    // Node Node => Boolean
    function sameNode(node1, node2){
        return node1.x == node2.x && node1.y == node2.y;
    }

    // Returns an Array of all possible moves that 
    // Node => Array
    function possibleMoves(someNode) {
        moves = []
        for(var i = 0; i < row.length; i++) {
            var moveX, moveY;
            moveX = someNode.x + col[i];
            moveY = someNode.y + row[i];

            if(validPiece(moveX, moveY)) {
                moves.push({x: moveX, y: moveY, parent: someNode});
            } 
        }

        return moves;
    }

    // Does the list contain the node
    // Array Node => Boolean
    function contains(arr, someNode) {
        for(var i = 0; i < arr.length; i++) {
            var arrayNode = arr[i];
            if(sameNode(arrayNode, someNode)){
                return true;
            }
        }
        return false;
    }

    // Performs Breadth First Search to find the shortet path towards the target
    function BFS() {

        queue.push({x: knightX, y: knightY, parent: null});
        while(!(queue === undefined || queue.length == 0)){

            var node = queue.shift();

            if(sameNode(node, target)){
                return node;
            }

            if(!contains(visited, node)){
                visited.push(node);

                queue = queue.concat(possibleMoves(node));
            }
        }
        return null;
    }

    //Converts a node into an Array
    // Node => Array
    function generateListFromPath(someNode) {
        var arr = [];
        var temp = someNode;
        while(temp.parent != null) {
            arr.push({x: temp.x, y: temp.y});
            temp = temp.parent;
        }
        arr.push({x: temp.x, y: temp.y});
        return arr;
    }

    return generateListFromPath(BFS());
}



// Listens for post to /path
server.post('/path', async (req, res) => {
    console.log("test");
    try {
    const coord1 = await req.body.coord1;
    const coord2 = await req.body.coord2;
    console.log(coord1, coord2);
    console.log(findKnightShortestPath(coord1, coord2));
    res.send({knightPath: findKnightShortestPath(coord1, coord2)});
    res.end();
    } catch (error) {
        console.log(error);
    }
});

// Server Listen
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
}); 