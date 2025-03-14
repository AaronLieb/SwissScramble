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
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { red, grey } from '@mui/material/colors';
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router";
import Cookies from 'js-cookie'

const theme = createTheme({
  typography: {
    fontFamily: "Helvetica"
  },
  palette: {
    primary: red,
    secondary: {
      main: grey[100],
    }
  },
});

function App() {
  const backend = import.meta.env.VITE_BACKEND_URL

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [user, setUser] = useState('')

  const [auth, setAuth] = useState(null)

  useEffect(() => {
    let cookie = Cookies.get('authCookie')
    if(cookie) setAuth(cookie)
  }, [])

  function logout() {
    setAuth(null)
    Cookies.remove('authCookie')
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
                      color="secondary"
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
                  {auth == null ? (<NavLink style={{ color: "white" }} to='/login'><Button color="inherit">Log In</Button></NavLink>) : <Button onClick={logout} color="inherit">Log Out</Button>}
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
            <Login setUser={setUser} setAuth={setAuth} backend={backend} />
          </ThemeProvider>
        } />
      </Routes>
    </Router>

  )
}

export default App
