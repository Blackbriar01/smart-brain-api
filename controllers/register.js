const handleRegister = (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;

    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }

    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err=> res.status(400).json('unable to register'))
}

module.exports = {
    handleRegister: handleRegister
};

// create a transaction when you need to do two things at once. like to update 2 different tables with info from each table
// this can read like this:
// start a transaction on the db, transaction named trx. insert the hash, from const hash= bcrypt and the email from the req.body. insert those into the login table on the DB. return from that function, the email item. THEN...
// do another function called loginEmail which returns everything from the users table ( return trx(users).returning(*) )
// insert into that table, the email field, which was passed as a foreign key from login, the name field from req.body and the new data/time stamp.
// then... respond with the user in json format
// then trx(commit) pushes the inputs/updates to the db
//.catch(rollback) will cancel any changes if there is an error so that the db is not messed up
// if the whole transaction fails, return the 400 status error