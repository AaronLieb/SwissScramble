import {
    Grid2,
    FormControl,
    Chip,
    Paper,
    Snackbar,
    Button,
    Autocomplete,
    TextField,
    Typography,
    Alert,
    Stack,
} from "@mui/material";
import * as d3 from 'd3';
import { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router';
import './App.css';
import * as topojson from 'topojson-client'
import card from './assets/card.jpg'
import cursecard from './assets/curse.jpeg'
import { SnackbarProvider, enqueueSnackbar } from 'notistack';

function Switzerland() {
    const backend = import.meta.env.VITE_BACKEND_URL
    const elevation = 5

    const bombed = "black";

    // Coloring for map.
    const highlightColor = 'oklch(75% 0.1801 216.4)'
    const teamColors = ["oklch(75% 0.1801 216.4)", "oklch(75% 0.1 300)", "oklch(55% 0.1 300)", "oklch(45% 0.1 300)"]
    const teamHue = "300"
    const enemyHue = "175"
    const teamColorRange = (hue) => {
        return ["#e8e8e8", `oklch(75% 0.1 ${hue})`, `oklch(55% 0.1 ${hue})`, `oklch(45% 0.1 ${hue})`]
    }
    const teamColorsFaded = ["oklch(75% 0.1801 216.4)", "oklch(75% 0.03 300)", "oklch(55% 0.03 300)", "oklch(45% 0.03 300)"]

    const enemyColors = ["oklch(75% 0.1801 216.4)", "oklch(75% 0.1 175)", "oklch(55% 0.1 175)", "oklch(45% 0.1 175)"]
    const enemyColorsFaded = ["oklch(75% 0.1801 216.4)", "oklch(75% 0.03 175)", "oklch(55% 0.03 175)", "oklch(45% 0.03 175)"]

    // Interactivity for map.
    const width = 900, height = 500;
    const [mapLoaded, setMapLoaded] = useState(false)
    const neutral = "oklch(90% 0 360)"


    const [canton, setCanton] = useState("");
    const [cantons, setCantons] = useState([])
    const [selection, setSelection] = useState(null)

    const [team, setTeam] = useState(1)

    // gameState holds the controlled cantons with their levels.
    const [gameState, setGameState] = useState({})
    

    // Challenge form related info
    const [challenges, setChallenges] = useState([])
    const [selectedChallenge, setSelectedChallenge] = useState("")

    // Shop values with selection.
    const [powerups, setPowerups] = useState(["A", "B"])
    const [powerup, setPowerup] = useState("")
    
    const [curses, setCurses] = useState(["poop", "curse curse curse", "aaaaaahhhhh"])
    const [curse, setCurse] = useState("")

    const [money, setMoney] = useState(0)

    // purchasePowerup purchases a powerup.
    function purchasePowerup() {
        let text = `Are you sure you want to purchase "${powerup}"?`
        if (!window.confirm(text)) {
            return
        }
        console.log(powerup)
    }

    // usePowerup purchases a powerup.
    function usePowerup() {
        if(powerup === "") {
            enqueueSnackbar("No powerup selected", {variant: "error", autoHideDuration: 6000})
            return
        }
        let text = `Are you sure you want to use "${powerup}"?`
        if (!window.confirm(text)) {
            return
        }
        console.log(powerup)
    }


    // purchaseCurse purchases a curse.
    function purchaseCurse() {
        let text = `Are you sure you want to purchase a random curse for 100₣?`
        if (!window.confirm(text)) {
            return
        }
    }

    // useCurse purchases a curse.
    function useCurse() {
        if(curse === "") {
            enqueueSnackbar("No curse selected", {variant: "error", autoHideDuration: 6000})
            return
        }
        let text = `Are you sure you want to use ${curse}?`
        if (!window.confirm(text)) {
            return
        }
    }

    useEffect(() => {
        setTeam("myid")
        if (!mapLoaded) {
            fetch("./swiss-maps.json")
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    drawMap(data)
                })
                .catch((err) => {
                    console.log("Error rendering map data " + err);
                });

            fetch(backend + "/challenges/")
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    setChallenges(data)
                })
                .catch((err) => {
                    console.log("Error fetching challanges " + err);
                });

            // fetch("http://localhost:8000/challenges/", {
            //     method: 'GET', // or POST, PUT, DELETE, etc.
            //     mode: 'no-cors', // set to 'no-cors' to disable CORS
            //     })
            //     .then((response) => {
            //         console.log(response)
            //         return response.json()
            //     })
            //     .then((data) => {
            //         console.log(data)
            //         setChallenges(data.Challenges)
            //     })
            //     .catch((err) => {
            //         console.log("Error unmarshaling " + err);
            //     });

            // Get Location



            fetch(backend + "/cantons/")
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    let game = {
                        cantons: data
                    }
                    setGameState(game)
                    setCantons(game.cantons)
                    updateColors(game)
                })
                .catch((err) => {
                    console.log("Error fetching canton data " + err);
                });


        }
    }, []);

    // Print this user's location every 5 seconds.
    // useInterval(function() {
    //     navigator.geolocation.getCurrentPosition((position) => {
    //         console.log(position)
    //     });
    // }, 5000)

    // function useInterval(callback, delay) {
    //     const savedCallback = useRef();
       
    //     // Remember the latest callback.
    //     useEffect(() => {
    //       savedCallback.current = callback;
    //     }, [callback]);
       
    //     // Set up the interval.
    //     useEffect(() => {
    //       function tick() {
    //         savedCallback.current();
    //       }
    //       if (delay !== null) {
    //         let id = setInterval(tick, delay);
    //         return () => clearInterval(id);
    //       }
    //     }, [delay]);
    // }

    // drawMap renders on the svg an interactive map.
    // It sets the projection, zoom functionality and coloring.
    function drawMap(data) {
        if (mapLoaded) return
        setMapLoaded(true)

        const canvas = d3.select('#travelmap')
        canvas.selectAll("*").remove()

        // d3.geoAlbers()
        // d3.geoMercator()
        var projection = d3.geoMercator()
            .rotate([0, 0])
            .center([8.3, 46.8])
            .scale(8000)
            .translate([width / 2, height / 2])
            .precision(.1);

        var path = d3.geoPath()
            .projection(projection);

        let svg = d3
            .select("#travelmap")
            .attr("viewBox", [0, 0, width, height])
            .attr("width", width)
            .attr("height", height)
            .on('click', d => setCanton(d.target.id))
            .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

        let g = svg
            .append("g")
            .attr("id", "pathsG")

        const cantons = g
            .append("g")
            .attr("class", "cantons")
            .selectAll(".cantonholder")
            .data(topojson.feature(data, data.objects.cantons).features)
            .join("g")
            .attr("class", "cantonholder")

        cantons.append("path")
            .attr("class", "canton")
            .attr("d", path)
            .attr("id", d => d.properties.name)
            .attr("stroke", "black")
            .attr("stroke-width", "0.1px")
        // .on('mouseover', function () {
        //     d3.select(this).transition()
        //         .duration(50)
        //         .style('fill', "rgba(70, 130, 180, 0.8)")
        // })
        // .on('mouseout', function () {
        //     d3.select(this).transition()
        //         .duration(50)
        //         .style('fill', "rgba(211,211,211, 1)")
        // })

        const zoom = d3
            .zoom()
            .scaleExtent([1, 4])
            .translateExtent([[0, 0], [width, height]])
            .on("zoom", (d) => {
                cantons.attr("transform", d.transform);
            });

        d3.select("#slider")
            .datum({})
            .attr("aria-label", "zoom-slider")
            .attr("type", "range")
            .attr("value", zoom.scaleExtent()[0])
            .attr("min", zoom.scaleExtent()[0])
            .attr("max", zoom.scaleExtent()[1])
            .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100);

        svg.call(zoom)
    }

    useEffect(() => {
        if (canton == "travelmap") {
            updateSelected("");
            setCanton("")
        }
        else updateSelected(canton);
    }, [canton]);

    function updateSelected(selected) {
        var g = d3.select("#pathsG").select(".cantons").selectAll("g");
        if (canton !== "") {
            g.selectAll("path")
                .transition()
                .duration(200)
                .attr("fill", (d) => d.properties.name === selected ? highlightColor : getColorForCanton(d.properties.name, true))
                .attr("stroke-width", (d) => d.properties.name === selected ? 3 : "0.1px");
        } else {
            g.selectAll("path")
                .transition()
                .duration(200)
                .attr("fill", (d) => getColorForCanton(d.properties.name, false))
                .attr("stroke-width", "0.1px");
        }


        if (Object.keys(gameState).length > 0) {
            let item = gameState["cantons"].find(e => e.name === selected)
            if (item) {
                setSelection(item)
            } else {
                if (selected) setSelection({ name: selected, level: 0, team: "None" })
            }
        }

    }

    function updateColors(state) {
        var g = d3.select("#pathsG").select(".cantons").selectAll("g");
        g.selectAll("path")
            .transition()
            .duration(200)
            .attr("fill", (d) => getColorFromGameState(state, d.properties.name))
            .attr("stroke-width", "0.1px");
    }


    function getColorFromGameState(state, value) {
        let item = state.cantons.find(e => e.name === value)
        if (item) {
            if (item.team_id === team) {
                return teamColorRange(teamHue)[item.level]
            } else {
                return teamColorRange(enemyHue)[item.level]
            }
        }
        return neutral
    }

    function getColorForCanton(value, faded) {
        if (Object.keys(gameState) == 0) return neutral
        let item = gameState["cantons"].find(e => e.name === value)
        if (item) {
            if (faded) {
                if (item.team_id === 1) {
                    return teamColorsFaded[item.level]
                } else if (item.team_id === 2) {
                    return enemyColorsFaded[item.level]
                } else {
                    return neutral
                }

            } else {
                if (item.team_id === 1) {
                    return teamColors[item.level]
                } else if (item.team_id === 2) {
                    return enemyColors[item.level]
                } else {
                    return neutral
                }
            }
        }
        return neutral
    }

    return (
        <>
            {/* {events.map((e,idx) => (
                <Snackbar open={true} key={e+idx} autoHideDuration={6000} onClose={closeSnackbar}>
                <Alert
                    onClose={closeSnackbar}
                    severity={e.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {e.message}
                </Alert>
                </Snackbar>
                
            ))} */}
            <SnackbarProvider maxSnack={3} />



            <Grid2 spacing={2} container direction="column">
                <Paper elevation={elevation}>
                    <h1 className='display-3 mb-0'>Swiss Scramble 🇨🇭</h1>
                    <NavLink to='/login'>Log in</NavLink>
                </Paper>
                    <Grid2 item direction={"column"}>
                    <Stack spacing={2}>
                    <Typography variant="h4" align="left">💰 {money}₣</Typography>
                    <Stack spacing={2} direction={"row"}>
                    <Typography variant="h4" align="left">💪 </Typography>
                    {curses.map(e => (
                        <Paper elevation={elevation} sx={{ maxWidth: "4%" }} key={e} variant="outlined">
                        <img width={"100%"} height={"100%"} src={card} />
                        </Paper>
                    ))}
                    </Stack>
                    <Stack spacing={2} direction={"row"}>
                    <Typography variant="h4" align="left">👺 </Typography>
                    {curses.map(e => (
                        <Paper elevation={elevation} sx={{ maxWidth: "4%" }} key={e} variant="outlined">
                        <img width={"100%"} height={"100%"} src={cursecard} />
                        </Paper>
                    ))}
                    </Stack>
                    </Stack>
                    </Grid2>
                    <Paper elevation={elevation}>
                    <Grid2
                        container
                        direction={"row"}
                        spacing={2}
                        alignItems="center"
                        justifyContent={"space-around"}
                        >
                    {selection ?
                        (<>
                            <Typography variant="h4" align="left">{selection.name}</Typography><Typography variant="h4" align="left">Team {selection.team_id}</Typography><Typography variant="h4" align="left">Level {selection.level}</Typography>
                        </>)
                        : (
                            <>
                                <Typography variant="h4" align="left">Select a Canton</Typography>
                            </>
                        )
                    }
                    </Grid2>
                    <Grid2 item className='h-100' size={12}>
                        <svg id="travelmap"></svg>
                    </Grid2>
                </Paper>
                <Paper sx={{ padding: "2%" }} elevation={elevation}>
                    <Grid2 spacing={2} container>
                        <Grid2 item size={{ xs: 12, lg: 6 }}>
                            <FormControl sx={{ width: "100%" }} aria-label="Canton selection">
                                <Autocomplete
                                    disablePortal
                                    id="challenge-select"
                                    aria-labelledby="challenge-select"
                                    options={cantons.map(e => e.name)}
                                    value={canton}
                                    onChange={(d, e) => {
                                        if (e !== null) setCanton(e);
                                        else setCanton("");
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Canton" />
                                    )}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 item size={{ xs: 12, lg: 6 }}>
                            <Button variant="outlined" sx={{ m: 1 }} onClick={console.log} type="submit">Enter Canton</Button>
                            <Button variant="outlined" sx={{ m: 1 }} onClick={console.log} type="submit">Submit Challenge</Button>
                        </Grid2>
                        <Grid2 item size={{ xs: 12, lg: 12 }}>
                            <FormControl aria-label="Challenge selection" sx={{ width: "100%" }}>
                                <Autocomplete
                                    disablePortal
                                    id="challenge-select"
                                    aria-labelledby="challenge-select"
                                    options={challenges ? challenges.map(c => c.description) : ["Challanges not found."]}
                                    value={selectedChallenge}
                                    onChange={(d, e) => {
                                        if (e !== null) setSelectedChallenge(e);
                                        else setSelectedChallenge("");
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Challenge" />
                                    )}
                                />
                            </FormControl>
                        </Grid2>
                    </Grid2>
                </Paper>
                <Paper sx={{ padding: "2%" }} elevation={elevation}>
                    <Grid2 spacing={2} container>
                        <Grid2 item size={{ xs: 12, lg: 6 }}>
                            <FormControl sx={{ width: "100%" }} aria-label="Powerups">
                                <Autocomplete
                                    disablePortal
                                    id="powerup-select"
                                    aria-labelledby="powerup-select"
                                    options={powerups.map(e => e)}
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
                            <FormControl sx={{ width: "100%" }} aria-label="Powerups">
                                <Autocomplete
                                    disablePortal
                                    id="curse-select"
                                    aria-labelledby="curse-select"
                                    options={curses.map(e => e)}
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
            </Grid2>
        </>
    );
}

export default Switzerland;
