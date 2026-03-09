export interface Challenge {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  editor: "blockly" | "node-flow" | "playground";
  description: string;
  objective: string;
  steps: string[];
  hints: string[];
  starterCode?: string;
  expectedOutput?: string;
}

export const challenges: Challenge[] = [
  // Blockly challenges
  {
    id: "block-1",
    title: "Hello, World!",
    difficulty: "beginner",
    editor: "blockly",
    description: "Learn to use the print block to display text on the screen.",
    objective: "Use a text_print block with the text \"Hello, World!\" to display a message.",
    steps: [
      "Open the Text category in the toolbox on the left",
      "Drag a 'print' block onto the workspace",
      "Drag a 'text' block and connect it to the print block",
      "Type \"Hello, World!\" inside the text block",
      "Click the Run button to see your output",
    ],
    hints: [
      "The print block is in the Text category",
      "You need to connect a text block to provide the message",
    ],
  },
  {
    id: "block-2",
    title: "Simple Calculator",
    difficulty: "beginner",
    editor: "blockly",
    description: "Build a basic calculator that adds two numbers and prints the result.",
    objective: "Create a program that adds 15 + 27 and prints the result.",
    steps: [
      "Drag a 'print' block from the Text category",
      "Open the Math category and drag an arithmetic block",
      "Set the operation to addition (+)",
      "Add number blocks with values 15 and 27",
      "Connect the arithmetic block to the print block",
      "Run and verify the output is 42",
    ],
    hints: [
      "The arithmetic block has a dropdown to change the operation",
      "Number blocks are in the Math category",
    ],
  },
  {
    id: "block-3",
    title: "Loop Counter",
    difficulty: "intermediate",
    editor: "blockly",
    description: "Use a loop to print numbers from 1 to 10.",
    objective: "Create a 'count with' loop that prints each number from 1 to 10.",
    steps: [
      "Open the Loops category and drag a 'count with' block",
      "Set the loop to go from 1 to 10",
      "Add a print block inside the loop",
      "Use the loop variable (i) as the value to print",
      "Find the variable block in the Variables category",
      "Run and check that numbers 1 through 10 are printed",
    ],
    hints: [
      "The loop variable is automatically created — find it in Variables",
      "Make sure the print block is nested inside the loop",
    ],
  },
  {
    id: "block-4",
    title: "Even or Odd",
    difficulty: "intermediate",
    editor: "blockly",
    description: "Use logic blocks to check if a number is even or odd.",
    objective: "Create a program that checks if the number 7 is even or odd and prints the result.",
    steps: [
      "Create a variable called 'number' and set it to 7",
      "Drag an if/else block from Logic",
      "Use a math remainder operation to check if number % 2 equals 0",
      "Print 'Even' in the if branch and 'Odd' in the else branch",
      "Run and verify it prints 'Odd'",
    ],
    hints: [
      "Use the math arithmetic block with the modulo (%) operation",
      "The comparison block is in the Logic category",
    ],
  },
  {
    id: "block-5",
    title: "FizzBuzz",
    difficulty: "advanced",
    editor: "blockly",
    description: "Implement the classic FizzBuzz problem using blocks.",
    objective: "Loop 1–15: print 'FizzBuzz' if divisible by both 3 and 5, 'Fizz' if by 3, 'Buzz' if by 5, else the number.",
    steps: [
      "Create a loop from 1 to 15",
      "Add nested if/else blocks to check divisibility",
      "First check: divisible by both 3 AND 5 → print 'FizzBuzz'",
      "Second check: divisible by 3 → print 'Fizz'",
      "Third check: divisible by 5 → print 'Buzz'",
      "Else: print the number itself",
    ],
    hints: [
      "Use the logic AND block to combine two conditions",
      "Check the combined condition (3 and 5) first, then individual ones",
      "Use the modulo operation to check divisibility",
    ],
  },

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

  // Code Playground challenges
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
];

export const getByEditor = (editor: Challenge["editor"]) =>
  challenges.filter((c) => c.editor === editor);

export const getById = (id: string) => challenges.find((c) => c.id === id);
