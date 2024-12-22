const Video = require('../models/Video')

exports.getVideos = async (req, res) => {
  const videos = await Video.find({userId: req.user.id})
  res.json(videos)
}
