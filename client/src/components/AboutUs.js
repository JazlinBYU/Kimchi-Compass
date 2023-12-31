import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Carousel.css";

function AboutUs() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={
            "https://i.ibb.co/wBqFjMH/fresh-gourmet-meal-wooden-table-close-up-generative-ai.jpg"
          }
          alt="First slide"
        />
        <Carousel.Caption>
          <h3>Turn On Your Appetite</h3>
          <p>
            Get hungry looking at a plentiful amount of Korean restaurants in
            the Seattle area!
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={
            "https://i.ibb.co/ggvh0WR/fresh-vegetable-pasta-meal-gourmet-crockery-plate-generative-ai.jpg"
          }
          alt="Second slide"
        />
        <Carousel.Caption>
          <h3>Remember Forever</h3>
          <p>
            Save all your eats in one easy to access location while spicing up
            your profile to fit your needs.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src={
            "https://i.ibb.co/Fnc5dyx/freshly-grilled-meat-wooden-plate-generated-by-ai.jpg"
          }
          alt="Third slide"
        />
        <Carousel.Caption>
          <h3>Rate Your Eats</h3>
          <p>
            Don't forget to review the restaurants you eat at so you cant
            directly remember as well as give others helpful tips for future
            ordering.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default AboutUs;
