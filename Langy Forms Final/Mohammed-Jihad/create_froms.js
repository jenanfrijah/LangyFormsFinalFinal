// =============== Show Inline Message ===============
function showMessage(text, type = "danger") {
  const box = document.getElementById("messageBox");
  if (!box) return;
  box.textContent = text;
  box.className = `alert alert-${type} alert-dismissible fade show`;
  box.classList.remove("d-none");
  setTimeout(() => {
    box.classList.add("d-none");
  }, 5000);
}

// =============== Admin Access Check ===============
// document.addEventListener('DOMContentLoaded', () => {
//     const user = JSON.parse(localStorage.getItem('currentUser'));
//     if (!user || user.role !== 'admin') {
//         showMessage('Access denied!', 'danger');
//         setTimeout(() => {
//             window.location.href = 'index.html';
//         }, 2000);
//         return;
//     }
//     // تهيئة الحقول
//     initFormBuilder();
// });

// =============== Logout ===============
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// =============== Initialize Form Builder ===============
let currentForm = {
  title: "",
  description: "",
  status: "active",
  questions: [],
};

function initFormBuilder() {
  // إعداد زر "Clear Question"
  document
    .getElementById("clearQuestionBtn")
    .addEventListener("click", clearQuestion);

  // إعداد زر "Add Option"
  document.getElementById("addOptionBtn").addEventListener("click", addOption);

  // إعداد زر "Add Question to Form"
  document
    .getElementById("addQuestionToFormBtn")
    .addEventListener("click", addQuestionToForm);

  // إعداد زر "Save Form"
  document.getElementById("saveFormBtn").addEventListener("click", saveForm);

  // تحديث قائمة الخيارات عند تغيير نوع السؤال
  document
    .getElementById("questionType")
    .addEventListener("change", updateOptionsSection);
}

// =============== Clear Question ===============
function clearQuestion() {
  document.getElementById("questionText").value = "";
  document.getElementById("requiredCheck").checked = true;
  document.getElementById("fontSelect").value = "sans-serif";
  document.getElementById("optionInput").value = "";
  document.getElementById("optionsList").innerHTML = "";
  document.getElementById("correctAnswerList").innerHTML = "";
  updateOptionsSection(); // لإعادة عرض القسم بشكل صحيح
}

// =============== Update Options Section ===============
function updateOptionsSection() {
  const type = document.getElementById("questionType").value;
  const optionsSection = document.getElementById("optionsSection");
  const optionsList = document.getElementById("optionsList");
  const correctAnswerList = document.getElementById("correctAnswerList");

  if (type === "text") {
    optionsSection.style.display = "none";
  } else {
    optionsSection.style.display = "block";
    // إذا لم يكن هناك خيارات، أضف خيارًا افتراضيًا
    if (optionsList.innerHTML === "" && correctAnswerList.innerHTML === "") {
      addOption(); // أضف خيارًا افتراضيًا
    }
  }
}

// =============== Add Option ===============
function addOption() {
  const optionInput = document.getElementById("optionInput");
  const optionValue = optionInput.value.trim();
  if (!optionValue) {
    showMessage("Please enter an option.", "warning");
    return;
  }

  const optionsList = document.getElementById("optionsList");
  const correctAnswerList = document.getElementById("correctAnswerList");
  const optionId = "option_" + Date.now();

  // إضافة الخيار إلى قائمة الخيارات
  const optionItem = document.createElement("div");
  optionItem.className = "option-item";
  optionItem.innerHTML = `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="correctAnswer" id="${optionId}" ${
    correctAnswerList.children.length === 0 ? "checked" : ""
  }>
                    <label class="form-check-label" for="${optionId}">${optionValue}</label>
                </div>
                <button class="btn btn-sm btn-remove remove-option" data-id="${optionId}">Remove</button>
            `;
  optionsList.appendChild(optionItem);

  // إضافة الخيار إلى قائمة الإجابة الصحيحة
  const correctAnswerItem = document.createElement("div");
  correctAnswerItem.className = "option-item";
  correctAnswerItem.innerHTML = `
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="correctAnswer" id="correct_${optionId}" ${
    correctAnswerList.children.length === 0 ? "checked" : ""
  }>
                    <label class="form-check-label" for="correct_${optionId}">${optionValue}</label>
                </div>
                <button class="btn btn-sm btn-remove remove-correct-option" data-id="${optionId}">Remove</button>
            `;
  correctAnswerList.appendChild(correctAnswerItem);

  // مسح حقل الإدخال
  optionInput.value = "";

  // ربط زر الحذف
  optionItem
    .querySelector(".remove-option")
    .addEventListener("click", function () {
      removeOption(this.getAttribute("data-id"));
    });
  correctAnswerItem
    .querySelector(".remove-correct-option")
    .addEventListener("click", function () {
      removeCorrectOption(this.getAttribute("data-id"));
    });
}

// =============== Remove Option ===============
function removeOption(optionId) {
  const optionElement = document.getElementById(optionId);
  if (optionElement) {
    optionElement.closest(".option-item").remove();
  }
  removeCorrectOption(optionId); // إزالة من قائمة الإجابة الصحيحة أيضًا
}

// =============== Remove Correct Option ===============
function removeCorrectOption(optionId) {
  const correctElement = document.getElementById("correct_" + optionId);
  if (correctElement) {
    correctElement.closest(".option-item").remove();
  }
  // إذا لم يكن هناك خيارات، أضف خيارًا افتراضيًا
  if (document.getElementById("correctAnswerList").children.length === 0) {
    addOption();
  }
}

// =============== Add Question to Form ===============
function addQuestionToForm() {
  const questionText = document.getElementById("questionText").value.trim();
  const required = document.getElementById("requiredCheck").checked;
  const font = document.getElementById("fontSelect").value;
  const type = document.getElementById("questionType").value;

  if (!questionText) {
    showMessage("Please enter a question text.", "warning");
    return;
  }

  let options = [];
  let correctAnswer = "";

  if (type !== "text") {
    const optionsList = document.getElementById("optionsList");
    const correctAnswerList = document.getElementById("correctAnswerList");

    // جمع الخيارات
    Array.from(optionsList.children).forEach((item) => {
      const label = item.querySelector(".form-check-label").textContent;
      options.push(label);
    });

    // جمع الإجابة الصحيحة
    const correctRadio = correctAnswerList.querySelector(
      'input[type="radio"]:checked'
    );
    if (correctRadio) {
      correctAnswer = correctRadio.nextElementSibling.textContent;
    }
  }

  // إنشاء كائن السؤال
  const question = {
    text: questionText,
    type: type,
    required: required,
    font: font,
    options: options,
    correctAnswer: correctAnswer,
  };

  // إضافة السؤال إلى القائمة
  currentForm.questions.push(question);

  // تحديث عرض الأسئلة
  renderQuestionsList();

  // مسح الحقول
  clearQuestion();
}

// =============== Render Questions List ===============
function renderQuestionsList() {
  const list = document.getElementById("formQuestionsList");
  list.innerHTML = "";

  currentForm.questions.forEach((q, index) => {
    const questionPreview = document.createElement("div");
    questionPreview.className = "question-preview";
    questionPreview.innerHTML = `
                    <span>Question ${index + 1}: ${q.text}</span>
                    <button class="btn btn-sm btn-remove delete-question-btn" data-index="${index}">Delete</button>
                `;
    list.appendChild(questionPreview);

    // ربط زر الحذف
    questionPreview
      .querySelector(".delete-question-btn")
      .addEventListener("click", function () {
        deleteQuestion(parseInt(this.getAttribute("data-index")));
      });
  });
}

// =============== Delete Question ===============
function deleteQuestion(index) {
  currentForm.questions.splice(index, 1);
  renderQuestionsList();
}

// =============== Save Form ===============
function saveForm() {
  const title = document.getElementById("formTitle").value.trim();
  const description = document.getElementById("formDescription").value.trim();
  const status = document.getElementById("formStatus").value;

  if (!title) {
    showMessage("Please enter a form title.", "warning");
    return;
  }

  if (currentForm.questions.length === 0) {
    showMessage("Please add at least one question.", "warning");
    return;
  }

  // إنشاء كائن النموذج
  const form = {
    formId: "form_" + Date.now(),
    title: title,
    description: description,
    status: status,
    questions: currentForm.questions,
    createdAt: new Date().toISOString(),
  };

  // جلب النماذج الحالية
  let forms = JSON.parse(localStorage.getItem("forms")) || [];

  // حفظ النموذج
  forms.push(form);
  localStorage.setItem("forms", JSON.stringify(forms));

  showMessage("Form saved successfully!", "success");

  // إعادة تعيين النموذج الحالي
  currentForm = {
    title: "",
    description: "",
    status: "active",
    questions: [],
  };

  // مسح الحقول
  document.getElementById("formTitle").value = "";
  document.getElementById("formDescription").value = "";
  document.getElementById("formStatus").value = "active";
  renderQuestionsList();
}
