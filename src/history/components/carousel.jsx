import React, { Component } from 'react';
import { Image } from "semantic-ui-react"
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

export class ImagesCarousel extends Component {
    render() {
        return (
                this.props.carousel ?
                    (
                        <Carousel dynamicHeight={true}>
                            {
                                this.props.images.map(
                                    (image) => <div>
                                        <Image src={image.path}/>
                                    </div>
                                )
                            }
                        </Carousel>
                    )
                :
                    (
                        <Image.Group size='small'>
                            {this.props.images.map((image) => <Image src={image.path}/>)}
                        </Image.Group>
                    )
        )
    }
}

export default ImagesCarousel;
