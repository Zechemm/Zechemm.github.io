let loginSection, programSection, userProfileModal;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    loginSection = document.getElementById('loginSection');
    programSection = document.getElementById('programSection');
    userProfileModal = document.getElementById('userProfileModal');
    


    // Check login status on page load
    checkLoginStatus();

    // Handle browser refresh (F5 or refresh button)
    window.addEventListener('beforeunload', () => {
        const accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
        const loggedInUser = accounts.find(user => user.loggedIn);
        if (loggedInUser) {
            loggedInUser.loggedIn = false;
            localStorage.setItem('sharedAccounts', JSON.stringify(accounts));
        }
    });
});

// Function to show alerts
function showAlert(message, isSuccess = false) {
    const alertBox = document.getElementById('customAlert');
    if (alertBox) {
        const alertMessage = document.getElementById('alertMessage');
        alertMessage.textContent = message;

        if (isSuccess) {
            alertBox.style.borderColor = "green";
            alertMessage.style.color = "green";
        } else {
            alertBox.style.borderColor = "red";
            alertMessage.style.color = "red";
        }

        alertBox.classList.add('show');
        setTimeout(() => {
            alertBox.classList.remove('show');
        }, 3000);
    } else {
        console.error('Alert box element not found in the document.');
    }
}

// Function to assign badge to a user
function assignBadge() {
    const badgeSelect = document.getElementById('badgeSelect');
    const selectedBadge = badgeSelect.value;

    if (!selectedBadge) {
        showAlert("Please select a badge to assign.");
        return;
    }

    // Show the custom input popup
    const customInputPopup = document.getElementById('customInputPopup');
    const inputMessage = document.getElementById('inputMessage');
    const inputUsername = document.getElementById('inputUsername');

    inputMessage.textContent = "Enter the username to assign the badge:";
    inputUsername.value = '';

    customInputPopup.style.display = 'block';

    // Function to confirm input
    window.confirmInput = function() {
        const username = inputUsername.value.trim();

        if (!username) {
            showAlert("Username not provided.");
            customInputPopup.style.display = 'none';
            return;
        }

        let accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
        const userToAssign = accounts.find(user => user.username === username);

        if (userToAssign) {
            // Add the selected badge to the user's badges array if not already present
            if (!userToAssign.badges.includes(selectedBadge)) {
                userToAssign.badges.push(selectedBadge);

                // Save updated accounts back to local storage
                localStorage.setItem('sharedAccounts', JSON.stringify(accounts));

                // Display success message
                showAlert(`Badge '${selectedBadge}' assigned to user '${username}' successfully!`, true);
            } else {
                showAlert(`Badge '${selectedBadge}' is already assigned to user '${username}'.`);
            }
        } else {
            showAlert(`User '${username}' not found.`);
        }

        // Hide the input popup after processing
        customInputPopup.style.display = 'none';
    };

    // Function to cancel input
    window.cancelInput = function() {
        customInputPopup.style.display = 'none';
    };
}
// Function to remove selected badge
// Function to handle editing a user's details
function editUser(username) {
    // Display the custom input popup
    const popup = document.getElementById('customInputPopup');
    popup.style.display = 'block';

    // Set the username in the input field
    const usernameInput = document.getElementById('usernameInput');
    usernameInput.value = username;

    // Update badge select options or handle dynamically

    // Update or clear existing badge selection

    // Display the "Add Badges" button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Badges';
    addButton.onclick = function() {
        assignBadge();
    };

    popup.appendChild(addButton);

    // Display the "Remove Badges" button
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove Badges';
    removeButton.onclick = function() {
        removeBadge();
    };

    popup.appendChild(removeButton);
}

// Function to remove badges from selected username
function removeBadge() {
    // Show the custom input popup for username input
    const customInputPopup = document.getElementById('customInputPopup');
    const inputMessage = document.getElementById('inputMessage');
    const inputUsername = document.getElementById('inputUsername');

    inputMessage.textContent = "Enter the username to remove the badge:";
    inputUsername.value = '';

    customInputPopup.style.display = 'block';

    // Function to confirm input
    window.confirmInput = function() {
        const username = inputUsername.value.trim();

        if (!username) {
            showAlert("Username not provided.");
            customInputPopup.style.display = 'none';
            return;
        }

        let accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
        const userToRemove = accounts.find(user => user.username === username);

        if (userToRemove) {
            const badgeSelect = document.getElementById('badgeSelect');
            const selectedBadge = badgeSelect.value;

            if (!selectedBadge) {
                showAlert("Please select a badge to remove.");
                customInputPopup.style.display = 'none';
                return;
            }

            // Remove the selected badge from the user's badges array if present
            const badgeIndex = userToRemove.badges.indexOf(selectedBadge);
            if (badgeIndex !== -1) {
                userToRemove.badges.splice(badgeIndex, 1);

                // Save updated accounts back to local storage
                localStorage.setItem('sharedAccounts', JSON.stringify(accounts));

                // Display success message
                showAlert(`Badge '${selectedBadge}' removed from user '${username}' successfully!`, true);
            } else {
                showAlert(`Badge '${selectedBadge}' is not assigned to user '${username}'.`);
            }
        } else {
            showAlert(`User '${username}' not found.`);
        }

        // Hide the input popup after processing
        customInputPopup.style.display = 'none';
    };

    // Function to cancel input
    window.cancelInput = function() {
        customInputPopup.style.display = 'none';
    };
}









// Function to display user profile
function displayUserProfile() {
    const accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
    const loggedInUser = accounts.find(user => user.loggedIn);

    if (loggedInUser) {
        document.getElementById('currentUsername').textContent = loggedInUser.username; // Update current username
        const badgeContainer = document.getElementById('badgeContainer');
        badgeContainer.innerHTML = '';

        // Display badges (unique)
        const uniqueBadges = [...new Set(loggedInUser.badges)]; // Remove duplicates
        uniqueBadges.forEach(badge => {
            const badgeContainerDiv = document.createElement('div');
            badgeContainerDiv.classList.add('badge-container');

            const badgeImage = document.createElement('img');
            badgeImage.src = `${badge.toLowerCase()}-badge.png`; // Assuming badges are named similarly to their corresponding images
            badgeImage.alt = `${badge} Badge`;
            badgeImage.classList.add('badge');
            badgeContainerDiv.appendChild(badgeImage);

            const badgeText = document.createElement('span');
            badgeText.textContent = badge.toUpperCase(); // Set badge name as text content (convert to uppercase)
            badgeText.classList.add('badge-text');
            badgeContainerDiv.appendChild(badgeText);

            badgeContainer.appendChild(badgeContainerDiv);
        });
    }
}

// Function to check login status and update UI
function checkLoginStatus() {
    if (loginSection && programSection) {
        const accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
        const loggedInUser = accounts.find(user => user.loggedIn);

        if (loggedInUser) {
            // If user is logged in, show program section and user profile
            loginSection.classList.add('hidden');
            programSection.classList.remove('hidden');
            displayUserProfile();
        } else {
            // If no active session, show login section
            loginSection.classList.remove('hidden');
            programSection.classList.add('hidden');
        }
    } else {
        console.error('Login section or program section elements not found in the document.');
    }
}

// Function to authenticate user login
function authenticate() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
    const loggedInUser = accounts.find(user => user.username === username && user.password === password);

    if (loggedInUser) {
        // Set loggedIn flag for the user and update local storage
        loggedInUser.loggedIn = true;
        localStorage.setItem('sharedAccounts', JSON.stringify(accounts));

        // Clear login fields and show program section and user profile
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        if (loginSection && programSection) {
            loginSection.classList.add('hidden');
            programSection.classList.remove('hidden');
            displayUserProfile();
        }
        
        // Handle browser history navigation to prevent staying logged in
        window.history.pushState(null, '', 'index.html'); // Ensure proper URL
        window.addEventListener('popstate', function () {
            logout();
            history.pushState(null, '', 'index.html');
        });

        showAlert('Login successful.', true);
    } else {
        showAlert('Invalid username or password.');
    }
}
function closeAlert() {
    const customAlert = document.getElementById('customAlert');
    customAlert.classList.remove('show');
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
    const user = accounts.find(acc => acc.username === username && acc.password === password);

    if (user) {
        user.loggedIn = true;
        localStorage.setItem('sharedAccounts', JSON.stringify(accounts));
        // Hide the login section
        document.getElementById('loginSection').classList.add('hidden');

        // Show the program section
        document.getElementById('programSection').classList.remove('hidden');
        showAlert("Login Successful")
        return user;
    } else {
        showAlert('Invalid credentials')
        return null;
    }
}
function getLoggedInUser() {
    const accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
    return accounts.find(user => user.loggedIn) || null;
}
// Function to log out user
function logout() {
    const accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
    const loggedInUser = accounts.find(user => user.loggedIn);

    if (loggedInUser) {
        loggedInUser.loggedIn = false;
        localStorage.setItem('sharedAccounts', JSON.stringify(accounts));

        // Refresh the page after logging out
        location.reload();

        if (loginSection && programSection) {
            loginSection.classList.remove('hidden');
            programSection.classList.add('hidden');
            closeUserProfileModal();
        }

        showAlert('Logged out successfully.', true);
    } else {
        showAlert('Already logged out.');
    }
}

// Function to open create account modal
function openCreateAccount() {
    const createAccountModal = document.getElementById('createAccountModal');
    if (createAccountModal) {
        createAccountModal.style.display = 'block';
    } else {
        console.error('Create account modal element not found.');
    }
}

// Function to close create account modal and clear fields
function closeCreateAccountModal() {
    const createAccountModal = document.getElementById('createAccountModal');
    if (createAccountModal) {
        createAccountModal.style.display = 'none';
        clearCreateAccountFields();
    } else {
        console.error('Create account modal element not found.');
    }
}

// Function to create a new account
function createAccount() {
    const newUsername = document.getElementById('newUsername').value.trim();
    const verifyUsername = document.getElementById('verifyUsername').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const verifyPassword = document.getElementById('verifyPassword').value.trim();

    if (newUsername === '' || verifyUsername === '' || newPassword === '' || verifyPassword === '') {
        showAlert('Please fill in all fields.');
        return;
    }

    if (newUsername !== verifyUsername) {
        showAlert('Usernames do not match.');
        return;
    }

    if (newPassword !== verifyPassword) {
        showAlert('Passwords do not match.');
        return;
    }

    let accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
    const existingUser = accounts.find(user => user.username === newUsername);

    if (existingUser) {
        showAlert('Username already exists.');
        return;
    }

    const newAccount = {
        username: newUsername,
        password: newPassword,
        badges: [], // Initialize badges array
        loggedIn: false
    };

    accounts.push(newAccount);
    localStorage.setItem('sharedAccounts', JSON.stringify(accounts));
    closeCreateAccountModal();
    showAlert('Account created successfully.', true);
}

// Function to clear create account modal fields
function clearCreateAccountFields() {
    document.getElementById('newUsername').value = '';
    document.getElementById('verifyUsername').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('verifyPassword').value = '';
}

// Function to update user account details
function updateAccount() {
    const newUsername = document.getElementById('editUsername').value.trim();
    const newPassword = document.getElementById('editPassword').value.trim();

    let accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
    const loggedInUser = accounts.find(user => user.loggedIn);

    if (loggedInUser) {
        if (newUsername !== '') {
            const existingUser = accounts.find(user => user.username === newUsername);
            if (existingUser && existingUser !== loggedInUser) {
                showAlert('Username already exists.');
                return;
            }
            loggedInUser.username = newUsername;
        }

        if (newPassword !== '') {
            loggedInUser.password = newPassword;
        }

        // Update badges if needed (assuming badges are updated similarly)
        loggedInUser.badges = []; // Update with logic to modify badges

        localStorage.setItem('sharedAccounts', JSON.stringify(accounts));
        displayUserProfile();
        showAlert('Account updated successfully.', true);
    } else {
        showAlert('User not logged in.');
    }
}

// Function to open user profile modal
function openUserProfile() {
    const accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];

    // Find the logged-in user
    const loggedInUser = accounts.find(user => user.loggedIn);

    // Check if a logged-in user was found
    if (loggedInUser) {
        document.getElementById('currentUsername').textContent = loggedInUser.username; // Update current username
        const badgeContainer = document.getElementById('badgeContainer');
        badgeContainer.innerHTML = '';

        // Display badges (unique)
        const uniqueBadges = [...new Set(loggedInUser.badges)]; // Remove duplicates
        uniqueBadges.forEach(badge => {
            const badgeImage = document.createElement('img');
            badgeImage.src = `${badge.toLowerCase()}-badge.png`; // Assuming badge images are named accordingly
            badgeImage.alt = `${badge} Badge`;
            badgeImage.classList.add('badge');
            badgeImage.style.width = '50px'; // Set badge width
            badgeImage.style.height = 'auto'; // Set badge height
            badgeContainer.appendChild(badgeImage);
        });

        // Show the profile modal
        if (userProfileModal) {
            userProfileModal.style.display = 'block';
        } else {
            console.error('User profile modal element not found.');
        }
    } else {
        showAlert("No user logged in.");
    }
}


// Function to close user profile modal and clear fields
function closeUserProfileModal() {
    if (userProfileModal) {
        userProfileModal.style.display = 'none';
        clearUserProfileFields();
    } else {
        console.error('User profile modal element not found.');
    }
}

// Function to clear user profile modal fields
function clearUserProfileFields() {
    document.getElementById('editUsername').value = '';
    document.getElementById('editPassword').value = '';
}
