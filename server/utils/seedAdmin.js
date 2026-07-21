const User = require("../model/UserModel");

const seedAdmin = async () => {
  try {
    const adminEmail = "admin@store.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      await User.create({
        name: "Admin User",
        email: adminEmail,
        password: "admin123",
        role: "admin",
      });
      console.log(`Default admin user successfully seeded: ${adminEmail} / admin123`);
    } else {
      console.log("Admin user already exists. Seeding skipped.");
    }
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

module.exports = seedAdmin;
