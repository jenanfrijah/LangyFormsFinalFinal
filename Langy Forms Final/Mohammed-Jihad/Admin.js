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
//     updateStats();
// });

// =============== Logout ===============
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// =============== Update Stats (Users & Forms) ===============
function updateStats() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const forms = JSON.parse(localStorage.getItem("forms")) || [];

  document.getElementById("totalUsers").textContent = users.length;
  document.getElementById("totalForms").textContent = forms.length;
}
