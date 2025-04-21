const User = require("../models/userModel");
const Profile = require("../models/profilesModel");

const profilesController = {
    async getProfileByUser(req, res) {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        try {
            const profiles = await Profile.find({ userId });
            if (!profiles) {
                return res.status(404).json({ message: "User not found." });
            }

            res.json(profiles);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch profiles' });
        }

    },
    async getProfileByProfileId(req, res) {
        const profileId = req.params.profileId;
        if (!profileId) {
            return res.status(400).json({ message: "Profile ID is required" });
        }

        try {
            const profile = await Profile.findOne({ _id: profileId });
            if (!profile) {
                return res.status(404).json({ message: "Profile not found." });
            }

            res.json(profile);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch profile' });
        }
    },
    async createProfile(req, res) {
        const { name, userId } = req.body;
        if (!name || !userId) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const avatars = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png'];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

        try {
            const profile = new Profile({ name, image: randomAvatar, userId });
            const saved = await profile.save();
            res.status(201).json(saved);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create profile' });
        }
    },
    async updateProfile(req, res) {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({ message: "profile ID is required" });
        }

        if (!updateData) {
            return res.status(400).json({ message: "One of the filed are missing!" });
        }

        try {
            const updatedProfile = await Profile.findOneAndUpdate({ _id: id }, updateData, { new: true });

            if (!updatedProfile) {
                return res.status(404).json({ message: "Child not found" });
            }
            res.status(200).json({ message: "Child updated successfully", profile: updatedProfile });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    },
    async deleteProfile(req, res) {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "profile ID is required" });
        }

        try {
            const deleteProfile = await Profile.findOneAndDelete({ _id: id });
            if (!deleteProfile) {
                return res.status(404).json({ message: "Profile not found" });
            }

            res.status(200).json({ message: "Profile deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    },
    async addFavorite(req, res) {
        const { profileId } = req.params;
        const { id, title, poster } = req.body;
        if (!id || !title || !poster) {
            return res.status(400).json({ message: "Missing fields" });
        }

        try {
            const profile = await Profile.findById(profileId);
            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }
            const alreadyExists = profile.favorites.some(fav => String(fav.id) === String(id));
            if (alreadyExists) {
                return res.status(409).json({ message: "Item already in favorites" });
            }
            profile.favorites.push({ id, title, poster });
            await profile.save();
            res.status(200).json({ message: "Added to favorites", favorites: profile.favorites });
        } catch (err) {
            res.status(500).json({ error: 'Failed to add favorite', details: err.message });
        }
    }, async getFavorites(req, res) {
        const { profileId } = req.params;

        try {
            const profile = await Profile.findById(profileId);
            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }
            res.status(200).json(profile.favorites);
        } catch (err) {
            res.status(500).json({ error: 'Failed to fetch favorites', details: err.message });
        }
    }
};

module.exports = { profilesController };
