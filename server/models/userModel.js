import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true },
    url: { type: String, trim: true },
    handle: { type: String, trim: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    title: { type: String, trim: true },
    bio: { type: String, trim: true },
    location: { type: String, trim: true },
    avatarUrl: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    description: { type: String, trim: true },
    age: { type: Number, min: 13, max: 120 },
    instagram: { type: String, trim: true },
    machine: { type: String, trim: true },
    socialLinks: { type: [socialLinkSchema], default: [] },
    publicSlug: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

const slugifyName = name => {
  if (!name) {
    return `user-${Math.random().toString(36).substring(2, 8)}`;
  }

  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 60);
};

userSchema.pre('save', function setSlug(next) {
  if (!this.publicSlug || this.isModified('name')) {
    this.publicSlug = slugifyName(this.name);
  }
  next();
});

userSchema.methods.toPublicProfile = function toPublicProfile() {
  return {
    id: this._id,
    name: this.name,
    title: this.title,
    bio: this.bio,
    location: this.location,
    avatarUrl: this.avatarUrl,
    coverImage: this.coverImage,
    description: this.description,
    age: this.age,
    instagram: this.instagram,
    machine: this.machine,
    socialLinks: this.socialLinks,
    publicSlug: this.publicSlug,
    updatedAt: this.updatedAt
  };
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
