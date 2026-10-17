const routeCases = {
  get_one: {
    method: "GET", path: "/students/2", body: "",
    request: "GET /students/2",
    requestNote: "This is the actual URL requested by the client. The final segment contains the value 2.",
    decorator: '@app.get("/students/{student_id}")',
    decoratorNote: "GET selects the HTTP method. /students/{student_id} is a pattern; the braces mark a named path slot, not a literal URL.",
    signature: "def get_student(student_id: int):",
    inputNote: 'FastAPI takes URL text "2", converts it to integer 2, then calls get_student(student_id=2). The names match.',
    logic: "students[2] → Sara",
    logicNote: "Your function looks up student 2. FastAPI converts the input but does not know which student IDs exist.",
    output: '200 {"id":2,"name":"Sara","age":22}',
    outputNote: "The function returns a dictionary. FastAPI serializes it as JSON and sends it to the client.",
    takeaway: "The bridge is the shared name student_id: the route pattern names the slot, and the function parameter receives its converted value. The function name does not determine the URL."
  },
  get_list: {
    method: "GET", path: "/students?min_age=21", body: "",
    request: "GET /students?min_age=21",
    requestNote: "The path is /students. The text after ? is the query string.",
    decorator: '@app.get("/students")',
    decoratorNote: "FastAPI matches GET and /students. The query string is not written in the decorator path.",
    signature: "def get_students(min_age: int | None = None):",
    inputNote: 'min_age is absent from the route path, so FastAPI reads query text "21", converts it to int 21, and supplies min_age=21.',
    logic: "filter ages ≥ 21",
    logicNote: "Your function filters the student list. Ali (20) is excluded; Sara (22) remains.",
    output: '200 [{"id":2,"name":"Sara","age":22}]',
    outputNote: "The filtered list goes back as JSON. Omitting min_age would use the default None.",
    takeaway: "The decorator only names the path. A simple function parameter not found in that path usually comes from the query string."
  },
  post: {
    method: "POST", path: "/students", body: '{"name":"Zain","age":24}',
    request: "POST /students + JSON body",
    requestNote: 'The client sends {"name":"Zain","age":24} in the body, not in the URL.',
    decorator: '@app.post("/students", status_code=201)',
    decoratorNote: "POST selects the HTTP method. There is no {student_id} slot because the server will assign an ID.",
    signature: "def create_student(student: StudentIn):",
    inputNote: 'FastAPI reads the JSON body and validates it with StudentIn. The function receives student.name="Zain" and student.age=24.',
    logic: "generate ID 3 → save student",
    logicNote: "Your function creates the ID and stores the new record. Returning a value alone would not save it.",
    output: '201 {"id":3,"name":"Zain","age":24}',
    outputNote: "The new record becomes the response body; status_code=201 comes from the decorator.",
    takeaway: "No ID comes from the path on POST /students. The student fields come from the JSON body; the application generates the ID."
  },
  put: {
    method: "PUT", path: "/students/2", body: '{"name":"Sara Khan","age":23}',
    request: "PUT /students/2 + JSON body",
    requestNote: 'The URL identifies student 2. The JSON body supplies a full replacement for the editable fields.',
    decorator: '@app.put("/students/{student_id}")',
    decoratorNote: "PUT matches the method, and {student_id} captures the last path segment.",
    signature: "def replace_student(student_id: int, student: StudentIn):",
    inputNote: 'The path supplies student_id=2 (int). The body supplies a validated StudentIn(name="Sara Khan", age=23).',
    logic: "replace name and age for ID 2",
    logicNote: "Your function checks that ID 2 exists, then replaces both editable fields while keeping the path ID.",
    output: '200 {"id":2,"name":"Sara Khan","age":23}',
    outputNote: "The replacement record is returned as JSON. Omitting name or age would fail body validation.",
    takeaway: "One function call can receive values from two places: student_id from the URL path and student from the JSON body."
  },
  patch: {
    method: "PATCH", path: "/students/2", body: '{"age":23}',
    request: "PATCH /students/2 + JSON body",
    requestNote: 'The URL identifies student 2. The body contains only the field to change: age.',
    decorator: '@app.patch("/students/{student_id}")',
    decoratorNote: "PATCH selects partial-update behavior in this application; {student_id} captures the path value.",
    signature: "def update_student(student_id: int, changes: StudentPatch):",
    inputNote: "The path supplies student_id=2. The body becomes StudentPatch with age=23; name was omitted.",
    logic: "change age; keep name Sara",
    logicNote: "Your function uses exclude_unset=True, so only age is updated. An explicitly supplied null is rejected by this example.",
    output: '200 {"id":2,"name":"Sara","age":23}',
    outputNote: "The response includes the whole updated record, although the request sent only one field.",
    takeaway: "PATCH gets the ID from the path and changes from the body. Omitted fields stay as they were; omission differs from explicit null."
  },
  delete: {
    method: "DELETE", path: "/students/2", body: "",
    request: "DELETE /students/2",
    requestNote: "The URL identifies the student to remove. This example sends no JSON body.",
    decorator: '@app.delete("/students/{student_id}", status_code=204)',
    decoratorNote: "DELETE matches the method, and {student_id} names the path slot. The decorator sets the success status.",
    signature: "def delete_student(student_id: int):",
    inputNote: "FastAPI converts URL text 2 to int 2 and supplies student_id=2. No student model is created from a body.",
    logic: "delete students[2]",
    logicNote: "Your function checks that the ID exists and removes it. A second DELETE would find no record and return 404.",
    output: "204 No Content",
    outputNote: "The server sends a success status with no response body.",
    takeaway: "The path tells the function what to delete. The 204 response contains no JSON, even though storage changed."
  },
  bad_id: {
    method: "GET", path: "/students/abc", body: "",
    request: "GET /students/abc",
    requestNote: 'The client supplies the text "abc" where a student ID would normally appear.',
    decorator: '@app.get("/students/{student_id}")',
    decoratorNote: "The URL shape matches this route: {student_id} captures one segment, even if its value is invalid.",
    signature: "def get_student(student_id: int):",
    inputNote: 'FastAPI tries to convert "abc" to int for student_id and fails. It does not call get_student.',
    logic: "function does not run",
    logicNote: "No dictionary lookup occurs and no data changes. Validation stops the request first.",
    output: "422 validation error",
    outputNote: "FastAPI sends a validation response explaining that the path value is not a valid integer.",
    takeaway: "A matching route does not guarantee the function runs. FastAPI validates the captured value before calling it.",
    skipped: true
  },
  missing_id: {
    method: "GET", path: "/students/999", body: "",
    request: "GET /students/999",
    requestNote: "The client supplies 999 in the path.",
    decorator: '@app.get("/students/{student_id}")',
    decoratorNote: "The method and path shape match this route; {student_id} captures 999.",
    signature: "def get_student(student_id: int):",
    inputNote: "FastAPI converts the path text to int 999 and calls get_student(student_id=999).",
    logic: "lookup 999 → not found",
    logicNote: "Your function runs, finds no record with ID 999, and raises HTTPException(404).",
    output: '404 {"detail":"Student not found"}',
    outputNote: "FastAPI turns the exception into an HTTP 404 response for the client.",
    takeaway: "FastAPI checks type, but your code checks existence. This 404 occurs inside the endpoint, unlike the earlier 422."
  }
};

if (typeof module !== "undefined" && module.exports) module.exports = { routeCases };

if (typeof document !== "undefined") {
const routeCaseSelect = document.querySelector("#route-case");
function showRouteCase(key) {
  const example = routeCases[key];
  const fields = {
    "route-request": example.request,
    "route-request-note": example.requestNote,
    "route-decorator": example.decorator,
    "route-decorator-note": example.decoratorNote,
    "route-signature": example.signature,
    "route-input-note": example.inputNote,
    "route-logic": example.logic,
    "route-logic-note": example.logicNote,
    "route-output": example.output,
    "route-output-note": example.outputNote,
    "route-takeaway": example.takeaway,
    "route-logic-tag": example.skipped ? "04 · FUNCTION SKIPPED" : "04 · YOUR CODE RUNS"
  };
  for (const [id, value] of Object.entries(fields)) document.getElementById(id).textContent = value;
  document.querySelector(".route-lens").classList.toggle("route-failed-before-call", Boolean(example.skipped));
}
routeCaseSelect.addEventListener("change", () => showRouteCase(routeCaseSelect.value));
document.querySelector("#load-route-lab").addEventListener("click", () => {
  const example = routeCases[routeCaseSelect.value];
  document.querySelector("#method").value = example.method;
  document.querySelector("#request-path").value = example.path;
  document.querySelector("#request-body").value = example.body;
  window.location.hash = "lab";
  document.querySelector("#request-path").focus();
});
}
