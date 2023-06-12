const collegeModel = require('../models/collegeModel');
const internModel = require('../models/internModel');
const valid = require('../utils/util');



const createIntern = async function (req, res) {
  try {
    const data = req.body;
    const { name, email, mobile, collegeName } = data;

    // Validate name format
    if (!valid.isValidData(name)) {
      return res.status(400).send({ status: false, message: "Name should only contain letters" });
    }

    // Validate email format
    if (!valid.validEmail(email)) {
      return res.status(400).send({ status: false, message: "Please enter a valid email address" });
    }

    // Check if mobile number is provided
    if (!mobile) {
      return res.status(400).send({ status: false, message: "Please enter the mobile number" });
    }

    // Validate mobile number format
    if (!valid.validMobile(mobile)) {
      return res.status(400).send({ status: false, message: "Please enter a valid mobile number" });
    }

    // Check if college name is provided
    if (!collegeName) {
      return res.status(400).send({ status: false, message: "Please enter the college name" });
    }

    const college = await collegeModel.findOne({ name: collegeName });

    // Check if college exists
    if (!college) {
      return res.status(400).send({ status: false, message: "Please enter the correct college name" });
    }

    // Check for duplicate email
    const existingInternEmail = await internModel.findOne({ email });
    if (existingInternEmail) {
      return res.status(400).send({ status: false, message: "Email already exists" });
    }

    // Check for duplicate mobile number
    const existingInternMobile = await internModel.findOne({ mobile });
    if (existingInternMobile) {
      return res.status(400).send({ status: false, message: "Mobile number already exists" });
    }

    const intern = await internModel.create({ name, email, mobile, collegeId: college._id });
    const resIntern = intern.toObject();

    delete resIntern._id;
    delete resIntern.createdAt;
    delete resIntern.updatedAt;
    delete resIntern.__v;
    res.status(201).send({ status: true, data: resIntern });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports.createIntern = createIntern;
