const prompt = require('prompt-sync')({sigint: true})

const questions = [
  {
    question: "What is the only food that cannot go bad?", 
    choices: ["Dark chocolate", "Peanut butter", "Canned tuna", "Honey"],
    answer: "Honey"
  },
  {
    question: "Which US city is the sunniest major city and sees more than 320 sunny days each year?",
    choices: ["Phoenix", "Miami", "San Francisco", "Austin"],
    answer: "Phoenix"
  },
  {
    question: "What type of food holds the world record for being the most stolen around the globe?",
    choices: ["Wagyu beef", "Cheese", "Coffee", "Chocolate"],
    answer: "Cheese"
  },
  {
    question: "What element does the chemical symbol Au stand for?", 
    choices: ["Silver", "Magnesium", "Salt", "Gold"],
    answer: "Gold"
  },
  {
    question: "What is the highest-grossing Broadway show of all time?", 
    choices: ["The Lion King", "Wicked", "Kinky Boots", "Hamilton"],
    answer: "The Lion King"
  }
]

let score = 0
let currentQuestionIndex = 0
let gameStartTime
const TIME_LIMIT = 120000
let timeIsUp = false

function displayQuestion() {
  const question = questions[currentQuestionIndex]
  console.log(`\nQuestion ${currentQuestionIndex + 1}: ${question.question}`)
  
  question.choices.forEach((choice, index) => {
    console.log(`${index + 1}. ${choice}`)
  })
}

function checkAnswer(userAnswer) {
  const question = questions[currentQuestionIndex]
  const correctAnswerIndex = question.choices.indexOf(question.answer) + 1
  
  if (parseInt(userAnswer) === correctAnswerIndex) {
    console.log("Correct!")
    score++
  } else {
    console.log(`Incorrect! The correct answer was ${correctAnswerIndex}. ${question.answer}`)
  }
}

function checkTime() {
  const elapsed = Date.now() - gameStartTime
  if (elapsed >= TIME_LIMIT) {
    timeIsUp = true
    console.log("\nTime's up!")
    endGame()
    return true
  }
  return false
}

function nextQuestion() {
  currentQuestionIndex++
  if (currentQuestionIndex < questions.length && !timeIsUp) {
    displayQuestion()
    getAnswerWithTimeout()
  } else if (!timeIsUp) {
    endGame()
  }
}

function getAnswerWithTimeout() {
  while (!timeIsUp) {
    if (checkTime()) break
    
    // Use a short timeout to periodically check the time
    const userAnswer = prompt("Your answer (1-4) or 'q' to quit: ", { timeout: 100 })
    
    if (userAnswer === 'q') {
      endGame()
      break
    }
    
    if (userAnswer && ['1', '2', '3', '4'].includes(userAnswer.trim())) {
      checkAnswer(userAnswer)
      nextQuestion()
      break
    } else if (userAnswer !== null) {
      console.log("Please enter a number between 1 and 4.")
    }
    
    // Small delay to prevent tight loop from consuming too much CPU
    if (!timeIsUp) require('deasync').sleep(100)
  }
}

function startGame() {
  console.log("Welcome to the CLI Trivia Game!")
  console.log(`You have 2 minutes to answer ${questions.length} questions.`)
  console.log("Enter the number of your answer choice (1-4) for each question.\n")
  
  gameStartTime = Date.now()
  displayQuestion()
  getAnswerWithTimeout()
}

function endGame() {
  timeIsUp = true
  console.log("\nThe Game's Over!")
  console.log(`Your final score is: ${score} out of ${questions.length}`)
  
  const percentage = (score / questions.length) * 100
  console.log(`That's ${percentage.toFixed(1)}% correct!`)
  
  if (percentage >= 80) {
    console.log("Excellent job! You're a trivia master!")
  } else if (percentage >= 60) {
    console.log("Good job! You know quite a bit!")
  } else if (percentage >= 40) {
    console.log("Not bad! Keep learning!")
  } else {
    console.log("Keep practicing! You'll get better!")
  }
  
  process.exit()
}

startGame()
