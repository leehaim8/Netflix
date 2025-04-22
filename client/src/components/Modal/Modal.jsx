import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Modal.css';

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
    const navigate = useNavigate();
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const profileId = pathSegments[pathSegments.length - 1];
    const [data, setData] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editedText, setEditedText] = useState('');
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]
        || sessionStorage.getItem('token');


    useEffect(() => {
        const fetchData = async () => {
            if (!props.modalData || !props.modalData.id) return;
            try {
                const res = await fetch(`https://netflix-472l.onrender.com/api/moviesAndTv/byId/${props.modalData.id}?name=${props.modalData.title || props.modalData.name}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.status === 401 || res.status === 403) {
                    navigate('/');
                    return;
                }

                const fetchedData = await res.json();
                setData(fetchedData);
            } catch (error) {
                console.error("Failed to fetch modal data:", error);
            }
        };

        fetchData();
    }, [props.modalData, token, navigate]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`https://netflix-472l.onrender.com/api/reviews/${props.modalData.id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const fetched = await res.json();
                setReviews(fetched);
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            }
        };

        if (props.modalData?.id) {
            fetchReviews();
        }
    }, [props.modalData, token]);

    const visibleReviews = reviews.filter(r =>
        r.isPublic || r.profileId === profileId
    );

    const handleDelete = async (reviewId) => {
        try {
            const res = await fetch(`https://netflix-472l.onrender.com/api/reviews/${reviewId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== reviewId));
                props.onClose();
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleEdit = async (reviewId, index) => {
        try {
            const res = await fetch(`https://netflix-472l.onrender.com/api/reviews/${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: editedText })
            });
            if (res.ok) {
                const updated = [...reviews];
                updated[index].text = editedText;
                setReviews(updated);
                setEditingIndex(null);
                setEditedText('');
            }
        } catch (err) {
            console.error("Edit failed:", err);
        }
    };


    if (!data) return <div className="loading-modal">Loading...</div>;

    const isTV = !!data.number_of_seasons;
    const releaseYear = (data.first_air_date || data.release_date)?.split('-')[0];
    const castList = Array.isArray(data.credits?.cast)
        ? data.credits.cast.slice(0, 5).map(c => c.name).join(', ')
        : Array.isArray(data.cast)
            ? data.cast.slice(0, 5).join(', ')
            : 'Not available';

    const genres = Array.isArray(data.genres)
        ? (typeof data.genres[0] === 'string'
            ? data.genres
            : data.genres.map(g => g.name))
        : [];


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
                    <img className="modal-cover" src={
                        data.backdrop_path
                            ? `https://image.tmdb.org/t/p/w200${data.backdrop_path}`
                            : data.backdrop?.startsWith('http')
                                ? data.backdrop
                                : `${data.backdrop?.replace(/^\/?/, '')}`
                    } alt={data.title || data.name} />
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
                <div className="modal-reviews">
                    <h3>Reviews</h3>
                    {visibleReviews.length === 0 ? (
                        <p>No reviews yet.</p>
                    ) : (
                        visibleReviews.map((review, index) => (
                            <div key={index} className="review-card">
                                <div className="review-header">
                                    <div className="review-stars">⭐️ {review.stars}/5</div>
                                    {review.profileId === profileId && (
                                        <div className="review-actions">
                                            <button onClick={() => {
                                                setEditingIndex(index);
                                                setEditedText(review.text);
                                            }}>🖉</button>
                                            <button onClick={() => handleDelete(review._id)}>🗑</button>
                                        </div>
                                    )}
                                </div>
                                {editingIndex === index ? (
                                    <div className="edit-review">
                                        <textarea value={editedText} onChange={e => setEditedText(e.target.value)} />
                                        <button onClick={() => handleEdit(review._id, index)}>💾 Save</button>
                                    </div>
                                ) : (
                                    <p className="review-text">"{review.text}"</p>
                                )}
                                {!review.isPublic && <span className="private-tag">Private</span>}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Model;
