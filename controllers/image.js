const {FACE_DETECT_MODEL} = require('clarifai');

const app = new Clarifai.App({
    apiKey: '9f04c7d0f86443f588d3d31509a3bd2a'
  });

  const handleApiCall = (req, res) => {
      app.models
          .predict(FACE_DETECT_MODEL, req.body.input)
          .then(data => {
              res.json(data);
          })
          .catch(err=> res.status(400).json('unable to handle api'))
  }


const handleImage = (req, res, db) => {
    const { id } = req.body;

    db('users').where('id','=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries=> {
        res.json(entries[0]);
    })
    .catch(err=> res.status(400).json('unable to update'))
}
module.exports = {
    handleImage,
    handleApiCall
}