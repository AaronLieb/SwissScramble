/* eslint-disable react/prop-types */
import {
    Grid2,
    Paper,
} from "@mui/material";
import * as d3 from 'd3';
import Drawer from './Drawer.jsx'
import { useEffect, useState } from 'react';
import './App.css';
import * as topojson from 'topojson-client'
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import AuthDisplay from "./AuthDisplay.jsx";
import Score from "./Score.jsx";
import Events from "./Events.jsx"
import About from './About.jsx';

function Switzerland(props) {
    const elevation = 5;
    const destroyed = "oklch(0% 0 300)";

    // Coloring for map.
    const highlightColor = 'oklch(75% 0.1801 216.4)'

    const teamHue = "300"
    const enemyHue = "175"
    const neutral = "oklch(90% 0 360)"
    const lightness = ["85%", "85%", "55%", "35%"]
    const getColor = (item,faded) => {
        if(!item)  return neutral
        if(item.destroyed) return destroyed
        if(item.level === 0)  return neutral
        if(item.team_id === 1) return `oklch(${lightness[Math.min(item.level, 3)]} ${faded ? '0.03':'0.1'} ${teamHue})`
        if(item.team_id === 2) return `oklch(${lightness[Math.min(item.level, 3)]} ${faded ? '0.03':'0.1'} ${enemyHue})`
        // Base case.
        return neutral
    }

    // Interactivity for map.
    const width = 900, height = 500;
    const [mapLoaded, setMapLoaded] = useState(false)

    const [canton, setSelectedCanton] = useState("");
    const [cantons, setCantons] = useState([])

    // Player state.
    const [team, setTeam] = useState({})
    const [money, setMoney] = useState(0)
    const [curses, setCurses] = useState([])

    const [myPowerups, setMyPowerups] = useState([])
    const [myPowerup, setMyPowerup] = useState("")

    const [events, setEvents] = useState([]);

    // updateEvents is a hook to re-fetch.
    const [updateEvents, setUpdateEvents] = useState(0);

    function setCanton(c) {
        if (c == "travelmap") setSelectedCanton("")
        else setSelectedCanton(c)
    }

    // Fetch all data on initial map load.
    useEffect(() => {
        if (!mapLoaded) {
            makeGame()
        }
    }, []);

    async function makeGame() {
        await fetch("./swiss-maps.json")
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                drawMap(data)
            })
            .catch((err) => {
                console.log("Error rendering map data " + err);
            });
        await fetchEndpoint("/cantons/")
        await fetchEndpoint("/team/")
    }

    useEffect(() => {
        updateColors(cantons)
    }, [cantons])
    
    useEffect(() => {
        updateSelected(canton);
    }, [canton]);

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
            .attr("width", "100%")
            .attr("height", "60vh")
            .on('click', d => setCanton(d.target.id))
            .attr("style", "max-width: 100%; height: auto; height: intrinsic; text-align: center; ")

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

        const zoom = d3
            .zoom()
            .scaleExtent([0.5, 6])
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
    }

    function updateColors(state) {
        var g = d3.select("#pathsG").select(".cantons").selectAll("g");
        g.selectAll("path")
            .transition()
            .duration(200)
            .attr("fill", (d) => getColorForCanton(d.properties.name, false))
            .attr("stroke-width", "0.1px");
    }

    function getColorForCanton(value, faded) {
        let item = cantons.find(e => e.name === value)
        return getColor(item,faded)
    }

    async function fetchEvents() {
        await fetchEndpoint("/events/")
        await fetchEndpoint("/cantons/")
    }

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
                        case "/team/":
                            setTeam(data)
                            console.log(data)
                            resolve();
                            break;
                        case "/teams/":
                            setTeams(data)
                            resolve();
                            break;
                        case "/events/":
                            setEvents(data)
                            resolve();
                            break;
                        case "/cantons/":
                            setCantons(data)
                            updateColors(data)
                            resolve();
                            break;
                        case "/events/":
                            setEvents(data)
                            resolve();
                            break;
                        default:
                            console.log(`warning: no endpoint handler available for ${endpoint}`)
                            resolve();
                    }
                })
                .catch((err) => {
                    enqueueSnackbar(`Failed to fetch data for ${endpoint}: ${err}`, { variant: "error", autoHideDuration: 3000 })
                    resolve(err) // This application is not robust enough to handle rejection.
                });
          })
    }

    return (
        <>
            <SnackbarProvider maxSnack={5} />
            <Drawer elevation={elevation} curses={curses} money={money} drawerOpen={props.drawerOpen} toggleDrawer={props.toggleDrawer} />
            <Grid2 sx={{m: 2}} spacing={2} container direction="column" alignItems={"center"} justifyContent={"center"}>
                <Grid2 item className='h-100' size={{ sx: 10, md: 8 }} sx={{mt:4}}>
                    <Paper elevation={elevation}>
                        <svg id="travelmap"></svg>
                    </Paper>
                </Grid2>
                {props.auth !== null ? (
                    <Grid2 item className='h-100' size={{ sx: 10, md: 8 }}>
                        <AuthDisplay
                            money={money}
                            setMoney={setMoney}
                            myPowerup={myPowerup}
                            setMyPowerup={setMyPowerup}
                            myPowerups={myPowerups}
                            setMyPowerups={setMyPowerups}
                            fetchEvents={fetchEvents}
                            updateEvents={updateEvents}
                            setUpdateEvents={setUpdateEvents}
                            auth={props.auth}
                            backend={props.backend}
                            elevation={elevation}
                            canton={canton}
                            setCanton={setCanton}
                            cantons={cantons}
                            curses={curses}
                            setCurses={setCurses}
                        />
                    </Grid2>
                ) : (
                    <Grid2 item className='h-100' size={{ sx: 10, md: 8 }}>
                        <h2>Hi guys :)</h2>
                    </Grid2>
                )}
                <Grid2 item className='h-100' size={{ sx: 10, md: 8 }}>
                    <Score canton={canton} elevation={elevation} cantons={cantons} />
                </Grid2>
                <Grid2 item className='h-100' size={{ sx: 10, md: 8 }}>
                    <Events events={events} fetchEvents={fetchEvents} updateEvents={props.updateEvents} backend={props.backend} elevation={elevation} />
                </Grid2>
                <Grid2 item className='h-100' size={{ sx: 10, md: 8 }}>
                    <About elevation={elevation} />
                </Grid2>
            </Grid2>
        </>
    );
}

export default Switzerland;
