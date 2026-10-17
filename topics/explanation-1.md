FastAPI — Modules 1 to 5 (Simple + Practical)
We'll cover the topics in your video in order, but spend more time on path parameters, query parameters, function arguments, and CRUD, because these are the foundations of building APIs.
We'll use a simple Student Management API throughout.
Module 1: Introduction to APIs and FastAPI
1. What is an API?
Imagine you have a university website where students can view their results.

The process:
1. A student clicks "View Result."
2. The frontend sends a request to the backend API.
3. The backend finds the student's result.
4. The API returns the result, usually as JSON.
5. The frontend displays it.
FastAPI is a Python framework for building that backend API.
2. Understanding HTTP methods
These methods tell the server what action we want.
Method	Purpose	Example
GET	Read data	Get student information
POST	Create data	Register a student
PUT	Replace data	Replace student details
PATCH	Update selected fields	Change only a student's name
DELETE	Delete data	Remove a student
These five methods will form our CRUD API.
3. Your first FastAPI endpoint
from fastapi import FastAPIapp = FastAPI()@app.get("/")def home():    return {"message": "Welcome to FastAPI"}



Understand each line:
- FastAPI is the class provided by the framework.
- app = FastAPI() creates our application.
- @app.get("/") connects a GET request at / to the function below it.
- def home() defines the function that runs when that endpoint is called.
- return sends data back to the client. FastAPI converts this dictionary into JSON.
Open:
http://127.0.0.1:8000/
Response:
{
  "message": "Welcome to FastAPI"
}


Important: @app.get("/") is called a decorator. For now, understand that it tells FastAPI which URL and HTTP method should execute the function.

Module 2: Environment Setup
Since you're using Windows and VS Code:
Step 1 — Create a project
mkdir fastapi-learning
cd fastapi-learning


Step 2 — Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\activate


A virtual environment keeps the project's installed Python packages separate from other projects.
Step 3 — Install FastAPI
pip install "fastapi[standard]"


Step 4 — Create main.py
Paste the previous Hello World example into it.
Step 5 — Run the server
fastapi dev main.py


Alternatively, you can use:
uvicorn main:app --reload


In main:app, main is the Python file and app is the FastAPI object. --reload restarts the development server when you edit code.
Open these addresses:
URL	Purpose
http://127.0.0.1:8000	Your API
http://127.0.0.1:8000/docs	Interactive Swagger documentation
http://127.0.0.1:8000/redoc	Alternative API documentation
We'll use /docs to test POST, PUT, PATCH and DELETE without needing Postman.

Module 3: Type Hints and Path Parameters
This module is especially important. First, let's clear up Python function syntax.
1. Function parameters, arguments, and return values
Consider:
def add(a: int, b: int) -> int:    result = a + b    return resultanswer = add(5, 3)print(answer)



Output:
8


Here's exactly what each part means:

- a and b are parameters: variable names in the function definition.
- : int is a type hint: we expect integers.
- 5 and 3 are arguments: the actual values passed when calling the function.
- -> int is the return type hint: the function is expected to return an integer.
- return result actually returns the calculated value.
Remember: -> does not return anything. return does.
Also, => is not Python function syntax. You might have seen it in JavaScript arrow functions.
2. More function examples
Example A — Function with no return value
def greet(name: str) -> None:    print(f"Hello {name}")



-> None means the function isn't expected to return a useful value.
Example B — Function returning a dictionary
def get_student() -> dict:    return {"name": "Ali", "age": 21}



-> dict means the expected result is a dictionary.
Example C — Default argument
def greet(name: str = "Guest") -> str:    return f"Hello {name}"



Calling greet() returns "Hello Guest".
Calling greet("Ali") returns "Hello Ali".
The = "Guest" provides a default value when no argument is given.
One additional point: regular Python type hints describe expected types but don't automatically enforce them. FastAPI uses these annotations to validate and convert incoming HTTP values.
3. What are path parameters?
Suppose we have three students:
ID	Name
1	Ali
2	Ahmed
3	Sara
We want these endpoints:
/students/1  → Ali
/students/2  → Ahmed
/students/3  → Sara


We don't want to write separate functions for each student.
Instead:
from fastapi import FastAPIapp = FastAPI()students = {    1: "Ali",    2: "Ahmed",    3: "Sara"}@app.get("/students/{student_id}")def get_student(student_id: int):    return {        "id": student_id,        "name": students.get(student_id)    }



What happens when someone visits /students/2?
1. FastAPI matches /students/{student_id}.
2. It takes 2 from the URL.
3. It converts 2 into an integer because of : int.
4. It calls get_student(student_id=2).
5. The function finds Ahmed and returns the result.
{
  "id": 2,
  "name": "Ahmed"
}


Notice that student_id in the route and the function must have the same name.
4. Multiple path parameters
@app.get("/students/{student_id}/courses/{course_id}")def get_course(student_id: int, course_id: int):    return {        "student_id": student_id,        "course_id": course_id    }



Request:
GET /students/10/courses/5


Response:
{
  "student_id": 10,
  "course_id": 5
}


There are two path parameters here because both are part of the URL path.
5. Important path parameter cases
Request	What happens?
/students/2	Valid integer, function executes
/students/abc	422 validation error because abc isn't an integer
/students/	Does not match the student-ID route
/students/999	Function runs, but you must handle the missing student yourself
The last case is important: FastAPI validates types; it doesn't know which student IDs exist in your data.
Also be careful with routes like:
@app.get("/students/all")def all_students():    ...@app.get("/students/{student_id}")def get_student(student_id: int):    ...



Declare specific static routes like /students/all before general dynamic routes like /students/{student_id}, otherwise the dynamic route can capture all first.
We'll handle missing records properly in the CRUD module.

Module 4: Query Parameters
1. What is a query parameter?
Look at these two URLs:
/students/5
/students?age=20


They serve different purposes.
- /students/5 → Get one specific student with ID 5.
- /students?age=20 → Find students whose age is 20.
A path parameter usually identifies a particular resource.
A query parameter is commonly used to filter, search, sort, or paginate data.
2. Basic query parameter example
@app.get("/students")def get_students(age: int):    return {"requested_age": age}



Request:
GET /students?age=20


FastAPI receives the query parameter age=20 and passes its value to the function.
Response:
{
  "requested_age": 20
}


Important: A query parameter without a default value is required.
So requesting just /students would produce a 422 validation error because age is missing.
3. Required, default, and optional query parameters
These three scenarios are very important.
Case A — Required
@app.get("/search")def search(name: str):    return {"name": name}



You must provide:
/search?name=Ali


Case B — Default value
@app.get("/students")def get_students(limit: int = 10):    return {"limit": limit}



Now:
/students           → limit = 10
/students?limit=5   → limit = 5


If the user doesn't provide limit, FastAPI uses 10.
Case C — Optional, with None
@app.get("/students")def get_students(name: str | None = None):    return {"name": name}



Now:
/students             → name = None
/students?name=Ali    → name = "Ali"


Understand this syntax:
- str | None means the value can be a string or None.
- = None makes the parameter optional by providing a default.
A type such as str | None on its own does not make a query parameter optional; the default value matters.
4. Multiple query parameters
@app.get("/students")def get_students(    age: int,    city: str = "Lahore",    active: bool = True):    return {        "age": age,        "city": city,        "active": active    }



Request:
/students?age=21&city=Karachi&active=false


What happens?
- age = 21
- city = "Karachi"
- active = False
We use ? to start query parameters and & to separate them.
Also, FastAPI converts the text "false" from the URL into the Python boolean False.
5. Path and query parameters together
This is a very common source of confusion.
@app.get("/students/{student_id}")def get_student(    student_id: int,    include_courses: bool = False):    return {        "student_id": student_id,        "include_courses": include_courses    }



Request:
GET /students/7?include_courses=true


Function parameter	Value	Comes from
student_id	7	URL path
include_courses	True	Query string
How does FastAPI know which one is which?
It looks at the endpoint:
@app.get("/students/{student_id}")



The parameter student_id appears inside the path, so FastAPI knows it must come from there.
The other simple parameter, include_courses, is treated as a query parameter. 

FastAPI
+1



6. Real-world use: Search and pagination
Imagine you have 1,000 students and want only 10 at a time.
@app.get("/students")def get_students(skip: int = 0, limit: int = 10):    return {        "skip": skip,        "limit": limit    }



Requests:
/students?skip=0&limit=10
/students?skip=10&limit=10
/students?skip=20&limit=10


They correspond to the first, second, and third pages of ten records.
To actually select records from a Python list:
students = ["Ali", "Sara", "Ahmed", "Zain", "Ayesha"]@app.get("/students")def get_students(skip: int = 0, limit: int = 2):    return students[skip:skip + limit]



Results:
Request	Returned students
?skip=0&limit=2	Ali, Sara
?skip=2&limit=2	Ahmed, Zain
?skip=4&limit=2	Ayesha
students[skip:skip + limit] is normal Python list slicing.
For production code, you should also restrict invalid values such as a negative skip or an excessively large limit.

Module 5: Building a CRUD API
Most important module
Now we'll combine everything and build a small working API.
1. First, understand CRUD
CRUD stands for Create, Read, Update, and Delete.
Consider a university storing student information.
Action	Method	Endpoint
Create student	POST	/students
Get all students	GET	/students
Get one student	GET	/students/2
Replace student	PUT	/students/2
Update some fields	PATCH	/students/2
Delete student	DELETE	/students/2
Before coding, you need to understand one more thing.
2. Path vs Query vs Request Body
When you build CRUD, data can come from three important places.
Example: Update a student
HTTP request
PUT
/students/5?notify=true


JSON Body
{
  "name": "Ahmed",
  "age": 22
}



Path
5
Which student?

Query
true
Notify them?

Body
name, age
New information



In FastAPI, the function could look like:
@app.put("/students/{student_id}")def update_student(    student_id: int,    student: StudentIn,    notify: bool = False):    ...



Here:
- student_id: int → Path parameter
- student: StudentIn → JSON request body
- notify: bool = False → Query parameter
StudentIn is a small Pydantic model we'll define next. FastAPI recognizes Pydantic-model parameters as request-body data in this example. 

FastAPI



3. Minimal Pydantic — only what we need
Since Pydantic is your next topic, we won't go into its advanced features.
For now, think of it as a way to describe the structure of incoming data and validate it.
from pydantic import BaseModelclass StudentIn(BaseModel):    name: str    age: int



This says a student must have:
- name as a string.
- age as an integer.
A valid JSON request body:
{
  "name": "Ali",
  "age": 21
}


If the client leaves out name, FastAPI returns a validation error.
This is enough Pydantic knowledge for the CRUD examples.
4. Complete CRUD API — runnable code
We'll use a Python dictionary as a temporary database. This makes it easier to understand CRUD before adding SQLAlchemy or MongoDB.
Create main.py and paste this code:
from fastapi import FastAPI, HTTPExceptionfrom pydantic import BaseModelapp = FastAPI()# Models for incoming dataclass StudentIn(BaseModel):    name: str    age: intclass StudentPatch(BaseModel):    name: str | None = None    age: int | None = None# Temporary in-memory databasestudents = {    1: {"id": 1, "name": "Ali", "age": 20},    2: {"id": 2, "name": "Sara", "age": 22},}next_id = 3# READ: Get all students, with optional filters@app.get("/students")def get_students(    search: str | None = None,    min_age: int | None = None,    skip: int = 0,    limit: int = 10):    result = list(students.values())



Run:
fastapi dev main.py


Open /docs.
Now let's understand the CRUD functions one by one, including what happens in different scenarios.

5. READ — GET Operations
We commonly need two different GET endpoints.
Case A: Get all students
@app.get("/students")def get_students():    return list(students.values())



Let's suppose our dictionary contains:
students = {    1: {"id": 1, "name": "Ali", "age": 20},    2: {"id": 2, "name": "Sara", "age": 22}}



students.values() gets the student records, and list() converts them into a list.
Response:
[
  {"id": 1, "name": "Ali", "age": 20},
  {"id": 2, "name": "Sara", "age": 22}
]


Case B: Get a particular student
@app.get("/students/{student_id}")def get_student(student_id: int):    if student_id not in students:        raise HTTPException(            status_code=404,            detail="Student not found"        )    return students[student_id]



Request:
GET /students/2


FastAPI gives student_id = 2 to the function.
Then:
if student_id not in students:



checks whether ID 2 exists as a key in our dictionary.
If it exists, return the student's data.
If not, raise an HTTP error.
What does raise HTTPException() mean?
It means stop processing this request and send an HTTP error response to the client.
For example:
GET /students/999


Response status: 404 Not Found
{
  "detail": "Student not found"
}


This is better than returning None because the client now knows that the resource doesn't exist. 

FastAPI



Case C: Search and filter
Our complete code also supports:
GET /students?search=Ali
GET /students?min_age=21
GET /students?search=Sara&min_age=20


Consider this line:
if search.lower() in s["name"].lower()



It checks whether the search text appears inside the student's name, ignoring uppercase/lowercase differences.
And this:
if s["age"] >= min_age



only keeps students whose age is greater than or equal to the requested minimum.
Finally:
return result[skip:skip + limit]



returns only the requested portion of the filtered results.

6. CREATE — POST Operation
POST is used to create new resources.
@app.post("/students", status_code=201)def create_student(student: StudentIn):    global next_id    new_student = {        "id": next_id,        **student.model_dump()    }    students[next_id] = new_student    next_id += 1    return new_student



Scenario: Register a new student
Request:
POST /students


JSON body:
{
  "name": "Ahmed",
  "age": 23
}


What happens?
1. FastAPI reads the JSON body and validates it using StudentIn.
2. The function receives the validated student object.
3. It creates a new student record with the next available ID.
4. It saves the record in our dictionary.
5. It increments next_id so the next student gets a different ID.
6. It returns the newly created student.
Response (201 Created):
{
  "id": 3,
  "name": "Ahmed",
  "age": 23
}


Understanding the confusing lines
student: StudentIn



This is the function parameter, representing the incoming JSON data as a Pydantic object.
student.model_dump()



Converts the Pydantic object into a normal Python dictionary:
{"name": "Ahmed", "age": 23}



Then:
{    "id": next_id,    **student.model_dump()}



combines the ID and the provided values into one dictionary.
The ** operator unpacks the fields from the dictionary.
global next_id allows this function to modify the counter defined outside the function. This is useful for our learning example, but a real application normally uses a database-generated ID.
Common POST scenarios
Scenario	Result
Valid name and age	Student created, 201
age is "abc"	Validation error, 422
name is missing	Validation error, 422
ID is not provided	Server generates one
Empty data storage	POST can still create a record

7. UPDATE — PUT vs PATCH
This is one of the most important CRUD distinctions.
Suppose our current record is:
{
  "id": 1,
  "name": "Ali",
  "age": 20
}


PUT — Replace the complete editable record
@app.put("/students/{student_id}")def replace_student(student_id: int, student: StudentIn):    if student_id not in students:        raise HTTPException(            status_code=404,            detail="Student not found"        )    students[student_id] = {        "id": student_id,        **student.model_dump()    }    return students[student_id]



Request:
PUT /students/1


Body:
{
  "name": "Ali Khan",
  "age": 21
}


The original record's editable fields are replaced by the new information. The ID remains unchanged.
With our StudentIn model, both name and age are required for PUT.
PATCH — Update only selected fields
Suppose we only want to change Ali's age, without sending the name again.
@app.patch("/students/{student_id}")def update_student(student_id: int, changes: StudentPatch):    ...



Request:
PATCH /students/1


Body:
{
  "age": 23
}


The result becomes:
{
  "id": 1,
  "name": "Ali",
  "age": 23
}


Only the age changes.
To do this, our full code uses:
updates = changes.model_dump(exclude_unset=True)students[student_id].update(updates)



- exclude_unset=True gives us only the fields the client actually sent.
- .update() changes those fields in the existing dictionary.
- The code also rejects explicitly supplied null values because we don't want a student's name or age to become None.
You don't need to memorize model_dump() yet. Its main purpose here is to turn Pydantic data into a dictionary.
PUT vs PATCH visual comparison
PUT
Full replacement

Request body{"name": "Ali Khan",
 "age": 25}


Updated record{"id": 1,
 "name": "Ali Khan",
 "age": 25}



PATCH
Partial change

Request body{"age": 25}


Updated record{"id": 1,
 "name": "Ali",
 "age": 25}





Important distinction: HTTP PUT is defined around replacing the resource's state, while PATCH applies partial modifications. In our teaching example, we keep the ID in the URL and only let the client replace the editable fields.
For this API, updating a student who doesn't exist returns 404. Some APIs deliberately support creating a resource using PUT, but we aren't implementing that behavior here.

8. DELETE — Delete Operation
@app.delete("/students/{student_id}", status_code=204)def delete_student(student_id: int):    if student_id not in students:        raise HTTPException(            status_code=404,            detail="Student not found"        )    del students[student_id]    return None



Scenario
Request:
DELETE /students/2


1. The function receives student_id = 2.
2. It checks if student 2 exists.
3. It deletes the record using del.
4. The API responds with 204 No Content.
Why 204?
It means the operation succeeded, but the server isn't returning a response body.
What if we call DELETE /students/2 again?
The record no longer exists. Our code therefore returns 404 Not Found.
An important detail: Some APIs use soft deletion, where a record is marked inactive rather than physically deleted. Our example uses hard deletion and removes it from the dictionary.

9. HTTP Status Codes You Must Understand
Status	Meaning	Common scenario
200 OK	Successful request	GET, PUT, PATCH
201 Created	Resource created	POST
204 No Content	Success, no response body	DELETE
400 Bad Request	Invalid request	Business rule violation
401 Unauthorized	Authentication needed or invalid	Missing/invalid login credentials
403 Forbidden	Access denied	User lacks permission
404 Not Found	Resource doesn't exist	Wrong student ID
422 Unprocessable Content	Request data validation failed	Wrong/missing field
500 Internal Server Error	Server-side failure	Unexpected application error
These codes communicate the outcome to the frontend. 

FastAPI




10. Practice: Predict the function inputs
Test your understanding
0 of 4 answered

1. GET /students/8?details=true
Function: {question.code}


student_id=8, details=True

student_id=True, details=8

student_id=8, details=False



2. GET /students?limit=5
Function: {question.code}


limit=10, skip=5

limit=5, skip=0

limit=5, skip=None



3. PATCH /students/3 with JSON body {"age": 25}
Function: {question.code}


student_id=3, changes.age=25

student_id=25, changes.age=3

student_id=3, changes=None



4. GET /students/abc
Function: {question.code}


student_id is automatically 0

The function receives 'abc' as an int

FastAPI responds with a 422 error


Complete all four questions
Try again


11. Common CRUD Confusions — Final Recap
Confusion	Correct understanding
Is student_id an argument or parameter?	Parameter in the function definition; its actual received value is the argument
Does -> dict return a dictionary?	No, it's a return type annotation. return returns it
Why is student_id from the path?	It matches {student_id} in the URL
Why is limit a query parameter?	It is a simple function parameter not declared in the path or body
Where does student: StudentIn come from?	The JSON request body
Is GET used to save records?	No, GET is for retrieving data
Does POST automatically create an ID?	No, your application or database must generate it
What if a student doesn't exist?	Raise HTTPException(404)
Why do we need PATCH?	To change only selected fields
Does return automatically save to the database?	No, you must save the data first
Will our data survive server restart?	No, because it is currently stored in Python memory
12. Your practical exercise
Try these requests in Swagger UI in this exact order, using the runnable code above.
Hands-on checklist
0/8 complete



[ ] GET
/students

Read the initial two students.

[ ] POST
/students

Create {"name":"Zain","age":24}. Note the returned ID.

[ ] GET
/students/3

Verify that Zain now exists.

[ ] GET
/students?min_age=22

Verify that only eligible ages appear.

[ ] PUT
/students/3

Replace Zain with {"name":"Zain Ali","age":25}.

[ ] PATCH
/students/3

Send only {"age":26}. Check whether the name stays unchanged.

[ ] DELETE
/students/3

Delete Zain.

[ ] GET
/students/3

Verify that the response is now 404.


Once you can explain what FastAPI receives, where each value comes from, what the function changes, and what it returns, you understand the main concepts of these five modules.