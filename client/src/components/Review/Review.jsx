import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Review.css';

function ReviewPage() {
    const { profileId, itemId } = useParams();
    const [text, setText] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [stars, setStars] = useState(0);
    const navigate = useNavigate();

    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1] || sessionStorage.getItem('token');

    const handleSubmit = async () => {
        if (!text.trim()) {
            return alert("Please enter your review.");
        }

        try {
            const res = await fetch(`http://localhost:8080/api/reviews/${profileId}/${itemId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    text,
                    isPublic,
                    stars
                })
            });

            if (res.status === 401 || res.status === 403) {
                navigate('/');
                return;
            }

            const data = await res.json();
            if (res.ok) {
                navigate(-1);
            } else {
                throw new Error(data.message || 'Failed to submit review');
            }

        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    return (
        <div className="review-container">
            <h2 className="review-title">Write a Review</h2>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="What did you think about the show?"
                className="review-textarea"
            />
            <div className="review-options">
                <div className="visibility-options">
                    <label>
                        <input
                            type="radio"
                            name="visibility"
                            checked={isPublic}
                            onChange={() => setIsPublic(true)}
                        />
                        Public
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="visibility"
                            checked={!isPublic}
                            onChange={() => setIsPublic(false)}
                        />
                        Private
                    </label>
                </div>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(num => (
                        <span
                            key={num}
                            className={`star ${num <= stars ? 'filled' : ''}`}
                            onClick={() => setStars(num)}
                        >★</span>
                    ))}
                </div>
            </div>
            <button className="submit-button" onClick={handleSubmit}>Submit Review</button>
        </div>
    );
}

export default ReviewPage;
