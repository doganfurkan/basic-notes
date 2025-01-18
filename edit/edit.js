// Get note ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const noteId = urlParams.get("id");

// Get notes from localStorage
const notes = JSON.parse(localStorage.getItem("notes") || "[]");
const note = notes[noteId];

// Populate form with existing note data
if (note) {
  document.getElementById("title").value = note.title || "";
  document.getElementById("note-content").value = note.content || "";

  if (note.tags && note.tags.length > 0) {
    const tagsContainer = document.getElementById("selected-tags");
    note.tags.forEach((tag) => {
      const tagElement = document.createElement("div");
      tagElement.className = "tag";
      const span = document.createElement("span");
      span.textContent = "×";
      span.addEventListener("click", () => removeTag(span));
      tagElement.textContent = tag + " ";
      tagElement.appendChild(span);
      tagsContainer.appendChild(tagElement);
    });
  }
}

// Populate tag select with existing tags
// Get saved tags from localStorage
const savedTags = JSON.parse(localStorage.getItem("tags") || "[]");
const tagSelect = document.getElementById("tag-select");

// Get currently selected tags by looking at the tag elements in the container
const currentTags = Array.from(
  document.getElementById("selected-tags").children
).map((tag) => {
  // Need to handle the × character and extra whitespace carefully
  return tag.textContent.slice(0, -1).trim(); // Remove the × and trim whitespace
});

// Add saved tags that aren't already selected to the dropdown
savedTags.forEach((tag) => {
  if (!currentTags.includes(tag)) {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagSelect.appendChild(option);
  }
});

// Handle tag selection from dropdown
tagSelect.addEventListener("change", (e) => {
  if (e.target.value) {
    const tagText = e.target.value;
    const tagsContainer = document.getElementById("selected-tags");

    // Create and add the tag element
    const tagElement = document.createElement("div");
    tagElement.className = "tag";
    const span = document.createElement("span");
    span.textContent = "×";
    span.addEventListener("click", () => removeTag(span));
    tagElement.textContent = tagText + " ";
    tagElement.appendChild(span);
    tagsContainer.appendChild(tagElement);

    // Remove the selected option from dropdown
    e.target.remove(e.target.selectedIndex);

    // Reset select to default option
    e.target.value = "";
  }
});

// Back button handling
document.getElementById("back").addEventListener("click", () => {
  window.location.href = "../note/note.html?id=" + noteId;
});

// Tag handling
document.getElementById("addTag").addEventListener("click", () => {
  const newTagInput = document.getElementById("new-tag");
  const tagText = newTagInput.value.trim();

  if (tagText) {
    // Get existing tags from localStorage or initialize empty array
    let savedTags = JSON.parse(localStorage.getItem("savedTags") || "[]");

    // Add new tag if it doesn't exist
    if (!savedTags.includes(tagText)) {
      savedTags.push(tagText);
      localStorage.setItem("savedTags", JSON.stringify(savedTags));
    }

    const tagsContainer = document.getElementById("selected-tags");
    const tagElement = document.createElement("div");
    tagElement.className = "tag";
    const span = document.createElement("span");
    span.textContent = "×";
    span.addEventListener("click", () => removeTag(span));
    tagElement.textContent = tagText + " ";
    tagElement.appendChild(span);
    tagsContainer.appendChild(tagElement);
    newTagInput.value = "";
  }
});

function removeTag(element) {
  // Get the tag text without the × symbol
  const tagText = element.parentElement.textContent.replace("×", "").trim();

  // Get saved tags and notes from localStorage
  let savedTags = JSON.parse(localStorage.getItem("savedTags") || "[]");
  let notes = JSON.parse(localStorage.getItem("notes") || "[]");

  // Remove tag from savedTags array
  const tagIndex = savedTags.indexOf(tagText);
  if (tagIndex > -1) {
    savedTags.splice(tagIndex, 1);
    localStorage.setItem("savedTags", JSON.stringify(savedTags));
  }

  // Remove the tag element from the DOM
  element.parentElement.remove();
}

// Update note
document.getElementById("updateNote").addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const content = document.getElementById("note-content").value;
  const tagElements = document.querySelectorAll(".tag");
  const tags = Array.from(tagElements).map((tag) =>
    tag.textContent.replace("×", "").trim()
  );
  const timestamp = note.timestamp;

  if (title && content) {
    notes[noteId] = {
      title,
      content,
      tags,
      updated: new Date().toISOString(),
      timestamp: timestamp,
    };

    localStorage.setItem("notes", JSON.stringify(notes));
    window.location.href = "../note/note.html?id=" + noteId;
  } else {
    alert("Please fill in both title and content");
  }
});
