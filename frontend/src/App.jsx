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
import { useState } from 'react';
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
  const backend = import.meta.env.VITE_BACKEND_URL

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };
  const [drawerOpen, setDrawerOpen] = useState(false)

  const [auth, setAuth] = useState("hi")

  function updateAuth() {
    if(auth !== null) setAuth(null);
    else setAuth("hi")
  }

  return (
    <Router>
      <Routes>
        <Route path='/' element={
          <ThemeProvider theme={theme}>
              <AppBar position="sticky">
                <Toolbar>
                  {auth && (
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
                  )}
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Swiss Scramble 🇨🇭
                  </Typography>
                  <NavLink style={{ color: "white" }} to='/login'><Button color="inherit">Log in</Button></NavLink>
                  <Button  style={{ color: "white" }} onClick={updateAuth} >{auth === null ? "Log in(cheat)" : "Log out(cheat)"}</Button>
                </Toolbar>
              </AppBar>
                  <ThemeProvider theme={theme}>
                    <Switzerland
                      auth={auth}
                      backend={backend}
                      toggleDrawer={toggleDrawer}
                      drawerOpen={drawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                  </ThemeProvider>
          </ThemeProvider>
        } />
        <Route path='/login' element={
          <ThemeProvider theme={theme}>
            <Login setAuth={setAuth} backend={backend} />
          </ThemeProvider>
        } />
      </Routes>
    </Router>

  )
}

export default App
