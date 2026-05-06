import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema({
  name: { type: String, required: [true, "Name is required"] },
  phone: { type: String, required: [true, "Phone is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  isActive: { type: Boolean, default: true },
  currentActivePlan: { type: Object, },
  lastLogin: Date,
}, { timestamps: true });

UserSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  // next();
})

UserSchema.methods.comparePassword = function(p) {
  return bcrypt.compare(p, this.password);
}

export default mongoose.models.User || mongoose.model("User", UserSchema);