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

// // =============== Admin Access Check ===============
// document.addEventListener('DOMContentLoaded', () => {
//     const user = JSON.parse(localStorage.getItem('currentUser'));
//     if (!user || user.role !== 'admin') {
//         showMessage('Access denied!', 'danger');
//         setTimeout(() => {
//             window.location.href = 'index.html';
//         }, 2000);
//         return;
//     }
//     loadUsersTable();
//     document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
//         if (window.deleteUserId) {
//             deleteUser(window.deleteUserId);
//             const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
//             modal.hide();
//         }
//     });
// });

// =============== Load Users Table ===============
function loadUsersTable() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const tbody = document.getElementById("usersTableBody");
  tbody.innerHTML = "";

  if (users.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center">No users yet</td></tr>';
    return;
  }

  users.forEach((user, index) => {
    // حساب عدد النماذج التي أنشأها المستخدم
    const forms = JSON.parse(localStorage.getItem("forms")) || [];
    const userFormsCount = forms.filter(
      (f) => f.createdBy === user.username
    ).length;

    const statusBadge =
      user.status === "active"
        ? '<span class="badge badge-active">Active</span>'
        : '<span class="badge badge-pending">Pending</span>';

    const actionButtons = `
                    <button class="btn btn-sm btn-edit me-1" onclick="openEditModal('${user.username}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="showDeleteConfirm('${user.username}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                `;

    const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${user.username}</td>
                        <td>${user.email}</td>
                        <td>${statusBadge}</td>
                        <td>${userFormsCount}</td>
                        <td>${actionButtons}</td>
                    </tr>
                `;
    tbody.innerHTML += row;
  });
}

// =============== Open Edit Modal ===============
function openEditModal(username) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.username === username);
  if (!user) {
    showMessage("User not found.", "danger");
    return;
  }

  // ملء حقول المودال
  document.getElementById("editUsername").value = user.username;
  document.getElementById("editName").value = user.username; // اسم المستخدم هو الاسم
  document.getElementById("editEmail").value = user.email;
  document.getElementById("editStatus").value = user.status;

  // عرض المودال
  const modal = new bootstrap.Modal(document.getElementById("editUserModal"));
  modal.show();
}

// =============== Save Edited User ===============
function saveEditedUser() {
  const username = document.getElementById("editUsername").value;
  const newName = document.getElementById("editName").value.trim();
  const email = document.getElementById("editEmail").value.trim();
  const status = document.getElementById("editStatus").value;

  // التحقق من الحقول
  if (!newName || !email) {
    showMessage("All fields are required.", "warning");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  const index = users.findIndex((u) => u.username === username);
  if (index !== -1) {
    // تحديث بيانات المستخدم
    users[index].username = newName;
    users[index].email = email;
    users[index].status = status;
    localStorage.setItem("users", JSON.stringify(users));
    showMessage("User updated successfully!", "success");
    loadUsersTable(); // تحديث الجدول

    // إغلاق المودال
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("editUserModal")
    );
    modal.hide();
  }
}

// =============== Show Delete Confirmation Modal ===============
function showDeleteConfirm(userId) {
  window.deleteUserId = userId;
  const modal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  modal.show();
}

// =============== Delete User ===============
function deleteUser(userId) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users = users.filter((u) => u.username !== userId);
  localStorage.setItem("users", JSON.stringify(users));
  loadUsersTable();
  showMessage("User deleted successfully.", "success");
}
