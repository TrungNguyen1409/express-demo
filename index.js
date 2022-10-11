const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());


const courses =  [
    { id: 1, name:"course1"},
    { id: 2, name:"course2"},
    { id: 3, name:"course3"}
]
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});


app.get('/api/courses', (req,res)=>{
    res.send(courses);
});

app.post('/api/courses', (req,res)=> {

    const {error} = validateCourse(req.body)
    if(error){
        // 400 Bad Request
        res.status(400).send(error.details[0].message)
        return;
    }
    
    const course = {
        id: courses.length+1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.get('/api/courses/:id',(req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID was not found')
    res.send(course); // 404
});

app.put('/api/courses/:id', (req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) {
        res.status(404).send('the course with the given ID was not found')
    }

    // Validate
    const {error} = validateCourse(req.body) // result.error

    // If invalide, return 400 - Bad request
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    // Update course
    course.name = req.body.name;
    // Return updated course
    res.send(course);
});



function validateCourse(course){
    const schema = Joi.object({name: Joi.string().min(3).required()});
  
    return schema.validate(course);
   
}

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))