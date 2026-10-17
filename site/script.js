const simulator = createStudentSimulator();
const methodInput = document.querySelector("#method");
const pathInput = document.querySelector("#request-path");
const bodyInput = document.querySelector("#request-body");
const responseStatus = document.querySelector("#response-status");
const responseBody = document.querySelector("#response-body");
const responseExplanation = document.querySelector("#response-explanation");
const responseTrace = document.querySelector("#response-trace");
const statusNames = { 200: "OK", 201: "Created", 204: "No Content", 404: "Not Found", 405: "Method Not Allowed", 422: "Unprocessable Content" };

function display(response) {
  responseStatus.textContent = `${response.status} ${statusNames[response.status] ?? "Response"}`;
  responseStatus.classList.toggle("error", response.status >= 400);
  responseBody.textContent = response.body === null ? "(no response body)" : JSON.stringify(response.body, null, 2);
  responseExplanation.textContent = response.explanation;
  responseTrace.replaceChildren(...response.trace.map(step => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = step.title;
    const detail = document.createElement("span");
    detail.textContent = step.detail;
    item.append(title, detail);
    return item;
  }));
}

document.querySelector("#send-request").addEventListener("click", () => {
  display(simulator.request(methodInput.value, pathInput.value.trim(), bodyInput.value));
});
document.querySelector("#reset-lab").addEventListener("click", () => {
  simulator.reset();
  methodInput.value = "GET";
  pathInput.value = "/students";
  bodyInput.value = "";
  display(simulator.request("GET", "/students", ""));
});
display(simulator.request("GET", "/students", ""));

const questions = [...document.querySelectorAll(".question")];
function updateProgress() {
  const correct = questions.filter(q => q.dataset.correct === "true").length;
  document.querySelector("#quiz-progress").textContent = `${correct} / ${questions.length} correct`;
}
for (const question of questions) {
  question.addEventListener("click", event => {
    const button = event.target.closest("button[data-choice]");
    if (!button || !question.contains(button)) return;
    const correct = button.dataset.choice === question.dataset.answer;
    question.dataset.correct = String(correct);
    for (const option of question.querySelectorAll("button")) option.classList.remove("correct", "incorrect");
    button.classList.add(correct ? "correct" : "incorrect");
    question.querySelector(".feedback").textContent = correct ? "Correct. Explain where each value came from." : "Try again: trace each value back to its part of the request.";
    updateProgress();
  });
}
