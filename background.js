console.log(" Background service worker started");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log(" Message received in background:", request);

  if (request.type !== "EXPLAIN") return;

  fetch("http://localhost:3000/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word: request.word,
      context: request.context
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log("🧠 Backend response FULL:", data);

      //  FORCE non-null
      sendResponse({
        explanation:
          data.explanation ||
          "⚠️ explanation missing from backend"
      });
    })
    .catch(err => {
      console.error(" Fetch failed:", err);
      sendResponse({
        explanation: " Backend unreachable"
      });
    });

  return true; 
});
