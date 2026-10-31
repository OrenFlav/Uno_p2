// ─────────────────────────────────────────────────────────────
// CONFESSION PART 2 — app.js
// ─────────────────────────────────────────────────────────────

// ── SCROLL UNFURL ANIMATION ───────────────────────────────────
let scrollOpened = false;

function unfurlScroll() {
  if (scrollOpened) return;
  scrollOpened = true;

  const scrollWrap  = document.getElementById("scrollWrap");
  const sceneIntro  = document.getElementById("sceneIntro");
  const sceneCard   = document.getElementById("sceneCard");
  const scrollRolled= document.getElementById("scrollRolled");

  // 1. Animate the scroll icon out
  scrollRolled.style.transition = "opacity .3s ease";
  scrollRolled.style.opacity    = "0";

  // 2. Expand then contract (unfurl effect)
  setTimeout(() => {
    // Grow scroll body taller as if unrolling
    scrollRolled.style.transition = "max-height .6s cubic-bezier(.4,0,.2,1), padding .6s";
    scrollRolled.style.maxHeight  = "400px";
    scrollRolled.style.padding    = "60px 20px";
  }, 200);

  // 3. Fade out the entire intro scene
  setTimeout(() => {
    sceneIntro.style.transition = "opacity .5s ease";
    sceneIntro.style.opacity    = "0";
  }, 700);

  // 4. Show the card
  setTimeout(() => {
    sceneIntro.classList.add("hidden");
    sceneCard.classList.remove("hidden");
    sceneCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1200);
}


// ── REPLY MODAL ───────────────────────────────────────────────
function openReplyModal() {
  document.getElementById("replyModal").classList.add("open");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("replyMessage").focus(), 300);
}

function closeReplyModal() {
  document.getElementById("replyModal").classList.remove("open");
  document.body.style.overflow = "";
}

// Click overlay background to close
document.getElementById("replyModal").addEventListener("click", function (e) {
  if (e.target === this) closeReplyModal();
});

// ESC key to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeReplyModal();
});


// ── FORM SUBMIT VIA EMAILJS ───────────────────────────────────
document.getElementById("replyForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const replyMessage = document.getElementById("replyMessage").value.trim();
  const btnSend      = document.getElementById("btnSend");
  const sendNote     = document.getElementById("sendNote");

  if (!replyMessage) return;

  btnSend.disabled    = true;
  btnSend.textContent = "Sending... 🔥";
  sendNote.textContent = "";
  sendNote.className  = "send-note";

  // Sender is always Yzah — no name field needed
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
    from_name : "Yzah",
    message   : replyMessage,
    to_email  : "crissstmads@gmail.com",
    reply_to  : "noreply@confession.site",
  })
  .then(() => {
    btnSend.textContent  = "Na send na😱";
    sendNote.textContent = "Oh my nag reply nasad siya😭";
    sendNote.className   = "send-note success";
    launchConfetti();

    setTimeout(() => {
      document.getElementById("replyForm").reset();
      btnSend.disabled    = false;
      btnSend.textContent = "Send it 🔥";
      sendNote.textContent = "";
      closeReplyModal();
    }, 60000);
  })
  .catch((err) => {
    console.error("EmailJS error:", err);
    btnSend.disabled    = false;
    btnSend.textContent = "Send it 🔥";
    sendNote.textContent = "Something went wrong. Try again? 🥺";
    sendNote.className  = "send-note error";
  });
});


// ── CONFETTI (orange themed) ──────────────────────────────────
function launchConfetti() {
  const canvas  = document.getElementById("confettiCanvas");
  const ctx     = canvas.getContext("2d");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Orange-toned confetti palette
  const colors = [
    "#ff6b1a","#ff8c42","#ffa566","#c24e0e",
    "#ffcc99","#ff4500","#ff9933","#fff0e0"
  ];

  const pieces = [];
  for (let i = 0; i < 130; i++) {
    pieces.push({
      x:     Math.random() * canvas.width,
      y:     Math.random() * -canvas.height,
      r:     3 + Math.random() * 7,
      d:     2 + Math.random() * 3.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      spin:  (Math.random() - .5) * .12,
      drift: (Math.random() - .5) * 1.8,
      shape: Math.random() > .5 ? "rect" : "circle",
    });
  }

  let frame;
  let tick = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tick++;

    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.8);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.r / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      p.y     += p.d;
      p.x     += p.drift;
      p.angle += p.spin;
    });

    if (tick < 220) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(frame);
    }
  }

  draw();
}


// ── RESIZE canvas ─────────────────────────────────────────────
window.addEventListener("resize", () => {
  const canvas  = document.getElementById("confettiCanvas");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});


// ── SUBTLE MOODBOARD PARALLAX on mouse move ───────────────────
document.addEventListener("mousemove", (e) => {
  const imgs = document.querySelectorAll(".mb-img");
  const cx   = window.innerWidth  / 2;
  const cy   = window.innerHeight / 2;
  const dx   = (e.clientX - cx) / cx;   // -1 to 1
  const dy   = (e.clientY - cy) / cy;   // -1 to 1

  imgs.forEach((img, i) => {
    const depth = (i % 3 + 1) * 5;
    img.style.transform = img.style.transform.replace(/translate\([^)]*\)/g, "")
      + ` translate(${dx * depth}px, ${dy * depth}px)`;
  });
});
