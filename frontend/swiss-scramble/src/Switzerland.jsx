import { Container, Row, Col, Form } from 'react-bootstrap';
import * as d3 from 'd3';
import { useEffect, useState } from 'react';
import './App.css';
import * as topojson from 'topojson-client'



function Switzerland() {

    const countries = []


    const [mapLoaded, setMapLoaded] = useState(false)
    // const [continents, setContinents] = useState(4)
    // const [mapType, setMapType] = useState("geoOrthographic")
    // const [geoJson, setGeoJson] = useState(null)
    // const [inter, setInter] = useState(null)

    const width = 900, height = 500;

    // Zoom slider value
    const [slider, setSlider] = useState(1);

    // function getProjection() {
    //     return d3.geoMercator()
    //         .scale(100)
    //         .center([200, 200])
    //         .translate([width / 2, height / 2])
    // }

    useEffect(() => {
        console.log(slider)
        if (!mapLoaded) {
            fetch("./swiss-maps.json")
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    setMapLoaded(true)

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
                    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")

                    let g = svg
                    .append("g")
                    .attr("id", "pathsG")
                    
                    svg
                    .append("g")
                    .attr("class", "country")
                    .selectAll(".country")
                    .data(topojson.feature(data, data.objects.country).features)
                    .join("g")
                    .attr("class", "cantons")
                

                    const cantons = svg
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
                    .attr("fill", () => "white")
                    //.attr("fill", d => d.properties.fill)
                    //.attr("stroke", d => d.properties.stroke)
                    .attr("stroke", "black")
                    .attr("stroke-width", "0.5px")
                    .on('mouseover', function () {
                            d3.select(this).transition()
                                .duration(50)
                                .style('fill', "rgba(70, 130, 180, 0.8)")
                        })
                    .on('mouseout', function () {
                        d3.select(this).transition()
                            .duration(50)
                            .style('fill', "rgba(211,211,211, 1)")
                    })

                    svg.selectAll("text")
                    .data(topojson.feature(data, data.objects.cantons).features)
                    .join("text")
                    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
                    .attr("dy", ".2em")
                    .attr("font-size", "0.5em")
                    .text(function(d) { return d.properties.name; });
                    


                    const zoom = d3
                    .zoom()
                    // .scaleExtent([1, 8])
                    // .extent([
                    //   [0, 0],
                    //   [width, height],
                    // ])
                    .scaleExtent([1, 40])
                    .translateExtent([[-100, -100], [width + 90, height + 100]])
                    //.translateBy(g, 500, -500)
                    .on("zoom", (d) => {
                      g.attr("transform", d.transform);
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
          
                    svg
                    .call(zoom)
                    .call(
                    zoom.transform,
                    d3.zoomIdentity.translate(0, height / 4).scale(1.27)
                    );




                })
                .catch((err) => {
                    console.log("Error reading data " + err);
                });




        }
    }, []);

    return (
        <>
            <Row>
            
                <Container>
                    <Row className='mb-2 w-100'>
                        <Col xs={4}>
                            <h1 className='display-3 mb-0'>Switzerland</h1>
                        </Col>
                        <Col xs={{ offset: 4, span: 4 }}>
                            <Form.Label className='d-flex flex-row-reverse'>let me be franc</Form.Label>
                            <svg id="travelmap"></svg>
                            <input
                            type="range"
                            onChange={(e) => {
                                setSlider(parseFloat(e.target.value));
                            }}
                            value={slider}
                            min={1}
                            max={8}
                            orient="vertical"
                            id="sliderP"
                            />
                        </Col>
                    </Row>
                </Container>

                <p className='text-center'>✈️ {countries.length} Cantons | Continents | 🌎 Progress {(countries.length / 26).toFixed(1)}%</p>
            </Row>
  
        </>
    );
}

export default Switzerland;
