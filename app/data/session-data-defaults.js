/*

Provide default values for user session data. These are automatically added
via the `autoStoreData` middleware. Values will only be added to the
session if a value doesn't already exist. This may be useful for testing
journeys where users are returning or logging in to an existing application.

============================================================================

Example usage:

"full-name": "Sarah Philips",

"options-chosen": [ "foo", "bar" ]

============================================================================

*/

module.exports = {

  // Insert values here
  'installations': [
    {
      'name': 'Nevern Power Limited',
      'permitId': 'EU-100-73432-0-76',
      'emissionAllowance': [
        {
          'general-allowance': 52834
        }
      ]
    },
    {
      'name': 'Scunthorpe Integrated Iron & Steel Works',
      'permitId': 'EU-100-82345-0-76',
      'emissionAllowance': [
        {
          'general-allowance': 23871,
          'CER': 138,
          'ERU': 20
        }
      ]
    },
    {
      'name': 'Port Talbot Steelworks',
      'permitId': 'EU-100-73104-0-76',
      'emissionAllowance': [
        {
          'general-allowance': 1406
        }
      ]
    },
    {
      'name': 'Lynemouth Power Station',
      'permitId': 'EU-100-77732-0-76',
      'emissionAllowance': [
        {
          'general-allowance': 10473
        }
      ]
    }
  ]

}
