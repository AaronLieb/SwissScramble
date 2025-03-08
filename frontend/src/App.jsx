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
import About from './About.jsx';

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
            <div>
              <AppBar position="fixed">
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
              <Grid2 container
                id="home"
              >
              </Grid2>
              <Grid2 sx={{ mt: 5 }} container>
                <Grid2 item xs={0} lg={3}></Grid2>
                <Grid2 item xs={12}>
                  <ThemeProvider theme={theme}>
                    <Switzerland
                      auth={auth}
                      backend={backend}
                      toggleDrawer={toggleDrawer}
                      drawerOpen={drawerOpen}
                      setDrawerOpen={setDrawerOpen}
                    />
                    <About elevation={3} />
                  </ThemeProvider>
                </Grid2>
                <Grid2 item xs={0} lg={3}></Grid2>
              </Grid2>
            </div>
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
