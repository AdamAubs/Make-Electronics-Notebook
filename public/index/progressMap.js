

window.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("progressMap");
  const ctx = canvas.getContext("2d");
  const clickableSections = [];
  let publicSections = [];
  let background = new Image();

  const dpr = resizeCanvas(canvas);

  try {
    const response = await fetch("/api/sections");
    publicSections = await response.json();
    background.src = "/images/ProgressDisplayBackground.png";

    background.onload = () => {
      drawAll(ctx, canvas, background, publicSections, clickableSections, dpr);
    };
  } catch (err) {
    console.error("Error loading public sections:", err);
  }

  window.addEventListener("resize", () => {
    const dpr = resizeCanvas(canvas);
    drawAll(ctx, canvas, background, publicSections, clickableSections, dpr);
  });

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    for (const area of clickableSections) {
      if (
        clickX >= area.x &&
        clickX <= area.x + area.width &&
        clickY >= area.y &&
        clickY <= area.y + area.height
      ) {
        window.location.href = area.url;
        break;
      }
    }
  });
});


function resizeCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  return dpr;
}


function drawAll(ctx, canvas, background, sections, clickableSections, dpr) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  clickableSections.length = 0;

  sections.forEach((section, i) => {

    let x, y, width, height;
    // draw section one in correct location
    if (section.id == 1) {
      x = canvas.width * (0.63);
      y = canvas.height * (0.25 + i * 0.05);
      width = canvas.width * 0.15;
      height = canvas.height * 0.08;
    }

    ctx.fillStyle = "green";
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "white";
    ctx.font = `${14 * dpr}px sans-serif`;
    ctx.fillText(section.title, x + 10, y + height / 2);

    clickableSections.push({
      x, y, width, height,
      url: `/my/sections/${section.id}/experiments`
    });
  });
}
