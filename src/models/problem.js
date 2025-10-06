
const mongoose = require("mongoose");
const {Schema} = mongoose;

const problemSchema = new Schema({

    title:{
        type:String,
        required:true,
    },
    
    description:{
        type : String,
        required:true,
    },

    difficulty:{
        type:String,
        enum : ['easy','medium','hard'],
        required : true,
    },

    topics:{
        type : String,
        enum : ["Array", "String", "Hash Table", "Dynamic Programming", "Math", "Sorting", "Greedy", "Depth First Search", "Binary Search", "Database", "Matrix", "Tree", "Breadth First Search", "Bit Manipulation", "Two Pointers", "Prefix Sum", "Heap (Priority Queue)", "Simulation", "Binary Tree", "Stack", "Graph", "Counting", "Sliding Window", "Design",  "Backtracking", "Union Find", "Linked List", "Number Theory", "Ordered Set", "Monotonic Stack", "Segment Tree", "Trie", "Combinatorics", "Bitmask", "Queue", "Recursion", "Divide and Conquer", "Binary Indexed Tree", "Memoization", "Hash Function", "Geometry", "Binary Search Tree", "String Matching", "Topological Sort", "Shortest Path", "Rolling Hash", "Game Theory", "Data Stream", "Monotonic Queue", "Brainteaser", "Doubly-Linked List", "Randomized", "Merge Sort", "Counting Sort", "Iterator", "Concurrency", "Probability and Statistics", "Quickselect", "Suffix Array", "Line Sweep", "Bucket Sort", "Minimum Spanning Tree", "Strongly Connected Component", "Eulerian Circuit", "Radix Sort", "Biconnected Component"],
        required : true,
    },

    visibleTestCases:[
        {
            input : {
                type: String,
                required : true,
            },
            output : {
                type : String,
                required : true,
            },
            explanation : {
                type : String,
                required : true,
            },
        }
    ],

    hiddenTestCases:[
        {
            input : {
                type: String,
                required : true,
            },
            output : {
                type : String,
                required : true,
            },
        }
    ],

    starterCode:[
        {
            language : {
                type : String,
                required : true,
            },
            initialCode : {
                type : String,
                required : true,
            },
        }
    ],

    referenceSolution : [
        {
            language : {
                type : String,
                required : true,
            },
            completeCode : {
                type : String,
                required : true,
            }
        }

    ],

    likes : [{
        type : Schema.Types.ObjectId,
        ref : 'user'
    }],

    notes : [{
        user : {
            type : Schema.Types.ObjectId,
            ref : 'user',
            required : true
        },
        text : {
            type : String,
            required : true
        }
    }],

    problemCreator:{
        type : Schema.Types.ObjectId,
        ref : "user",
        required : true,
    }
    
},{timestamps:true})

const Problem = new mongoose.model('problem',problemSchema);

module.exports = Problem;