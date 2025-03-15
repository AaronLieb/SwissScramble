/* eslint-disable react/prop-types */
import {
    Grid2,
    FormControl,
    Paper,
    Button,
    Autocomplete,
    TextField,
    Typography,
    Tab,
    Tabs,
    Box,
    Stack,
    ListItem,
    ListItemText
} from "@mui/material";
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import Drawer from './Drawer.jsx'
import challenge from './assets/challengesmall.png'
import curse from './assets/cursesmall.png'
import SportsScoreIcon from '@mui/icons-material/SportsScore';

function AuthDisplay(props) {


    // Auth Required Fields - are these needed / wanted?
    const [user, setUser] = useState(null)
    const [team, setTeam] = useState({ money: 0, curses: 0 })


    // Challenge form related info
    const [challenges, setChallenges] = useState([])
    const [selectedChallenge, setSelectedChallenge] = useState("")
    const [selectedCanton, setSelectedCanton] = useState({})

    // Shop values with selection.
    const [powerup, setPowerup] = useState("")
    const [powerups, setPowerups] = useState([])



    const [tabValue, setTabValue] = useState(0)
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    }

    async function handleSubmitChallenge() {
        if (!selectedCanton.id) {
            enqueueSnackbar("Canton not specified", { variant: "error", autoHideDuration: 3000 })
            return
        }
        if (!selectedChallenge) {
            enqueueSnackbar("Challenge not specified", { variant: "error", autoHideDuration: 3000 })
            return
        }
        let text = `Are you sure you want to submit "${selectedChallenge.description}"?`
        if (!window.confirm(text)) {
            return
        }
        await props.postEndpoint("/challenge/", JSON.stringify({
            id: selectedChallenge.id,
            canton: selectedCanton.id,
        }))
        await props.setUpdateEvents(selectedChallenge.id)
    }


    // purchasePowerup purchases a powerup.
    async function purchasePowerup() {
        if (powerup === "") {
            enqueueSnackbar("No powerup selected", { variant: "error", autoHideDuration: 3000 })
            return
        }
        let text = `Are you sure you want to purchase "${powerup.description}"?`
        if (!window.confirm(text)) {
            return
        }
        console.log(powerup)
        await props.postEndpoint("/powerup/", JSON.stringify({
            id: powerup.id,
        }))
        await fetchEndpoint("/team/powerups/")

    }

    // usePowerup purchases a powerup.
    async function usePowerup() {
        if (props.myPowerup === "") {
            enqueueSnackbar("No powerup selected", { variant: "error", autoHideDuration: 3000 })
            return
        }
        let text = `Are you sure you want to use "${props.myPowerup.description}"?`
        if (!window.confirm(text)) {
            return
        }

        console.log()
        await props.postEndpoint("/use_powerup/", JSON.stringify({
            id: props.myPowerup.id,
        }))
        props.setMyPowerup("")
        await fetchEndpoint("/team/powerups/")
    }


    // purchaseCurse purchases a random curse.
    // We do not actually need to select a random curse here, just post an event and subtract some money.
    async function purchaseCurse() {
        let text = `Are you sure you want to purchase a random curse for 100₣?`
        if (!window.confirm(text)) {
            return
        }
        await props.postEndpoint("/curse/", JSON.stringify({
            id: 1,
        }))
        fetchEndpoint("/team/")
    }

    // useCurse purchases a curse.
    async function useCurse() {
        if (team.curses < 1) {
            enqueueSnackbar("No curses available.", { variant: "error", autoHideDuration: 3000 })
            return
        }
        let text = `Are you sure you want to use a curse? You currently have ${team.curses}.`
        if (!window.confirm(text)) {
            return
        }
        await props.postEndpoint("/use_curse/", JSON.stringify({
            id: 1,
        }))
        fetchEndpoint("/team/")
    }

    function destroyCanton() {
        let sel = getCantonFromName(props.canton)
        if (!sel) {
            enqueueSnackbar("No canton selected.", { variant: "error", autoHideDuration: 3000 })
            return
        }
        let text = `Are you sure you want to DESTROY ${props.canton}?`
        if (window.confirm(text)) {
            props.postEndpoint("/destroy_canton/", JSON.stringify({
                id: sel.id,
            }))
        }
    }

    async function handleEnterCanton() {
        let sel = getCantonFromName(props.canton)
        if (!sel) {
            enqueueSnackbar("Cannot find canton to enter.", { variant: "error", autoHideDuration: 3000 })
            return
        }
        let text = `Are you sure you want to enter ${props.canton}?`
        if (!window.confirm(text)) {
            return
        }
        await props.postEndpoint("/enter_canton/", JSON.stringify({
            id: sel.id,
        }))
        fetchEndpoint("/team/")
        await props.setUpdateEvents(sel.id)
    }

    function getCantonFromName(name) {
        return props.cantons.find(e => e.name === name)
    }

    // Fetch all data on map load.
    useEffect(() => {
        fetchEndpoint("/team/powerups/")
        fetchEndpoint("/powerups/")
        fetchEndpoint("/challenges/")
        fetchEndpoint("/user/")
        fetchEndpoint("/team/")
    }, [props.updateEvents]);


    useEffect(() => {
        setSelectedCanton(props.cantons.find((e) => e.name == props.canton) || {})
    }, [props.canton]);

    // fetchEndpoint grabs data from and endpoint and handles its result by
    // storing it in specific frontend state.
    async function fetchEndpoint(endpoint) {
        let authHeaders = {
            headers: new Headers({
                'Authorization': `Bearer ${props.auth}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            })
        }
        return new Promise((resolve) => {
            fetch(props.backend + endpoint, authHeaders)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    switch (endpoint) {
                        case "/team/powerups/":
                            console.log(data)
                            props.setMyPowerups(data)
                            break;
                        case "/powerups/":
                            setPowerups(data.sort((a, b) => a.cost - b.cost))
                            break;
                        case "/challenges/":
                            setChallenges(data.sort((a,b) => Intl.Collator().compare(a.name.toUpperCase(), b.name.toUpperCase())))
                            break;
                        case "/curses/":
                            props.setCurses(data)
                            break;
                        case "/user/":
                            setUser(data)
                            //console.log(data)
                            break;
                        case "/team/":
                            setTeam(data)
                            break;
                        default:
                            console.log(`warning: no endpoint handler available for ${endpoint}`)
                            break;
                    }
                })
                .catch((err) => {
                    resolve(err) // This application is not robust enough to handle rejection.
                });
        })
    }
    
    function a11yProps(index) {
        return {
            id: `simple-tab-${index}`,
            'aria-controls': `simple-tabpanel-${index}`,
        };
    }

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
            </div>
        );
    }


    // function SortAlphabetically(alphabet)
    // {
    //     return function(a, b) {
    //         var index_a = alphabet.indexOf(a[0]),
    //         index_b = alphabet.indexOf(b[0]);
    
    //         if (index_a === index_b) {
    //             // same first character, sort regular
    //             if (a < b) {
    //                 return -1;
    //             } else if (a > b) {
    //                 return 1;
    //             }
    //             return 0;
    //         } else {
    //             return index_a - index_b;
    //         }
    //     }
    // }
    


    return (
        <>
            <Drawer team={team} drawerOpen={props.drawerOpen} toggleDrawer={props.toggleDrawer} />
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs variant="fullWidth" value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab wrapped label="Overview" {...a11yProps(0)} />
                        <Tab wrapped label="Challenges" {...a11yProps(1)} />
                        <Tab wrapped label="Powerups" {...a11yProps(2)} />
                        <Tab wrapped label="Curses" {...a11yProps(3)} />
                    </Tabs>
                </Box>
                <CustomTabPanel value={tabValue} index={0}>
                    <Grid2 container spacing={2}>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ py: 2 }} elevation={props.elevation}>
                            <Stack spacing={2} alignItems={"center"} justifyContent={"center"} direction={"row"}>
                                <Stack>
                                    <Typography variant="h3" align="center">💰</Typography>
                                    <Typography variant="h3" align="center">{team.money}₣</Typography>
                                </Stack>

                                <img height={"50%"} width={"20%"} src={challenge} />
                                <Typography variant="h3" align="center"> {team.challenges} </Typography>

                                <img height={"50%"} width={"20%"} src={curse} />
                                <Typography variant="h3" align="center">{team.curses}</Typography>
                            </Stack>
                        </Paper>
                        </Grid2>
                        <Grid2 item size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ py: 2 }} elevation={props.elevation}>
                            <Stack spacing={2} alignItems={"center"} justifyContent={"center"} direction={"row"}>
                                <SportsScoreIcon />
                                <Typography variant="h3" align="center">{new Date().getTime()}</Typography>
                            </Stack>
                        </Paper>
                        </Grid2>
                    </Grid2>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={1}>
                    <Grid2 container spacing={2}>
                        <Grid2 item size={12}>
                            <Paper sx={{ p: 2 }} elevation={props.elevation}>
                                <Grid2 spacing={2} container>
                                    <Grid2 item size={{ xs: 9, lg: 9 }}>
                                        <FormControl sx={{ width: "100%" }} aria-label="Canton selection">
                                            <Autocomplete
                                                disablePortal
                                                id="challenge-select"
                                                aria-labelledby="challenge-select"
                                                options={props.cantons.map(e => e.name)}
                                                value={props.canton}
                                                onChange={(d, e) => {
                                                    if (e !== null) props.setCanton(e);
                                                    else props.setCanton("");
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Canton" />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 3 }}>
                                        <FormControl sx={{ width: "100%" }} aria-label="Canton selection">
                                            <TextField id="outlined-basic" label="Level" defaultValue={selectedCanton.level} slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }} />
                                        </FormControl>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, lg: 12 }}>
                                        <FormControl aria-label="Challenge selection" sx={{ width: "100%" }}>
                                            <Autocomplete
                                                disablePortal
                                                id="challenge-select"
                                                aria-labelledby="challenge-select"
                                                options={challenges || null}
                                                value={selectedChallenge}
                                                getOptionLabel={(option) =>
                                                    option ? `${option.name}` : ''
                                                }
                                                renderOption={({ key, ...props }, option) => (
                                                    <ListItem key={key} {...props}>
                                                        <ListItemText primary={option.name} secondary={`${option.levels} Level, ${option.money} ₣`} />
                                                    </ListItem>
                                                  )}
                                                onChange={(_, newValue) => {
                                                    setSelectedChallenge(newValue || null)
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} label="Challenge" />
                                                )}
                                            />
                                        </FormControl>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, lg: 6 }}>
                                        <Button variant="contained" sx={{ width: "100%" }} onClick={handleEnterCanton} type="submit">Enter Canton</Button>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, lg: 6 }}>
                                        <Button variant="contained" sx={{ width: "100%" }} onClick={handleSubmitChallenge} type="submit">Submit Challenge</Button>
                                    </Grid2>
                                </Grid2>
                            </Paper>
                        </Grid2>
                        <Grid2 item size={12}>
                            <Paper elevation={props.elevation}>
                                <Button variant="contained" sx={{ width: "100%" }} onClick={destroyCanton} type="submit">
                                    <Typography variant="h5">
                                        ☢️ DESTROY CANTON ☢️
                                    </Typography>
                                </Button>
                            </Paper>
                        </Grid2>
                    </Grid2>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={2}>
                    <Paper sx={{ p: 2 }} elevation={props.elevation}>
                        <Grid2 spacing={2} container alignItems={"center"}>
                            <Grid2 item size={{ xs: 12, lg: 6 }}>
                                <FormControl sx={{ width: "100%" }} aria-label="Powerups">
                                    <Autocomplete
                                        disablePortal
                                        id="powerup-select"
                                        aria-labelledby="powerup-select"
                                        options={powerups || null}
                                        value={powerup}
                                        getOptionLabel={(option) =>
                                            option ? `${option.description} | ${option.cost}₣` : ''
                                        }
                                        sx={{ textAlign: "left", align: "justify", color: "red" }}
                                        onChange={(d, e) => {
                                            if (e !== null) setPowerup(e)
                                            else setPowerup("");
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Powerups" />
                                        )}
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 item size={{ xs: 12, lg: 6 }}>
                                <Button variant="contained" sx={{ width: "100%" }} onClick={purchasePowerup} type="submit">Purchase Power-Up</Button>
                            </Grid2>
                            <Grid2 item size={{ xs: 12, lg: 6 }}>
                                <FormControl sx={{ width: "100%" }} aria-label="My Powerups">
                                    <Autocomplete
                                        disablePortal
                                        id="my-powerup-select"
                                        aria-labelledby="my-powerup-select"
                                        options={props.myPowerups || null}
                                        value={props.myPowerup}
                                        getOptionLabel={(option) =>
                                            option ? `${option.description}` : ''
                                        }
                                        onChange={(d, e) => {
                                            if (e !== null) props.setMyPowerup(e)
                                            else props.setMyPowerup("");
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="My Powerups" />
                                        )}
                                    />
                                </FormControl>
                            </Grid2>
                            <Grid2 item size={{ xs: 12, lg: 6 }}>
                                <Button variant="contained" sx={{ width: "100%" }} onClick={usePowerup} type="submit">Use Powerup</Button>
                            </Grid2>
                        </Grid2>
                    </Paper>
                </CustomTabPanel>
                <CustomTabPanel value={tabValue} index={3}>
                    <Paper align={"center"} elevation={props.elevation}>
                        <Grid2 sx={{ p: 1 }} spacing={2} container>
                            <Grid2 item size={{ xs: 12, lg: 6 }}>
                                <Button variant="contained" sx={{ width: 1 }} onClick={purchaseCurse} type="submit">Purchase curse</Button>
                            </Grid2>
                            <Grid2 item size={{ xs: 12, lg: 6 }}>
                                <Button variant="contained" sx={{ width: 1 }} onClick={useCurse} type="submit">Use Curse</Button>
                            </Grid2>
                        </Grid2>
                    </Paper>
                </CustomTabPanel>
            </Box>
        </>
    )
}

export default AuthDisplay;