const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note')
const{body,validationResult}= require('express-validator');

//Route 1: Get all notes using : GET "/api/notes/fetchallnotes". login required
router.get('/fetchallnotes',fetchuser, async (req,res)=>{
    try {
        
    
    const notes = await Note.find({user: req.user.id});
    
    res.json(notes)
     } catch(error){
        console.error(error.message);
        res.status(500).send("error occured");
    }
})


//Route 2: Get all notes using : POST "/api/notes/addnote". login required
router.post('/addnote',fetchuser,[
    body('title','Enter a valid title').isLength({min:3}),
    body('description','description must be atleast 5 characters').isLength({min:5})], async (req,res)=>{
    try {
        
    
        const {title,description,tag} = req.body
     //If there are errors, return Bad request and the error
   const errors = validationResult(req);
   if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array() });
   }
    const note = new Note({
        title,description,tag,user: req.user.id
    })
    const saveNote = await note.save()
    res.json(saveNote)
    } catch(error){
        console.error(error.message);
        res.status(500).send("error occured");
    }
})
//Route 3: Update an existing node : PUT "/api/notes/updatenote". login required

router.put('/updatenote/:id',fetchuser,
     async (req,res)=>{
        try {
        const{title,description,tag} = req.body;
        //create newNote object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};
        //find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})

        res.json({note});
    } catch(error){
        console.error(error.message);
        res.status(500).send("error occured");
    }
    })

    //Route 4: Delete an existing node : DELETE "/api/notes/deletenote". login required

router.delete('/deletenote/:id',fetchuser,
async (req,res)=>{
    try {
   
   //find the note to be delete and deleted it
   let note = await Note.findById(req.params.id);
   if(!note){return res.status(404).send("Not Found")}
    //Allow deletion only if user owns this Note
   if(note.user.toString() !== req.user.id){
       return res.status(401).send("Not Allowed");
   }

   note = await Note.findByIdAndDelete(req.params.id)

   res.json({"Succes" : "Note has been deleted",note:note});
} catch(error){
    console.error(error.message);
    res.status(500).send("error occured");
}
})
module.exports = router