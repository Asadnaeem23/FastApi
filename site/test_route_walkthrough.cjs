const assert = require("node:assert/strict");
const { routeCases } = require("./route-walkthrough.js");
const { createSimulator } = require("./simulator.js");

for (const [name, example] of Object.entries(routeCases)) {
  const result = createSimulator().request(example.method, example.path, example.body);
  assert.equal(result.status, Number(example.output.slice(0, 3)), `${name}: walkthrough status`);
  if (name === "bad_id") assert.equal(result.trace[2].title, "Before the function");
  if (name === "missing_id") assert.equal(result.trace[2].title, "Function → data");
}
assert.equal(routeCases.get_one.decorator.includes("{student_id}"), true);
assert.equal(routeCases.put.signature.includes("student_id: int, student: StudentIn"), true);
console.log("CRUD walkthrough scenarios match the request lab.");
