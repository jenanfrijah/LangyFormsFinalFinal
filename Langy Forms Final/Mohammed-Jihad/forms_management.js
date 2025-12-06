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
//     document.addEventListener('DOMContentLoaded', () => {
//         const user = JSON.parse(localStorage.getItem('currentUser'));
//         if (!user || user.role !== 'admin') {
//             showMessage('Access denied!', 'danger');
//             setTimeout(() => {
//                 window.location.href = 'index.html';
//             }, 2000);
//             return;
//         }

//         loadFormsTable();
//         document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
//             if (window.deleteFormId) {
//                 deleteForm(window.deleteFormId);
//                 const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
//                 modal.hide();
//             }
//         });
//     }
// );

// =============== Load Forms Table ===============
function loadFormsTable() {
  const forms = JSON.parse(localStorage.getItem("forms")) || [];
  const tbody = document.getElementById("formsTableBody");
  tbody.innerHTML = "";

  if (forms.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="text-center">No forms yet</td></tr>';
    return;
  }

  forms.forEach((form, index) => {
    const statusBadge =
      form.status === "active"
        ? '<span class="badge badge-active">Active</span>'
        : '<span class="badge badge-inactive">Inactive</span>';

    const actionButtons = `
                    <button class="btn btn-sm btn-edit me-1" onclick="editForm('${
                      form.formId
                    }')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-sm ${
                      form.status === "active"
                        ? "btn-deactivate"
                        : "btn-activate"
                    } me-1"
                            onclick="toggleFormStatus('${form.formId}')">
                        <i class="fas fa-toggle-${
                          form.status === "active" ? "off" : "on"
                        }"></i> 
                        ${form.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="showDeleteConfirm('${
                      form.formId
                    }')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                `;

    const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${form.title}</td>
                        <td>${form.questions?.length || 0}</td>
                        <td>${new Date(
                          form.createdAt
                        ).toLocaleDateString()}</td>
                        <td>${statusBadge}</td>
                        <td>${actionButtons}</td>
                    </tr>
                `;
    tbody.innerHTML += row;
  });
}

// =============== Toggle Form Status ===============
function toggleFormStatus(formId) {
  const forms = JSON.parse(localStorage.getItem("forms")) || [];
  const form = forms.find((f) => f.formId === formId);
  if (form) {
    form.status = form.status === "active" ? "inactive" : "active";
    localStorage.setItem("forms", JSON.stringify(forms));
    showMessage(`Form status updated to ${form.status}.`, "success");
    loadFormsTable();
  }
}

// =============== Show Delete Confirmation Modal ===============
function showDeleteConfirm(formId) {
  window.deleteFormId = formId;
  const modal = new bootstrap.Modal(
    document.getElementById("confirmDeleteModal")
  );
  modal.show();
}

// =============== Delete Form ===============
function deleteForm(formId) {
  let forms = JSON.parse(localStorage.getItem("forms")) || [];
  forms = forms.filter((f) => f.formId !== formId);
  localStorage.setItem("forms", JSON.stringify(forms));
  loadFormsTable();
  showMessage("Form deleted successfully.", "success");
}

// =============== Edit Form ===============
function editForm(formId) {
  // انتقل إلى صفحة إنشاء النموذج وقم بفتحه للتعديل
  window.location.href = `create_forms.html?formId=${formId}`;
}
