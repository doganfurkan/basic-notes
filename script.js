document.getElementById("baslik").addEventListener("keypress", check);
document.getElementById("theme").addEventListener("click", changeTheme);

let notes = localStorage.getItem("notes")
  ? JSON.parse(localStorage.getItem("notes"))
  : [];

update();

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark")
}

// Load tags from localStorage and create filter buttons
let tags = localStorage.getItem("tags") 
    ? JSON.parse(localStorage.getItem("tags")) 
    : [];

// Create filter buttons for each tag
tags.forEach(tag => {
    const filterBtn = document.createElement("span");
    filterBtn.textContent = tag;
    
    // Create delete button
    const deleteBtn = document.createElement("button"); 
    deleteBtn.textContent = "×";
    deleteBtn.className = "tag-delete";
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent filter click
        
        if (window.confirm("Do you want to delete this tag? It will be removed from all notes that have it.")) {
            // Remove tag from localStorage
            tags = tags.filter(t => t !== tag);
            localStorage.setItem("tags", JSON.stringify(tags));
            
            // Remove tag from all notes that have it
            notes = notes.map(note => {
                if (note.tags && note.tags.includes(tag)) {
                    note.tags = note.tags.filter(t => t !== tag);
                }
                return note;
            });
            localStorage.setItem("notes", JSON.stringify(notes));
            
            // Remove button from DOM
            filterBtn.remove();
        }
    });
    
    filterBtn.appendChild(deleteBtn);
    
    filterBtn.addEventListener("click", (e) => {
        if(e.target === deleteBtn) return; // Don't filter if delete was clicked
        
        // Remove chosen class from all buttons
        document.querySelectorAll("#filters span").forEach(btn => {
            btn.classList.remove("chosen");
        });
        // Add chosen class to clicked button
        filterBtn.classList.add("chosen");
        
        // Filter notes
        if (notes.length > 0) {
            const filteredNotes = notes.filter(note => {
                // Handle both old string notes and new note objects with tags
                if (typeof note === 'string') return false;
                return note.tags && note.tags.includes(tag);
            });
            
            if (filteredNotes.length === 0) {
                document.getElementById("list").innerHTML = "<span>No notes with this tag</span>";
            } else {
                document.getElementById("list").innerHTML = "";
                filteredNotes.forEach((note, index) => {
                    let s = document.createElement("div");
                    const noteIndex = notes.indexOf(note);
                    s.innerHTML = `<span>${note.title}</span><button class="deleteButton" dataId="${noteIndex}"><img src="trash-simple-fill.svg"/></button>`;
                    if (typeof note === 'object') {
                        s.querySelector('span').style.cursor = 'pointer';
                        s.querySelector('span').addEventListener('click', () => {
                            window.location.href = `note/note.html?id=${noteIndex}`;
                        });
                    }
                    document.getElementById("list").appendChild(s);
                });
            }
        }
    });
    document.getElementById("filters").appendChild(filterBtn);
});

// Add click handler for "All" button to show all notes
document.getElementById("all").addEventListener("click", (e) => {
    document.querySelectorAll("#filters span").forEach(btn => {
        btn.classList.remove("chosen");
    });
    e.target.classList.add("chosen");
    update();
});


function update() {
  if (notes.length == 0) {
    document.getElementById("list").innerHTML =
      "<span>There is nothing here</span>";
  } else {
    document.getElementById("list").innerHTML = "";
    for (let i = 0; i < notes.length; i++) {
      let noteText = typeof notes[i] === 'string' ? notes[i] : notes[i].title;
      let s = document.createElement("div");
      s.innerHTML = `<span>${noteText}</span><button class="deleteButton" dataId="${i}"><img src="trash-simple-fill.svg"/></button>`;
      if (typeof notes[i] === 'object') {
        s.querySelector('span').style.cursor = 'pointer';
        s.querySelector('span').addEventListener('click', () => {
          window.location.href = `note/note.html?id=${i}`;
        });
      }
      document.getElementById("list").appendChild(s);
    }
    if (document.getElementsByClassName("deleteButton").length > 0) {
      for (
        let k = 0;
        k < document.getElementsByClassName("deleteButton").length;
        k++
      ) {
        document
          .getElementsByClassName("deleteButton")
          [k].addEventListener("click", () => {
            deleteNote(
              document
                .getElementsByClassName("deleteButton")
                [k].getAttribute("dataId")
            );
          });
      }
    }
  }
}

function check(event) {
  if (event.keyCode === 13) {
    let s = document.createElement("div");
    s.innerHTML = `<span>${
      document.getElementById("baslik").value
    }</span><button class="deleteButton" dataId="${
      notes.length
    }"><img src="trash-simple.svg"/></button>`;
    notes.push(document.getElementById("baslik").value);
    document.getElementById("list").appendChild(s);
    document.getElementById("baslik").value = "";
    localStorage.setItem("notes", JSON.stringify(notes));
    update();
  }
}

function deleteNote(a) {
  if (window.confirm("Do you want to delete this item?")) {
    notes.splice(a, 1);
    console.log(`Note number ${a} is deleted`);
    localStorage.setItem("notes", JSON.stringify(notes));
    update();
  }
}

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