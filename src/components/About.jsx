import './About.css';
import craftyLogo from '../assets/craftylogo.png';

export default function About() {
    return (
        <section className="about" id="about">
            <div className="about__container">

                <div className="about__content">
                    <div className="about__text-block">
                        <h2 className="about__title">Digital Elegance</h2>
                        <p className="about__description">
                            Crafty is a premier weekly event in Second Life dedicated to high-end virtual aesthetics.
                            We bring together the finest digital designers to offer exclusive, meticulously crafted
                            clothing, accessories, and aesthetic enhancements for your avatar.
                        </p>
                        <p className="about__description">
                            Every weekend, discover a curated selection of virtual couture designed to elevate
                            your digital presence to the highest standard of luxury.
                        </p>
                    </div>

                    <div className="about__visual">
                        <div className="about__logo-container">
                            <img src={craftyLogo} alt="Crafty Logo" className="about__logo" />
                            <div className="about__glow"></div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
