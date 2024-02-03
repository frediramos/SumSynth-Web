import './App.css';
import Topbar from "./topbar/Topbar";
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ListSubheader from '@mui/material/ListSubheader';

import SyntaxHighlighter from 'react-syntax-highlighter'; 

import strlen from "./placeholders/strlen.in";

const endpoint = "http://localhost:3001/gen";

function dropDownItems(names) {

	return names.map((name) => (
		<MenuItem key={name} value={name}>
		  {name}
		</MenuItem>
	  ))
}

function App() {

	const [defaultSumms, setDefaultSumms] = useState({"under":{}});
	
	const [first, setFirst] = useState(true);
	const [placeholder, setPlaceholder] = useState("");
	const [inputSpec, setinputSpec] = useState("");
	const [language, setLang] = useState('c');
	const [displaylang, setDisplayLang] = useState('c');
	const [generator, setGenerator] = useState('under');
	
	const [inputError, setInputError] = useState(false)
	const [genSummary, setgenSummary] = useState('')
	
 
	fetch(strlen)
	.then(r => r.text())
	.then(text => {
		if(first){
			setinputSpec(text);
			setPlaceholder(text);
		}
	});

	const handleInputChange = (event) => {
		console.log(event.target.value)
		setFirst(false);
		setinputSpec(event.target.value);
	};

  	const handleFormSubmit = async (event) => {
		event.preventDefault();
		
		if(!inputSpec){
			setgenSummary("");
			return;
		}
		
		console.log('Sending text to the server:', inputSpec);
		
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
			}).then(response => {	
						if(response.ok){return response.json();}
						throw new Error(response.status);
					
			}).then((responseJson) => {
				
				const code = responseJson.code
				console.log(code);

				if(code){
					setgenSummary(code);
					setInputError(false);
					setDisplayLang(language)
				} 
				
			}).catch((error) => {
				console.log('error: ' + error);
				setInputError(true);
			});
		
		} catch (err) {
			console.error(err);
		}
	};


  return (
	<>
	<Topbar/>
	<div className='container'> 

	  <div className='formBox'>
		<div className='titles'>Summary Specification</div>

		<Box sx={{ mb: 3, mt: 3 }}>
		<FormControl fullWidth size="small">
        <InputLabel>Default spec</InputLabel>
        <Select label="Default spec" >
		
			<ListSubheader>Under</ListSubheader>
				{dropDownItems(["strlen", "strcmp"])}
			<ListSubheader>Over</ListSubheader>
				<MenuItem value={3}>Option 3</MenuItem>
				<MenuItem value={4}>Option 4</MenuItem>
			<ListSubheader>Exact</ListSubheader>
				<MenuItem value={3}>Option 3</MenuItem>
				<MenuItem value={4}>Option 4</MenuItem>    
		
		</Select>
      	</FormControl>
    	</Box>
		
		<form className='form' onSubmit={handleFormSubmit}>
		{<TextField
			error={inputError}
			helperText={inputError? "Invalid input spec.": undefined}
			placeholder={inputError? placeholder: undefined}
			fullWidth 
			multiline
			value={first? inputSpec : undefined} 
			onChange={handleInputChange}
			color='warning'
			variante='outlined'
			rows={10}
		/>}
		
		<div className='generators'> 
		<ToggleButtonGroup
			sx={{ mb: 1, mt: "1%" }}
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

		  <Button type="submit" variant="contained" className='submitButton'>
			Generate
		  </Button>      
		</form>
	  </div>



	  <div className='responseBox'>
		<div className='titles'>Generated Summary</div>
		<Paper
		fullWidth
		variant='outlined'
		sx ={{
			minHeight: 260,
			border: 1,
			borderColor: "#b6b6b6"	
		}}
			
		elevation={0}>
          <SyntaxHighlighter
		   language={displaylang==='c'? 'c':'python'}
		   wrapLongLines customStyle={{
				backgroundColor: "transparent",
			 	marginTop: "-1pt",
			 	marginBottom: "-1pt",
		  	}}>
		  {genSummary}
          </SyntaxHighlighter>
		</Paper> 
	  </div>     
	</div>
	</>
  );
}

export default App;
