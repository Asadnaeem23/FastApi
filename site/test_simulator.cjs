const assert = require("node:assert/strict");
const { createSimulator } = require("./simulator.js");

const api = createSimulator();
assert.equal(api.request("GET", "/students/abc", "").status, 422);
assert.match(api.request("GET", "/students/abc", "").trace[1].detail, /endpoint does not run/);
assert.equal(api.request("GET", "/students/999", "").status, 404);
assert.equal(api.request("GET", "/students/-1", "").status, 404);
assert.match(api.request("GET", "/students/999", "").trace[1].detail, /student_id: int/);
assert.deepEqual(api.request("GET", "/students?min_age=21", "").body.map(s => s.name), ["Sara"]);
assert.equal(api.request("GET", "/students?limit=101", "").status, 422);

const created = api.request("POST", "/students", '{"name":"Zain","age":24}');
assert.equal(created.status, 201);
assert.equal(created.body.id, 3);
assert.equal(api.request("PUT", "/students/3", '{"name":"Zain Ali"}').status, 422);
assert.equal(api.request("PUT", "/students/3", '{"name":"Zain Ali","age":25}').body.age, 25);
assert.equal(api.request("PATCH", "/students/3", '{"age":null}').status, 422);
assert.equal(api.request("PATCH", "/students/3", '{"age":null}').trace[2].title, "Function → data");
assert.deepEqual(api.request("PATCH", "/students/3", '{"age":26}').body, { id: 3, name: "Zain Ali", age: 26 });
assert.match(api.request("PATCH", "/students/3", '{"age":26}').trace[1].detail, /StudentPatch/);
assert.equal(api.request("DELETE", "/students/3", "").status, 204);
assert.equal(api.request("GET", "/students/3", "").status, 404);
api.reset();
assert.equal(api.request("GET", "/students", "").body.length, 2);
console.log("Simulator lifecycle, filtering, and validation checks passed.");
