export interface Challenge {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  editor: "node-flow" | "playground";
  description: string;
  objective: string;
  steps: string[];
  hints: string[];
  starterCode?: string;
  expectedOutput?: string;
}

export const challenges: Challenge[] = [
  // Node Flow challenges
  {
    id: "node-1",
    title: "Your First Flow",
    difficulty: "beginner",
    editor: "node-flow",
    description: "Learn the basics of node-based programming by creating a simple addition flow.",
    objective: "Connect two input nodes to a process node, then to an output node, and run the flow.",
    steps: [
      "Notice the pre-built flow with two inputs (A=10, B=5)",
      "Check that Input A and Input B are connected to the Add process",
      "Verify the Add process is connected to the Result output",
      "Click 'Run Flow' to execute the pipeline",
      "Check the Execution Log for the result (should be 15)",
    ],
    hints: [
      "The default flow is already set up — just run it!",
      "Look at the Execution Log panel on the right",
    ],
  },
  {
    id: "node-2",
    title: "Build a Pipeline",
    difficulty: "beginner",
    editor: "node-flow",
    description: "Add new nodes to extend the data pipeline.",
    objective: "Add a new Input node, connect it to the existing process, and observe how the result changes.",
    steps: [
      "Click '+ Input' in the toolbar to add a new input node",
      "Drag the new node to a convenient position",
      "Connect it to the existing Add process node",
      "Run the flow and check the updated result",
      "The result should now be the sum of all three inputs",
    ],
    hints: [
      "Drag from the handle (dot) on the right side of the input to the left handle of the process",
      "Each new input defaults to value 0",
    ],
  },
  {
    id: "node-3",
    title: "Multi-Stage Pipeline",
    difficulty: "intermediate",
    editor: "node-flow",
    description: "Create a flow with multiple processing stages.",
    objective: "Build a two-stage pipeline: first add two numbers, then connect the output to another process.",
    steps: [
      "Start with the default flow (A + B → Result)",
      "Add a new Process node from the toolbar",
      "Add another Input node for a multiplier value",
      "Connect the first output and the new input to the second process",
      "Add a new Output node and connect it to the second process",
      "Run and observe both stages in the execution log",
    ],
    hints: [
      "You can have multiple process and output nodes",
      "Each process node sums all its connected inputs",
    ],
  },
  {
    id: "node-4",
    title: "Parallel Flows",
    difficulty: "advanced",
    editor: "node-flow",
    description: "Design independent parallel data flows that process simultaneously.",
    objective: "Create two completely independent pipelines that each produce their own output.",
    steps: [
      "Keep the existing flow as Pipeline A",
      "Add two new Input nodes for Pipeline B",
      "Add a new Process node and connect Pipeline B inputs to it",
      "Add a new Output node for Pipeline B",
      "Run the flow and verify both pipelines execute independently",
      "Check the execution log shows results for both pipelines",
    ],
    hints: [
      "Independent flows don't need to be connected to each other",
      "Position your nodes clearly to visually separate the two pipelines",
    ],
  },

  // Code Playground challenges — Beginner
  {
    id: "code-1",
    title: "Variables & Types",
    difficulty: "beginner",
    editor: "playground",
    description: "Learn about JavaScript variables and data types.",
    objective: "Declare variables of different types and log them to the console.",
    steps: [
      "Declare a string variable: let name = \"CodeFlow\";",
      "Declare a number variable: let age = 2024;",
      "Declare a boolean: let isAwesome = true;",
      "Declare an array: let skills = [\"blocks\", \"nodes\", \"code\"];",
      "Use console.log() to print each variable",
      "Use typeof to check the type of each variable",
    ],
    hints: [
      "console.log(typeof name) will show 'string'",
      "Arrays are technically 'object' type in JavaScript",
    ],
    starterCode: `// Declare your variables below\n\n\n// Print them to the console\n`,
  },
  {
    id: "code-2",
    title: "Functions",
    difficulty: "beginner",
    editor: "playground",
    description: "Write your first JavaScript functions.",
    objective: "Create a function that takes a name and returns a personalized greeting.",
    steps: [
      "Define a function called 'greet' that takes a 'name' parameter",
      "Have it return 'Hello, ' + name + '!'",
      "Call the function with your name and log the result",
      "Create an arrow function version called 'greetArrow'",
      "Test both functions and compare outputs",
    ],
    hints: [
      "function greet(name) { return ... }",
      "const greetArrow = (name) => ...",
    ],
    starterCode: `// Create your greeting functions\n\n\n// Test them\n`,
  },

  // Code Playground — Intermediate
  {
    id: "code-3",
    title: "Array Methods",
    difficulty: "intermediate",
    editor: "playground",
    description: "Master map, filter, and reduce on arrays.",
    objective: "Use array methods to transform and aggregate data.",
    steps: [
      "Create an array of numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]",
      "Use .filter() to get only even numbers",
      "Use .map() to square each even number",
      "Use .reduce() to sum all squared even numbers",
      "Log each intermediate result",
      "Chain all operations in a single expression",
    ],
    hints: [
      "n % 2 === 0 checks if a number is even",
      "You can chain: arr.filter(...).map(...).reduce(...)",
    ],
    starterCode: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n\n// Your code here\n`,
  },
  {
    id: "code-4",
    title: "Object Manipulation",
    difficulty: "intermediate",
    editor: "playground",
    description: "Work with JavaScript objects and destructuring.",
    objective: "Create, access, and transform objects using modern JS syntax.",
    steps: [
      "Create a student object with name, age, and grades (array)",
      "Use destructuring to extract properties",
      "Calculate the average grade using reduce",
      "Use spread operator to create a new object with the average added",
      "Log the final enhanced student object",
    ],
    hints: [
      "const { name, grades } = student;",
      "const enhanced = { ...student, average: avg };",
    ],
    starterCode: `// Create a student object\n\n\n// Transform and enhance it\n`,
  },

  // Code Playground — Advanced: Closures
  {
    id: "code-5",
    title: "Closures",
    difficulty: "advanced",
    editor: "playground",
    description: "Understand closures and how functions remember their scope.",
    objective: "Create a counter factory using closures and demonstrate private state.",
    steps: [
      "Create a function 'createCounter' that returns an object with increment, decrement, and getCount methods",
      "Use a local variable 'count' inside createCounter (this is the closed-over variable)",
      "increment() should add 1, decrement() should subtract 1, getCount() should return the current value",
      "Create two independent counters and manipulate them separately",
      "Log the counts to prove they maintain independent state",
      "Try accessing 'count' directly from outside — it should be undefined",
    ],
    hints: [
      "The inner functions 'close over' the count variable",
      "Each call to createCounter creates a new scope with its own count",
    ],
    starterCode: `// Create a counter factory using closures\nfunction createCounter() {\n  // Your code here\n}\n\n// Create two independent counters\n// Demonstrate that they have separate state\n`,
  },

  // Code Playground — Advanced: Async/Await
  {
    id: "code-6",
    title: "Async/Await Basics",
    difficulty: "advanced",
    editor: "playground",
    description: "Learn asynchronous programming with Promises and async/await.",
    objective: "Create async functions that simulate API calls and handle them with async/await.",
    steps: [
      "Create a function 'delay' that returns a Promise resolving after a given ms",
      "Create an async function 'fetchUser' that awaits delay(500) then returns a user object",
      "Create an async function 'fetchPosts' that awaits delay(300) then returns an array of posts",
      "Write a 'main' async function that fetches user and posts in parallel using Promise.all",
      "Log the combined results",
      "Add error handling with try/catch around the async operations",
    ],
    hints: [
      "const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))",
      "Use Promise.all([fetchUser(), fetchPosts()]) for parallel execution",
      "Wrap everything in try/catch for error handling",
    ],
    starterCode: `// Simulate async API calls\nconst delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));\n\n// Create your async functions\n\n\n// Run everything\n`,
  },

  // Code Playground — Advanced: Promise Chaining
  {
    id: "code-7",
    title: "Promise Chaining",
    difficulty: "advanced",
    editor: "playground",
    description: "Master Promise chaining and error propagation.",
    objective: "Build a data processing pipeline using chained Promises.",
    steps: [
      "Create a function 'fetchData' that returns a Promise resolving with raw data after 200ms",
      "Create 'validateData' that checks if data is valid, rejects if not",
      "Create 'transformData' that transforms the data into a new format",
      "Chain all three: fetchData().then(validate).then(transform).then(log)",
      "Add a .catch() handler at the end to handle any errors in the chain",
      "Test with both valid and invalid data to see error handling work",
    ],
    hints: [
      "Each .then() receives the return value of the previous one",
      "A single .catch() at the end handles errors from any step",
      "Return new Promises from each step to keep the chain going",
    ],
    starterCode: `// Build a Promise chain pipeline\n\nfunction fetchData() {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve({ id: 1, name: "Test", value: 42 }), 200);\n  });\n}\n\n// Add validate and transform functions\n// Chain them together\n`,
  },

  // Code Playground — Intermediate: Closures practical
  {
    id: "code-8",
    title: "Memoization with Closures",
    difficulty: "intermediate",
    editor: "playground",
    description: "Use closures to cache expensive function results.",
    objective: "Build a memoize function that caches results of expensive computations.",
    steps: [
      "Create a 'memoize' function that takes another function as an argument",
      "Inside memoize, create a cache object (closed-over variable)",
      "Return a new function that checks the cache before computing",
      "If the argument was seen before, return the cached result",
      "Otherwise, compute the result, store it in cache, and return it",
      "Test with a 'factorial' function and log cache hits",
    ],
    hints: [
      "Use JSON.stringify(args) as the cache key for multiple arguments",
      "The cache object persists between calls thanks to closure",
    ],
    starterCode: `// Create a memoize higher-order function\nfunction memoize(fn) {\n  // Your code here\n}\n\n// Test with factorial\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nconst memoizedFactorial = memoize(factorial);\n// Test it!\n`,
  },

  // Code Playground — Advanced: DOM Manipulation
  {
    id: "code-9",
    title: "DOM Manipulation",
    difficulty: "advanced",
    editor: "playground",
    description: "Learn how the DOM works by creating and modifying elements programmatically.",
    objective: "Write code that creates HTML elements, modifies attributes, and handles events (conceptual).",
    steps: [
      "Create an object representing a virtual DOM element with tag, attributes, and children",
      "Write a function 'createElement' that builds the element structure",
      "Write a function 'render' that converts the virtual DOM to an HTML string",
      "Create a nested structure: a div containing an h1, a paragraph, and a button",
      "Add an 'onclick' attribute to the button",
      "Log the final HTML string output",
    ],
    hints: [
      "Use template literals to build HTML strings",
      "Handle self-closing tags differently from container tags",
      "Children can be strings (text nodes) or other virtual elements",
    ],
    starterCode: `// Virtual DOM implementation\nfunction createElement(tag, attrs = {}, ...children) {\n  return { tag, attrs, children };\n}\n\nfunction render(vnode) {\n  // Convert virtual DOM to HTML string\n}\n\n// Build a UI\nconst app = createElement('div', { class: 'app' },\n  createElement('h1', {}, 'Hello DOM!'),\n  createElement('p', {}, 'This is virtual DOM rendering.'),\n  createElement('button', { onclick: 'alert(\"clicked\")' }, 'Click Me')\n);\n\nconsole.log(render(app));\n`,
  },

  // Code Playground — Intermediate: Event System
  {
    id: "code-10",
    title: "Event Emitter Pattern",
    difficulty: "intermediate",
    editor: "playground",
    description: "Implement a custom event system similar to DOM events.",
    objective: "Build an EventEmitter class with on, off, and emit methods.",
    steps: [
      "Create an EventEmitter class with a constructor initializing an events object",
      "Implement 'on(event, callback)' to register event listeners",
      "Implement 'off(event, callback)' to remove a specific listener",
      "Implement 'emit(event, ...args)' to trigger all listeners for an event",
      "Test by creating an emitter, adding listeners, emitting events",
      "Verify that 'off' correctly removes listeners",
    ],
    hints: [
      "Store events as { eventName: [callback1, callback2, ...] }",
      "Use .filter() in the off method to remove a specific callback",
    ],
    starterCode: `// Build a custom EventEmitter\nclass EventEmitter {\n  constructor() {\n    // Your code here\n  }\n\n  on(event, callback) { }\n  off(event, callback) { }\n  emit(event, ...args) { }\n}\n\n// Test it!\nconst emitter = new EventEmitter();\n`,
  },
];

export const getByEditor = (editor: Challenge["editor"]) =>
  challenges.filter((c) => c.editor === editor);

export const getById = (id: string) => challenges.find((c) => c.id === id);
