import { useState } from 'react'
import Switzerland from './Switzerland.jsx'
import {
  Grid2
} from "@mui/material";
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red, purple } from '@mui/material/colors';


const theme = createTheme({
  palette: {
    primary: red,
    secondary: purple,
  },
});

function App() {


  return (
    <div>

      <Grid2 container
        id="home"
      >
      </Grid2>
      <Grid2 container>
        <Grid2 item xs={0} lg={3}></Grid2>
        <Grid2 item xs={12}>
          <ThemeProvider theme={theme}>
            <Switzerland />
          </ThemeProvider>
        </Grid2>
        <Grid2 item xs={0} lg={3}></Grid2>
      </Grid2>
    </div>
  )
}

export default App
