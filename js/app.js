// Select elements
const quizBox = document.getElementById('quiz');
const resultsBox = document.getElementById('results');
const submitButton = document.getElementById('submit');
const previousButton = document.getElementById('previous');
const nextButton = document.getElementById('next');
const resetButton = document.getElementById('reset');
const timerDisplay = document.getElementById('time');

// Variables for questions, slides, and timer
let myQuestions = [];
let currentSlide = 0;
let timer;
let timeLeft = 60; // Set countdown start (in seconds)

// Fetch questions
fetch('json/questions.json')
    .then(response => response.json())
    .then(data => {
        myQuestions = data;
        buildQuiz();
        showSlide(0);
        startTimer();
    })
    .catch(error => console.error("Error loading questions:", error));

// Function to build quiz
function buildQuiz() {
    const output = myQuestions.map((question, questionNumber) => {
        const answers = Object.keys(question.answers).map(letter =>
            `<label>
                <input type="radio" name="question${questionNumber}" value="${letter}">
                ${letter} : ${question.answers[letter]}
            </label>`
        ).join('');
        return `
            <div class="slide">
                <div class="question">${questionNumber + 1}. ${question.question}</div>
                <div class="answers">${answers}</div>
            </div>`;
    });
    quizBox.innerHTML = output.join('');
}

// Function to show results
function showResults() {
    clearInterval(timer);
    let numCorrect = 0;
    const answerBoxes = quizBox.querySelectorAll('.answers');
    myQuestions.forEach((question, questionNumber) => {
        const answerBox = answerBoxes[questionNumber];
        const userAnswer = (answerBox.querySelector(`input[name="question${questionNumber}"]:checked`) || {}).value;
        if (userAnswer === question.correctAnswer) {
            numCorrect++;
            answerBox.style.color = 'green';
        } else {
            answerBox.style.color = 'red';
        }
    });
    resultsBox.innerHTML = `You got ${numCorrect} out of ${myQuestions.length} correct.`;
}

// Timer function
function startTimer() {
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showResults();
        }
    }, 1000);
}

// Reset quiz function
function resetQuiz() {
    clearInterval(timer);
    timeLeft = 60;
    timerDisplay.textContent = timeLeft;
    currentSlide = 0;
    document.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
    resultsBox.innerHTML = '';
    buildQuiz();
    showSlide(0);
    startTimer();
}

// Slide navigation functions
function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    currentSlide = n;
    previousButton.style.display = currentSlide === 0 ? 'none' : 'inline-block';
    nextButton.style.display = currentSlide === slides.length - 1 ? 'none' : 'inline-block';
    submitButton.style.display = currentSlide === slides.length - 1 ? 'inline-block' : 'none';
}

function showNextSlide() {
    showSlide(currentSlide + 1);
}

function showPreviousSlide() {
    showSlide(currentSlide - 1);
}

// Event listeners
submitButton.addEventListener('click', showResults);
previousButton.addEventListener('click', showPreviousSlide);
nextButton.addEventListener('click', showNextSlide);
resetButton.addEventListener('click', resetQuiz);
