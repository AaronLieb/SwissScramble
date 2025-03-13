/* eslint-disable react/prop-types */
import {
    Grid2,
    FormControl,
    Paper,
    Button,
    Autocomplete,
    TextField,
} from "@mui/material";
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

function AuthDisplay(props) {


    // Auth Required Fields - are these needed / wanted?
    const [user, setUser] = useState(null)
    const [team, setTeam] = useState(null)


    // Challenge form related info
    const [challenges, setChallenges] = useState([])
    const [selectedChallenge, setSelectedChallenge] = useState("")

    // Shop values with selection.

    const [powerup, setPowerup] = useState("")
    const [powerups, setPowerups] = useState(["A", "B"])
    const [curse, setCurse] = useState("")

    function handleSubmitChallenge() {
        const selectedCanton = props.cantons.find((e) => e.name == props.canton) || null
        if (selectedCanton && selectedChallenge) {
            const response = {
                id: selectedChallenge.id,
                canton: selectedCanton.id,
            }
            fetch(props.backend + "/challenge/",
                {
                    method: 'POST',
                    body: JSON.stringify(response)
                }
            );
        } else {
            enqueueSnackbar("No Challenge or Canton specified", { variant: "error", autoHideDuration: 3000 })
        }
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
        await postEndpoint("/powerup/", JSON.stringify({
            id: "a",
            //current_user: user 
        }))
        await fetchEndpoint("/powerups/")

    }

    // usePowerup purchases a powerup.
    function usePowerup() {
        if (powerup === "") {
            enqueueSnackbar("No powerup selected", { variant: "error", autoHideDuration: 3000 })
            return
        }
        let text = `Are you sure you want to use "${powerup}"?`
        if (!window.confirm(text)) {
            return
        }
        console.log(powerup)
    }


    // purchaseCurse purchases a random curse.
    // We do not actually need to select a random curse here, just post an event and subtract some money.
    async function purchaseCurse() {
        let text = `Are you sure you want to purchase a random curse for 100₣?`
        if (window.confirm(text)) {
            const allCursesResponse = await fetch(props.backend + "/curses/")
            if (allCursesResponse.ok) {
                let curses = await allCursesResponse.json()
                const curseCount = curses ? curses.length : 0
                if (!curseCount) {
                    throw "Failed to fetch curses."
                }
                let pick = Math.floor(Math.random() * curseCount)
                console.log(`Picked curse number ${pick} out of ${curseCount} curses.`)
                await postEndpoint("/curse/", JSON.stringify({
                    id: pick,
                }))
                await fetchEndpoint("/curses/")
            }
        }
    }

    // useCurse purchases a curse.
    function useCurse() {
        if (curse === "") {
            enqueueSnackbar("No curse selected", { variant: "error", autoHideDuration: 3000 })
            return
        }
        let text = `Are you sure you want to use ${curse}?`
        if (!window.confirm(text)) {
            return
        }
    }

    async function handleEnterCanton() {
        let sel = getCantonFromName(props.canton)
        if(!sel) {
            enqueueSnackbar("Cannot find canton to enter.", { variant: "error", autoHideDuration: 3000 })
            return
        }
        console.log(sel)
        await postEndpoint("/enter_canton/", JSON.stringify({
            canton_id: sel.id,
        })) 
    }

    function getCantonFromName(name) {
        return props.cantons.find(e => e.name === name)
    }

    // Fetch all data on map load.
    useEffect(() => {
        fetchEndpoint("/powerups/")
        fetchEndpoint("/challenges/")
        fetchEndpoint("/user/")
        fetchEndpoint("/team/")
    }, []);


    // fetchEndpoint grabs data from and endpoint and handles its result by
    // storing it in specific frontend state.
    async function fetchEndpoint(endpoint) {
        let authHeaders = {
            headers: new Headers({
            'Authorization': `Bearer ${props.auth}`, 
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        })}
        return new Promise((resolve) => {
                fetch(props.backend + endpoint, authHeaders)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    switch(endpoint) {
                        case "/powerups/":
                            setPowerups(data.sort((a, b) => a.cost - b.cost))
                            resolve();
                            break;
                        case "/challenges/":
                            setChallenges(data)
                            resolve();
                            break;
                        case "/curses/":
                            props.setCurses(data)
                            resolve();
                            break;
                        case "/user/":
                            setUser(data)
                            console.log(data)
                            resolve();
                            break;
                        case "/team/":
                            setTeam(data)
                            console.log(data)
                            resolve();
                            break;
                        default:
                            console.log(`warning: no endpoint handler available for ${endpoint}`)
                            resolve();
                    }
                })
                .catch((err) => {
                    resolve(err) // This application is not robust enough to handle rejection.
                });
          })
    }

    async function postEndpoint(endpoint, body) {
        let op = endpoint.replaceAll("/","")
        return new Promise((resolve) => {
            fetch(props.backend + endpoint, {
                method: 'POST',
                body: body,
                headers: new Headers({
                    'Authorization': `Bearer ${props.auth}`, 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }), 
            })
            .then((response) => {
                console.log(response)
                switch(response.status) {
                    case 401:
                        enqueueSnackbar(`Failed to submit ${op}: ${response.statusText}`, { variant: "error", autoHideDuration: 3000 })
                        break;
                    case 422:
                        enqueueSnackbar(`Failed to submit ${op}: ${response.statusText}`, { variant: "error", autoHideDuration: 3000 })
                        break;
                    case 200:
                        enqueueSnackbar(`Successfully submitted ${op} 🎉`, { variant: "success", autoHideDuration: 3000 })
                        props.setUpdateEvents(response.status)
                        break;
                    default:
                        enqueueSnackbar(`Unknown submit operation ${op}`, { variant: "warning", autoHideDuration: 3000 })
                }
                // switch(endpoint) {
                //     case "/powerups/":
                //         setPowerups(data.sort((a, b) => a.cost - b.cost))
                //         resolve();
                //         break;
                //     case "/challenges/":
                //         setChallenges(data)
                //         resolve();
                //         break;
                //     default:
                //         resolve();
                // }
            })
            .catch((err) => {
                enqueueSnackbar(`failed to submit ${op}: ${err}`, { variant: "error", autoHideDuration: 3000 })
                resolve(err) // This application is not robust enough to handle rejection.
            });
      })
    }

    return (
        <>
            <Paper sx={{ p: 2, my: 1 }} elevation={props.elevation}>
                <Grid2 spacing={2} container>
                    <Grid2 item size={{ xs: 12, lg: 12 }}>
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
                    <Grid2 item size={{ xs: 12, lg: 12 }}>
                        <FormControl aria-label="Challenge selection" sx={{ width: "100%" }}>
                            <Autocomplete
                                disablePortal
                                id="challenge-select"
                                aria-labelledby="challenge-select"
                                options={challenges || null}
                                value={selectedChallenge}
                                getOptionLabel={(option) =>
                                    option ? `${option.description} | ${option.levels} Level | ${option.money}₣` : ''
                                }
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
                        <Button variant="outlined" sx={{ m: 1 }} onClick={handleEnterCanton} type="submit">Enter Canton</Button>
                        <Button variant="outlined" sx={{ m: 1 }} onClick={handleSubmitChallenge} type="submit">Submit Challenge</Button>
                    </Grid2>
                </Grid2>
            </Paper>
            <Paper sx={{ padding: "2%" }} elevation={props.elevation}>
                <Grid2 spacing={2} container>
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
                        <Button variant="outlined" sx={{ m: 1 }} onClick={purchasePowerup} type="submit">Purchase Power-Up</Button>
                        <Button variant="outlined" sx={{ m: 1 }} onClick={usePowerup} type="submit">Use Powerup</Button>
                    </Grid2>
                    <Grid2 item size={{ xs: 12, lg: 6 }}>
                        <FormControl sx={{ width: "100%" }} aria-label="Curses">
                            <Autocomplete
                                disablePortal
                                id="curse-select"
                                aria-labelledby="curse-select"
                                options={props.curses || null}
                                value={curse}
                                getOptionLabel={(option) =>
                                    option ? `${option}` : ''
                                }
                                onChange={(d, e) => {
                                    if (e !== null) setCurse(e)
                                    else setCurse("");
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Curses" />
                                )}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 item size={{ xs: 12, lg: 6 }}>
                        <Button variant="outlined" sx={{ m: 1 }} onClick={purchaseCurse} type="submit">Purchase Curse</Button>
                        <Button variant="outlined" sx={{ m: 1 }} onClick={useCurse} type="submit">Use Curse</Button>
                    </Grid2>
                </Grid2>
            </Paper>
        </>
    )
}

export default AuthDisplay;