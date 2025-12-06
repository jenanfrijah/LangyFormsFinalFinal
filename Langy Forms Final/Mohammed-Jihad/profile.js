document.addEventListener('DOMContentLoaded', function () {
    // ✅ Define showFeedback — consistent with password script
    function showFeedback(message, type = 'error') {
        let feedbackEl = document.getElementById('profile-feedback');
        if (!feedbackEl) {
            feedbackEl = document.createElement('div');
            feedbackEl.id = 'profile-feedback';
            feedbackEl.style.padding = '10px';
            feedbackEl.style.margin = '10px 0';
            feedbackEl.style.borderRadius = '4px';
            feedbackEl.style.fontWeight = '500';
            feedbackEl.style.display = 'none';
            // Insert before profile view (fallback to top of body)
            const viewSection = document.getElementById('profile-view-section');
            if (viewSection) {
                viewSection.parentNode.insertBefore(feedbackEl, viewSection);
            } else {
                document.body.prepend(feedbackEl);
            }
        }

        if (type === 'success') {
            feedbackEl.style.backgroundColor = '#e8f5e9';
            feedbackEl.style.color = '#2e7d32';
        } else {
            feedbackEl.style.backgroundColor = '#ffecec';
            feedbackEl.style.color = '#d32f2f';
        }

        feedbackEl.textContent = message;
        feedbackEl.style.display = 'block';

        if (type === 'success') {
            setTimeout(() => {
                feedbackEl.style.display = 'none';
            }, 3000);
        }
    }

    // 🔐 Check login status
    const loggedInUsername = localStorage.getItem('loggedInUser');
    if (!loggedInUsername) {
        showFeedback("You must be logged in to view your profile.", "error");
        setTimeout(() => {
            window.location.href = "Login.html";
        }, 1500);
        return;
    }

    // 📦 Load users
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = users.find(u => u.username === loggedInUsername);

    if (!currentUser) {
        showFeedback("User data not found. Please log in again.", "error");
        setTimeout(() => {
            window.location.href = "Login.html";
        }, 1500);
        return;
    }

    // 📅 Helper: Format date for display (e.g., Jan 18, 2000)
    function formatDateForDisplay(dateStr) {
        if (!dateStr) return "—";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
    }

    // ✅ Populate profile view
    document.getElementById("profile-username").textContent = currentUser.username;
    document.getElementById("profile-email").textContent = currentUser.email;
    document.getElementById("profile-phone").textContent = currentUser.phone;
    document.getElementById("profile-dob").textContent = formatDateForDisplay(currentUser.dateOfBirth);

    // 🧩 DOM Elements
    const editBtn = document.getElementById("edit-profile-btn");
    const cancelBtn = document.getElementById("cancel-edit");
    const editForm = document.getElementById("profile-edit-form");
    const profileViewSection = document.getElementById("profile-view-section");
    const editFormSection = document.getElementById("edit-form-section");

    // ✏️ Edit → Show form, hide view
    editBtn.addEventListener('click', function () {
        // Prefill form
        document.getElementById("edit-username").value = currentUser.username;
        document.getElementById("edit-email").value = currentUser.email;
        document.getElementById("edit-phone").value = currentUser.phone;
        document.getElementById("edit-dob").value = currentUser.dateOfBirth;

        // Clear feedback & toggle visibility
        const feedbackEl = document.getElementById('profile-feedback');
        if (feedbackEl) feedbackEl.style.display = 'none';

        profileViewSection.style.display = 'none';
        editFormSection.style.display = 'block';
    });

    // 🚫 Cancel → Show view, hide form & clear feedback
    cancelBtn.addEventListener('click', function () {
        profileViewSection.style.display = 'block';
        editFormSection.style.display = 'none';

        const feedbackEl = document.getElementById('profile-feedback');
        if (feedbackEl) feedbackEl.style.display = 'none';
    });

    // 💾 Save changes
    editForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const updated = {
            username: document.getElementById("edit-username").value.trim(),
            email: document.getElementById("edit-email").value.trim(),
            phone: document.getElementById("edit-phone").value.trim(),
            dateOfBirth: document.getElementById("edit-dob").value.trim()
        };

        // 🔍 Validation
        if (!updated.username || !updated.email || !updated.phone || !updated.dateOfBirth) {
            showFeedback("All fields are required.", "error");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(updated.email)) {
            showFeedback("Invalid email format.", "error");
            return;
        }

        // 🔒 Username must be unique (excluding current user)
        const usernameExists = users.some(u => 
            u.username === updated.username && u.username !== currentUser.username
        );
        if (usernameExists) {
            showFeedback("Username already taken.", "error");
            return;
        }

        // 🎂 Age ≥ 12
        function calculateAge(dob) {
            const today = new Date();
            const birthDate = new Date(dob);
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }

        if (calculateAge(updated.dateOfBirth) < 12) {
            showFeedback("You must be at least 12 years old to use this service.", "error");
            return;
        }

        // ✅ Update user in array
        const userIndex = users.findIndex(u => u.username === loggedInUsername);
        users[userIndex] = { ...currentUser, ...updated };

        // 💾 Save to localStorage
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedInUser", updated.username);

        // 🔑 Sync sessionStorage too
        sessionStorage.setItem("loggedInUser", updated.username);

        // 🔄 Refresh displayed data
        document.getElementById("profile-username").textContent = updated.username;
        document.getElementById("profile-email").textContent = updated.email;
        document.getElementById("profile-phone").textContent = updated.phone;
        document.getElementById("profile-dob").textContent = formatDateForDisplay(updated.dateOfBirth);

        // 🎉 Switch back to view mode
        cancelBtn.click(); // reuse cancel logic (also hides feedback)

        showFeedback("✅ Profile updated successfully!", "success");
    });
});


