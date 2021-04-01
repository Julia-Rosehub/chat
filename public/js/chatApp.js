$(document).ready(() => {
  const socket = io();

  const getCurrentUserClass = (id) => {
    let userId = $("#chat-user-id").val();
    return userId === id ? "current-user" : "";
  };

  $("#chatForm").submit((event) => {
    event.preventDefault();
    let content = $("#chat-input").val(),
      userName = $("#chat-user-name").val(),
      userId = $("#chat-user-id").val();
    socket.emit("message", {
      content,
      userName,
      userId,
    });
    $("#chat-input").val("");
  });

  socket.on("message", (msg) => {
    console.log(msg)
    displayMessage(msg);
  });

  socket.on("flickMessage", () => {
    for (let i = 0; i < 2; i++) {
      $(".chat-icon").fadeOut(200).fadeIn(200);
    }
  });

  socket.on("load all messages", data => {
    data.forEach(msg => displayMessage(msg));
  });

  socket.on("user disconnected", () => {
    const userName = $("#chat-user-name").val();
    displayMessage({
      userName,
      content: " left the chat"
    });
  });

  const displayMessage = (data) => {
    $(".messages").append($("<li>")
      .html(`
            <strong class="message ${getCurrentUserClass(
        data.user)}">
            ${data.userName}
            </strong>: ${data.content}`)
      .append($("<span class='datestamp'>").html((data.timestamps))));
  };

  const addJoinButtonListener = () => {
    $(".join-button").click((event) => {
      let $button = $(event.target),
        courseId = $button.data("id");
      $.get(`/api/courses/${courseId}/join`, (results = {}) => {
        let data = results.data;
        if (data && data.success) {
          $button
            .text("Joined")
            .addClass("joined-button")
            .removeClass("join-button");
          setButtons();
        } else {
          $button.text("Log in");
        };
      });
    });
  }

  const addJoinCancelButtonListener = () => {
    $(".joined-button").click((event) => {
      let $button = $(event.target),
        courseId = $button.data("id");
      $.get(`/api/courses/${courseId}/canceljoin`, (results = {}) => {
        let data = results.data;
        if (data && data.success) {
          $button
            .text("Join")
            .addClass("join-button")
            .removeClass("joined-button");
          setButtons();
        }
        else {
          $button.text("Log in");
        }
      });
    });
  };

  const setButtons = () => {
    $(".modal-body").html('');
    $.get("/api/courses", (results = {}) => {
      let data = results.data;
      if (!data || !data.courses) return;
      data.courses.forEach((course) => {
        $(".modal-body").append(
          `    <span class="course-title">
              ${course.title}
              </span>
              <button class='${course.joined ? "joined-button" : "join-button"}'
                   data-id="${course._id}">                                        
                    ${course.joined ? "Joined" : "Join"}                              
              </button>
              <div class="course-description">
              ${course.description}
              </div>`
        );
      });
    }).then(() => {
      addJoinButtonListener();
      addJoinCancelButtonListener();
    }).catch(error => {
      $(".modal-body").append(
        `<div>${error.statusText}</div>`
      );
    });
  };

  $("#modal-button").click(() => {
    setButtons();
  });

  $(window).scroll(() => {
    if (($("#nav-icon")[0].scrollHeight) - ($(window)[0].scrollY) === ($("#nav-icon")[0].clientHeight)) {
      $(".chat-icon").css("color", "white");
    } else $(".chat-icon").css("color", "red");
  });
});
