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
import { SnackbarProvider } from 'notistack';
import AuthDisplay from "./AuthDisplay.jsx";
import Score from "./Score.jsx";
import Events from "./Events.jsx"

function Switzerland(props) {
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


    const [canton, setSelectedCanton] = useState("");
    const [cantons, setCantons] = useState([])
    const [selection, setSelection] = useState(null)

    const [team, setTeam] = useState(1)

    // gameState holds the controlled cantons with their levels.
    const [gameState, setGameState] = useState({})

    // Player state.
    const [money, setMoney] = useState(0)
    const [myPowerups, setMyPowerups] = useState([])
    const [curses, setCurses] = useState(["poop", "curse curse curse", "aaaaaahhhhh"])

    const [teamState, setTeamState] = useState([])

    function setCanton(c) {
        if(c == "travelmap") setSelectedCanton("")
        else setSelectedCanton(c)
    }

    // Fetch all data on map load.
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
            fetch(props.backend + "/cantons/")
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

                    setTeamState(groupBy(game.cantons, 'team_id'))
                })
                .catch((err) => {
                    console.log("Error fetching canton data " + err);
                });


        }
    }, []);




    var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] ??= []).push(x);
            return rv;
        }, {});
    };

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
        
        // Experimental feature to add label for selected canton
        // svg.append("text")
        //     .text(canton)
        //     .attr("id", "cantonlabel")
        //     .attr("z-index", 999)
        //     .style("color", "rgba(0, 0, 0, 0.6)")
        //     .attr("font-weight", "light")
        //     .attr("font-size", "2em")
        //     .attr("x", 10)
        //     .attr("y", height-10)

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
            .scaleExtent([1, 6])
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
        updateSelected(canton);
        // Experimental feature to add label for selected canton
        // d3.select("#cantonlabel").text(canton)
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
            <SnackbarProvider maxSnack={3} />
            <Drawer elevation={elevation} curses={curses} money={money} drawerOpen={props.drawerOpen} toggleDrawer={props.toggleDrawer} />
            <Grid2 spacing={2} container direction="column">
                <Paper elevation={elevation}>
                    <Grid2
                        container
                        direction={"row"}
                        spacing={2}
                        alignItems="center"
                        justifyContent={"space-around"}
                    >
                    </Grid2>
                    <Grid2 item className='h-100' size={12}>
                        <svg id="travelmap"></svg>
                    </Grid2>
                </Paper>
                {props.auth !== null ? (
                    <AuthDisplay
                        backend={props.backend}
                        elevation={elevation}
                        canton={canton}
                        setCanton={setCanton}
                        cantons={cantons}
                        curses={curses}
                    />
                ) : (
                    <Score canton={canton} elevation={elevation} teamState={teamState} />
                )}
                <Events backend={props.backend} elevation={elevation} />

            </Grid2>
        </>
    );
}

export default Switzerland;
