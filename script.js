document.getElementById("baslik").addEventListener("keypress", check);
document.getElementById("theme").addEventListener("click", changeTheme);
let notes = localStorage.getItem("notes")
  ? JSON.parse(localStorage.getItem("notes"))
  : [];

update();

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark")
}

function update() {
  if (notes.length == 0) {
    document.getElementById("list").innerHTML =
      "<span>There is nothing here</span>";
  } else {
    document.getElementById("list").innerHTML = "";
    for (let i = 0; i < notes.length; i++) {
      let s = document.createElement("div");
      s.innerHTML = `<span>${notes[i]}</span><button class="deleteButton" dataId="${i}"><img src="trash-simple.svg"/></button>`;
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