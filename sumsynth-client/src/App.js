import './App.css';
import Topbar from "./topbar/Topbar";
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const endpoint = "http://localhost:3000/gen"

function App() {

  const [inputSpec, setinputSpec] = useState('');
  const [isSummReceived, setIsSummReceived] = useState(false);
  const [genSummary, setgenSummary] = useState('')

  const handleInputChange = (event) => {
    setinputSpec(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log('Sending text to the server:', inputSpec);
    
    try {
        fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                spec: inputSpec,
                gen: "under",
                lang: "c",
            })
        }).then((response) => response.json()).then((responseJson) => {
            
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

  const handleNewSubmission = (event) => {
    setIsSummReceived(false);

  }

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
          <Button style={{marginTop: "1%"}} type="submit" variant="contained" color="primary">
            Submit
          </Button>      
        </form>
      </div>  

      <div className='responseBox'>
        <div className='titles'> Generated Summary </div>
        {isSummReceived &&
        
        <TextField 
            fullWidth 
            multiline
            id="fullWidth" 
            value={genSummary}
        />   
        }

        {!isSummReceived &&
        <TextField 
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
