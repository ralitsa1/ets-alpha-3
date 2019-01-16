const express = require('express')
const router = express.Router()

// make available for all routes
router.use(function (req, res, next) {
  if (!req.session.data.newAuthorisedReps) {
    req.session.data.newAuthorisedReps = []
  }
  if (!req.session.data.newTrustedAccounts) {
    req.session.data.newTrustedAccounts = []
  }
  next()
})

router.get('/', function (req, res, next) {
  req.session.data.pageView = req.query.view || 'operator'
  next()
})

router.get('/account/:id/:page?/:subPage?', function (req, res, next) {
  res.locals['currentDate'] = Date.now()
  res.locals['installationID'] = req.params.id
  res.locals['pageView'] = req.query.view
  
  var permitId = req.params.id;
  res.locals.installationData = req.session.data['installations'].filter(function (installation, permitID) {
      if (installation.permitId == permitId) {
          return installation;
      }
  })[0];
  if (!req.params.page) {
      res.locals['installationData'] =   res.render('account/index')
  }
  else {
      next();
  }
})

router.get('/apply-for-an-account/:page', function (req, res, next) {
  next()
})

router.get('/register-for-ets/:page', function (req, res, next) {
  next()
})

router.get('/account/:id/:page/:subPage', function (req, res, next) {
  if (req.query.error) {
    res.locals['errorExists'] = req.query.error
  }
  res.render('account/' + req.params.page + '/' + req.params.subPage)
})

router.post('/account/:id/submit-emissions/specify-amount', function (req, res) {
    req.session.data['ets-submit-emmissions']['total'] = parseInt(req.session.data['ets-submit-emmissions']['emissions']['co2']) + parseInt(req.session.data['ets-submit-emmissions']['emissions']['pfc']) + parseInt(req.session.data['ets-submit-emmissions']['emissions']['no2']);
    res.redirect('/account/' + req.params.id + '/submit-emissions/select-verifier');
})

router.post('/account/:id/surrender-allowance/surrender-amount', function (req, res) {
  var amountToSurrender = req.session.data['ets-surrender-allowance']['amount-to-surrender']

  if (amountToSurrender === 'other') {
    res.redirect('confirm-oversurrender')
  } else {
    res.redirect('check-and-submit')
  }
})

router.post('/account/:id/transfer-allowance/select-installation', function (req, res) {
    res.redirect('select-recipient');
})

router.post('/account/:id/transfer-allowance/select-recipient', function (req, res) {
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


router.post('/account/:id/add-a-new-authorised-representative/representative-details', function (req, res, next) {
  var isExistingEtsUser = req.session.data['new-linked-representative']['existing-ets-user']
  var existingUserId = req.session.data['new-linked-representative']['id']

  if (isExistingEtsUser === 'yes' && existingUserId !== ' ') {
    res.redirect('/account/' + req.params.id + '/add-a-new-authorised-representative/check-respresentative-details')
  } else {
    res.redirect('/account/' + req.params.id + '/add-a-new-authorised-representative/confirmation')
  }
})

router.post('/account/:id/add-a-new-authorised-representative/confirmation', function (req, res, next) {
  var newAuthorisedRepName = req.session.data['new-authorised-representatives']['name']
  var newAuthorisedReps = req.session.data.newAuthorisedReps
  if (!newAuthorisedReps.includes(newAuthorisedRepName)) {
    req.session.data.newAuthorisedReps.push(newAuthorisedRepName)
  }
  next()
})

router.post('/account/:id/add-a-new-trusted-account/account-details', function (req, res, next) {
  var newTrustedAccountId = req.session.data['new-trusted-account']['id'] || ' '
  var doesItemExist = req.session.data['existing-accounts'].find(o => o.id === newTrustedAccountId) || false

  if (newTrustedAccountId !== ' ' && doesItemExist) {
    res.redirect('/account/' + req.params.id + '/add-a-new-trusted-account/check-account-details')
  } else {
    res.redirect('/account/' + req.params.id + '/add-a-new-trusted-account/account-details?error=true')
  }
})

router.post('/account/:id/add-a-new-trusted-account/confirmation', function (req, res, next) {
  var newTrustedAccountId = req.session.data['new-trusted-account']['id']
  var newTrustedAccountDetails = {
    id: newTrustedAccountId,
    nickname: req.session.data['new-trusted-account']['account-nickname'],
    note: req.session.data['new-trusted-account']['account-notes']
  }
  var newTrustedAccounts = req.session.data.newTrustedAccounts
  var doesItemExist = newTrustedAccounts.find(o => o.id === newTrustedAccountId) || false
  if (!doesItemExist) {
    req.session.data.newTrustedAccounts.push(newTrustedAccountDetails)
  }
  next()
})

module.exports = router
