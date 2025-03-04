import {
    Grid2,
    FormControl,
    Chip,
    Paper,
    Button,
    Autocomplete,
    TextField,
} from "@mui/material";
import * as d3 from 'd3';
import { useEffect, useState, useRef } from 'react';
import './App.css';
import * as topojson from 'topojson-client'



function Switzerland() {


    const elevation = 3

    const countries = []

    // https://hihayk.github.io/scale/#0/4/50/73/-51/75/67/14/be64ac/190/100/172/white
    // https://oklch.com/#71.81,0.1,175,100 change lightness value
    //const colors = ["#e8e8e8", "#ace4e4", "#5ac8c8", "#dfb0d6", "#a5add3", "#5698b9", "#be64ac", "#8c62aa", "#3b4994"];

    const bombed = "black";

    //const teamColors = ["#e8e8e8", "#CAB4E4", "#C58BD2", "#8e64ac"]
    const teamColors = ["#e8e8e8", "oklch(75% 0.1 300)", "oklch(55% 0.1 300)", "oklch(45% 0.1 300)"]
    const teamHue = "300"
    const enemyHue = "175"
    const teamColorRange = (hue) => {
        return ["#e8e8e8", `oklch(75% 0.1 ${hue})`, `oklch(55% 0.1 ${hue})`, `oklch(45% 0.1 ${hue})`]
    }


    // const teamColorRange = (level) => {
    //     return ["#e8e8e8", `oklch(${light} 0.1 300)`, `oklch(${light} 0.1 300)`, `oklch(${light} 0.1 300)`] 
    // }


    //const teamColors = ["#e8e8e8", "#8ebdd4", "#5abdc8", "#5a92c1"]
    const teamColorsFaded = ["#e8e8e8", "oklch(75% 0.03 300)", "oklch(55% 0.03 300)", "oklch(45% 0.03 300)"]

    //const enemyColors = ["#e8e8e8", "#CAB4E4", "#C58BD2", "#8e64ac"]

    //const enemyColors = ["#e8e8e8", "#56b9a0", "#2f9780", "#006752"]
    // const enemyColorRange = (light) => {
    //     return ["#e8e8e8", `oklch(${light} 0.1 300)`, `oklch(${light} 0.1 300)`, `oklch(${light} 0.1 300)`] 
    // }
    const enemyColors = ["#e8e8e8", "oklch(75% 0.1 175)", "oklch(55% 0.1 175)", "oklch(45% 0.1 175)"]

    //const enemyColors = ["#e8e8e8", "#DAE5A9", "#97CC80", "#6ABA6B"];
    const enemyColorsFaded = ["#e8e8e8", "oklch(75% 0.03 175)", "oklch(55% 0.03 175)", "oklch(45% 0.03 175)"]


    const [team, setTeam] = useState("myid")

    // const colors2d = [
    //   ["#e8e8e8", "#ace4e4", "#5ac8c8"],
    //   ["#dfb0d6", "#a5add3", "#5698b9"],
    //   ["#be64ac", "#8c62aa", "#3b4994"]
    //   ];

    const [mapLoaded, setMapLoaded] = useState(false)

    const highlightColor = 'oklch(75% 0.1801 216.4)'
    const neutral = "oklch(90% 0 360)"

    const width = 900, height = 500;

    // Zoom slider value
    const [slider, setSlider] = useState(1);

    const [canton, setCanton] = useState("");

    const [selection, setSelection] = useState(null)

    const [gameState, setGameState] = useState({})

    const [cantons, setCantons] = useState([])


    // Challenge form related info
    const [challenges, setChallenges] = useState([])
    const [selectedChallenge, setSelectedChallenge] = useState("")

    // Shop values
    const [powerups, setPowerups] = useState(["A", "B"])
    const [powerup, setPowerup] = useState("")

    const [money, setMoney] = useState(0)

    // purchasePowerup purchases a powerup.
    function purchasePowerup() {
        let text = `Are you sure you want to purchase "${powerup}"?`
        if (!window.confirm(text)) {
            return
        }
        console.log(powerup)
    }

    // purchaseCurse purchases a curse.
    function purchaseCurse() {
        let text = `Are you sure you want to a random curse for 100₣?`
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

            // Get Location
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position)
            });

            fetch("./test-challenges.json")
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    setChallenges(data.Challenges)
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



            fetch("./test-data.json")
                //fetch("0.0.0.0:8000/cantons/")
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    setGameState(data)
                    setCantons(data.Cantons)
                    updateColors(data)
                })
                .catch((err) => {
                    console.log("Error fetching user data " + err);
                });


        }
    }, []);

    // Print this user's location every 5 seconds.
    useInterval(function() {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position)
        });
    }, 5000)

    function useInterval(callback, delay) {
        const savedCallback = useRef();
       
        // Remember the latest callback.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
       
        // Set up the interval.
        useEffect(() => {
          function tick() {
            savedCallback.current();
          }
          if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
          }
        }, [delay]);
    }

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
            .attr("fill", neutral)
            //.attr("fill", d => d.properties.fill)
            //.attr("stroke", d => d.properties.stroke)
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
                setSlider(parseFloat(d.transform.k));
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
            let item = gameState["Cantons"].find(e => e.name === selected)
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
        let item = state["Cantons"].find(e => e.name === value)
        if (item) {
            if (item["team_id"] === team) {
                return teamColorRange(teamHue)[item.level]
            } else {
                return teamColorRange(enemyHue)[item.level]
            }
        }
        return neutral
    }

    function getColorForCanton(value, faded) {
        if (Object.keys(gameState) == 0) return neutral

        let item = gameState["Cantons"].find(e => e.name === value)

        if (item) {
            console.log(faded)
            if (faded) {
                if (item.team_id === team) {
                    return teamColorsFaded[item.level]
                } else {
                    return enemyColorsFaded[item.level]
                }

            } else {
                console.log("not faded")
                if (item.team_id === team) {
                    return teamColors[item.level]
                } else {
                    return enemyColors[item.level]
                }
            }
        }
        return neutral
    }

    return (
        <>
            <Grid2 spacing={2} container direction="column">
                <Paper elevation={elevation}>
                    <h1 className='display-3 mb-0'>Swiss Scramble 🇨🇭</h1>
                </Paper>
                <Paper elevation={elevation}>
                    <Grid2 item className='h-100' size={12}>
                        <svg id="travelmap"></svg>
                    </Grid2>
                </Paper>
                <Paper sx={{ padding: "2%" }} elevation={elevation}>
                    <h2>Money: {money}₣</h2>
                    {selection ?
                        (<>
                            <h2>Canton: {selection.name} Team: {selection.team_id} Level: {selection.level}</h2>
                        </>)
                        : (
                            <>
                                <h2>Canton: Team: Level: </h2>
                            </>
                        )
                    }
                </Paper>
                <Paper sx={{ padding: "2%" }} elevation={elevation}>
                    <Grid2 spacing={2} container>
                        <Grid2 item size={{ xs: 12, lg: 12 }}>
                            <FormControl aria-label="Challenge selection" sx={{ width: "100%" }}>
                                <Autocomplete
                                    disablePortal
                                    id="challenge-select"
                                    aria-labelledby="challenge-select"
                                    options={challenges.map(c => c.Description)}
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
                            <Button variant="outlined" sx={{ m: 1 }} onClick={purchaseCurse} type="submit">Purchase Curse</Button>
                        </Grid2>
                    </Grid2>
                </Paper>
            </Grid2>

            <p className='text-center'>✈️ {countries.length} Cantons | Continents | 🌎 Progress {(countries.length / 26).toFixed(1)}%</p>


        </>
    );
}

export default Switzerland;
