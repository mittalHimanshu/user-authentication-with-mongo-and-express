module.exports.loggedOut = (req, res, next) => {
    if(req.session && req.session.userId){
        res.redirect('/profile')
    }
    next()
}