import React, { useEffect, useState } from 'react';
import '../styles/team-card.css';

function Card({foto,nama,peran,tugas}){
    return(
        <div className='card'>
            <div className='subcard'>
                <h4>{peran}</h4>
                <h4>{peran}</h4>
                <h4>{peran}</h4>
                <h4>{peran}</h4>
                <h4>{peran}</h4>
            </div>
            <img src={foto} alt={nama} className='foto-card'/>
            <div className='card-profil'>
                <p className='nama-card'>{nama}</p>
                <p className='tugas-card'>{tugas}</p>
            </div>
        </div>
    );
}
export default Card;