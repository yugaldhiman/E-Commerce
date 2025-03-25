import React from 'react'
import "./hero.css"
import handIcon from "../Assest/hand_icon.png"
import arrowIcon from "../Assest/arrow.png"
import heroImage from "../Assest/hero_image.png"

function Hero() {
  return (
    <div className='hero'>
        <div className="hero-left">
            <h2>NEW ARRIVALS ONLY</h2>
            <div>
            <div className="hero-hand-icon">
                <p>New</p>
                <img src={handIcon} alt="" />
            </div>
            <p>Collections</p>
            <p>For Everone</p>
        </div>
        <div className="hero-latest-button">
            <div>Latest Collection</div>
            <img src={arrowIcon} alt="" />
        </div>
        </div>
        <div className="hero-right">
            <img src={heroImage} alt="" />
        </div>
    </div>
  )
}

export default Hero