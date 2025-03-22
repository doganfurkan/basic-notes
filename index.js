document.getElementById("sort").addEventListener("click", sortNotes);
document.getElementById("quickNote").addEventListener("keypress", check);

let notes = localStorage.getItem("notes")
  ? JSON.parse(localStorage.getItem("notes"))
  : [];

update();

async function update() {
  if (notes.length == 0) {
    const noNotes = document.createElement("span");
    noNotes.textContent = await localize("noNotes");
    document.getElementById("list").appendChild(noNotes);
  } else {
    document.getElementById("list").innerHTML = "";
    for (let i = 0; i < notes.length; i++) {
      let noteText =
        typeof notes[i] === "string"
          ? notes[i]
          : notes[i].title
          ? notes[i].title
          : notes[i].content;
      let s = document.createElement("div");
      const span = document.createElement("a");
      span.href = `note/note.html?id=${i}`;
      span.textContent = noteText;
      const button = document.createElement("button");
      button.className = "deleteButton";
      button.setAttribute("dataId", i);
      const img = document.createElement("img");
      img.src = "images/trash-simple-fill.svg";
      button.appendChild(img);
      s.appendChild(span);
      s.appendChild(button);
      if (typeof notes[i] === "object") {
        s.querySelector("a").style.cursor = "pointer";
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

async function sortCheck() {
  if (localStorage.getItem("sorting") == "false") {
    if (!document.getElementById("sort").classList.contains("ters")) {
      document.getElementById("sort").classList.add("ters");
    }
    document.getElementById("sort").querySelector("span").textContent =
      await localize("sortNewest");
  } else {
    localStorage.setItem(
      "sorting",
      !document.getElementById("sort").classList.contains("ters")
    );
    document.getElementById("sort").querySelector("span").textContent =
      await localize("sortOldest");
  }
}

sortCheck();

// Load tags from localStorage and create filter buttons
let tags = localStorage.getItem("tags")
  ? JSON.parse(localStorage.getItem("tags"))
  : [];

// Create filter buttons for each tag
tags.forEach((tag) => {
  const filterBtn = document.createElement("span");
  filterBtn.textContent = tag;

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "×";
  deleteBtn.className = "tag-delete";
  deleteBtn.addEventListener("click", async (e) => {
    e.stopPropagation(); // Prevent filter click

    if (window.confirm(await localize("deleteTagAlert"))) {
      // Remove tag from localStorage
      tags = tags.filter((t) => t !== tag);
      localStorage.setItem("tags", JSON.stringify(tags));

      // Remove tag from all notes that have it
      notes = notes.map((note) => {
        if (note.tags && note.tags.includes(tag)) {
          note.tags = note.tags.filter((t) => t !== tag);
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
    if (e.target === deleteBtn) return; // Don't filter if delete was clicked

    // Remove chosen class from all buttons
    document.querySelectorAll("#filters-container span").forEach((btn) => {
      btn.classList.remove("chosen");
    });
    // Add chosen class to clicked button
    filterBtn.classList.add("chosen");

    // Filter notes
    filterNotes(tag);
  });
  document.getElementById("filters-container").appendChild(filterBtn);
});

async function filterNotes(tag) {
  if (notes.length > 0) {
    const filteredNotes = notes.filter((note) => {
      // Handle both old string notes and new note objects with tags
      if (typeof note === "string") return false;
      return note.tags && note.tags.includes(tag);
    });

    if (filteredNotes.length === 0) {
      const noNotes = document.createElement("span");
      noNotes.textContent = await localize("noNotes");
      document.getElementById("list").appendChild(noNotes);
    } else {
      document.getElementById("list").innerHTML = "";
      filteredNotes.forEach((note, index) => {
        let s = document.createElement("div");
        const noteIndex = notes.indexOf(note);
        let span = document.createElement("span");
        span.textContent = note.title ? note.title : note.content;

        let button = document.createElement("button");
        button.className = "deleteButton";
        button.setAttribute("dataId", noteIndex);

        let img = document.createElement("img");
        img.src = "images/trash-simple-fill.svg";

        button.appendChild(img);
        s.appendChild(span);
        s.appendChild(button);

        if (typeof note === "object") {
          s.querySelector("span").style.cursor = "pointer";
          s.querySelector("span").addEventListener("click", () => {
            window.location.href = `note/note.html?id=${noteIndex}`;
          });
        }
        document.getElementById("list").appendChild(s);
      });
    }
  }
}
// Add click handler for "All" button to show all notes
document.getElementById("all").addEventListener("click", allNotes);

function allNotes() {
  document.querySelectorAll("#filters-container span").forEach((btn) => {
    btn.classList.remove("chosen");
  });
  document.getElementById("all").classList.add("chosen");
  update();
}

// Quick Note
document.getElementById("quick").addEventListener("click", quickNotes);

function quickNotes() {
  document.querySelectorAll("#filters-container span").forEach((btn) => {
    btn.classList.remove("chosen");
  });
  document.getElementById("quick").classList.add("chosen");
  filterNotes("Quick Note");
}

function check(event) {
  if (event.keyCode === 13) {
    let note = {
      title: "",
      tags: ["Quick Note"],
      content: document.getElementById("quickNote").value,
      timestamp: new Date().toISOString(),
    };
    if (localStorage.getItem("sorting") == "true") {
      notes.push(note);
    } else {
      notes.unshift(note);
    }
    document.getElementById("quickNote").value = "";
    localStorage.setItem("notes", JSON.stringify(notes));
    update();
  }
}

async function deleteNote(a) {
  if (window.confirm(await localize("deleteAlert"))) {
    notes.splice(a, 1);
    console.log(`Note number ${a} is deleted`);
    localStorage.setItem("notes", JSON.stringify(notes));
    update();
  }
}

async function sortNotes() {
  notes.reverse();
  localStorage.setItem("notes", JSON.stringify(notes));
  document.getElementById("sort").classList.toggle("ters");
  document.getElementById("sort").querySelector("span").textContent = document
    .getElementById("sort")
    .classList.contains("ters")
    ? await localize("sortNewest")
    : await localize("sortOldest");
  localStorage.setItem(
    "sorting",
    !document.getElementById("sort").classList.contains("ters")
  );
  allNotes();
  update();
}
