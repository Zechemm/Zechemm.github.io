document.addEventListener('DOMContentLoaded', (event) => {
    // Load saved notepad content from local storage when the page loads
    let savedContent = localStorage.getItem('debugpadContent');
    if (savedContent) {
        document.getElementById('notepadText').value = savedContent;
    }
});
const commands = ["help", "accountmanagement", "systemstatus", "systemrestart","debugnotepad"];

function showAlert(message) {
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;

    const customAlert = document.getElementById('customAlert');
    customAlert.classList.add('show');

    setTimeout(() => {
        customAlert.classList.remove('show');
        alertMessage.textContent = '';
    }, 3000);
}

function closeAlert() {
    const customAlert = document.getElementById('customAlert');
    customAlert.classList.remove('show');
}

function suggestCommands(input) {
    const suggestionsDiv = document.getElementById("suggestions");
    suggestionsDiv.innerHTML = "";

    if (input) {
        const matchingCommands = commands.filter(cmd => cmd.startsWith(input));
        matchingCommands.forEach(cmd => {
            const suggestion = document.createElement("p");
            suggestion.textContent = cmd;
            suggestion.addEventListener("click", () => {
                document.getElementById("commandInput").value = cmd;
                executeCommand(cmd);
                suggestionsDiv.classList.remove("active");
            });
            suggestionsDiv.appendChild(suggestion);
        });

        if (matchingCommands.length > 0) {
            suggestionsDiv.classList.add("active");
        } else {
            suggestionsDiv.classList.remove("active");
        }
    } else {
        suggestionsDiv.classList.remove("active");
    }
}

function handleCommand(event) {
    if (event.key === "Enter") {
        const input = document.getElementById("commandInput").value.trim();
        if (input) {
            executeCommand(input);
            document.getElementById("commandInput").value = "";
            document.getElementById("suggestions").classList.remove("active");
        }
    } else {
        const input = document.getElementById("commandInput").value.trim();
        suggestCommands(input);
    }
}
function openNotepad() {
    document.getElementById('notepadModal').style.display = 'block';
}

function closeNotepad() {
    document.getElementById('notepadModal').style.display = 'none';
}

function saveNotepad() {
    const notepadText = document.getElementById('notepadText').value;
    localStorage.setItem('debugpadContent', notepadText);
    closeNotepad();
}
function executeCommand(command) {
    const outputDiv = document.getElementById("output");

    // Clear previous output
    outputDiv.innerHTML = "";

    const newOutput = document.createElement("p");
    newOutput.style.color = "#ff0000";
    newOutput.textContent = `> ${command}`;
    outputDiv.appendChild(newOutput);

    switch (command.toLowerCase()) {
        case "help":
            outputDiv.innerHTML += `Welcome to The Network Command Console!

    Available commands:

                - accountmanagement
                - debugnotepad
                - help
                - systemrestart
                - systemstatus
            `;
            break;
        case "accountmanagement":
            outputDiv.innerHTML += "Executed ACCOUNTMANAGEMENT . . ."
            openAccountManagementModal();
            break;
        case "systemstatus":
            outputDiv.innerHTML += "System Status: All systems are operational.";
            break;
        case "systemrestart":
            outputDiv.innerHTML += "System is restarting...";
            setTimeout(() => {
                outputDiv.innerHTML += "\nSystem Restarted Successfully.";
            }, 2000);
            //ADD SYSTEM RESTART FUNCTION HERE
            break;
        case "debugnotepad":
            outputDiv.innerHTML += "Executed DEBUGPAD . . ."
            openNotepad()
            break;
        default:
            outputDiv.innerHTML += "Unknown command. Type 'help' for a list of available commands.";
            break;
    }
}

function openAccountManagementModal() {
    const accountManagementModal = document.getElementById("accountManagementModal");
    const accounts = JSON.parse(localStorage.getItem("sharedAccounts")) || [];
    const accountListDiv = document.getElementById("accountList");

    if (!accountListDiv) {
        console.error("Element with id 'accountList' not found.");
        return;
    }

    accountListDiv.innerHTML = "";

    if (accounts.length === 0) {
        accountListDiv.innerHTML = "<p>No accounts found.</p>";
    } else {
        accounts.forEach(account => {
            const accountItem = document.createElement("div");
            accountItem.className = "account-item";
            accountItem.innerHTML = `
                <p><strong>Username:</strong> ${account.username}</p>
                <button class="delete-btn" onclick="deleteAccount('${account.username}')">Delete</button>
                <button class="edit-btn" onclick="editAccount('${account.username}')">Edit</button>
            `;
            accountListDiv.appendChild(accountItem);
        });
    }

    accountManagementModal.style.display = "block";
}

function displayUserProfile(username) {
    const accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
    const user = accounts.find(user => user.username === username);

    if (user) {
        // Populate user profile modal with user information
        document.getElementById('currentUsername').textContent = user.username; // Update current username
        const badgeContainer = document.getElementById('badgeContainer');
        badgeContainer.innerHTML = '';

        // Display badges (unique)
        const uniqueBadges = [...new Set(user.badges)]; // Remove duplicates
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
        const userProfileModal = document.getElementById('profileModal');
        userProfileModal.style.display = 'block';
    } else {
        showAlert(`User '${username}' not found.`);
    }
}

function closeProfileModal() {
    const userProfileModal = document.getElementById('profileModal');
    userProfileModal.style.display = 'none';
}

function closeAccountManagementModal() {
    const accountManagementModal = document.getElementById("accountManagementModal");
    accountManagementModal.style.display = "none";
}

function editAccount(username) {
    displayUserProfile(username); // Display the user profile modal for editing
}

function deleteAccount(username) {
    let accounts = JSON.parse(localStorage.getItem("sharedAccounts")) || [];
    accounts = accounts.filter(account => account.username !== username);
    localStorage.setItem("sharedAccounts", JSON.stringify(accounts));
    openAccountManagementModal();
    showAlert(`Account '${username}' deleted successfully.`);
}

window.addEventListener("click", function(event) {
    const accountManagementModal = document.getElementById("accountManagementModal");
    if (event.target === accountManagementModal) {
        accountManagementModal.style.display = "none";
    }
});

// Disable forward button to prevent navigation
const forwardButton = document.querySelector('a[href="project-sol-menu.html"]');
if (forwardButton) {
    forwardButton.onclick = function(event) {
        const accounts = JSON.parse(localStorage.getItem('sharedAccounts')) || [];
        const loggedInUser = accounts.find(user => user.loggedIn);
        if (!loggedInUser) {
            event.preventDefault();
            showAlert('Please log in to access this page.');
        }
    };
}
