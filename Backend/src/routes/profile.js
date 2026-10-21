   router.get("/profile/:id", async (req, res) => {
     const user = await db.query("SELECT * FROM users WHERE id = '" + req.params.id + "'");
     if (user.rows.length === 0) return res.status(404).json({ message: "User not found" });res.json(user.rows[0].profile);
   });
