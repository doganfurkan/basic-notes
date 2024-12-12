// Get note ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const noteId = urlParams.get('id');

// Get notes from localStorage
const notes = JSON.parse(localStorage.getItem('notes') || '[]');
const note = notes[noteId];

if (note) {
  document.getElementById('title').textContent = note.title || '';
  const content = document.getElementById('content');
  const contentText = note.content || '';
  
  // Check if content contains a URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hasUrl = urlRegex.test(contentText);

  if (hasUrl) {
    // Replace URLs with text + link icon
    content.innerHTML = contentText.replace(urlRegex, url => 
      `${url} <a href="${url}" target="_blank" rel="noopener noreferrer">Open Link <img src="../link-simple.svg" alt="link" style="width: 16px; vertical-align: middle;"></a>`
    );
  } else {
    content.textContent = contentText;
  }
  
  if (note.tags && note.tags.length > 0) {
    const tagsContainer = document.getElementById('tags');
    note.tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.textContent = tag;
      tagsContainer.appendChild(tagElement);
    });
  }
}

// Apply theme if dark mode is enabled
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

document.getElementById("back").addEventListener("click", () => {
  window.location.href = "../index.html";
});

document.getElementById("noteTheme").addEventListener("click", () => {
  changeTheme();
});

function changeTheme(){
    let thm;
    document.body.classList.toggle("dark");
    if(localStorage.getItem("theme") === "dark"){
        thm = "light"
    } else if(localStorage.getItem("theme") === "light"){
        thm = "dark"
    } else{
        thm = "light"
    }
    localStorage.setItem("theme", thm)
}

document.getElementById("editNote").addEventListener("click", () => {
  window.location.href = "../edit/edit.html?id=" + noteId;
});

document.getElementById("deleteNote").addEventListener("click", () => {
  deleteNote(noteId);
});

function deleteNote(a) {
  if (window.confirm("Do you want to delete this item?")) {
    notes.splice(a, 1);
    console.log(`Note number ${a} is deleted`);
    localStorage.setItem("notes", JSON.stringify(notes));
    window.location.href = "../index.html";
  }
}

if(note.timestamp){
  const date = new Date(note.timestamp);
  document.getElementById("note-created").innerHTML = `Created: ${date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })}`;
}

if(note.updated){
  const date = new Date(note.updated);
  document.getElementById("note-updated").innerHTML = `Updated: ${date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })}`;
}

