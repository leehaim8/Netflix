import React, { useEffect, useState } from 'react';
import './Model.css';

const genreTagsMap = {
    Drama: ["Emotional", "Character-driven"],
    Comedy: ["Witty", "Feel-good"],
    Action: ["Explosive", "Fast-paced"],
    Thriller: ["Suspenseful", "Dark"],
    Horror: ["Scary", "Disturbing"],
    Romance: ["Heartfelt", "Romantic"],
    Crime: ["Gritty", "Violent"],
    "Science Fiction": ["Futuristic", "Mind-bending"],
    Fantasy: ["Magical", "Epic"],
    Animation: ["Emotional", "Epic"]
};

const ratingWarningsMap = {
    "TV-MA": ["Smoking", "Violence", "Strong Language"],
    "R": ["Violence", "Drug Use", "Explicit Content"],
    "PG-13": ["Mild Violence", "Language"],
    "PG": ["Mild Language"],
};

function Model(props) {
    const [data, setData] = useState(null);

    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
        || sessionStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            if (!props.modalData || !props.modalData.id) return;
            try {
                const res = await fetch(`http://localhost:8080/api/moviesAndTv/byId/${props.modalData.id}?name=${props.modalData.title || props.modalData.name}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const fetchedData = await res.json();
                setData(fetchedData);
            } catch (error) {
                console.error("Failed to fetch modal data:", error);
            }
        };

        fetchData();
    }, [props.modalData, token]);

    if (!data) return <div className="loading-modal">Loading...</div>;

    const isTV = !!data.number_of_seasons;
    const releaseYear = (data.first_air_date || data.release_date)?.split('-')[0];
    const castList = data.credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || 'Not available';
    const genres = data.genres?.map(g => g.name) || [];

    const tagSet = new Set();
    genres.forEach(g => {
        genreTagsMap[g]?.forEach(tag => tagSet.add(tag));
    });
    const autoTags = [...tagSet];

    const rating = data.adult ? "R" : "TV-MA";
    const warnings = ratingWarningsMap[rating] || [];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={props.onClose}>✕</button>

                <div className="modal-image-container">
                    <img className="modal-cover" src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`} alt={data.title || data.name} />

                    <div className="modal-title-overlay-bottom">
                        <div className="netflix-title">
                            <span className="n-letter">N</span><span className="rest-title"> SERIES</span>
                        </div>
                        <h1 className="modal-title">{data.title || data.name}</h1>
                        <div className="modal-buttons">
                            <button className="btn btn-review" onClick={props.onReviewClick}>▶ Review</button>
                            <button className="btn btn-add" onClick={(e) => {
                                e.stopPropagation();
                                props.onAddToWatchlist();
                            }}>＋</button>
                        </div>
                    </div>
                </div>

                <div className="modal-info-container">
                    <div className="modal-left">
                        <div className="modal-subinfo">
                            <div className="tag-line">
                                <span className="tag new">New</span>
                                {isTV && <span className="tag">{data.number_of_seasons} Seasons</span>}
                                {releaseYear && <span className="tag">{releaseYear}</span>}
                                <span className="tag hd">HD</span>
                                <span className="tag">AD</span>
                            </div>

                            <div className="tag-line">
                                <span className="tag tv-ma hd">{rating}</span>
                                {warnings.map((warn, i) => (
                                    <span key={i} className="tag warning">{warn}</span>
                                ))}
                            </div>
                        </div>
                        <p className="modal-overview">{data.overview}</p>
                    </div>

                    <div className="modal-right">
                        <div className="modal-cast"><b>Cast:</b> {castList}</div>
                        <div className="modal-genres"><b>Genres:</b> {genres.join(', ')}</div>
                        <div className="modal-tags"><b>This show is:</b> {autoTags.join(', ') || 'N/A'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Model;
