const express = require('express')
const router = express.Router()

// Add your routes here - above the module.exports line
router.get('/*-submit', function(req, res, next){
  res.locals['serviceName'] = 'Submit emissions data for ETS'
  next()
})
router.get('/*-transfer', function(req, res, next){
  res.locals['serviceName'] = 'Check and trade emissions for ETS'
  next()
})

router.post("/choose-transfer-route", function(req,res){

  var whichTransfer = req.session.data['whichtransfer']

  if (whichTransfer == "Existing installation"){
    res.redirect("/existing-transfer")
  } else {
    res.redirect("/new-transfer")
  }

})

router.post("/choose-installation-route", function(req,res){

  var installationName = req.session.data['installationName']

  if (installationName == "Scunthorpe Integrated Iron & Steel Works"){
    res.redirect("/choose-unit-transfer")
  } else {
    res.redirect("/choose-transfer")
  }

})

router.post("/amount-surrender-route", function(req,res){

  var amountToSurrender = req.session.data['surrender-radio']

  if (amountToSurrender == "Everything"){
    res.redirect("/confirmation-surrender")
  } else if (amountToSurrender == "Other") {
    res.redirect("/are-you-sure-surrender")
  }

})

// new routes
router.get('/apply-for-an-account/:page', function (req, res, next) {
  res.locals['serviceName'] = 'Apply for an ETS account'
  next()
})

router.get('/register-for-ets/:page', function (req, res, next) {
  res.locals['serviceName'] = 'Register for ETS'
  next()
})

router.post('/register-for-ets/account-details-answer', function (req, res) {

  let previousEtsUser = req.session.data['ets-register']['is-previous-ets-user']

  if (previousEtsUser === 'yes') {
    res.redirect('/register-for-ets/your-linked-representative')
  } else {
    res.redirect('/apply-for-an-account/')
  }
})

router.post('/register-for-ets/operator-selection-answer', function (req, res) {

  let isGHG = req.session.data['ets-register']['ghg-operator']

  if (isGHG === 'yes') {
    res.redirect('/register-for-ets/account-details')
  } else {
    res.redirect('/apply-for-an-account/')
  }
})

router.post('/register-for-ets/linked-representative-answer', function (req, res) {

  let linkedReps = req.session.data['ets-register']['linked-reps']
  if (linkedReps.includes('non-existant')) {
    res.redirect('/register-for-ets/add-new-linked-representative')
  } else {
    res.redirect('/register-for-ets/check-and-submit')
  }
})

module.exports = router
