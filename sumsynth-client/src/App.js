import './App.css';
import Topbar from "./topbar/Topbar";
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';

const endpoint = "http://localhost:3000/gen"

function App() {

  const [codeSnippet, setCodeSnippet] = useState('');
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleInputChange = (event) => {
    setCodeSnippet(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                spec: codeSnippet,
                gen: "under",
                lang: "c",
            })
        });

    }  catch (err) {
        console.error(err);
    }

    console.log('Sending text to the server:', codeSnippet);
    setIsFormSubmitted(true);
  };

  const handleNewSubmission = (event) => {
    setIsFormSubmitted(false);

  }

  return (
    <>
    <Topbar/>
    <div className='container'> 

      <div className='formBox'>
        <div className='titles'>Code</div>
        <form className='form' onSubmit={handleFormSubmit}>
          <TextField 
            fullWidth 
            multiline
            label="Code Snippet" 
            id="fullWidth" 
            value={codeSnippet}
            onChange={handleInputChange}
          />
          <Button style={{marginTop: "1%"}} type="submit" variant="contained" color="primary">
            Submit
          </Button>      
        </form>
      </div>  

      <div className='responseBox'>
        <div className='titles'>Results</div>
        <div className='displayResponse'>
          results goes here
          <br/>
          and also here
          <br/>
          and continues here...
        </div>
      </div>
      

      {/*{isFormSubmitted ? (
        <div>
          <p>Thank you for your submission!</p>
          <Button onClick={handleNewSubmission} type="submit" variant="contained" color="primary">
            Submit another code snippet
          </Button> 
        </div>
      ) : 
        (
        <form className='form' onSubmit={handleFormSubmit}>
          <TextField 
            fullWidth 
            multiline
            label="Code Snippet" 
            id="fullWidth" 
            value={inputText}
            onChange={handleInputChange}
          />
          <Button style={{marginTop: "1%"}} type="submit" variant="contained" color="primary">
            Submit
          </Button>      
        </form>
        )
      }
      */}

    </div>
      
    </>
    
    
  );
}

export default App;
