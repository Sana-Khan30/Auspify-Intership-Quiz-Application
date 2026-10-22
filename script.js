/**
 * Auspify QuizMaster — Main Application Logic (Task 4 - Online Quiz Application)
 * Implements DOM Manipulation, Question Shuffling, Timer Engine, Auto-Scoring & Result Summary.
 */

(() => {
  // Application State
  const state = {
    selectedCategory: "javascript",
    questionCount: 10,
    timerSecondsPerQ: 30,
    feedbackMode: "instant", // 'instant' | 'exam'
    playerName: "",
    questions: [],
    currentIndex: 0,
    userAnswers: [], // { selectedOptionIndex, isCorrect, timeSpent, timedOut }
    streak: 0,
    bestStreak: 0,
    timerInterval: null,
    timeLeft: 30,
    quizStartTime: 0,
    totalTimeSpent: 0,
    reviewFilter: "all"
  };

  const STORAGE_KEYS = {
    THEME: "auspify_quiz_theme",
    HISTORY: "auspify_quiz_history",
    BEST_SCORE: "auspify_quiz_best_pct",
    PLAYER_NAME: "auspify_quiz_player"
  };

  // DOM Elements
  const dom = {
    homeScreen: document.getElementById("homeScreen"),
    quizScreen: document.getElementById("quizScreen"),
    resultScreen: document.getElementById("resultScreen"),

    brandHome: document.getElementById("brandHome"),
    bestScoreValue: document.getElementById("bestScoreValue"),
    themeToggleBtn: document.getElementById("themeToggleBtn"),
    themeIcon: document.getElementById("themeIcon"),

    playerNameInput: document.getElementById("playerNameInput"),
    questionCountSelect: document.getElementById("questionCountSelect"),
    timerModeSelect: document.getElementById("timerModeSelect"),
    instantFeedbackToggle: document.getElementById("instantFeedbackToggle"),
    categoryGrid: document.getElementById("categoryGrid"),
    startQuizBtn: document.getElementById("startQuizBtn"),

    activeCategoryTag: document.getElementById("activeCategoryTag"),
    questionCounterText: document.getElementById("questionCounterText"),
    streakCount: document.getElementById("streakCount"),
    timerBadge: document.getElementById("timerBadge"),
    timerCircle: document.getElementById("timerCircle"),
    timerText: document.getElementById("timerText"),
    progressBarFill: document.getElementById("progressBarFill"),
    questionDotsContainer: document.getElementById("questionDotsContainer"),

    questionDifficulty: document.getElementById("questionDifficulty"),
    questionPoints: document.getElementById("questionPoints"),
    questionText: document.getElementById("questionText"),
    codeSnippetBox: document.getElementById("codeSnippetBox"),
    optionsContainer: document.getElementById("optionsContainer"),
    explanationBox: document.getElementById("explanationBox"),
    explanationTitle: document.getElementById("explanationTitle"),
    explanationText: document.getElementById("explanationText"),

    prevQuestionBtn: document.getElementById("prevQuestionBtn"),
    nextQuestionBtn: document.getElementById("nextQuestionBtn"),
    quitQuizBtn: document.getElementById("quitQuizBtn"),

    resultTrophy: document.getElementById("resultTrophy"),
    resultHeadline: document.getElementById("resultHeadline"),
    resultSubheadline: document.getElementById("resultSubheadline"),
    finalScoreCircle: document.getElementById("finalScoreCircle"),
    finalPercentageText: document.getElementById("finalPercentageText"),
    finalGradeBadge: document.getElementById("finalGradeBadge"),
    finalPointsText: document.getElementById("finalPointsText"),
    correctCountText: document.getElementById("correctCountText"),
    wrongCountText: document.getElementById("wrongCountText"),
    skippedCountText: document.getElementById("skippedCountText"),
    timeTakenText: document.getElementById("timeTakenText"),

    retryQuizBtn: document.getElementById("retryQuizBtn"),
    newCategoryBtn: document.getElementById("newCategoryBtn"),
    toggleReviewBtn: document.getElementById("toggleReviewBtn"),
    reviewSection: document.getElementById("reviewSection"),
    reviewListContainer: document.getElementById("reviewListContainer"),
    historyTableWrapper: document.getElementById("historyTableWrapper"),
    clearHistoryBtn: document.getElementById("clearHistoryBtn")
  };

  // =========================================================================
  // Initialization
  // =========================================================================
  function init() {
    loadSavedPreferences();
    renderCategoryCards();
    updateBestScoreHeader();
    renderHistoryTable();
    bindEvents();
  }

  function loadSavedPreferences() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    dom.themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";

    const savedName = localStorage.getItem(STORAGE_KEYS.PLAYER_NAME) || "";
    dom.playerNameInput.value = savedName;
  }

  function bindEvents() {
    dom.themeToggleBtn.addEventListener("click", toggleTheme);
    dom.brandHome.addEventListener("click", () => switchScreen("home"));
    dom.startQuizBtn.addEventListener("click", startQuiz);

    dom.prevQuestionBtn.addEventListener("click", () => navigateQuestion(-1));
    dom.nextQuestionBtn.addEventListener("click", handleNextButton);
    dom.quitQuizBtn.addEventListener("click", () => {
      stopTimer();
      switchScreen("home");
    });

    dom.retryQuizBtn.addEventListener("click", startQuiz);
    dom.newCategoryBtn.addEventListener("click", () => switchScreen("home"));
    dom.toggleReviewBtn.addEventListener("click", () => {
      dom.reviewSection.scrollIntoView({ behavior: "smooth" });
    });

    dom.clearHistoryBtn.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      renderHistoryTable();
    });

    // Review filter chips
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        state.reviewFilter = chip.dataset.filter;
        renderReviewList();
      });
    });

    // Keyboard shortcuts (1-4 for options, Enter/ArrowRight for Next)
    document.addEventListener("keydown", (e) => {
      if (!dom.quizScreen.classList.contains("active")) return;
      if (["1", "2", "3", "4"].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        const optionButtons = dom.optionsContainer.querySelectorAll(".option-btn");
        if (optionButtons[idx] && !optionButtons[idx].disabled) {
          selectOption(idx);
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleNextButton();
      }
    });
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEYS.THEME, next);
    dom.themeIcon.textContent = next === "dark" ? "☀️" : "🌙";
  }

  // =========================================================================
  // Category Setup & Selection
  // =========================================================================
  function renderCategoryCards() {
    dom.categoryGrid.innerHTML = "";
    QUIZ_CATEGORIES.forEach((cat) => {
      const totalCount =
        cat.id === "mixed"
          ? Object.values(QUESTION_DATABASE).flat().length
          : QUESTION_DATABASE[cat.id].length;

      const card = document.createElement("div");
      card.className = `category-card ${state.selectedCategory === cat.id ? "selected" : ""}`;
      card.dataset.id = cat.id;

      card.innerHTML = `
        <div class="category-card-top">
          <div class="category-icon">${cat.icon}</div>
          <span class="category-count">${totalCount} Questions</span>
        </div>
        <div class="category-title">${cat.title}</div>
        <p class="category-desc">${cat.description}</p>
      `;

      card.addEventListener("click", () => {
        state.selectedCategory = cat.id;
        document.querySelectorAll(".category-card").forEach((el) => el.classList.remove("selected"));
        card.classList.add("selected");
      });

      dom.categoryGrid.appendChild(card);
    });
  }

  // =========================================================================
  // Quiz Engine & Question Preparation
  // =========================================================================
  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function prepareQuestions(categoryId, count) {
    let pool = [];
    if (categoryId === "mixed") {
      pool = [
        ...QUESTION_DATABASE.javascript,
        ...QUESTION_DATABASE.frontend,
        ...QUESTION_DATABASE.cs_fundamentals
      ];
    } else {
      pool = [...(QUESTION_DATABASE[categoryId] || QUESTION_DATABASE.javascript)];
    }

    const selected = shuffleArray(pool).slice(0, count);

    // Shuffle options within each question while tracking the correct option index
    return selected.map((q) => {
      const indexedOptions = q.options.map((text, idx) => ({
        text,
        isCorrect: idx === q.correctIndex
      }));
      const shuffledOptions = shuffleArray(indexedOptions);
      return {
        ...q,
        options: shuffledOptions.map((o) => o.text),
        correctIndex: shuffledOptions.findIndex((o) => o.isCorrect)
      };
    });
  }

  function startQuiz() {
    state.playerName = dom.playerNameInput.value.trim() || "Guest Learner";
    localStorage.setItem(STORAGE_KEYS.PLAYER_NAME, state.playerName);

    state.questionCount = parseInt(dom.questionCountSelect.value, 10) || 10;
    state.timerSecondsPerQ = parseInt(dom.timerModeSelect.value, 10);
    state.feedbackMode = dom.instantFeedbackToggle.value;

    state.questions = prepareQuestions(state.selectedCategory, state.questionCount);
    state.currentIndex = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.quizStartTime = Date.now();
    state.totalTimeSpent = 0;

    state.userAnswers = state.questions.map(() => ({
      selectedOptionIndex: null,
      isCorrect: false,
      timedOut: false
    }));

    const catObj = QUIZ_CATEGORIES.find((c) => c.id === state.selectedCategory);
    dom.activeCategoryTag.textContent = catObj ? catObj.title : "Quiz";

    switchScreen("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    stopTimer();
    const q = state.questions[state.currentIndex];
    const ans = state.userAnswers[state.currentIndex];
    const total = state.questions.length;

    // Update Header & Progress Bar
    dom.questionCounterText.textContent = `Question ${state.currentIndex + 1} of ${total}`;
    dom.streakCount.textContent = state.streak;
    const progressPct = ((state.currentIndex + 1) / total) * 100;
    dom.progressBarFill.style.width = `${progressPct}%`;

    renderQuestionDots();

    // Update Difficulty & Points
    dom.questionDifficulty.textContent = q.difficulty;
    dom.questionDifficulty.className = `difficulty-badge ${q.difficulty.toLowerCase()}`;
    dom.questionPoints.textContent = `+${q.points} pts`;

    // Question & Optional Code Block
    dom.questionText.textContent = q.question;
    if (q.code) {
      dom.codeSnippetBox.textContent = q.code;
      dom.codeSnippetBox.classList.remove("hidden");
    } else {
      dom.codeSnippetBox.classList.add("hidden");
    }

    // Render Answer Options
    dom.optionsContainer.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    const hasAnswered = ans.selectedOptionIndex !== null || ans.timedOut;

    q.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";

      let statusIcon = "";

      if (hasAnswered) {
        if (state.feedbackMode === "instant") {
          btn.disabled = true;
          if (idx === q.correctIndex) {
            btn.classList.add("correct");
            statusIcon = "✅";
          } else if (idx === ans.selectedOptionIndex && !ans.isCorrect) {
            btn.classList.add("wrong");
            statusIcon = "❌";
          }
        } else {
          // Exam Mode: allow changing selection before submitting
          if (idx === ans.selectedOptionIndex) {
            btn.classList.add("selected");
            statusIcon = "✓";
          }
        }
      }

      btn.innerHTML = `
        <div class="option-left">
          <span class="option-key">${letters[idx]}</span>
          <span class="option-label"></span>
        </div>
        <span class="option-status-icon">${statusIcon}</span>
      `;
      btn.querySelector(".option-label").textContent = optText;

      btn.addEventListener("click", () => selectOption(idx));
      dom.optionsContainer.appendChild(btn);
    });

    // Instant Explanation Box
    if (hasAnswered && state.feedbackMode === "instant") {
      showExplanation(q, ans);
    } else {
      dom.explanationBox.classList.add("hidden");
    }

    // Footer Navigation Buttons
    dom.prevQuestionBtn.disabled = state.currentIndex === 0;
    dom.nextQuestionBtn.textContent =
      state.currentIndex === total - 1 ? "Finish & View Results 🏆" : "Next Question →";

    // Start Timer if question not yet locked
    if (state.timerSecondsPerQ > 0 && !hasAnswered) {
      startQuestionTimer(state.timerSecondsPerQ);
      dom.timerBadge.classList.remove("hidden");
    } else if (state.timerSecondsPerQ === 0) {
      dom.timerBadge.classList.add("hidden");
    } else {
      dom.timerBadge.classList.remove("hidden");
      dom.timerBadge.classList.remove("danger");
      dom.timerText.textContent = ans.timedOut ? "0s" : "Done";
      dom.timerCircle.setAttribute("stroke-dasharray", "100, 100");
    }
  }

  function renderQuestionDots() {
    dom.questionDotsContainer.innerHTML = "";
    state.questions.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "q-dot";
      dot.textContent = idx + 1;

      const ans = state.userAnswers[idx];
      if (idx === state.currentIndex) {
        dot.classList.add("current");
      } else if (ans.selectedOptionIndex !== null || ans.timedOut) {
        if (state.feedbackMode === "instant") {
          dot.classList.add(ans.isCorrect ? "answered-correct" : "answered-wrong");
        } else {
          dot.classList.add("answered-neutral");
        }
      }

      dot.addEventListener("click", () => {
        state.currentIndex = idx;
        renderQuestion();
      });

      dom.questionDotsContainer.appendChild(dot);
    });
  }

  function selectOption(optionIndex) {
    const q = state.questions[state.currentIndex];
    const ans = state.userAnswers[state.currentIndex];

    // In instant feedback mode, lock after first selection
    if (state.feedbackMode === "instant" && (ans.selectedOptionIndex !== null || ans.timedOut)) {
      return;
    }

    stopTimer();

    const isCorrect = optionIndex === q.correctIndex;
    ans.selectedOptionIndex = optionIndex;
    ans.isCorrect = isCorrect;
    ans.timedOut = false;

    if (isCorrect) {
      state.streak += 1;
      if (state.streak > state.bestStreak) state.bestStreak = state.streak;
    } else {
      state.streak = 0;
    }

    renderQuestion();
  }

  function showExplanation(q, ans) {
    dom.explanationBox.classList.remove("hidden");
    if (ans.timedOut) {
      dom.explanationTitle.textContent = "⏰ Time's Up! Here's the Correct Concept:";
    } else if (ans.isCorrect) {
      dom.explanationTitle.textContent = "✅ Spot On! Explanation:";
    } else {
      dom.explanationTitle.textContent = "💡 Not Quite — Why the Correct Answer Works:";
    }
    dom.explanationText.textContent = q.explanation;
  }

  // =========================================================================
  // Timer Engine
  // =========================================================================
  function startQuestionTimer(seconds) {
    state.timeLeft = seconds;
    updateTimerUI(seconds, seconds);

    state.timerInterval = setInterval(() => {
      state.timeLeft -= 1;
      updateTimerUI(state.timeLeft, seconds);

      if (state.timeLeft <= 0) {
        stopTimer();
        handleTimeOut();
      }
    }, 1000);
  }

  function updateTimerUI(remaining, total) {
    dom.timerText.textContent = `${remaining}s`;
    const pct = Math.max(0, (remaining / total) * 100);
    dom.timerCircle.setAttribute("stroke-dasharray", `${pct}, 100`);

    if (remaining <= 5) {
      dom.timerBadge.classList.add("danger");
    } else {
      dom.timerBadge.classList.remove("danger");
    }
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function handleTimeOut() {
    const ans = state.userAnswers[state.currentIndex];
    ans.selectedOptionIndex = null;
    ans.isCorrect = false;
    ans.timedOut = true;
    state.streak = 0;
    renderQuestion();
  }

  function navigateQuestion(direction) {
    const nextIdx = state.currentIndex + direction;
    if (nextIdx >= 0 && nextIdx < state.questions.length) {
      state.currentIndex = nextIdx;
      renderQuestion();
    }
  }

  function handleNextButton() {
    if (state.currentIndex < state.questions.length - 1) {
      state.currentIndex += 1;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  // =========================================================================
  // Score Calculation & Results Summary (Steps 4 & 5)
  // =========================================================================
  function finishQuiz() {
    stopTimer();
    state.totalTimeSpent = Math.max(1, Math.round((Date.now() - state.quizStartTime) / 1000));

    let earnedPoints = 0;
    let maxPoints = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    state.questions.forEach((q, idx) => {
      maxPoints += q.points;
      const ans = state.userAnswers[idx];
      if (ans.selectedOptionIndex === null) {
        skippedCount += 1;
      } else if (ans.isCorrect) {
        correctCount += 1;
        earnedPoints += q.points;
      } else {
        wrongCount += 1;
      }
    });

    const accuracyPct = Math.round((correctCount / state.questions.length) * 100);
    const gradeInfo = computeGrade(accuracyPct);

    // Update Result DOM
    dom.resultTrophy.textContent = gradeInfo.icon;
    dom.resultHeadline.textContent = `${gradeInfo.headline}, ${state.playerName}!`;
    dom.resultSubheadline.textContent = gradeInfo.subtext;

    dom.finalPercentageText.textContent = `${accuracyPct}%`;
    dom.finalGradeBadge.textContent = `Grade ${gradeInfo.grade}`;
    dom.finalPointsText.textContent = `${earnedPoints} / ${maxPoints} pts`;

    dom.correctCountText.textContent = correctCount;
    dom.wrongCountText.textContent = wrongCount;
    dom.skippedCountText.textContent = skippedCount;
    dom.timeTakenText.textContent = formatDuration(state.totalTimeSpent);

    // Animate SVG Circular Gauge (Circumference = 2 * PI * 50 ≈ 314)
    const circumference = 314;
    const dash = (accuracyPct / 100) * circumference;
    dom.finalScoreCircle.setAttribute("stroke-dasharray", `0 ${circumference}`);
    setTimeout(() => {
      dom.finalScoreCircle.setAttribute("stroke-dasharray", `${dash} ${circumference}`);
    }, 80);

    // Persist Attempt & Best Score
    saveQuizAttempt({
      player: state.playerName,
      category: QUIZ_CATEGORIES.find((c) => c.id === state.selectedCategory)?.title || "Quiz",
      scorePct: accuracyPct,
      points: `${earnedPoints}/${maxPoints}`,
      correct: `${correctCount}/${state.questions.length}`,
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    });

    updateBestScoreHeader();
    renderReviewList();
    renderHistoryTable();

    switchScreen("result");
  }

  function computeGrade(pct) {
    if (pct >= 90) {
      return {
        grade: "A+",
        icon: "🏆",
        headline: "Outstanding Mastery",
        subtext: "You demonstrated exceptional command across the quiz concepts!"
      };
    }
    if (pct >= 75) {
      return {
        grade: "A",
        icon: "🌟",
        headline: "Great Job",
        subtext: "Strong performance! Review the missed questions below to reach 100%."
      };
    }
    if (pct >= 60) {
      return {
        grade: "B",
        icon: "👍",
        headline: "Solid Effort",
        subtext: "You have a good foundation. Check the explanations below to sharpen your edge."
      };
    }
    return {
      grade: "C",
      icon: "🎯",
      headline: "Keep Practicing",
      subtext: "Every expert starts somewhere! Study the explanations below and try again."
    };
  }

  function renderReviewList() {
    dom.reviewListContainer.innerHTML = "";

    state.questions.forEach((q, idx) => {
      const ans = state.userAnswers[idx];
      const isCorrect = ans.isCorrect;

      if (state.reviewFilter === "correct" && !isCorrect) return;
      if (state.reviewFilter === "incorrect" && isCorrect) return;

      const userChoiceText =
        ans.selectedOptionIndex !== null
          ? q.options[ans.selectedOptionIndex]
          : ans.timedOut
          ? "Timed Out (No Answer)"
          : "Unanswered";

      const correctChoiceText = q.options[q.correctIndex];

      const item = document.createElement("div");
      item.className = `review-item ${isCorrect ? "correct" : "incorrect"}`;

      item.innerHTML = `
        <div class="review-item-header">
          <span>Question ${idx + 1} • ${q.difficulty} (${q.points} pts)</span>
          <span>${isCorrect ? "✅ Correct" : "❌ Incorrect"}</span>
        </div>
        <div class="review-q-title"></div>
        <div class="review-answers-meta">
          <div><strong>Your Answer:</strong> <span class="user-ans-span"></span></div>
          <div><strong>Correct Answer:</strong> <span class="correct-ans-span"></span></div>
        </div>
        <div class="review-exp"></div>
      `;

      item.querySelector(".review-q-title").textContent = q.question;
      item.querySelector(".user-ans-span").textContent = userChoiceText;
      item.querySelector(".correct-ans-span").textContent = correctChoiceText;
      item.querySelector(".review-exp").textContent = `💡 ${q.explanation}`;

      dom.reviewListContainer.appendChild(item);
    });

    if (!dom.reviewListContainer.children.length) {
      dom.reviewListContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem;">No questions match this filter.</p>`;
    }
  }

  // =========================================================================
  // Persistence (LocalStorage Leaderboard & Best Score)
  // =========================================================================
  function saveQuizAttempt(entry) {
    const prevBest = parseInt(localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || "0", 10);
    if (entry.scorePct > prevBest) {
      localStorage.setItem(STORAGE_KEYS.BEST_SCORE, String(entry.scorePct));
    }

    let history = [];
    try {
      history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
    } catch {
      history = [];
    }
    history.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history.slice(0, 8)));
  }

  function updateBestScoreHeader() {
    const best = parseInt(localStorage.getItem(STORAGE_KEYS.BEST_SCORE) || "0", 10);
    dom.bestScoreValue.textContent = `${best}%`;
  }

  function renderHistoryTable() {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || "[]");
    } catch {
      history = [];
    }

    if (!history.length) {
      dom.historyTableWrapper.innerHTML = `<p style="color: var(--text-muted); font-size: 0.88rem;">No quiz attempts recorded yet. Complete a quiz to see your score history!</p>`;
      return;
    }

    const table = document.createElement("table");
    table.className = "history-table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>Player</th>
          <th>Topic</th>
          <th>Accuracy</th>
          <th>Correct</th>
          <th>Points</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector("tbody");
    history.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>${escapeHtml(row.player)}</strong></td>
        <td>${escapeHtml(row.category)}</td>
        <td><strong>${row.scorePct}%</strong></td>
        <td>${row.correct}</td>
        <td>${row.points}</td>
        <td>${row.date}</td>
      `;
      tbody.appendChild(tr);
    });

    dom.historyTableWrapper.innerHTML = "";
    dom.historyTableWrapper.appendChild(table);
  }

  // =========================================================================
  // Helpers
  // =========================================================================
  function switchScreen(screenName) {
    dom.homeScreen.classList.remove("active");
    dom.quizScreen.classList.remove("active");
    dom.resultScreen.classList.remove("active");

    if (screenName === "home") dom.homeScreen.classList.add("active");
    if (screenName === "quiz") dom.quizScreen.classList.add("active");
    if (screenName === "result") dom.resultScreen.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function formatDuration(totalSec) {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Run on DOM Ready
  document.addEventListener("DOMContentLoaded", init);
})();
