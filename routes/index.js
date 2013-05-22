
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Home' });
};

exports.chapters = function(req, res){
    res.render('chapters/' + req.params.id, { title: req.params.id });
};