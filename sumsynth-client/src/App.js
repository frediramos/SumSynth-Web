import './App.css';
import Topbar from "./topbar/Topbar";
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

const endpoint = "http://localhost:3000/gen"

function App() {

  const [inputSpec, setinputSpec] = useState('');
  const [language, setLang] = useState('c');
  const [generator, setGenerator] = useState('under');
  
  const [isSummReceived, setIsSummReceived] = useState(false);
  const [genSummary, setgenSummary] = useState('')

  const handleInputChange = (event) => {
    setinputSpec(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log('Sending text to the server:', inputSpec);
    
    if(!inputSpec){
        setgenSummary("");
        return;
    }

    try {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                spec: inputSpec,
                gen: generator,
                lang: language,
            })
        }).then(response =>
                {if(response.ok)
                    {return response.json()}
                }).then((responseJson) => {
            
            const code = responseJson.code
            console.log(code);

            if(code){
                setgenSummary(code);
                setIsSummReceived(true);
            } 
            
        });
    }
    catch (err) {
        console.error(err);
    }
  };


  return (
    <>
    <Topbar/>
    <div className='container'> 

      <div className='formBox'>
        <div className='titles'> Summary Specification </div>
        <form className='form' onSubmit={handleFormSubmit}>
          <TextField 
            fullWidth 
            multiline
            label="Input Spec" 
            id="fullWidth" 
            value={inputSpec}
            onChange={handleInputChange}
          />

        <div className='generators'> 
        <ToggleButtonGroup
            style={{marginTop: "1%"}}
            sx={{ mb: 1 }}
            exclusive
            value={generator}
            onChange={(_e, gen) => {if(gen !== null) setGenerator(gen);}}
            >
            <ToggleButton value='under' aria-label='Under'>Under</ToggleButton>
            <ToggleButton value='over' aria-label='Over'>Over</ToggleButton>
            <ToggleButton value='exact' aria-label='Exact'>Exact</ToggleButton>
        </ToggleButtonGroup>
        </div>

        <div className='language'> 
        <ToggleButtonGroup
            sx={{ mb: 1 }}
            exclusive
            value={language}
            onChange={(_e, lang) => {if(lang !== null) setLang(lang);}}
            >
            <ToggleButton value='c' aria-label='C'>C</ToggleButton>
            <ToggleButton value='py' aria-label='Python'>Python</ToggleButton>
        </ToggleButtonGroup>
        </div>

          <Button type="submit" variant="contained" color="primary">
            Generate
          </Button>      
        </form>
      </div>



      <div className='responseBox'>
        <div className='titles'> Generated Summary </div>
        {isSummReceived &&
        
        <TextField
        label="Summary" 
            fullWidth 
            multiline
            id="fullWidth" 
            value={genSummary}
        />   
        }

        {!isSummReceived &&
        <TextField 
            label="Summary" 
            fullWidth 
            multiline
            id="fullWidth" 
        />   
        } 

      </div>     
    </div>
    </>
  );
}

export default App;
