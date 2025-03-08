import Switzerland from './Switzerland.jsx'
import Login from './Login.jsx'
import {
  Grid2,
  AppBar,
  Button,
  Toolbar,
  Typography
} from "@mui/material";
import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState, useRef } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { red, purple } from '@mui/material/colors';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router";

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


  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <ThemeProvider theme={theme}>
          <div>
            <AppBar  position="fixed">
              <Toolbar>
                <IconButton
                  size="large"
                  edge="start"
                  color="grey"
                  aria-label="menu"
                  onClick={toggleDrawer(!drawerOpen)}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Swiss Scramble 🇨🇭
                </Typography>
                <Button color="inherit"><NavLink   style={{color: "white"}} to='/login'>Log in</NavLink></Button>
              </Toolbar>
            </AppBar>
            <Grid2 container
              id="home"
            >
            </Grid2>
            <Grid2 container>
              <Grid2 item xs={0} lg={3}></Grid2>
              <Grid2 item xs={12}>
                <ThemeProvider theme={theme}>
                  <Switzerland
                    toggleDrawer={toggleDrawer}
                    drawerOpen={drawerOpen}
                    setDrawerOpen={setDrawerOpen}
                  />
                </ThemeProvider>
              </Grid2>
              <Grid2 item xs={0} lg={3}></Grid2>
            </Grid2>
          </div>
          </ThemeProvider>
        } />
        <Route path='/login' element={
          <ThemeProvider theme={theme}>
            <Login />
          </ThemeProvider>
        } />
      </Routes>
    </Router>

  )
}

export default App
