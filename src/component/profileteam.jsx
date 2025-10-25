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
    { foto: '/item/dospem.png', nama: 'Triannisa Rahmawati S. Pd., M.Si', peran: 'Dosen Pembimbing', tugas: "<i>Supervisor</i>" },
    { foto: '/item/team2.png', nama: 'Nasrul Adadi', peran: 'Pendidikan Kimia', tugas: '<i>Project Leader</i>' },
    { foto: '/item/team3.png', nama: 'Desi Fauza Nurjanah', peran: 'Pendidikan Kimia', tugas: '<i>Content Developer</i>'},
    { foto: '/item/team1.png', nama: 'Defrizal Yahdiyan Risyad', peran: 'Ilmu Komputer', tugas: '<i>AI & Virtual Robot Engineer</i>'},
    { foto: '/item/team4.png', nama: 'Muhammad Ridho Fajri', peran: 'Pendidikan Ilmu Komputer', tugas: '<i>Visual Designer</i>'},
    { foto: '/item/team5.png', nama: 'Muhammad Fathin Mughits', peran: 'Pendidikan Ilmu Komputer', tugas: '<i>Web Developer</i>' },
  ];

  return (
    <div className="teampage" ref={teamRef} id='team'>
      <h2 className={`profil ${isVisible ? 'visible' : ''}`}>Tim Profil</h2>
      <div className="teampage-konten">
        {anggota.map((item, index) => (
          <div key={index} className={`team-card ${isVisible ? 'visible' : ''}`}>
            <TeamPageCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileTeam;
