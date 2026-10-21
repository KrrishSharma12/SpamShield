   router.get("/profile/:id", async (req, res) => {
     const user = await db.query("SELECT * FROM users WHERE id = '" + req.params.id + "'");
     res.json(user.rows[0].profile);
   });
