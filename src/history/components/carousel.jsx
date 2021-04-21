import React, { Component } from "react";
import { Image } from "semantic-ui-react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

export class ImagesCarousel extends Component {
    render() {
        return <div style={{"width": "80%", "margin": "10px auto 50px"}}>
            <Carousel autoPlay showThumbs={false} infiniteLoop interval={5000}>
                {this.props.images.map((image) => (
                    <div key={"image-" + image.path}>
                        <Image src={image.path} />
                    </div>
                ))}
            </Carousel>
        </div>
    }
}

export default ImagesCarousel;
