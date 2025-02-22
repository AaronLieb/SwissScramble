import { Container, Row, Col, Form } from 'react-bootstrap';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import './App.css';
import * as topojson from 'topojson-client'



function Switzerland() {

    const countries = []

    // https://hihayk.github.io/scale/#0/4/50/73/-51/75/67/14/be64ac/190/100/172/white
    //const colors = ["#e8e8e8", "#ace4e4", "#5ac8c8", "#dfb0d6", "#a5add3", "#5698b9", "#be64ac", "#8c62aa", "#3b4994"];

    const teamColors = ["#e8e8e8", "#8ebdd4", "#5abdc8", "#5a92c1"]
    const teamColorsFaded = ["#e8e8e8", "#bddede", "#8ed4d4", "#5ac8c8"]

    const enemyColors = ["#e8e8e8", "#CAB4E4", "#C58BD2", "#8e64ac"]
    const enemyColorsFaded = ["#e8e8e8", "#dabdd4", "#cc92c1", "#be64ac"]


    const [team, setTeam] = useState("myid")

    // const colors2d = [
    //   ["#e8e8e8", "#ace4e4", "#5ac8c8"],
    //   ["#dfb0d6", "#a5add3", "#5698b9"],
    //   ["#be64ac", "#8c62aa", "#3b4994"]
    //   ];

    const [mapLoaded, setMapLoaded] = useState(false)

    const highlightColor = 'steelblue'
    const neutral = "#e8e8e8"

    const width = 900, height = 500;

    // Zoom slider value
    const [slider, setSlider] = useState(1);

    const [canton, setCanton] = useState("");

    const [selection, setSelection] = useState(null)

    const [gameState, setGameState] = useState({})

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
            
            fetch("./test-data.json")
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    setGameState(data)
                    updateColors(data)
                })
                .catch((err) => {
                    console.log("Error fetching user data " + err);
                });
        }
    }, []);

    // drawMap renders on the svg an interactive map.
    // It sets the projection, zoom functionality and coloring.
    function drawMap(data) {
        if (mapLoaded) return
        setMapLoaded(true)

        const canvas = d3.select('#travelmap')
        canvas.selectAll("*").remove()

        // d3.geoAlbers()
        // d3.geoMercator()
        var projection = d3.geoAlbers()
            .rotate([0, 0])
            .center([8.3, 46.8])
            .scale(10000)
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
        if(canton == "travelmap") updateSelected("");
        else updateSelected(canton);
      }, [canton]);
    
      function updateSelected(selected) {
        console.log(selected)
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


        if(Object.keys(gameState).length > 0) {
            let item = gameState["Cantons"].find(e => e.name === selected)
            if(item) {
                setSelection(item)
            } else {
                if(selected) setSelection({name: selected, level: 0, team: "None"})
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
        if(item) {
            if(item["team_id"] === team) {
                return teamColors[item.level]
            } else {
                return enemyColors[item.level]
            }
        }
        return neutral
    }

    function getColorForCanton(value, faded) {
        if(Object.keys(gameState) == 0) return neutral
        let item = gameState["Cantons"].find(e => e.name === value)
        if(item) {
            if(faded) {
                if(item.team_id === team) {
                    return teamColorsFaded[item.level]
                } else {
                    return enemyColorsFaded[item.level]
                }

            } else {
                if(item.team_id === team) {
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
            <Row>

                <Container>
                    <Row className='mb-2 w-100'>
                        <Col xs={4}>
                            <h1 className='display-3 mb-0'>Swiss Scramble 🇨🇭</h1>
                            <Form.Label className='d-flex flex-row-reverse'>let me be franc</Form.Label>
                        </Col>
                        <Col className='h-100' xs={{ offset: 0, span: 12 }} md={{ offset: 4, span: 4 }}>
                            
                            <input
                                type="range"
                                disabled
                                value={slider}
                                min={1}
                                max={8}
                                orient="vertical"
                                id="slider"
                            />
                        </Col>
                        <Col className='h-100' xs={{ offset: 0, span: 12 }} md={{ offset: 4, span: 4 }}>
                            <svg id="travelmap"></svg>
                        </Col>
                    </Row>
                </Container>
                {selection ?
                    (<>
                        <h2>Canton: {selection.name}</h2>
                        <h2>Team: {selection.team_id}</h2>
                        <h2>Level: {selection.level}</h2>
                    </>)
                    : (
                    <>
                    <h2>Canton: </h2>
                    <h2>Team: </h2>
                    <h2>Level: </h2>
                    </>
                )
                }
                <p className='text-center'>✈️ {countries.length} Cantons | Continents | 🌎 Progress {(countries.length / 26).toFixed(1)}%</p>
            </Row>

        </>
    );
}

export default Switzerland;
