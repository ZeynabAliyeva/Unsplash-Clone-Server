const { default: mongoose } = require("mongoose");
const { Schema } = mongoose;

const adminSchema = Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
});

const admin = mongoose.model("Admin", adminSchema);

module.exports = {
  admin,
};
