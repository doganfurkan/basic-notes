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
  
  // Check if content contains URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = contentText.match(urlRegex);

  if (urls) {       
    content.textContent = contentText;
        
    // Create and add links for each URL after the text
    urls.forEach((url, index) => {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      let linkText = urls.length > 1 ? `Open Link ${index + 1}` : 'Open Link';
      link.textContent = linkText;
          
      const img = document.createElement('img');
      img.src = '../images/link-simple.svg';
      img.alt = 'link';
      img.style.width = '16px';
      img.style.verticalAlign = 'middle';
          
      link.appendChild(img);
      content.appendChild(link);
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
