import { useState } from 'react'
import Switzerland from './Switzerland.jsx'
import { Col, Row, Container } from 'react-bootstrap'
import './App.css'

function App() {


  return (
    <div style={{ position: "relative", overflow: "hidden" }}>

      <Container
        id="home"
        className="mx-auto justify-content-center d-flex align-items-center content align-self-center"
        fluid
      >
      </Container>
      <Container
        id="aboutme"
        className="d-flex justify-content-center align-items-center mt-5 content"
        fluid
      >
        <Col lg={3}></Col>
        <Col lg={6}>
          <Switzerland />
        </Col>
        <Col lg={3}></Col>
      </Container>

      
      <Container
        id="portfolio"
        className="d-flex justify-content-center mt-5 content"
        fluid
      >
        <Col lg={3}></Col>
        <Col lg={6}>
         
        </Col>
        <Col lg={3}></Col>
      </Container>

    </div>
  )
}

export default App
