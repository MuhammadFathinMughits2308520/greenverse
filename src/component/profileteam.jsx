import React, { useEffect, useState, useRef } from 'react';
import '../styles/profileteam.css';
import TeamPageCard from "./teampage-card";

function ProfileTeam() {
  const [isVisible, setIsVisible] = useState(false);
  const teamRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (teamRef.current) observer.observe(teamRef.current);
    return () => teamRef.current && observer.unobserve(teamRef.current);
  }, []);

  const anggota = [
    { foto: '/item/dospem.png', nama: 'Triannisa Rahmawati S. Pd., M.Si', peran: 'Dosen Pembimbing', tugas: "<i>Supervisor</i>",link:'https://www.instagram.com/ttriannisa_ra?igsh=MTIwY21scmFic25qbA==' },
    { foto: '/item/team2.png', nama: 'Nasrul Adadi', peran: 'Pendidikan Kimia', tugas: '<i>Project Leader</i>',link:'https://www.instagram.com/nsrladadi_?igsh=MTh6YWp5MHNydjU3aw==' },
    { foto: '/item/team3.png', nama: 'Desi Fauza Nurjanah', peran: 'Pendidikan Kimia', tugas: '<i>Content Developer</i>',link:'https://www.instagram.com/desifzn_?igsh=MXd0bW0xcWlrMjluNQ=='},
    { foto: '/item/team1.png', nama: 'Defrizal Yahdiyan Risyad', peran: 'Ilmu Komputer', tugas: '<i>AI & Virtual Robot Engineer</i>',link:'https://www.instagram.com/__dfrzlyr?igsh=MTF3dzN3bmN1a2Q4MA=='},
    { foto: '/item/team4.png', nama: 'Muhammad Ridho Fajri', peran: 'Pendidikan Ilmu Komputer', tugas: '<i>Visual Designer</i>',link:'https://www.instagram.com/mridhofajri_12?igsh=MWt0cW9laTV3N3ljdQ=='},
    { foto: '/item/team5.png', nama: 'Muhammad Fathin Mughits', peran: 'Pendidikan Ilmu Komputer', tugas: '<i>Web Developer</i>',link:'https://www.instagram.com/nsrladadi_?igsh=MTh6YWp5MHNydjU3aw==' },
  ];

  return (
    <div className="teampage" ref={teamRef} id='team'>
      <h2 className={`profil ${isVisible ? 'visible' : ''}`}>Profil Tim</h2>
      <div className="teampage-konten">
        {anggota.map((item, index) => (
          <a
            key={index}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`team-card ${isVisible ? 'visible' : ''}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <TeamPageCard {...item} />
          </a>
        ))}
      </div>
    </div>
  );
}

export default ProfileTeam;
