/* eslint-disable react/prop-types */
import {
    Grid2,
    FormControl,
    Paper,
    Button,
    Autocomplete,
    TextField,
} from "@mui/material";
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import { useEffect, useState, useRef } from 'react';

function AuthDisplay(props) {



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
            console.log("canton:", selectedCanton, "\nchallenge:", selectedChallenge)
            enqueueSnackbar("No Challenge or Canton specified", { variant: "error", autoHideDuration: 3000 })
            throw "Challenge or canton not specified.";
        }
    }


    // purchasePowerup purchases a powerup.
    function purchasePowerup() {
        if (powerup === "") {
            enqueueSnackbar("No powerup selected", { variant: "error", autoHideDuration: 3000 })
            return
        }
        let text = `Are you sure you want to purchase "${powerup}"?`
        if (!window.confirm(text)) {
            return
        }
        console.log(powerup)
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
                await fetch(props.backend + "/curse/", {
                    method: 'POST',
                    body: JSON.stringify({
                        id: pick,
                    }),
                });
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

    function handleEnterCanton() {

    }



    // Fetch all data on map load.
    useEffect(() => {
        fetch(props.backend + "/challenges/")
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setChallenges(data)
            })
            .catch((err) => {
                console.log("Error fetching challanges " + err);
            });

        fetch(props.backend + "/powerups/")
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setPowerups(data.sort((a, b) => a.cost - b.cost))
            })
            .catch((err) => {
                console.log("Error fetching challanges " + err);
            });

    }, []);

    return (
        <>
            <Paper sx={{ p:2 }} elevation={props.elevation}>
                <Grid2 spacing={2} container>
                    <Grid2 item size={{ xs: 12, lg: 6 }}>
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
                    <Grid2 item size={{ xs: 12, lg: 6 }}>
                        <Button variant="outlined" sx={{ m: 1 }} onClick={handleEnterCanton} type="submit">Enter Canton</Button>
                        <Button variant="outlined" sx={{ m: 1 }} onClick={handleSubmitChallenge} type="submit">Submit Challenge</Button>
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
                                options={powerups.map(e => (`${e.description} | ${e.cost}₣`))}
                                value={powerup}
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
                                options={props.curses.map(e => e)}
                                value={curse}
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