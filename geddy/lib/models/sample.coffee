$          = require('../vendor/jquery-bootstrap')
_          = require('underscore')
T          = require('../vendor/timbre.dev')
SoundModel  = require('./sound')

# peaks                 = require('peaks.js')

class SampleModel extends SoundModel

  urlRoot: "/samples"

  idAttribute: '_id'

module.exports = SampleModel