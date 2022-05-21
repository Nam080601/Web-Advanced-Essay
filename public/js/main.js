if (location.pathname == "/") {
  const socket = io();

  const messages = $("#messages");
  const system = $("#system");
  const form = $("#form");
  const input = $("#input");

  let isTyping = false;
  let typingTimer;
  const doneTypingInterval = 200;

  function doneTyping() {
    isTyping = false;
    socket.emit("end typing");
  }

  $(".btn-logout").click((e) => {
    e.preventDefault();
    localStorage.removeItem("current");
    window.location = "/logout";
  });

  socket.emit("connected", localStorage.getItem("current"));

  $(input).keydown(function (e) {
    if (e.key == "Enter") return;
    clearTimeout(typingTimer);
    if (!isTyping) {
      socket.emit("start typing");
      isTyping = true;
    }
  });

  $(input).keyup(function (e) {
    // If typing
    if ($(input).val()) return;
    // Otherwise
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  });

  $(form).submit(function (e) {
    e.preventDefault();
    if (localStorage.getItem("current") && input.val()) {
      socket.emit("chat message", {
        name: localStorage.getItem("current"),
        message: input.val(),
      });
      input.val("");
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }
  });

  socket.on("system notify", async function (msg) {
    if (msg.includes(localStorage.getItem("current"))) {
      return;
    }
    $("#connect").append(
      `<p class="user-connect d-flex justify-content-center text-white" style="font-size: 11pt">${msg}</p>`
    );
    setTimeout(() => {
      $(".user-connect").addClass("hidden");
    }, 1000);
    setTimeout(() => {
      $(".user-connect").remove();
    }, 2000);
    window.scrollTo(0, $(".chat-area").prop("scrollHeight"));
  });

  socket.on("show users", function (msg) {
    $(".list-users").empty();
    $(".list-users").append(
      msg.map(
        (e) =>
          `<div class="my-2"><i class="fa-solid fa-user ms-2 me-3"></i>${e}</div>`
      )
    );
  });

  socket.on("chat message", function (msg) {
    const pos = msg.name.includes(localStorage.getItem("current"))
      ? "end"
      : "start";
    messages.append(
      `<div class="d-flex justify-content-${pos}">
        <div class="d-flex flex-column align-items-start">
          <div class="mx-2" style="font-size: 10pt; color: #fff">${
            msg.name.includes(localStorage.getItem("current")) ? "" : msg.name
          }</div>
          <div class="chat m-2 p-3">${msg.message}</div>
        </div>
      </div>`
    );
    window.scrollTo(0, $(".chat-area").prop("scrollHeight"));
  });

  socket.on("start typing", function (msg) {
    if (msg.includes(localStorage.getItem("current"))) {
      return;
    }
    const msgKey = msg.replaceAll(" ", "-");
    system.append(
      `<p class="messages-${msgKey} d-flex justify-content-center text-white" style="font-size: 11pt">${msg} is typing . . .</p>`
    );
    window.scrollTo(0, $(".chat-area").prop("scrollHeight"));
  });

  socket.on("end typing", function (msg) {
    if (msg.includes(localStorage.getItem("current"))) {
      return;
    }
    const msgKey = msg.replaceAll(" ", "-");
    if ($(`.messages-${msgKey}`)) {
      $(`.messages-${msgKey}`).remove();
    }
  });
}

// Login + register
if (location.pathname == "/login" || location.pathname == "/register") {
  const loginInput = $(".validate-input .input");

  $(".login-form").submit(async (e) => {
    e.preventDefault();
    let invalidInput = false;
    for (let i = 0; i < loginInput.length; i++) {
      if ($(loginInput[i]).val().length == 0) {
        showValidate(loginInput[i]);
        invalidInput = true;
      }
    }
    if (invalidInput) {
      return;
    }
    if (location.pathname == "/login") {
      const body = {
        username: $("#username").val(),
        password: $("#password").val(),
      };
      const response = await fetch("/login", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-type": "application/json" },
      });
      const data = await response.json();
      if (response.status == 200) {
        localStorage.setItem("current", data.data);
        location.href = "/";
      } else {
        console.log(data.message);
      }
    }
    if (location.pathname == "/register") {
      const body = {
        username: $("#username").val(),
        password: $("#password").val(),
        name: $("#name").val(),
      };
      const response = await fetch("/register", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-type": "application/json" },
      });
      const data = await response.json();
      if (response.status == 201) {
        localStorage.setItem("current", data.data);
        location.href = "/";
      } else {
        console.log(data.message);
      }
    }
  });

  $(".validate-form .input").each(function () {
    $(this).focus(function () {
      hideValidate(this);
    });
  });

  function showValidate(loginInput) {
    const thisAlert = $(loginInput).parent();
    $(thisAlert).addClass("alert-validate");
  }

  function hideValidate(loginInput) {
    const thisAlert = $(loginInput).parent();
    $(thisAlert).removeClass("alert-validate");
  }
}
