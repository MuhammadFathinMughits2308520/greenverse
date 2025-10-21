import React from 'react';
import Beranda from "../component/beranda";
import Team from '../component/profileteam';
import Footer from '../component/footer';
import AboutTeam from '../component/aboutteam';
import AboutMedia from '../component/aboutmedia';
import ResearchBenefit from '../component/researchbenefit';
import UrgensiKontribusi from '../component/urgensikontribusi';
import Produk from '../component/produk';

function LandingPage() {
  return (
    <div className='landingpage'>
      <div id='beranda'><Beranda /></div>
      <div id='team'>
        <AboutTeam />
        <Team />
        </div>
      <div id='konten1'>
        <AboutMedia />
        <UrgensiKontribusi />
      </div>
      <div id='konten2'>
        <ResearchBenefit />
        <Produk />
      </div>
      <Footer />
    </div>
  );
}

export default LandingPage;