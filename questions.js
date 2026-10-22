/**
 * Question Database for Auspify QuizMaster (Task 4 - Online Quiz Application)
 * Includes multiple categories, difficulty tiers, optional code snippets, and detailed explanations.
 */

const QUIZ_CATEGORIES = [
  {
    id: "javascript",
    title: "JavaScript & DOM Logic",
    description: "Closures, ES6+, Event Delegation, DOM Manipulation & Async JS.",
    icon: "⚡",
    accent: "#f59e0b"
  },
  {
    id: "frontend",
    title: "Frontend Web Development",
    description: "HTML5 Semantics, CSS Grid/Flexbox, Accessibility & Web Performance.",
    icon: "🎨",
    accent: "#0ea5e9"
  },
  {
    id: "cs_fundamentals",
    title: "Computer Science & Algorithms",
    description: "Data Structures, Big-O Complexity, Networking & System Fundamentals.",
    icon: "🧠",
    accent: "#8b5cf6"
  },
  {
    id: "mixed",
    title: "Full-Stack Challenge (Mixed)",
    description: "A randomized blend across JavaScript, Frontend UI, and CS Fundamentals.",
    icon: "🚀",
    accent: "#10b981"
  }
];

const QUESTION_DATABASE = {
  javascript: [
    {
      id: "js-1",
      difficulty: "Easy",
      points: 10,
      question: "Which DOM method returns the FIRST element within the document that matches the specified CSS selector?",
      code: "const card = document._______('.quiz-card');",
      options: [
        "document.querySelector()",
        "document.querySelectorAll()",
        "document.getElementsByClassName()",
        "document.getElementById()"
      ],
      correctIndex: 0,
      explanation: "document.querySelector() returns the first Element within the document that matches the specified CSS selector, whereas querySelectorAll() returns a static NodeList of all matching elements."
    },
    {
      id: "js-2",
      difficulty: "Medium",
      points: 10,
      question: "What will be logged to the console when the following JavaScript code executes?",
      code: "console.log(typeof null);\nconsole.log(Array.isArray([]));",
      options: [
        "\"object\" and true",
        "\"null\" and true",
        "\"object\" and \"array\"",
        "\"undefined\" and false"
      ],
      correctIndex: 0,
      explanation: "In JavaScript, typeof null returns \"object\" due to a legacy bug from the first implementation of JS. Array.isArray([]) reliably checks if a value is an array and returns true."
    },
    {
      id: "js-3",
      difficulty: "Medium",
      points: 10,
      question: "In DOM event handling, what is the exact difference between event.stopPropagation() and event.preventDefault()?",
      options: [
        "stopPropagation() prevents the event from bubbling up the DOM tree; preventDefault() cancels the browser's default action.",
        "preventDefault() stops event bubbling; stopPropagation() reloads the page.",
        "Both methods do the exact same thing in modern browsers.",
        "stopPropagation() only works on form inputs, while preventDefault() only works on anchor links."
      ],
      correctIndex: 0,
      explanation: "event.stopPropagation() halts further propagation of the current event in the capturing and bubbling phases, whereas event.preventDefault() stops the default browser behavior (like submitting a form or following a link)."
    },
    {
      id: "js-4",
      difficulty: "Medium",
      points: 10,
      question: "Which array method creates a NEW array populated with the results of calling a provided function on every element in the calling array?",
      code: "const scores = [10, 20, 30];\nconst doubled = scores._____(x => x * 2);",
      options: [
        "Array.prototype.map()",
        "Array.prototype.forEach()",
        "Array.prototype.filter()",
        "Array.prototype.reduce()"
      ],
      correctIndex: 0,
      explanation: "map() transforms each item in an array and returns a brand-new array of the same length. forEach() returns undefined and is used for side effects."
    },
    {
      id: "js-5",
      difficulty: "Hard",
      points: 15,
      question: "What is the output of the following asynchronous JavaScript snippet?",
      code: "console.log('1');\nsetTimeout(() => console.log('2'), 0);\nPromise.resolve().then(() => console.log('3'));\nconsole.log('4');",
      options: [
        "1, 4, 3, 2",
        "1, 2, 3, 4",
        "1, 4, 2, 3",
        "1, 3, 4, 2"
      ],
      correctIndex: 0,
      explanation: "Synchronous logs ('1' and '4') run first. Promise callbacks go into the Microtask Queue, which has higher priority than the Macrotask/Task Queue used by setTimeout, so '3' logs before '2'."
    },
    {
      id: "js-6",
      difficulty: "Easy",
      points: 10,
      question: "Which property is safest to use when inserting plain user-supplied text into a DOM element to prevent XSS (Cross-Site Scripting) attacks?",
      options: [
        "element.textContent",
        "element.innerHTML",
        "element.outerHTML",
        "document.write()"
      ],
      correctIndex: 0,
      explanation: "element.textContent treats the input strictly as plain text and does not parse HTML tags, preventing malicious <script> injection."
    },
    {
      id: "js-7",
      difficulty: "Medium",
      points: 10,
      question: "What does the 'dataset' property on an HTML element allow you to access in JavaScript?",
      code: "<button id=\"opt\" data-option-index=\"3\">Select</button>",
      options: [
        "All custom data-* attributes on the element (e.g., element.dataset.optionIndex)",
        "The internal SQLite database of the browser",
        "Only the class and id attributes of the element",
        "The JSON payload returned by fetch()"
      ],
      correctIndex: 0,
      explanation: "HTMLElement.dataset provides read/write access to custom data-* attributes on elements, automatically converting dashed names (data-option-index) to camelCase (dataset.optionIndex)."
    },
    {
      id: "js-8",
      difficulty: "Hard",
      points: 15,
      question: "What occurs when you declare a variable with 'let' or 'const' and try to access it before its declaration line within the same block?",
      options: [
        "A ReferenceError is thrown due to the Temporal Dead Zone (TDZ)",
        "It evaluates to undefined just like 'var'",
        "It evaluates to null",
        "JavaScript automatically assigns it to 0"
      ],
      correctIndex: 0,
      explanation: "Variables declared with let and const are hoisted but remain uninitialized in the Temporal Dead Zone (TDZ) until execution reaches the declaration statement, causing a ReferenceError if accessed early."
    },
    {
      id: "js-9",
      difficulty: "Easy",
      points: 10,
      question: "How do you store a JavaScript object in localStorage without losing its structure?",
      options: [
        "localStorage.setItem('key', JSON.stringify(obj))",
        "localStorage.saveObject('key', obj)",
        "localStorage.setItem('key', obj.toString())",
        "localStorage.push('key', obj)"
      ],
      correctIndex: 0,
      explanation: "Web Storage (localStorage and sessionStorage) only stores string key-value pairs. Serializing objects with JSON.stringify() and parsing them back with JSON.parse() preserves their structure."
    },
    {
      id: "js-10",
      difficulty: "Medium",
      points: 10,
      question: "What is Event Delegation in JavaScript DOM programming?",
      options: [
        "Attaching a single event listener to a parent element to handle events triggered by its current or future child elements",
        "Creating a separate event listener for every single button on the page",
        "Passing events from the browser back to the web server via WebSockets",
        "Disabling all click events on the document body"
      ],
      correctIndex: 0,
      explanation: "Event Delegation leverages event bubbling so a single listener on a parent container can inspect event.target (or event.target.closest()) to handle interactions for many dynamic child nodes efficiently."
    }
  ],

  frontend: [
    {
      id: "fe-1",
      difficulty: "Easy",
      points: 10,
      question: "In CSS Flexbox, which property aligns flex items along the MAIN axis?",
      options: [
        "justify-content",
        "align-items",
        "align-content",
        "place-self"
      ],
      correctIndex: 0,
      explanation: "justify-content controls alignment along the main axis (horizontal in a row, vertical in a column), while align-items controls alignment along the cross axis."
    },
    {
      id: "fe-2",
      difficulty: "Medium",
      points: 10,
      question: "What does the CSS rule 'box-sizing: border-box;' do to an element's dimensions?",
      options: [
        "Includes padding and border inside the element's specified width and height",
        "Adds padding and margin outside the specified width and height",
        "Automatically wraps the element inside a flex container",
        "Removes all borders when the viewport shrinks below 768px"
      ],
      correctIndex: 0,
      explanation: "With box-sizing: border-box, if you set width: 300px and padding: 20px, the total rendered box width remains 300px instead of expanding to 340px."
    },
    {
      id: "fe-3",
      difficulty: "Medium",
      points: 10,
      question: "Which CSS Grid declaration creates a responsive grid where columns automatically fit the container with a minimum width of 240px?",
      code: "grid-template-columns: ___________________________;",
      options: [
        "repeat(auto-fit, minmax(240px, 1fr))",
        "repeat(auto-grid, 240px 100%)",
        "flex-wrap(240px, auto)",
        "minmax(auto-fit, 240px)"
      ],
      correctIndex: 0,
      explanation: "repeat(auto-fit, minmax(240px, 1fr)) tells CSS Grid to fit as many columns of at least 240px as possible on a row and distribute leftover space equally (1fr)."
    },
    {
      id: "fe-4",
      difficulty: "Easy",
      points: 10,
      question: "Which HTML5 element is semantically best suited for the primary content unique to a webpage?",
      options: [
        "<main>",
        "<section>",
        "<div id=\"wrapper\">",
        "<aside>"
      ],
      correctIndex: 0,
      explanation: "The <main> landmark element identifies the dominant content of the <body> of a document and helps screen readers skip repetitive navigation."
    },
    {
      id: "fe-5",
      difficulty: "Medium",
      points: 10,
      question: "Which CSS unit is relative to the font-size of the root (<html>) element?",
      options: [
        "rem",
        "em",
        "vh",
        "ch"
      ],
      correctIndex: 0,
      explanation: "'rem' stands for 'root em' and scales consistently based on the root <html> font size, unlike 'em' which compounds relative to its parent element's font size."
    },
    {
      id: "fe-6",
      difficulty: "Hard",
      points: 15,
      question: "Which CSS selector has the HIGHEST specificity among the following?",
      options: [
        "#quizCard .option.selected",
        ".quiz-container .question-card .option:hover",
        "section main div ul li a",
        "[data-state=\"active\"] .btn"
      ],
      correctIndex: 0,
      explanation: "An ID selector (#quizCard) contributes (1, 0, 0) to specificity, outweighing any number of class (0, 1, 0) or element/type (0, 0, 1) selectors."
    },
    {
      id: "fe-7",
      difficulty: "Medium",
      points: 10,
      question: "Why is animating CSS 'transform' and 'opacity' preferred over animating 'top', 'left', or 'width'?",
      options: [
        "They can be GPU-accelerated on the compositor thread without triggering expensive layout reflows",
        "They are the only properties supported by @keyframes",
        "They automatically work without specifying transition durations",
        "They reduce the file size of the stylesheet"
      ],
      correctIndex: 0,
      explanation: "Modifying width/top triggers Layout (Reflow) and Paint on every frame, whereas transform and opacity can be handled directly by the GPU compositor for smooth 60fps animations."
    },
    {
      id: "fe-8",
      difficulty: "Easy",
      points: 10,
      question: "How do you define and use a custom CSS variable (custom property) globally?",
      options: [
        "Declare --primary: #2563eb; in :root and use var(--primary)",
        "Declare $primary: #2563eb; in body and use @primary",
        "Declare var-primary: #2563eb; in html and use env(primary)",
        "Declare --primary: #2563eb; and use css(--primary)"
      ],
      correctIndex: 0,
      explanation: "CSS Custom Properties start with two dashes (--name) inside :root (or any selector) and are referenced via the var(--name) function."
    },
    {
      id: "fe-9",
      difficulty: "Medium",
      points: 10,
      question: "What is the purpose of the 'aria-live=\"polite\"' attribute in accessible web applications?",
      options: [
        "It tells screen readers to announce dynamic content updates when the user is idle without interrupting their current speech",
        "It forces the browser to translate the page into the user's native language",
        "It enables live auto-reloading during local development",
        "It prevents keyboard users from tabbing into hidden modals"
      ],
      correctIndex: 0,
      explanation: "aria-live=\"polite\" notifies assistive technologies when dynamic DOM regions (such as quiz score updates or timer alerts) change, reading them aloud at the next graceful opportunity."
    },
    {
      id: "fe-10",
      difficulty: "Hard",
      points: 15,
      question: "When loading an external JavaScript file in the <head> with <script src=\"app.js\" defer></script>, when does the script execute?",
      options: [
        "It downloads in parallel with HTML parsing and executes after the HTML document has been fully parsed",
        "It pauses HTML parsing immediately, downloads, and executes before rendering continues",
        "It only executes after the user clicks somewhere on the page",
        "It executes after all external images and stylesheets have finished downloading"
      ],
      correctIndex: 0,
      explanation: "The 'defer' attribute downloads the script asynchronously in the background while HTML parses, and guarantees execution in order right before the DOMContentLoaded event fires."
    }
  ],

  cs_fundamentals: [
    {
      id: "cs-1",
      difficulty: "Easy",
      points: 10,
      question: "What is the time complexity of searching for a target value in a sorted array of N elements using Binary Search?",
      options: [
        "O(log N)",
        "O(N)",
        "O(N log N)",
        "O(1)"
      ],
      correctIndex: 0,
      explanation: "Binary Search halves the search space on every comparison, resulting in logarithmic time complexity O(log N)."
    },
    {
      id: "cs-2",
      difficulty: "Easy",
      points: 10,
      question: "Which data structure operates on the LIFO (Last-In, First-Out) principle and powers function call execution in programming languages?",
      options: [
        "Stack",
        "Queue",
        "Priority Heap",
        "Hash Table"
      ],
      correctIndex: 0,
      explanation: "A Stack follows Last-In, First-Out (LIFO): the most recently pushed stack frame is the first one popped when a function returns."
    },
    {
      id: "cs-3",
      difficulty: "Medium",
      points: 10,
      question: "What is the average-case time complexity for looking up a key in a well-distributed Hash Map / Hash Table?",
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N²)"
      ],
      correctIndex: 0,
      explanation: "By computing a hash index directly from the key, a Hash Table achieves O(1) constant average-case time for lookup, insertion, and deletion."
    },
    {
      id: "cs-4",
      difficulty: "Medium",
      points: 10,
      question: "In HTTP communication, what status code range indicates a Client Error (such as 400 Bad Request, 401 Unauthorized, or 404 Not Found)?",
      options: [
        "400 – 499",
        "200 – 299",
        "300 – 399",
        "500 – 599"
      ],
      correctIndex: 0,
      explanation: "HTTP status codes are grouped as: 2xx Success, 3xx Redirection, 4xx Client Error, and 5xx Server Error."
    },
    {
      id: "cs-5",
      difficulty: "Medium",
      points: 10,
      question: "Which graph traversal algorithm uses a Queue (FIFO) to explore nodes level by level and finds the shortest path in an unweighted graph?",
      options: [
        "Breadth-First Search (BFS)",
        "Depth-First Search (DFS)",
        "Binary Search",
        "Bubble Sort"
      ],
      correctIndex: 0,
      explanation: "Breadth-First Search (BFS) visits all neighbors at distance d before visiting nodes at distance d+1 using a FIFO Queue, guaranteeing the shortest path in unweighted graphs."
    },
    {
      id: "cs-6",
      difficulty: "Hard",
      points: 15,
      question: "What is the worst-case time complexity of Merge Sort on an array of N elements?",
      options: [
        "O(N log N)",
        "O(N²)",
        "O(N)",
        "O(log N)"
      ],
      correctIndex: 0,
      explanation: "Merge Sort recursively divides the array into log N levels and performs linear O(N) merging at each level, guaranteeing O(N log N) in best, average, and worst cases."
    },
    {
      id: "cs-7",
      difficulty: "Easy",
      points: 10,
      question: "In Git version control, what does the command 'git checkout -b feature-quiz' (or 'git switch -c feature-quiz') do?",
      options: [
        "Creates a new branch named 'feature-quiz' and immediately switches to it",
        "Deletes the branch named 'feature-quiz'",
        "Merges 'feature-quiz' into the main branch",
        "Uploads local commits to the remote repository"
      ],
      correctIndex: 0,
      explanation: "Both 'git checkout -b <name>' and the modern 'git switch -c <name>' create a new branch from the current HEAD and switch your working tree to it."
    },
    {
      id: "cs-8",
      difficulty: "Medium",
      points: 10,
      question: "Why is recursion without a valid base case dangerous in software execution?",
      options: [
        "It causes infinite function calls until the call stack memory is exhausted (Stack Overflow)",
        "It automatically formats the hard drive",
        "It converts synchronous code into an HTTP request",
        "It silently skips the function and returns null"
      ],
      correctIndex: 0,
      explanation: "Each recursive call allocates a new frame on the call stack. Without a terminating base case, the stack grows until it exceeds its memory limit, throwing a RangeError / Stack Overflow."
    },
    {
      id: "cs-9",
      difficulty: "Hard",
      points: 15,
      question: "Which SQL clause is used to filter grouped records AFTER an aggregation (such as COUNT or AVG) has been performed with GROUP BY?",
      options: [
        "HAVING",
        "WHERE",
        "ORDER BY",
        "DISTINCT"
      ],
      correctIndex: 0,
      explanation: "WHERE filters individual rows before grouping takes place, whereas HAVING filters groups created by the GROUP BY clause based on aggregate functions."
    },
    {
      id: "cs-10",
      difficulty: "Medium",
      points: 10,
      question: "What does idempotency mean in the context of RESTful HTTP methods (like GET, PUT, and DELETE)?",
      options: [
        "Making the same identical request multiple times produces the same server state as making it once",
        "The request is encrypted with a 256-bit TLS certificate",
        "The request executes in under 10 milliseconds",
        "The API endpoint never requires authentication"
      ],
      correctIndex: 0,
      explanation: "An operation is idempotent if repeating it multiple times has the exact same intended effect on server state as performing it a single time."
    }
  ]
};
