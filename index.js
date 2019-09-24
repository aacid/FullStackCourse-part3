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
    Person.countDocuments({}, (error, count) => {
        response.send(
            `<p>Phonebook has info for ${count} people</p><p>${Date()}</p>`
        );
    });
});

app.get("/api/persons", (request, response) => {
    Person.find({}).then(result => {
        response.json(result.map(record => record.toJSON()));
    });
});

app.get("/api/persons/:id", (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => {
            next(error);
        });
});

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end();
        })
        .catch(error => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body;

    const person = {
        number: body.number
    };

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedNote => {
            response.json(updatedNote);
        })
        .catch(error => next(error));
});

app.post("/api/persons", (request, response) => {
    const body = request.body;
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing"
        });
    }
    // if (persons.some(person => person.name === body.name)) {
    //     return response.status(409).json({
    //         error: `name ${body.name} already exists`
    //     });
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    });
    person.save().then(newPerson => {
        response.json(newPerson.toJSON());
    });
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === "CastError" && error.kind === "ObjectId") {
        return response.status(400).send({ error: "malformatted id" });
    }

    next(error);
};

app.use(errorHandler);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
