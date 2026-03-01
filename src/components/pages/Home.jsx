import React from 'react';
import Hero from '../studentWeb/Hero';
import GlobalConnected from '../studentWeb/GlobalConnected';
import Intro from '../studentWeb/Intro';
import VisionMission from '../studentWeb/VisionMission';
import WhyChooseUs from '../studentWeb/WhyChooseUs';
import Testimonials from '../studentWeb/Testimonials';
import FAQ from '../studentWeb/FAQ';
import StudentForm from '../StudentForm';

const Home = () => {
    return (
        <main>
            <Hero />
            {/* <div id="student-form">
                <StudentForm isEmbedded={true} />
            </div> */}
            <GlobalConnected />
            <Intro />
            <VisionMission />
            <WhyChooseUs />
            <Testimonials />
            <FAQ />
        </main>
    );
};

export default Home;
