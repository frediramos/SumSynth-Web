const express = require('express');
const Joi = require('joi');
const app = express();
const fs = require('fs');
const cors = require('cors');
const execSync = require('child_process').execSync;

// Dont need to block CPU to gen a temp string
// Can use 'non-secure'
const nanoid = require('nanoid/non-secure')

app.use(cors());
app.use(express.json())

const languages = ['c', 'py']
const generators = ['under', 'over', 'exact']

const postSchema = Joi.object({
    spec: Joi.string().min(1).required(),
    gen: Joi.string().valid(...generators).required(),
    lang: Joi.string().valid(...languages).required(),
});


function tmpName(){
    let name = nanoid.nanoid();
    while(fs.existsSync(name)){
        name = nanoid.nanoid();
    }
    return name;
}

function deleteFile(file){
    if(fs.existsSync(file)){
        fs.unlinkSync(file);
    }
}

// spec: handwritten input spec
// gen: under|over|exact generator
// lang: c|py| output language
function genSummary(spec, gen, lang){
    let summ = "";

    const tmp_spec = tmpName();
    const tmp_json = tmpName();
    const tmp_summ = tmpName();

    try{
        fs.writeFileSync(tmp_spec, spec)
        execSync(`spec2json ${tmp_spec} ${tmp_json} ${gen}`);   
        execSync(`json2summ -${lang} ${tmp_json} -o ${tmp_summ}`);   
        summ = fs.readFileSync(tmp_summ).toString();
    }
    catch (error) {
        console.error(error);
    }

    deleteFile(tmp_spec);
    deleteFile(tmp_json);
    deleteFile(tmp_summ);

    return summ;
}

app.post('/gen', (req, res) => {
    const result = postSchema.validate(req.body);   

    if (result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    
    const spec = req.body.spec;
    const gen = req.body.gen;
    const lang = req.body.lang;
    
    console.log(`Request Received:\n spec: ${spec}\n generator: ${gen}\n language: ${lang}\n`)
    
    const summ = genSummary(spec, gen, lang)

    console.log(`Computed Summary:\n ${summ}`)

    const summary = {   
        code: summ,
        gen: gen,
        lang: lang,
    };
    
    res.send(summary);
});    


const port = 3001
app.listen(port, () => console.log(`Listening on port ${port}\n`));