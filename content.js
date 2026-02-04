console.log("✅ content.js loaded");

let tooltip;

function showTooltip(text, x, y) {
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.background = "#111";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "8px 12px";
    tooltip.style.borderRadius = "8px";
    tooltip.style.maxWidth = "300px";
    tooltip.style.fontSize = "14px";
    tooltip.style.zIndex = "999999";
    tooltip.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
    document.body.appendChild(tooltip);
  }

  tooltip.textContent = text;
  tooltip.style.left = `${x + 10}px`;
  tooltip.style.top = `${y + 10}px`;
  tooltip.style.display = "block";
}

document.addEventListener("mouseup", (event) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const word = selection.toString().trim();
  if (!word || word.split(" ").length > 3) return;

  chrome.runtime.sendMessage(
    {
      type: "EXPLAIN",
      word,
      context: selection.anchorNode?.textContent || ""
    },
    (response) => {
      showTooltip(
        response?.explanation || "No explanation available.",
        event.pageX,
        event.pageY
      );
    }
  );
});

document.addEventListener("mousedown", () => {
  if (tooltip) tooltip.style.display = "none";
});
