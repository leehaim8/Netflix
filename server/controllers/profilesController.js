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

    }, async createProfile(req, res) {
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
    }
};

module.exports = { profilesController };
