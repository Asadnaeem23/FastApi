
# AGENTS.md — Interactive FastAPI Learning Guide

## 1. Project Goal

Build and maintain a professional, interactive FastAPI learning website that makes programming concepts simple to understand, visualize, practice, and remember.

This is a continuously growing personal learning resource.

The user learns concepts separately, primarily through ChatGPT, and provides explanations, notes, or code examples to this agent.

Your responsibility is to transform that material into high-quality interactive documentation.

The primary objective is **deep conceptual understanding**, not simply creating attractive pages or copying explanations into a website.

A learner should be able to:
- Understand what a concept means.
- Explain why it exists and what problem it solves.
- Understand how it works internally.
- Read and explain related code.
- Trace data through the code.
- Predict the output of different inputs.
- Understand common mistakes and edge cases.
- Apply the concept in practical scenarios.
- Explain the concept confidently in an interview.

Prioritize understanding over memorization.

---

## 2. Incremental Learning Approach

The user will provide new topics gradually as they learn them.

Do not attempt to build an entire FastAPI course at once.

### Rules

1. Work on the topics currently provided by the user.
2. Extend the existing documentation as new topics arrive.
3. Preserve all previously implemented lessons and features.
4. Maintain consistent navigation, design, and organization.
5. Identify important missing details within the current topic.
6. Add necessary prerequisites when they help explain the topic.
7. Do not introduce unrelated advanced topics prematurely.
8. Link related lessons when useful.
9. Make each lesson understandable without requiring knowledge of future lessons.

For example:

If the current topic is Path Parameters:
- Explain URL matching.
- Explain function parameters and arguments.
- Explain type hints.
- Show how FastAPI extracts and converts values.
- Explain validation errors.
- Show practical examples.

Do not unnecessarily introduce authentication, database migrations, or complex dependency injection.

The documentation should grow naturally as learning progresses.

---

## 3. Analyze and Improve Provided Explanations

Do not blindly copy or summarize the user's material.

Before implementation:

1. Read and understand the explanation.
2. Identify the main concepts being taught.
3. Check technical accuracy.
4. Identify missing explanations.
5. Identify confusing terminology.
6. Identify important use cases and edge cases.
7. Determine which concepts benefit from visualization.
8. Improve the explanation before converting it into documentation.

You are allowed and expected to improve the learning material.

However, preserve the intended scope.

### Important

A provided explanation may be incomplete.

Your responsibility is to make it conceptually complete for the current topic, not to reproduce its weaknesses.

Use official FastAPI, Python, or Pydantic documentation when verification is necessary.

Prefer modern, supported syntax and APIs.

Do not silently introduce version-specific behavior without checking compatibility.

---

## 4. Explanation Quality Standards

Explain concepts in simple, natural, beginner-friendly English.

Assume the learner understands basic Python but may struggle with backend execution flow, function signatures, HTTP concepts, and framework behavior.

### Each important concept should answer:

1. What is it?
2. Why do we need it?
3. What problem does it solve?
4. How does it work?
5. When should we use it?
6. How does it appear in code?
7. What happens when the code executes?
8. What happens with different inputs?
9. What are common mistakes?
10. What should the learner remember?

Adapt the explanation depth to the topic.

Simple concepts may need only a short explanation and example.

Important or confusing concepts should receive more detailed explanations, demonstrations, and practical scenarios.

### Avoid

- Unnecessary technical jargon.
- Long definitions without examples.
- Overly complicated analogies.
- Repeating the same information.
- Unexplained code dumps.
- Advanced implementation details unrelated to the current lesson.
- Visuals that look impressive but teach very little.

Use analogies when they genuinely clarify a concept, then connect them to the real technical behavior.

---

## 5. Explanation Before Visualization

This is a critical project rule.

**Never sacrifice conceptual understanding for visual appeal.**

Visual demonstrations should support explanations, not replace them.

Every important concept should have a clear written explanation alongside its visual demonstration.

Follow this general learning sequence:

1. Explain the concept simply.
2. Show a small example.
3. Explain the important code.
4. Visualize how it works.
5. Let the learner interact with it.
6. Show practical scenarios and errors.
7. Summarize the important takeaway.

Use this sequence flexibly rather than forcing every topic into the same layout.

For example, a function parameter lesson should explain what parameters and arguments are before displaying an animated function call.

The learner must understand both the visual and the actual code.

---

## 6. Explain Code Thoroughly

Code understanding is one of the highest priorities.

Do not assume that displaying syntax is enough.

For important examples, explain:

- What each important line does.
- Why the line is necessary.
- Where input values originate.
- What function receives the values.
- What type each value has.
- Whether values are converted or validated.
- What processing occurs.
- What data changes.
- What the function returns.
- What the client receives.

### Function Signatures

Pay particular attention to:

- Parameters versus arguments.
- Type hints such as `name: str`.
- Return annotations such as `-> dict`.
- The actual `return` statement.
- Default parameter values.
- Required versus optional parameters.
- Different parameter sources.

Explain syntax explicitly when it may confuse beginners.

For example:

```python
def add(a: int, b: int) -> int:
    return a + b
```

The learner should understand:
- `a` and `b` are parameters.
- `: int` indicates expected types.
- `-> int` describes the expected return type.
- `return` actually returns the result.
- Calling `add(5, 3)` passes the arguments `5` and `3`.

Do not assume readers already understand these differences.

---

## 7. Visualize Execution and Value Flow

For important concepts, demonstrate the execution process step by step.

For FastAPI, show the complete request lifecycle when relevant:

1. The client sends an HTTP request.
2. FastAPI matches the route.
3. FastAPI extracts input values.
4. FastAPI validates and converts supported inputs.
5. The endpoint function receives arguments.
6. The function executes its logic.
7. Data is read, created, modified, or deleted if applicable.
8. The function returns a value or raises an exception.
9. FastAPI processes the response.
10. The client receives the HTTP status and response.

Clearly distinguish between:

- Python behavior.
- FastAPI's automatic behavior.
- Pydantic validation.
- Developer-written application logic.
- Database behavior, when applicable.

For example, explain that FastAPI can convert a path parameter to an integer, but checking whether a student actually exists requires application logic or a database query.

### Value Tracing

When possible, visually trace a concrete value from beginning to end.

Example:

`GET /students/5`

Show:

- The URL contains `5`.
- The path defines `{student_id}`.
- FastAPI extracts `"5"`.
- FastAPI converts it to integer `5`.
- The function receives `student_id=5`.
- The code looks up the student.
- A response is generated.

Also show what happens if the input is invalid or the student does not exist.

The learner should understand exactly where execution fails and whether the endpoint function was executed.

---

## 8. Interactive Learning Features

Prioritize meaningful interactivity.

Use appropriate visual techniques depending on the concept:

- Interactive request/response simulations.
- Step-by-step execution diagrams.
- Animated data flow.
- Editable input values.
- Code highlighting.
- Before-and-after comparisons.
- Expandable code explanations.
- Interactive parameter demonstrations.
- CRUD operation simulations.
- Interactive quizzes.
- Predict-the-output exercises.
- Error scenario demonstrations.
- Revealable solutions.

### Interaction Principles

Whenever practical, let the learner:

1. Change an input.
2. Predict the result.
3. Execute or simulate the operation.
4. Observe the intermediate steps.
5. See the final output.
6. Understand why that output occurred.

For example:

For Path Parameters, allow entering:

`/students/5`

`/students/abc`

`/students/999`

Then show the different validation, application execution, and response paths.

### Accuracy Rules

- Interactive behavior must match the explanation.
- Do not fake successful execution.
- Clearly label simulations.
- Do not imply that a simulated database persists information.
- Keep displayed data and state consistent.
- Resettable demonstrations are preferred.
- Avoid unnecessary animations and decorative interactions.

A simple interactive example that clearly teaches the concept is better than a complicated animation.

---

## 9. Practical Use Cases and Edge Cases

Important topics must include realistic scenarios.

Do not demonstrate only the successful case.

Consider relevant scenarios such as:

- Valid input.
- Invalid input.
- Missing required values.
- Optional or default values.
- Incorrect data types.
- Resource not found.
- Empty results.
- Multiple input parameters.
- Unexpected or conflicting data.
- Appropriate HTTP errors.
- State changes and their consequences.

### CRUD Topics

When explaining CRUD operations, cover relevant differences between:

- GET, POST, PUT, PATCH, and DELETE.
- Creating versus updating.
- Full replacement versus partial modification.
- Missing fields versus explicitly supplied `null`.
- Path parameters versus query parameters versus request bodies.
- Successful operations versus validation failures.
- Resource-not-found errors.
- Response status codes.
- In-memory storage versus persistent storage.

Explain these concepts progressively, only when they belong to the current lesson.

Do not overwhelm learners with every possible production edge case at once.

---

## 10. Code Examples and Technical Accuracy

Use short, readable, runnable code examples wherever practical.

### Rules

1. Start with the simplest example that demonstrates the concept.
2. Gradually introduce additional complexity.
3. Explain important lines.
4. Show sample requests.
5. Show expected responses.
6. Include error examples when relevant.
7. Avoid unnecessary dependencies.
8. Prefer consistent naming and realistic examples.
9. Check that different examples do not contradict each other.
10. Use current, supported framework conventions.

For longer examples:
- First explain the individual concepts.
- Then provide a complete working example.
- Explain how the pieces connect.

Clearly indicate whether code is:

- A complete runnable example.
- A focused code snippet.
- Pseudocode.
- A simulated example.

Do not claim code has been executed or tested unless it actually has been.

---

## 11. Lesson Structure

Use a consistent but flexible structure.

A typical lesson may contain:

### A. Concept Introduction

A simple explanation of the concept and why it matters.

### B. Intuition

A relatable example or analogy when helpful.

### C. Basic Example

A short code example showing the concept.

### D. Code Explanation

Explain the important syntax, parameters, and statements.

### E. Execution Flow

A visual walkthrough showing what happens step by step.

### F. Interactive Demonstration

Let the learner change values and observe results.

### G. Practical Use Cases

Show where the concept is used in real applications.

### H. Common Mistakes

Show likely misunderstandings and explain corrections.

### I. Practice

Include short exercises or prediction questions when useful.

### J. Quick Revision

Summarize the most important learning points.

### Important

This is a guideline, not a mandatory template.

Avoid repetitive sections.

Combine or omit sections when appropriate.

Give complex concepts more explanation and simpler concepts less.

---

## 12. Documentation Website Management

Before implementing changes:

1. Inspect the existing project.
2. Identify the framework and libraries already in use.
3. Understand the existing file structure.
4. Review the current navigation and design system.
5. Reuse existing components where practical.

### Website Requirements

- Clean and professional documentation design.
- Responsive layouts for desktop and mobile.
- Readable typography.
- Consistent spacing and colors.
- Syntax-highlighted code.
- Logical lesson navigation.
- Clear section hierarchy.
- Easy movement between related topics.
- Accessible interactive controls.
- Consistent visual language.
- Useful navigation as new lessons are added.

Organize content into modules or topic groups as the website grows.

Do not restructure or rebuild unrelated parts of the project unnecessarily.

### Implementation Scope

The focus is a documentation website, not a collection of separate applications.

Create frontend components, interactive demonstrations, and supporting code as needed.

Avoid:
- Unnecessary backend services.
- Unrelated application features.
- Complex infrastructure.
- Unnecessary dependencies.
- Duplicate components.
- Large refactors unrelated to the task.

Prefer reusable components for common learning interactions.

Use the existing project's established conventions.

---

## 13. Learning Progression and Navigation

The documentation should support both:

1. Learning a concept for the first time.
2. Quickly revising it later.

Maintain logical learning order.

When a lesson depends on an earlier topic, link to that topic instead of unnecessarily repeating its entire explanation.

Use concise reminders where needed.

When the user provides a new lesson:
- Add it in the appropriate location.
- Update navigation.
- Connect related concepts.
- Preserve previous explanations and interactions.
- Maintain consistent terminology.

Do not generate empty pages for topics not yet provided.

Do not create an entire future curriculum without explicit instructions.

---

## 14. Practice and Knowledge Checks

Important lessons should help the learner verify understanding.

Use suitable exercises such as:

- Predict the response.
- Identify the parameter source.
- Find the error.
- Complete missing code.
- Compare two approaches.
- Choose the correct HTTP method.
- Trace function execution.
- Explain why a request fails.

Whenever practical, provide:

- Immediate feedback.
- Correct answers.
- Short reasoning.
- An option to retry.

Avoid questions based purely on memorizing definitions.

Prioritize reasoning and application.

---

## 15. Quality Assurance

Before considering a lesson complete, verify:

### Content Quality

- The explanation is technically accurate.
- Important concepts are not missing.
- The explanation is easy to follow.
- Necessary prerequisites are explained.
- Examples match the explanation.
- Edge cases are included where useful.
- Written explanations remain sufficient without animations.

### Code Quality

- Code is syntactically valid.
- Examples are runnable when presented as complete examples.
- Requests and expected responses are consistent.
- Type hints and return values are explained correctly.
- Framework behavior is distinguished from custom logic.
- Invalid scenarios behave as described.

### Interaction Quality

- Interactive controls function.
- Changing an input changes the appropriate result.
- Execution steps match actual behavior.
- Error demonstrations are correct.
- Reset functions work where provided.
- Interactive state remains consistent.

### Website Quality

- Navigation works.
- Existing lessons remain functional.
- Layouts work on mobile and desktop.
- Code blocks remain readable.
- No unnecessary duplicate content is introduced.
- No unrelated functionality is broken.

If a check cannot be performed, report that limitation rather than claiming success.

---

## 16. Workflow for Every New Topic

Whenever the user provides new explanations or code:

### Step 1 — Analyze

Understand the topic, existing explanation, and intended learning outcome.

### Step 2 — Identify Gaps

Identify:
- Incorrect information.
- Missing important concepts.
- Confusing code.
- Missing practical scenarios.
- Useful visual opportunities.

### Step 3 — Improve Content

Produce a clear, accurate explanation while respecting the scope of the supplied topic.

### Step 4 — Plan the Presentation

Determine which parts should use:
- Written explanations.
- Code walkthroughs.
- Diagrams.
- Interactive demonstrations.
- Comparisons.
- Practice exercises.

Do not create visuals unnecessarily.

### Step 5 — Implement

Integrate the lesson into the existing website.

Reuse components and follow established patterns.

### Step 6 — Verify

Check content accuracy, code examples, interaction behavior, responsiveness, and navigation.

### Step 7 — Report

Briefly summarize:
- What was added.
- What explanations were improved.
- What interactive features were created.
- What was actually tested.
- Any remaining limitations.

Do not request polished input material from the user.

Work directly from the notes, explanations, or examples provided.

Ask for clarification only when a genuinely essential requirement is missing and a reasonable assumption is not possible.

---

## 17. Preserve Existing Work

The documentation website will be developed incrementally.

Always preserve existing work unless the user explicitly requests changes.

Do not:
- Delete existing lessons without authorization.
- Replace working components unnecessarily.
- Rewrite unrelated code.
- Remove user-created content.
- Introduce unrelated features.
- Push changes to GitHub without authorization.

If existing code contains a relevant problem, fix it carefully without creating unnecessary changes elsewhere.

---

## 18. Definition of Done

A lesson is complete when:

1. The concept is explained clearly.
2. Essential information is present.
3. The learner understands why the concept exists.
4. Important code is explained.
5. Input and output behavior can be traced.
6. Suitable visuals or demonstrations are implemented.
7. Relevant failure cases are understood.
8. Practical use cases are covered.
9. The lesson provides a way to check understanding when appropriate.
10. The implementation is integrated and verified.

A visually attractive page alone does not satisfy these requirements.

---

## 19. Final Objective

Build a continuously expanding, interactive FastAPI learning resource.

The website should transform the user's learning notes into explanations that are:

- Simple enough for beginners.
- Technically correct.
- Conceptually complete.
- Supported by practical examples.
- Enhanced with meaningful visuals.
- Interactive where useful.
- Easy to revise later.

**The ultimate goal is not to make the learner memorize FastAPI syntax.**

**The goal is to help the learner understand what the code does, why it works, how data flows, what happens when something fails, and when to use each concept.**

Prioritize clarity, understanding, correctness, and long-term learning value over visual complexity or the amount of code written.
