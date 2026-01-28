//
// routes.js
// Prototype Kit routes with cookie consent fully integrated
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// -----------------------------
// Middleware to expose cookieConsent to templates
// -----------------------------
router.use((req, res, next) => {
  res.locals.cookieConsent = req.session.cookieConsent || null
  next()
})

// -----------------------------
// GET routes
// -----------------------------
router.get('/start', (req, res) => res.render('start'))

router.get('/contactPage', (req, res) => {
  const errors = []
  let fullNameErrorMessage = null
  let phoneNumberErrorMessage = null
  let emailErrorMessage = null

  if (req.session.data?.fullNameError) {
    errors.push({ text: req.session.data.fullNameError, href: '#full-name' })
    fullNameErrorMessage = { text: req.session.data.fullNameError }
    delete req.session.data.fullNameError
  }

  if (req.session.data?.phoneNumberError) {
    errors.push({ text: req.session.data.phoneNumberError, href: '#phone-number' })
    phoneNumberErrorMessage = { text: req.session.data.phoneNumberError }
    delete req.session.data.phoneNumberError
  }

  if (req.session.data?.emailError) {
    errors.push({ text: req.session.data.emailError, href: '#email' })
    emailErrorMessage = { text: req.session.data.emailError }
    delete req.session.data.emailError
  }

  res.render('contactPage', {
    errors: errors.length > 0 ? errors : null,
    data: req.session.data,
    fullNameErrorMessage,
    phoneNumberErrorMessage,
    emailErrorMessage
  })
})

router.get('/address', (req, res) => {
  const errors = []

  if (req.session.data?.addressLine1Error) {
    errors.push({ text: req.session.data.addressLine1Error, href: '#address-line-1' })
    delete req.session.data.addressLine1Error
  }
  if (req.session.data?.addressTownError) {
    errors.push({ text: req.session.data.addressTownError, href: '#address-town' })
    delete req.session.data.addressTownError
  }
  if (req.session.data?.addressPostcodeError) {
    errors.push({ text: req.session.data.addressPostcodeError, href: '#address-postcode' })
    delete req.session.data.addressPostcodeError
  }

  res.render('address', {
    errors: errors.length > 0 ? errors : null,
    data: req.session.data
  })
})

router.get('/nationalGrid', (req, res) => {
  const errors = []
  let contactErrorMessage = null
  let nationalGridRefErrorMessage = null

  if (req.session.data?.contactError) {
    errors.push({ text: req.session.data.contactError, href: '#contact' })
    contactErrorMessage = { text: req.session.data.contactError }
    delete req.session.data.contactError
  }

  if (req.session.data?.nationalGridRefError) {
    errors.push({ text: req.session.data.nationalGridRefError, href: '#national-grid-ref' })
    nationalGridRefErrorMessage = { text: req.session.data.nationalGridRefError }
    delete req.session.data.nationalGridRefError
  }

  res.render('nationalGrid', {
    errors: errors.length > 0 ? errors : null,
    data: req.session.data,
    contactErrorMessage,
    nationalGridRefErrorMessage
  })
})

router.get('/business', (req, res) => {
  const errors = []
  let businessOwnershipErrorMessage = null

  if (req.session.data?.businessOwnershipError) {
    errors.push({ text: req.session.data.businessOwnershipError, href: '#businessOwnership' })
    businessOwnershipErrorMessage = { text: req.session.data.businessOwnershipError }
    delete req.session.data.businessOwnershipError
  }

  res.render('business', {
    errors: errors.length > 0 ? errors : null,
    data: req.session.data,
    businessOwnershipErrorMessage
  })
})

router.get('/property', (req, res) => {
  const errors = []
  let ownershipErrorMessage = null

  if (req.session.data?.ownershipError) {
    errors.push({ text: req.session.data.ownershipError, href: '#ownership' })
    ownershipErrorMessage = { text: req.session.data.ownershipError }
    delete req.session.data.ownershipError
  }

  res.render('property', {
    errors: errors.length > 0 ? errors : null,
    data: req.session.data,
    ownershipErrorMessage
  })
})

router.get('/additional-info', (req, res) => {
  const errors = []
  let availableSpaceErrorMessage = null
  let turbineNumberErrorMessage = null
  let commitmentErrorMessage = null

  if (req.session.data?.availableSpaceError) {
    errors.push({ text: req.session.data.availableSpaceError, href: '#available-space' })
    availableSpaceErrorMessage = { text: req.session.data.availableSpaceError }
    delete req.session.data.availableSpaceError
  }

  if (req.session.data?.turbineNumberError) {
    errors.push({ text: req.session.data.turbineNumberError, href: '#turbine-number' })
    turbineNumberErrorMessage = { text: req.session.data.turbineNumberError }
    delete req.session.data.turbineNumberError
  }

  if (req.session.data?.commitmentError) {
    errors.push({ text: req.session.data.commitmentError, href: '#commitment' })
    commitmentErrorMessage = { text: req.session.data.commitmentError }
    delete req.session.data.commitmentError
  }

  res.render('additional-info', {
    errors: errors.length > 0 ? errors : null,
    data: req.session.data,
    availableSpaceErrorMessage,
    turbineNumberErrorMessage,
    commitmentErrorMessage
  })
})

router.get('/date-selection', (req, res) => {
  const errors = []
  let dateErrorMessage = null

  if (req.session.data?.dateError) {
    errors.push({ text: req.session.data.dateError, href: '#installation-date' })
    dateErrorMessage = { text: req.session.data.dateError }
    delete req.session.data.dateError
  }

  res.render('date-selection', {
    errors: errors.length > 0 ? errors : null,
    data: req.session.data,
    dateErrorMessage
  })
})

router.get('/check-answers', (req, res) => res.render('check-answers', { data: req.session.data }))

router.get('/ineligible', (req, res) => res.render('ineligible', { 
  data: req.session.data,
  reason: req.session.data?.ineligibleReason || 'grid'
}))

router.get('/confirmation', (req, res) => res.render('confirmation'))

// -----------------------------
// POST route for cookie consent
// -----------------------------
router.post('/cookie-consent', (req, res) => {
  if (!req.session.data) req.session.data = {}
  req.session.cookieConsent = req.body.consent // 'accept' or 'reject'

  const redirectUrl = req.headers.referer || '/'
  res.redirect(redirectUrl)
})

// -----------------------------
// POST routes for forms
// -----------------------------
router.post('/contactPage', (req, res) => {
  if (!req.session.data) req.session.data = {}

  const { fullName, phoneNumber, email } = req.body
  req.session.data.fullName = fullName
  req.session.data.phoneNumber = phoneNumber
  req.session.data.email = email

  delete req.session.data.fullNameError
  delete req.session.data.phoneNumberError
  delete req.session.data.emailError

  let hasErrors = false
  const errors = []

  if (!fullName || fullName.trim() === '') {
    req.session.data.fullNameError = 'Enter your full name'
    hasErrors = true
  }

  if (!phoneNumber || !/^\d{11}$/.test(phoneNumber.replace(/\D/g, ''))) {
    req.session.data.phoneNumberError = 'Enter a valid UK phone number (11 digits)'
    hasErrors = true
  }

  if (!email || email.trim() === '') {
    req.session.data.emailError = 'Enter your email address'
    hasErrors = true
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    req.session.data.emailError = 'Enter a valid email address'
    hasErrors = true
  }

  if (hasErrors) return res.redirect('/contactPage')

  res.redirect('/address')
})

// -----------------------------
// POST /address
// -----------------------------
router.post('/address', (req, res) => {
  if (!req.session.data) req.session.data = {}
  const { addressLine1, addressTown, addressPostcode } = req.body

  req.session.data.addressLine1 = addressLine1
  req.session.data.addressTown = addressTown
  req.session.data.addressPostcode = addressPostcode

  delete req.session.data.addressLine1Error
  delete req.session.data.addressTownError
  delete req.session.data.addressPostcodeError

  const errors = []
  const ukPostcodeRegex = /^([A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2})$/i

  if (!addressLine1 || addressLine1.trim() === '') {
    req.session.data.addressLine1Error = 'Enter address line 1'
    errors.push({ text: 'Enter address line 1', href: '#address-line-1' })
  }
  if (!addressTown || addressTown.trim() === '') {
    req.session.data.addressTownError = 'Enter a town or city'
    errors.push({ text: 'Enter a town or city', href: '#address-town' })
  }
  if (!addressPostcode || addressPostcode.trim() === '') {
    req.session.data.addressPostcodeError = 'Enter a postcode'
    errors.push({ text: 'Enter a postcode', href: '#address-postcode' })
  } else if (!ukPostcodeRegex.test(addressPostcode.trim())) {
    req.session.data.addressPostcodeError = 'Enter a real UK postcode, like SW1A 1AA'
    errors.push({ text: 'Enter a real UK postcode, like SW1A 1AA', href: '#address-postcode' })
  }

  if (errors.length > 0) return res.render('address', { errors, data: req.session.data })

  res.redirect('/nationalGrid')
})

// -----------------------------
// POST /nationalGrid
// -----------------------------
router.post('/nationalGrid', (req, res) => {
  if (!req.session.data) req.session.data = {}
  const { contact, NationalGridRef } = req.body

  req.session.data.contact = contact
  req.session.data.NationalGridRef = NationalGridRef

  delete req.session.data.contactError
  delete req.session.data.nationalGridRefError

  if (!contact) {
    req.session.data.contactError = 'Select whether the property is linked to the national grid'
    return res.redirect('/nationalGrid')
  }

  if (contact === 'yes' && (!NationalGridRef || NationalGridRef.trim() === '')) {
    req.session.data.nationalGridRefError = 'Enter the National Grid Reference Number'
    return res.redirect('/nationalGrid')
  }

  if (contact === 'no') {
    req.session.data.ineligibleReason = 'grid'
    return res.redirect('/ineligible')
  }

  res.redirect('/business')
})

// -----------------------------
// POST /business
// -----------------------------
router.post('/business', (req, res) => {
  if (!req.session.data) req.session.data = {}
  const { businessOwnership } = req.body
  req.session.data.businessOwnership = businessOwnership
  delete req.session.data.businessOwnershipError

  if (!businessOwnership) {
    req.session.data.businessOwnershipError = 'Select whether the business is owned by you'
    return res.redirect('/business')
  }

  if (businessOwnership === 'no') {
    req.session.data.ineligibleReason = 'business'
    return res.redirect('/ineligible')
  }

  res.redirect('/property')
})

// -----------------------------
// POST /property
// -----------------------------
router.post('/property', (req, res) => {
  if (!req.session.data) req.session.data = {}
  const { ownership } = req.body
  req.session.data.ownership = ownership
  delete req.session.data.ownershipError

  if (!ownership) {
    req.session.data.ownershipError = 'Select whether the property is owned by the business'
    return res.redirect('/property')
  }

  if (ownership === 'no') {
    req.session.data.ineligibleReason = 'property'
    return res.redirect('/ineligible')
  }

  res.redirect('/additional-info')
})

// -----------------------------
// POST /additional-info
// -----------------------------
router.post('/additional-info', (req, res) => {
  if (!req.session.data) req.session.data = {}
  const { availableSpace, turbineNumber, commitment } = req.body

  req.session.data.availableSpace = availableSpace
  req.session.data.turbineNumber = turbineNumber
  req.session.data.commitment = commitment

  delete req.session.data.availableSpaceError
  delete req.session.data.turbineNumberError
  delete req.session.data.commitmentError

  let hasErrors = false
  const availableSpaceNum = parseFloat(availableSpace)
  const turbineNumberNum = parseInt(turbineNumber)
  const maxTurbines = Math.min(4, Math.floor(availableSpaceNum / 200))

  if (isNaN(availableSpaceNum) || availableSpaceNum < 200) {
    req.session.data.availableSpaceError = 'Available space must be at least 200 square feet'
    hasErrors = true
  }

  if (isNaN(turbineNumberNum) || turbineNumberNum < 1) {
    req.session.data.turbineNumberError = 'Enter the number of wind turbines'
    hasErrors = true
  } else if (!isNaN(availableSpaceNum) && turbineNumberNum > maxTurbines) {
    req.session.data.turbineNumberError = 'You have selected too many wind turbines for your available space'
    hasErrors = true
  }

  if (!commitment) {
    req.session.data.commitmentError = 'Select whether you agree to maintain the wind turbine for 20 years'
    hasErrors = true
  } else if (commitment === 'no') {
    req.session.data.ineligibleReason = 'commitment'
    return res.redirect('/ineligible')
  }

  if (hasErrors) return res.redirect('/additional-info')

  res.redirect('/date-selection')
})

// -----------------------------
// POST /date-selection
// -----------------------------
router.post('/date-selection', (req, res) => {
  if (!req.session.data) req.session.data = {}

  req.session.data.installationDateDay = req.body['installationDate-day']
  req.session.data.installationDateMonth = req.body['installationDate-month']
  req.session.data.installationDateYear = req.body['installationDate-year']

  delete req.session.data.dateError

  const day = parseInt(req.session.data.installationDateDay)
  const month = parseInt(req.session.data.installationDateMonth)
  const year = parseInt(req.session.data.installationDateYear)

  if (!day || !month || !year) {
    req.session.data.dateError = 'Enter a complete date'
    return res.redirect('/date-selection')
  }

  const date = new Date(year, month - 1, day)
  if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
    req.session.data.dateError = 'Enter a valid date'
    return res.redirect('/date-selection')
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (date < today) {
    req.session.data.dateError = 'Installation date must be in the future'
    return res.redirect('/date-selection')
  }

  const maxDate = new Date()
  maxDate.setFullYear(maxDate.getFullYear() + 5)
  if (date > maxDate) {
    req.session.data.dateError = 'Installation date cannot be more than 5 years in the future'
    return res.redirect('/date-selection')
  }

  res.redirect('/check-answers')
})

// -----------------------------
// POST /check-answers
// -----------------------------
router.post('/check-answers', (req, res) => {
  res.redirect('/confirmation')
})

module.exports = router
