// 🎯 Dynamic quiz loader (lightweight, no duplication)
document.addEventListener("DOMContentLoaded", function () {
  // Get language from URL: quiz.html?lang=arabic
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get("lang")?.toLowerCase();

  if (!lang || !quizzes[lang]) {
    document.getElementById("quizForm").innerHTML = `
          <div class="alert alert-danger text-center">
            <h4><i class="fas fa-exclamation-triangle me-2"></i> Language Not Supported</h4>
            <p>“${lang || "Unknown"}” is not available.</p>
            <a href="user.html" class="btn btn-primary">← Back to Dashboard</a>
          </div>`;
    document.getElementById("quiz-title").textContent = "Error";
    return;
  }

  const questions = quizzes[lang];
  const langTitle = lang.charAt(0).toUpperCase() + lang.slice(1);
  document.getElementById("quiz-title").textContent = `${langTitle} Quiz`;

  // Build questions dynamically
  let html = "";
  questions.forEach((q, i) => {
    html += `
          <div class="card mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <h5 class="card-title mb-2">Question ${i + 1}</h5>
                <span class="language-badge bg-light text-dark">${langTitle}</span>
              </div>
              <p class="fw-bold mb-3">${q.q}</p>`;

    q.options.forEach((opt, j) => {
      const letter = String.fromCharCode(65 + j); // A, B, C, D
      html += `
            <div class="form-check mb-2">
              <input class="form-check-input" type="radio" name="q${i}" id="q${i}_${j}" value="${j}" required>
              <label class="form-check-label" for="q${i}_${j}">${letter}. ${opt}</label>
            </div>`;
    });

    html += `</div></div>`;
  });

  html += `
        <div class="text-center mt-4">
          <button type="button" id="submitBtn" class="btn btn-success btn-lg px-5">
            <i class="fas fa-paper-plane me-2"></i> Submit Answers
          </button>
        </div>`;

  document.getElementById("quizForm").innerHTML = html;

  // Handle submission
  document.getElementById("submitBtn").addEventListener("click", function () {
    // ✅ ADDED: Check for unanswered questions
    let unanswered = 0;
    for (let i = 0; i < questions.length; i++) {
      if (!document.querySelector(`input[name="q${i}"]:checked`)) {
        unanswered++;
      }
    }
    if (unanswered > 0) {
      alert("⚠️ Please answer all questions before submitting.");
      return;
    }

    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      const selected = document.querySelector(`input[name="q${i}"]:checked`);
      if (selected && parseInt(selected.value) === questions[i].answer) {
        score++;
      }
    }

    const total = questions.length;
    const percent = Math.round((score / total) * 100);
    const status = percent >= 50 ? "✅ Passed" : "⚠️ Failed";
    alert(
      `🎯 ${langTitle} Quiz Completed!\nScore: ${score}/${total} (${percent}%)\n${status}`
    );

    // Save to user history
    const username =
      localStorage.getItem("loggedInUser") ||
      sessionStorage.getItem("loggedInUser");
    if (!username) {
      alert("⚠️ You are not logged in. Results will not be saved.");
      return;
    }

    const userKey = `quizHistory_${username}`;
    const history = JSON.parse(localStorage.getItem(userKey) || "[]");
    history.push({
      language: lang,
      score,
      total,
      date: new Date().toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
    localStorage.setItem(userKey, JSON.stringify(history));
    console.log(`✅ Saved ${langTitle} quiz for ${username}`);

    document
      .querySelectorAll('input[type="radio"]:checked')
      .forEach((el) => (el.checked = false));
  });
});
