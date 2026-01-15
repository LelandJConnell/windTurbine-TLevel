//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// GET routes
router.get('/start', (req, res) => {
  res.render('start')
})

router.get('/contactPage', (req, res) => {
  res.render('contactPage')
})

router.get('/address', (req, res) => {
  res.render('address')
})

router.get('/nationalGrid', (req, res) => {
  res.render('nationalGrid')
})

router.get('/business', (req, res) => {
  res.render('business')
})

router.get('/property', (req, res) => {
  res.render('property')
})

router.get('/additional-info', (req, res) => {
  res.render('additional-info')
})

router.get('/date-selection', (req, res) => {
  res.render('date-selection')
})

router.get('/check-answers', (req, res) => {
  res.render('check-answers')
})

router.get('/ineligible', (req, res) => {
  res.render('ineligible')
})

router.get('/ineligible-business', (req, res) => {
  res.render('ineligible-business')
})

router.get('/ineligible-property', (req, res) => {
  res.render('ineligible-property')
})

router.get('/ineligible-commitment', (req, res) => {
  res.render('ineligible-commitment')
})

router.get('/confirmation', (req, res) => {
  res.render('confirmation')
})

router.post('/contactPage', (req, res) => {
  res.redirect('/address')
})

router.post('/address', (req, res) => {
  res.redirect('/nationalGrid')
})

router.post('/nationalGrid', (req, res) => {
  console.log('Contact value:', req.session.data.contact)
  if (req.session.data.contact === 'no') {
    res.redirect('/ineligible')
  } else {
    res.redirect('/business')
  }
})

router.post('/business', (req, res) => {
  console.log('Business ownership value:', req.session.data.businessOwnership)
  if (req.session.data.businessOwnership === 'no') {
    res.redirect('/ineligible-business')
  } else {
    res.redirect('/property')
  }
})

router.post('/property', (req, res) => {
  console.log('Property ownership value:', req.session.data.ownership)
  if (req.session.data.ownership === 'no') {
    res.redirect('/ineligible-property')
  } else {
    res.redirect('/additional-info')
  }
})

router.post('/additional-info', (req, res) => {
  // Clear previous errors
  delete req.session.data.availableSpaceError
  delete req.session.data.turbineNumberError
  delete req.session.data.commitmentError

  const availableSpace = parseFloat(req.session.data.availableSpace)
  const turbineNumber = parseInt(req.session.data.turbineNumber)
  const commitment = req.session.data.commitment
  const maxTurbines = Math.floor(availableSpace / 200)

  let hasErrors = false

  // Validate available space
  if (isNaN(availableSpace) || availableSpace < 200) {
    req.session.data.availableSpaceError = 'Available space must be at least 200 square feet'
    hasErrors = true
  }

  // Validate turbine number
  if (isNaN(turbineNumber) || turbineNumber < 1) {
    req.session.data.turbineNumberError = 'Enter the number of wind turbines'
    hasErrors = true
  } else if (turbineNumber > maxTurbines) {
    req.session.data.turbineNumberError = 'You have selected too many wind turbines for your available space'
    hasErrors = true
  }

  // Validate commitment
  if (!commitment) {
    req.session.data.commitmentError = 'Select whether you agree to maintain the wind turbine for 20 years'
    hasErrors = true
  } else if (commitment === 'no') {
    return res.redirect('/ineligible-commitment')
  }

  if (hasErrors) {
    return res.redirect('/additional-info')
  }

  res.redirect('/date-selection')
})

router.post('/date-selection', (req, res) => {
  res.redirect('/check-answers')
})

router.post('/check-answers', (req, res) => {
  res.redirect('/confirmation')
})
