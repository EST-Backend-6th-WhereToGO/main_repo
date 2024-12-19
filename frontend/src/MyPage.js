import React, { useState, useEffect } from "react";
import "./MyPage.css";

function MyPage() {
    const [userData, setUserData] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        bio: "",
    });

    useEffect(() => {
        // 사용자 데이터 가져오기 (예: API 호출)
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/user/mypage");
                const result = await response.json();
                setUserData(result);
                setFormData({
                    name: result.name,
                    email: result.email,
                    bio: result.bio,
                });
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            // 사용자 정보 수정 API 호출
            const response = await fetch("/api/user/mypage", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const updatedData = await response.json();
                setUserData(updatedData);
                setEditMode(false);
            } else {
                console.error("Failed to update user data");
            }
        } catch (error) {
            console.error("Error updating user data:", error);
        }
    };

    return (
        <div className="mypage-container">
            <h1>My Page</h1>

            {userData ? (
                <div className="profile-section">
                    <img
                        src={userData.profilePicture || "/default-profile.png"}
                        alt="Profile"
                        className="profile-picture"
                    />

                    {editMode ? (
                        <div className="edit-form">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Name"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                            />
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Bio"
                            ></textarea>
                            <button onClick={handleSave}>Save</button>
                            <button onClick={() => setEditMode(false)}>Cancel</button>
                        </div>
                    ) : (
                        <div className="profile-info">
                            <h2>{userData.name}</h2>
                            <p>Email: {userData.email}</p>
                            <p>Bio: {userData.bio}</p>
                            <button onClick={() => setEditMode(true)}>Edit Profile</button>
                        </div>
                    )}
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <div className="travel-history">
                <h2>Travel History</h2>
                {userData && userData.travelHistory && userData.travelHistory.length > 0 ? (
                    <ul>
                        {userData.travelHistory.map((trip, index) => (
                            <li key={index}>
                                <h3>{trip.destination}</h3>
                                <p>Date: {trip.date}</p>
                                <p>Notes: {trip.notes}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No travel history available.</p>
                )}
            </div>
        </div>
    );
}

export default MyPage;
