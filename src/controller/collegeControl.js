const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel');
const validUrl = require('valid-url');
const axios = require('axios');
const { isValidData } = require('../utils/util');


const createCollege = async function (req, res) {
  try {
    const data = req.body;
    const { name, fullName, logoLink } = data;

    // Validate the name format
    if (!isValidData(name)) {
      return res.status(400).send({ status: false, message: "Invalid name format or name already exists" });
    }

    // Check if full name is provided
    if (!fullName) {
      return res.status(400).send({ status: false, message: "Please enter the full name" });
    }

    // Check if logo link is provided
    if (!logoLink) {
      return res.status(400).send({ status: false, message: "Please enter the logo link" });
    }

    // Validate the syntax of the logo URL
    if (!validUrl.isWebUri(logoLink.trim())) {
      return res.status(400).send({ status: false, message: "Please enter a valid URL" });
    }

    // Check for duplicate college name
    const existingCollege = await collegeModel.findOne({ name });
    if (existingCollege) {
      return res.status(400).send({ status: false, message: "College name already exists" });
    }

    try {
      const checkLink = await axios.get(logoLink);
      const sts = checkLink.status;

      if (sts < 200 || sts > 299) {
        return res.status(400).send({ status: false, message: "Link is not accessible" });
      }
    } catch (err) {
      return res.status(400).send({ status: false, message: "Please enter a valid link" });
    }

    const college = await collegeModel.create(data);
    const collegeData = await collegeModel.findOne(college).select({ _id: 0, name: 1, fullName: 1, logoLink: 1, isDeleted: 1 });`` 
    return res.status(201).send({ status: true, data: collegeData });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const collegeDetails = async (req, res) => {
  try {
    const collegeName = req.query.collegeName;

    // Check if collegeName is provided
    if (!collegeName) {
      return res.status(404).send({ status: false, message: "Please provide valid college details" });
    }

    // Validate collegeName format
    if (!isValidString(collegeName)) {
      return res.status(400).send({ status: false, message: "Please provide a valid college name" });
    }

    const college = await collegeModel.findOne({ name: collegeName });

    // Check if college exists
    if (!college) {
      return res.status(404).send({ status: false, message: "No college exists with that name" });
    }

    const collegeId = college._id;

    const interns = await internModel.find({ collegeId, isDeleted: false }).select('_id name email mobile');

    const data = {
      name: college.name,
      fullName: college.fullName,
      logoLink: college.logoLink,
      interns: interns,
    };

    return res.status(200).send({ status: true, data: data });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createCollege, collegeDetails };
