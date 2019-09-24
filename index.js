require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const Person = require("./models/Person");
const app = express();

app.use(express.static("build"));
app.use(bodyParser.json());
morgan.token("body", (request, response) => {
    return JSON.stringify(request.body);
});
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

app.get("/info", (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
    );
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then(result => {
        response.json(result.map(record => record.toJSON()));
    });
});

app.get("/api/persons/:id", (request, response) => {
    // const id = Number(request.params.id);
    // const person = persons.find(person => person.id === id);
    // if (person) {
    //     response.json(person);
    // } else {
    //     response.status(404).end();
    // }
});

app.delete("/api/persons/:id", (request, response) => {
    // const id = Number(request.params.id);
    // persons = persons.filter(person => person.id !== id);
    // response.status(204).end();
});

app.post("/api/persons", (request, response) => {
    // const body = request.body;
    // if (!body.name || !body.number) {
    //     return response.status(400).json({
    //         error: "content missing"
    //     });
    // }
    // if (persons.some(person => person.name === body.name)) {
    //     return response.status(409).json({
    //         error: `name ${body.name} already exists`
    //     });
    // }
    // const person = {
    //     name: body.name,
    //     number: body.number,
    //     id: Math.floor(Math.random() * 1000000)
    // };
    // persons = persons.concat(person);
    // response.json(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
