var tasks = {};

var createTask = function (taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>").addClass("m-1").text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);

  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function () {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: [],
    };
  }

  // loop over object properties
  $.each(tasks, function (list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function (task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

$(".list-group").on("click", "p", (e) => {
  var text = $(e.target).text().trim();
  console.log(text);
  var textInput = $("<textarea>").addClass("form-control").val(text);
  $(e.target).replaceWith(textInput);
  textInput.trigger("focus");
});

$(".list-group").on("blur", "textarea", (e) => {
  var text = $(e.target).val().trim();
  console.log(text);
  var status = $(e.target)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  var index = $(e.target).closest(".list-group-item").index();
  tasks[status][index].text = text;
  saveTasks();
  var taskP = $("<p>").addClass("m-1").text(text);
  $(e.target).replaceWith(taskP);
});

$(".list-group").on("click", "span", (e) => {
  var date = $(e.target).text().trim();
  var dateInput = $("<input>")
    .attr("type", "text")
    .addClass("form-control")
    .val(date);
  $(e.target).replaceWith(dateInput);
  dateInput.trigger("focus");
});

$(".list-group").on("blur", "input", (e) => {
  var text = $(e.target).val().trim();
  console.log(text);
  var status = $(e.target)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");
  var index = $(e.target).closest(".list-group-item").index();
  tasks[status][index].date = text;
  saveTasks();
  var dateSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(text);
  $(e.target).replaceWith(dateSpan);
});

// modal was triggered
$("#task-form-modal").on("show.bs.modal", function () {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function () {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function () {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate,
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function () {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone",
  activate: function (e) {
    console.log("activate", this);
  },
  deactivate: function (e) {
    console.log("deactivate", this);
  },
  over: function (e) {
    console.log("over", e.target);
  },
  out: function (e) {
    console.log("out", e.target);
  },
  update: function (e) {
    $(this)
      .children()
      .each(function () {
        console.log($(this));
      });
  },
});

// load tasks for the first time
loadTasks();
