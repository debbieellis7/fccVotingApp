if(process.env.NODE_ENV === 'production'){
  module.exports = {mongoURI: 'mongodb://marksoo:marksoo123@ds255308.mlab.com:55308/fccvotingappz'}
} else{
  module.exports = {mongoURI: 'mongodb://localhost/expressreactredux'}
}