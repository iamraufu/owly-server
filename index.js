const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config();

app.use(bodyParser.json(), cors());

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Owly API'
    })
})

const userName = process.env.USER;
const password = process.env.PASSWORD;

const uri = `mongodb+srv://${userName}:${password}@eftykharrahman.lih5zus.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {

    const studentsCollection = client.db("OwlyBD").collection("Students");
    const partnersCollection = client.db("OwlyBD").collection("Partners");
    const institutesCollection = client.db("OwlyBD").collection("Institutes");

    // login
    app.post('/login', async (req, res) => {
        const { email, password } = req.body;
        const student = await studentsCollection.findOne({ email, password });
        const partner = await partnersCollection.findOne({ email, password });
        const institute = await institutesCollection.findOne({ email, password });

        student ||
            partner ||
            institute ?
            res.send({
                status: true,
                message: "Logged In Successfully!",
                result: {
                    student,
                    partner,
                    institute
                }
            })
            :
            res.send({
                status: false,
                message: "Email and Password does not match!"
            })
    })

    // Add New Student
    app.post('/addStudent', (req, res) => {
        const student = req.body;
        studentsCollection.findOne({ email: req.body.email }, (err, result) => {
            err && res.send({
                status: false,
                message: 'There is an error adding new student. Please try again later!',
            })
            if (result) {
                res.send({
                    status: false,
                    message: 'Student Already Exists!'
                })
            } else {
                studentsCollection.insertOne(student, (err, result) => {
                    err && res.send({
                        status: false,
                        message: 'There is an error adding new student. Please try again later!',
                    })
                    result && res.send({
                        status: true,
                        message: 'Student Registered Successfully'
                    });
                });
            }
        });
    })

    // Add New Partner
    app.post('/addPartner', (req, res) => {
        const partner = req.body;
        partnersCollection.findOne({ email: req.body.email }, (err, result) => {
            err && res.send({
                status: false,
                message: 'There is an error adding new partner. Please try again later!',
            })
            if (result) {
                res.send({
                    status: false,
                    message: 'Partner Already Exists!'
                })
            } else {
                partnersCollection.insertOne(partner, (err, result) => {
                    err && res.send({
                        status: false,
                        message: 'There is an error adding new partner. Please try again later!',
                    })
                    result && res.send({
                        status: true,
                        message: 'Partner Registered Successfully'
                    });
                });
            }
        });
    })

    // Add New Institute
    app.post('/addInstitute', (req, res) => {
        const institute = req.body;
        institutesCollection.findOne({ email: req.body.email }, (err, result) => {
            err && res.send({
                status: false,
                message: 'There is an error adding new institute. Please try again later!',
            })
            if (result) {
                res.send({
                    status: false,
                    message: 'Institute Already Exists!'
                })
            } else {
                institutesCollection.insertOne(institute, (err, result) => {
                    err && res.send({
                        status: false,
                        message: 'There is an error adding new institute. Please try again later!',
                    })
                    result && res.send({
                        status: true,
                        message: 'Institute Registered Successfully'
                    });
                });
            }
        });
    })

    // Get All Students
    app.get('/students', (req, res) => {
        studentsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // Get All Partners
    app.get('/partners', (req, res) => {
        partnersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // Get All Institutes
    app.get('/institutes', (req, res) => {
        institutesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // Get Single Student
    app.get('/students/:id', (req, res) => {
        studentsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    // Get Single Partner
    app.get('/partners/:id', (req, res) => {
        partnersCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    // Get Single Institute
    app.get('/institutes/:id', (req, res) => {
        institutesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    // Update Student By Id
    app.put('/student/:id', (req, res) => {
        studentsCollection.updateOne(
            {
                _id: ObjectId(req.params.id),
            },
            {
                $set: req.body
            },
            (err, result) => {
                err &&
                    res.send({
                        status: false,
                        message: "An Error Occurred! Please try again Later"
                    })
                result &&
                    res.send({
                        status: true,
                        message: "Student Information Updated Successfully!"
                    })
            }
        )
    })

    // Update Partner By Id 
    app.put('/partner/:id', (req, res) => {
        partnersCollection.updateOne(
            {
                _id: ObjectId(req.params.id),
            },
            {
                $set: req.body
            },
            (err, result) => {
                err &&
                    res.send({
                        status: false,
                        message: "An Error Occurred! Please try again Later"
                    })
                result &&
                    res.send({
                        status: true,
                        message: "Partner Information Updated Successfully!"
                    })
            }
        )
    })

    // Update Institute By Id
    app.put('/institute/:id', (req, res) => {
        institutesCollection.updateOne(
            {
                _id: ObjectId(req.params.id),
            },
            {
                $set: req.body
            },
            (err, result) => {
                err &&
                    res.send({
                        status: false,
                        message: "An Error Occurred! Please try again Later"
                    })
                result &&
                    res.send({
                        status: true,
                        message: "Institute Information Updated Successfully!"
                    })
            }
        )
    })

    // 

    err ? console.log(err) : console.log('Database connected successfully!');
})

app.listen(process.env.PORT || port, () => {
    console.log(`Owly Backend Running on port ${port}`)
})