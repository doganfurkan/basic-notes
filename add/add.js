document.getElementById("saveNote").addEventListener("click", saveNote);
const sorting = localStorage.getItem("sorting");

// Load existing tags from localStorage
let existingTags = [];
if (localStorage.getItem("tags")) {
    existingTags = JSON.parse(localStorage.getItem("tags"));
    const tagSelect = document.getElementById("tag-select");
    existingTags.forEach(tag => {
        const option = document.createElement("option");
        option.value = tag;
        option.textContent = tag;
        tagSelect.appendChild(option);
    });
}


// Generate unique ID
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Note saving functionality
function saveNote() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("note-content").value;
    const tags = Array.from(selectedTags);

    if (!title || !content) {
        alert(chrome.i18n.getMessage("blankNote"));
        return;
    }

    const note = {
        id: generateUniqueId(),
        title,
        content,
        tags,
        timestamp: new Date().toISOString()
    };

    // Get existing notes or initialize empty array
    let notes = localStorage.getItem("notes") 
        ? JSON.parse(localStorage.getItem("notes")) 
        : [];

    // Add new note
    if(sorting == "true"){
        notes.push(note);
    }else{
        notes.unshift(note);
    }

    // Save back to localStorage
    localStorage.setItem("notes", JSON.stringify(notes));

    // Redirect back to main page
    window.location.href = "../index.html";
}

// Tag management
let selectedTags = new Set();

document.getElementById('tag-select').addEventListener('change', function(e) {
    const tag = e.target.value;
    if (tag && !selectedTags.has(tag)) {
        selectedTags.add(tag);
        updateTagDisplay();
    }
    e.target.value = ''; // Reset select
});

function updateTagDisplay() {
    const container = document.getElementById('selected-tags');
    container.innerHTML = '';
    selectedTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        tagElement.onclick = () => {
            selectedTags.delete(tag);
            updateTagDisplay();
        };
        container.appendChild(tagElement);
    });
}

document.getElementById('addTag').addEventListener('click', function() {
    const newTag = document.getElementById('new-tag').value.trim();
    if (newTag && newTag.length > 0) {
        // Add to selected tags
        selectedTags.add(newTag);
        updateTagDisplay();

        // Get existing tags from localStorage or initialize empty array
        let existingTags = localStorage.getItem('tags') 
            ? JSON.parse(localStorage.getItem('tags'))
            : [];

        // Add new tag if it doesn't exist
        if (!existingTags.includes(newTag)) {
            existingTags.push(newTag);
            localStorage.setItem('tags', JSON.stringify(existingTags));
        }

        // Update tag select options
        const tagSelect = document.getElementById('tag-select');
        const option = document.createElement('option');
        option.value = newTag;
        option.textContent = newTag;
        tagSelect.appendChild(option);

        document.getElementById('new-tag').value = ''; // Clear input after adding
    }
});
