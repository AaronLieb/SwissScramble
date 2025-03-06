import Switzerland from './Switzerland.jsx'
import Login from './Login.jsx'
import {
  Grid2
} from "@mui/material";
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { red, purple } from '@mui/material/colors';
import { BrowserRouter as Router, Routes, Route } from "react-router";

const theme = createTheme({
  typography: {
    fontFamily: "Helvetica"
  },
  palette: {
    primary: red,
    secondary: purple,
  },
});

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={
                           <div>
                               <Grid2 container
                                      id="home"
                               >
                               </Grid2>
                               <Grid2 container>
                                   <Grid2 item xs={0} lg={3}></Grid2>
                                   <Grid2 item xs={12}>
                                       <ThemeProvider theme={theme}>
                                           <Switzerland/>
                                       </ThemeProvider>
                                   </Grid2>
                                   <Grid2 item xs={0} lg={3}></Grid2>
                               </Grid2>
                           </div>
                       }/>
                <Route path='/login' element={
                           <ThemeProvider theme={theme}>
                               <Login/>
                           </ThemeProvider>
                                             }/>
            </Routes>
        </Router>

  )
}

export default App
