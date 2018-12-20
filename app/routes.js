const express = require('express')
const router = express.Router()

// new routes
router.get('/apply-for-an-account/:page', function (req, res, next) {
  res.locals['serviceName'] = 'Apply for an ETS account'
  next()
})

router.get('/register-for-ets/:page', function (req, res, next) {
  res.locals['serviceName'] = 'Register for ETS'
  next()
})

router.get('/transfer-allowance/:page', function (req, res, next) {
  res.locals['serviceName'] = 'Check and trade emissions for ETS'
  next()
})

router.get('/submit-emissions/:page', function (req, res, next) {
  res.locals['serviceName'] = 'Submit emissions data for ETS'
  next()
})

router.get('/surrender-allowance/:page', function (req, res, next) {
  res.locals['serviceName'] = 'Surrender emissions allowance for ETS'
  next()
})

router.get('/account/:id', function (req, res, next) {
  res.locals['serviceName'] = 'Account'
  res.locals['currentDate'] = Date.now()
  res.locals['installationID'] = req.params.id
  res.render('account/index')
  next()
})

router.post('/transfer-allowance/select-recipient-answer', function (req, res) {
  var recipientType = req.session.data['ets-transfer-allowance']['select-recipient']

  if (recipientType === 'existing') {
    res.redirect('existing-recipient')
  } else {
    res.redirect('new-recipient')
  }
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

router.post('/surrender-allowance/surrender-amount-answer', function (req, res) {
  var amountToSurrender = req.session.data['ets-surrender-allowance']['amount-to-surrender']

  if (amountToSurrender === 'other') {
    res.redirect('confirm-oversurrender')
  } else {
    res.redirect('confirmation')
  }
})

module.exports = router
