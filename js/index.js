let task = document.getElementById("task");
let start = document.getElementById("start");
let end = document.getElementById("end");
let sort = document.getElementById("sort");
let sorting = document.getElementById("sorting");
let select = document.getElementById("select");
let addTask = document.getElementById("addTask");
let showTasks = document.getElementById("allTasks");
let search = document.getElementById("search");
let searchBtn = document.getElementById("searchBtn");
let deleteAll = document.getElementById("deleteAll");

// get data from local storage
let tasks = JSON.parse(window.localStorage.getItem("tasks")) || [];
// let customId = 0;

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// clean inputs
task.addEventListener("input", () => {
  checkInputs();
});
start.addEventListener("input", () => {
  checkInputs();
});
end.addEventListener("input", () => {
  checkInputs();
});

function checkInputs() {
  if ((task.value === "") | (start.value === "") | (end.value === "")) {
    addTask.classList.add("disable");
  } else {
    addTask.classList.remove("disable");
  }
}

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// create
addTask.addEventListener("click", () => {
  if (addTask.classList.contains("disable")) {
  } else {
    // update
    if (addTask.classList.contains("update")) {
      tasks.forEach((ele) => {
        if (ele.id == addTask.getAttribute("index")) {
          ele.task = task.value;
          ele.start = start.value;
          ele.end = end.value;
        }
      });
      addTask.classList.remove("update");
      addTask.innerText = "Add Task";
    } else {
      // create
      tasks.push({
        id: Date.now(),
        task: task.value,
        status: false,
        start: start.value,
        end: end.value,
      });
      //   customId++;
    }
    window.localStorage.setItem("tasks", JSON.stringify(tasks));
    resetInputs();
    read();
  }
});

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// reset inputs
function resetInputs() {
  task.value = "";
  start.value = "";
  end.value = "";
  addTask.classList.add("disable");
}

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// read
let read = () => {
  let myTask = "";
  if (tasks.length > 0) {
    sorting.style.display = "flex";
  } else {
    sorting.style.display = "none";
  }
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status) {
      myTask += `<li class='done'><p>${tasks[i].task}</p><p style="color: red; text-decoration:none">Congratulations!</p> <button onclick='handleEdit(${tasks[i].id})'>Edit</button> <button onclick='handleDelete(${tasks[i].id})'>Delete</button><button onclick='handleUndone(${tasks[i].id})'>Undone</button></li>`;
    } else {
      myTask += `<li><p>${tasks[i].task}</p><p>Start : ${
        tasks[i].start
      }</p> <p>Deadline : ${
        tasks[i].end
      }</p><p style='color:red'>${handleDeadline(
        tasks[i].id
      )}</p><button onclick='handleEdit(${
        tasks[i].id
      })'>Edit</button> <button onclick='handleDelete(${
        tasks[i].id
      })'>Delete</button><button onclick='handleDone(${
        tasks[i].id
      })'>Done</button></li>`;
    }
  }
  showTasks.innerHTML = myTask;
};

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// Done tasks
function handleDone(id) {
  console.log(id);
  tasks.forEach((ele) => {
    if (ele.id === id) {
      ele.status = true;
    }
  });
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
  read();
}

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// undone tasks
function handleUndone(id) {
  tasks.forEach((ele) => {
    if (ele.id === id) {
      ele.status = false;
    }
  });
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
  read();
}

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// delete
let handleDelete = (id) => {
  let arr = tasks.filter((ele) => {
    return ele.id !== id;
  });
  tasks = arr;
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
  read();
};

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
//  edit
let handleEdit = (id) => {
  let obj = tasks.find((ele) => {
    return ele.id === id;
  });
  task.value = obj.task;
  start.value = obj.start;
  end.value = obj.end;

  addTask.classList.add(`update`);
  addTask.setAttribute("index", id);

  addTask.innerText = "Update";
  addTask.classList.remove("disable");
};

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// sort and filter

sort.addEventListener("click", () => {
  let arr = [];
  switch (select.value) {
    case "all":
      return read();
    case "done":
      arr = tasks.filter((ele) => {
        return ele.status === true;
      });
      break;
    case "deadline":
      arr = tasks.slice().sort((a, b) => {
        let date1 = new Date(a.end);
        let date2 = new Date(b.end);
        return date1 - date2;
      });
      arr = arr.filter((ele) => {
        return ele.status === false && handleDeadline(ele.id) === "";
      });
      break;
    default:
      break;
  }

  readAfterEdit(arr);
});

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// search
searchBtn.addEventListener("click", () => {
  if (search.value === "") return read();
  let targetTask = tasks.find((ele) => {
    return ele.task.toLowerCase().startsWith(search.value.toLowerCase());
  });
  readAfterEdit([targetTask]);
});

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// read after sort & search & filter
function readAfterEdit(arr) {
  if (arr[0] === undefined)
    return (showTasks.innerHTML = `<li><p>Not Found</p></li>`);
  let myTask = "";
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].status) {
      myTask += `<li class='done'><p>${arr[i].task}</p> <p style="color: red; text-decoration:none">Congratulations!</p> <button onclick='handleEdit(${arr[i].id})'>Edit</button> <button onclick='handleDelete(${arr[i].id})'>Delete</button><button onclick='handleUndone(${arr[i].id})'>Undone</button></li>`;
    } else {
      myTask += `<li><p>${arr[i].task}</p><p>Start : ${
        arr[i].start
      }</p> <p>Deadline : ${arr[i].end}</p>
      <p style='color:red'>${handleDeadline(arr[i].id)}</p>
      <button onclick='handleEdit(${
        arr[i].id
      })'>Edit</button> <button onclick='handleDelete(${
        arr[i].id
      })'>Delete</button><button onclick='handleDone(${
        arr[i].id
      })'>Done</button></li>`;
    }
  }
  showTasks.innerHTML = myTask;
}

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// check if deadline has passed or not
function handleDeadline(id) {
  let reqTask = tasks.find((ele) => {
    return ele.id === id;
  });
  let deadlineDate = new Date(reqTask.end);
  let currentDate = new Date(Date.now());

  if (deadlineDate < currentDate) {
    return "Deadline has passed";
  } else {
    return "";
  }
}

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// delete all
deleteAll.addEventListener("click", () => {
  tasks = [];
  window.localStorage.setItem("tasks", JSON.stringify(tasks));
  read();
});

// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// $$$$$$$$$$$$$ :) $$$$$$$$$$$$$
// read after loading
read();
