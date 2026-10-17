/* A small teaching simulation. The optional Python example is the source of truth. */
(function (root) {
  function createSimulator() {
    let students;
    let nextId;
    function reset() {
      students = new Map([[1, { id: 1, name: "Ali", age: 20 }], [2, { id: 2, name: "Sara", age: 22 }]]);
      nextId = 3;
    }
    reset();
    const result = (status, body, explanation, stage = "function") => ({ status, body, explanation, stage });
    const invalid = (detail) => result(422, { detail }, "FastAPI rejected the input before calling the endpoint; no data changed.", "framework");
    const missing = () => result(404, { detail: "Student not found" }, "The ID is valid, but no student has that ID.");
    function validateBody(body, partial) {
      if (!body || typeof body !== "object" || Array.isArray(body)) return "Send a JSON object with student fields.";
      if (!partial && (!Object.hasOwn(body, "name") || !Object.hasOwn(body, "age"))) return "Both name and age are required.";
      if (Object.hasOwn(body, "name") && (typeof body.name !== "string" || body.name.length < 1)) return "name must be a nonempty string and cannot be null.";
      if (Object.hasOwn(body, "age") && (!Number.isInteger(body.age) || body.age < 0)) return "age must be a nonnegative integer and cannot be null.";
      return null;
    }
    function handleRequest(method, path, rawBody) {
      let url;
      try { url = new URL(path, "https://example.invalid"); } catch { return invalid("Enter a path such as /students/2."); }
      if (!path.startsWith("/") || url.origin !== "https://example.invalid") return invalid("Enter a relative path beginning with /. ");
      const segments = url.pathname.split("/").filter(Boolean);
      if (method === "GET" && segments.length === 0) return result(200, { message: "Welcome to FastAPI" }, "FastAPI matched the root GET route.");
      if (segments[0] !== "students" || segments.length > 2) return result(404, { detail: "Not Found" }, "No route matches this path, so no endpoint ran.", "framework");
      const hasId = segments.length === 2;
      let id;
      if (hasId) {
        if (!/^-?\d+$/.test(segments[1]) || !Number.isSafeInteger(Number(segments[1]))) return invalid("student_id must be an integer.");
        id = Number(segments[1]);
      }
      if (method === "GET") {
        if (hasId) return students.has(id) ? result(200, students.get(id), "The path identifies one student.") : missing();
        for (const key of ["min_age", "skip", "limit"]) {
          const value = url.searchParams.get(key);
          if (value !== null && !/^\d+$/.test(value)) return invalid(`${key} must be a nonnegative integer.`);
        }
        const skip = Number(url.searchParams.get("skip") ?? 0);
        const limit = Number(url.searchParams.get("limit") ?? 10);
        const minAge = url.searchParams.has("min_age") ? Number(url.searchParams.get("min_age")) : null;
        if (limit < 1 || limit > 100) return invalid("limit must be between 1 and 100.");
        const search = url.searchParams.get("search");
        let list = [...students.values()];
        if (search !== null) list = list.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
        if (minAge !== null) list = list.filter(s => s.age >= minAge);
        return result(200, list.slice(skip, skip + limit), "FastAPI parsed query values; the app filtered and sliced the list.");
      }
      if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return result(405, { detail: "Method Not Allowed" }, "Choose an HTTP method used by this example.", "framework");
      if ((method === "POST" && hasId) || (method !== "POST" && !hasId)) return result(405, { detail: "Method Not Allowed" }, "This route does not support that method; no endpoint ran.", "framework");
      if (method === "DELETE") {
        if (!students.has(id)) return missing();
        students.delete(id);
        return result(204, null, "The record was removed. A 204 response has no body.");
      }
      let body;
      try { body = JSON.parse(rawBody); } catch { return invalid("The request body must be valid JSON."); }
      const error = validateBody(body, method === "PATCH");
      if (error) {
        const explicitNull = method === "PATCH" && (body.name === null || body.age === null);
        if (explicitNull) return result(422, { detail: error }, "StudentPatch accepts an omitted field, but this endpoint rejects a field explicitly set to null; no data changed.");
        return invalid(error);
      }
      if (method === "POST") {
        const created = { id: nextId++, name: body.name, age: body.age };
        students.set(created.id, created);
        return result(201, created, "The server assigned a new ID and saved the student in memory.");
      }
      if (!students.has(id)) return missing();
      if (method === "PUT") {
        const replaced = { id, name: body.name, age: body.age };
        students.set(id, replaced);
        return result(200, replaced, "Both editable fields were replaced; the path ID stayed the same.");
      }
      const updated = { ...students.get(id) };
      if (Object.hasOwn(body, "name")) updated.name = body.name;
      if (Object.hasOwn(body, "age")) updated.age = body.age;
      students.set(id, updated);
      return result(200, updated, "Only supplied fields changed; omitted fields stayed the same.");
    }
    function traceRequest(method, path, rawBody, response) {
      const steps = [{ title: "Client → server", detail: `${method} ${path || "(no path)"} starts in the client.` }];
      let url;
      try { url = new URL(path, "https://example.invalid"); } catch { url = null; }
      const segments = url?.pathname.split("/").filter(Boolean) ?? [];
      const idText = segments.length === 2 && segments[0] === "students" ? segments[1] : null;
      const query = url ? [...url.searchParams.entries()].map(([key, value]) => `${key}=${value}`) : [];
      let inputDetail = "FastAPI looks for a matching method and path.";
      if (idText !== null) inputDetail += ` Path text “${idText}” is offered to student_id: int.`;
      if (query.length) inputDetail += ` Query string ${query.join(", ")} offers values to matching function parameters.`;
      if (["POST", "PUT", "PATCH"].includes(method)) {
        try {
          const parsed = JSON.parse(rawBody);
          const model = method === "PATCH" ? "StudentPatch" : "StudentIn";
          const fields = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? Object.keys(parsed).join(", ") || "no fields" : "a non-object value";
          inputDetail += ` JSON body fields (${fields}) are validated for ${model}.`;
        } catch {
          inputDetail += " JSON parsing fails before the endpoint runs.";
        }
      }
      if (response.stage === "framework" && response.status === 422) inputDetail += " FastAPI validation failed; the endpoint does not run.";
      if (response.status === 405) inputDetail += " This method is not registered for the matched path.";
      steps.push({ title: "FastAPI → routing & validation", detail: inputDetail });
      steps.push({ title: response.stage === "framework" ? "Before the function" : "Function → data", detail: response.explanation });
      steps.push({ title: "Server → client", detail: `${response.status} response; ${response.body === null ? "no body" : "the shown JSON body"} goes back to the client.` });
      return steps;
    }
    function request(method, path, rawBody) {
      const response = handleRequest(method, path, rawBody);
      return { ...response, trace: traceRequest(method, path, rawBody, response) };
    }
    return { request, reset };
  }
  root.createStudentSimulator = createSimulator;
  if (typeof module !== "undefined" && module.exports) module.exports = { createSimulator };
})(typeof window !== "undefined" ? window : globalThis);
