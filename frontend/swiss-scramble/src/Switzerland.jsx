import { Container, Row, Col, Form } from 'react-bootstrap';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import './App.css';
import * as topojson from 'topojson-client'



function Switzerland() {

    const countries = []

    //const colors = ["#e8e8e8", "#ace4e4", "#5ac8c8", "#dfb0d6", "#a5add3", "#5698b9", "#be64ac", "#8c62aa", "#3b4994"];

    // const teamColors = ["#e8e8e8", "#bddede", "#8ed4d4", "#5ac8c8"]
    // const enemyColors = ["#e8e8e8", "#dabdd4", "#cc92c1", "#be64ac"]

//       const colors2d = [
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

    useEffect(() => {
        if (!mapLoaded) {
            fetch("./swiss-maps.json")
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
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
                        // //.scaleExtent([1, 40])
                        .translateExtent([[0, 0], [width, height]])
                        //.translateBy(g, 500, -500)
                        .on("zoom", (d) => {
                            cantons.attr("transform", d.transform);
                            setSlider(parseFloat(d.transform.k));
                        });

                    d3.select("#sliderP")
                        .datum({})
                        .attr("aria-label", "zoom-slider")
                        .attr("type", "range")
                        .attr("value", zoom.scaleExtent()[0])
                        .attr("min", zoom.scaleExtent()[0])
                        .attr("max", zoom.scaleExtent()[1])
                        .attr("step", (zoom.scaleExtent()[1] - zoom.scaleExtent()[0]) / 100);

                    svg.call(zoom)

                })
                .catch((err) => {
                    console.log("Error reading data " + err);
                });
        }
    }, []);


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
            .attr("fill", (d) => d.properties.name === selected ? highlightColor : neutral)
            .attr("stroke-width", (d) => d.properties.name === selected ? 3 : "0.1px");
        } else {
            g.selectAll("path")
              .transition()
              .duration(200)
              .style("fill", neutral)
              .style("stroke-width", "0.1px");
          }
      }

    return (
        <>
            <Row>

                <Container>
                    <Row className='mb-2 w-100'>
                        <Col xs={4}>
                            <h1 className='display-3 mb-0'>Swiss Scramble 🇨🇭</h1>
                        </Col>
                        <Col className='h-100' xs={{ offset: 0, span: 12 }} md={{ offset: 4, span: 4 }}>
                            <Form.Label className='d-flex flex-row-reverse'>let me be franc</Form.Label>
                            <input
                                type="range"
                                onChange={(e) => {
                                    setSlider(parseFloat(e.target.value));
                                }}
                                disabled
                                value={slider}
                                min={1}
                                max={8}
                                orient="vertical"
                                id="sliderP"
                            />
                        </Col>
                        <Col className='h-100' xs={{ offset: 0, span: 12 }} md={{ offset: 4, span: 4 }}>
                            <svg id="travelmap"></svg>
                        </Col>
                    </Row>
                </Container>
                <p>Canton: {canton !== "travelmap" ? canton : ""}</p>
                <p className='text-center'>✈️ {countries.length} Cantons | Continents | 🌎 Progress {(countries.length / 26).toFixed(1)}%</p>
            </Row>

        </>
    );
}

export default Switzerland;
