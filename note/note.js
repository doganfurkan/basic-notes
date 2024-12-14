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
    // Create text and link elements instead of using innerHTML
    const parts = contentText.split(urlRegex);
    const matches = contentText.match(urlRegex) || [];
    
    content.textContent = ''; // Clear existing content
    
    parts.forEach((part, index) => {
      // Add text part
      content.appendChild(document.createTextNode(part));
      
      // Add link if there is a URL match
      if (index < matches.length) {
        const url = matches[index];
        const linkContainer = document.createElement('span');
        linkContainer.textContent = ' ';
        
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Open Link ';
        
        const img = document.createElement('img');
        img.src = '../link-simple.svg';
        img.alt = 'link';
        img.style.width = '16px';
        img.style.verticalAlign = 'middle';
        
        link.appendChild(img);
        linkContainer.appendChild(link);
        content.appendChild(linkContainer);
      }
    });
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
  const timestampElement = document.getElementById("note-created");
  timestampElement.textContent = `Created: ${date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })}`;
}

if(note.updated){
  const date = new Date(note.updated);
  const updatedElement = document.getElementById("note-updated");
  updatedElement.textContent = `Updated: ${date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  })}`;
}
