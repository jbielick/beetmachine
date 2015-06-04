do (root = this) ->

  class Groove
    constructor: (options = {sampleRate: 48000}) ->
      { @sampleRate } = options
      @context = @getAudioContext()

    getAudioContext: ->
      return new root.webkitAudioContext() if root.webkitAudioContext
      return new root.AudioContext() if root.AudioContext
      throw new Error('No Audio Context Support')

    createNode: (src) ->
      if src
        node = new Node @context, src
        node.load src
      else
        new Node @context

    connectNode: (node) ->

    @defer: ->
      return new Deferred()

    class Node
      constructor: (@context, @src) ->
        @nodes = []
        @effects = []
      _effectMappings:
        reverb:
          method: 'createConvolver'
        lowpass:
          method: 'createBiquadFilter'
        pan:
          method: 'createPanner'
        gain:
          method: 'createGain'
        compressor:
          method: 'createDynamicsCompressor'
      load: (src) ->
        deferred = new Deferred()
        @ready = false
        xhr = new root.XMLHttpRequest()
        xhr.open 'GET', src, true
        xhr.responseType = 'arraybuffer'
        xhr.onload = (e) =>
          @context.decodeAudioData xhr.response, (buffer) =>
            @buffer = buffer
            @ready = true
            deferred.resolve @
        xhr.send()
        deferred.promise

      play: (delay = 0) ->
        throw new Error "Buffer hasn't loaded yet." unless @ready
        sound = @context.createBufferSource()
        sound.buffer = @buffer

        rendered = @renderEffects sound

        rendered.connect(@context.destination)
        sound.start(delay)
      
      addEffect: (type, params) ->
        throw new Error "Unknown effect: #{type}" unless @_effectMappings[type]
        unless @context[@_effectMappings[type].method]
          throw new Error "'#{type}' not implemented for #{@context}"
        node = @context[@_effectMappings[type].method]()
        @effects[type] = node
        @nodes << node
        # config the node
        @

      renderEffects: (sound) ->
        currentNode = sound
        for own effectNodeName, effectNode of @effects
          currentNode.connect effectNode
          currentNode = effectNode
        # lowpass = @context.createBiquadFilter()
        # panner = @context.createPanner()
        # gainNode = @context.createGain()
        # compressor = @context.createDynamicsCompressor()
        # sound.connect(lowpass)
        # lowpass.connect(panner)
        # panner.connect(gainNode)
        # gainNode.connect(compressor)
        # compressor
        currentNode

  class Deferred
    constructor: ->
      @thens = []
      @catches = []
      @finallys = []
      @promise = new Promise @
    resolve: ->
      @resolved = Array.prototype.slice.call arguments
      thenCb.apply(@, arguments) for thenCb in @thens
      finallyCb.apply(@, arguments) for finallyCb in @finallys
    reject: ->
      @rejected = Array.prototype.slice.call arguments
      catchCb.apply(@, arguments) for catchCb in @catches
      finallyCb.apply(@, arguments) for finallyCb in @finallys

    class Promise
      constructor: (@deferred) ->
      then: (cb) =>
        @deferred.thens.push cb
        if @deferred.resolved
          cb.apply(@deferred, @deferred.resolved)
      catch: (cb) =>
        @deferredcatches.push cb
        if @deferred.rejected
          cb.apply(@deferred, @deferred.rejected)
      finally: (cb) =>
        @deferred.finallys.push cb
        if @deferred.resolved or @deferred.rejected
          cb.apply(@deferred, @deferred.resolved or @deferred.rejected)


  if module? and typeof moule is 'object'
    module.exports = Groove
  else if define?and typeof dfine is 'function'
    define 'Groove', [], Groove
  root.Groove = Groove
