/*
    @fileOverview: This file controlls the various audio files and controller their volume and pan location.

    @TODO
      1. Depth based volume controll
      2. Depth based panning
   */
  
    (function($) {
        'use strict';

        /*
          This class setup and controlls the audios
          @function AudioController
          @private
         */
        
        function AudioController() {

            window.AudioContext = window.AudioContext || window.webkitAudioContext;            

            this.$audioWrapper = $('.audioWrapper');
            this.$audioList = this.$audioWrapper.find('.audioList');
            this.$audioButton = $('.controlButton');
            this.$panControl = $('.panning-control');
            this.$resetLog = $('.tableReset');

            this.$messageBox = $('.message').find('table');


            this.audioSrc = [{ 
                name: 'drums',
                type: '.ogg',
                location: 'left',
                position: -1
            },
            { 
                name: 'flute', 
                type: '.mp3',
                location: 'center',
                position: 0
            }, 
            { 
              name: 'light', 
              type: '.mp3',
              location: 'right',
              position: 1
          }];

            this.audios = $([]);

        };

        AudioController.prototype = {
            /*
              This method the current volume of the source
              @function getVolume
              @param [HTMLObject] src HTMLObject
              @return [Integer]
             */
            getVolume: function(src) {
                //return this.getAudioSrc(src).volume;
                return src.volume;
            },
            /*
              This method the set volume of the given source
              @function setVolume
              @param [HTMLObject] src HTMLObject
              @param [integer] value An integer value to be set
             */
            setVolume: function(src, value) {

                value = value >= 0.1 ? value : 0.1;
                src.volume = value;
            },
            /*
              This method pick up object from the array
              @function getAudioSrc
              @param [integer] src Index number of array
              @return [HTMLObject] 
             */
            getAudioSrc: function(src) {
                return this.audios[src];
            },

            togglePlay: function(event) {

                this.$audioButton.prop('disabled', false);
                
                var $target = $(event.target);

                $target.prop('disabled', true);
                  
                this.audios.each(function(index, element) {
                    var $item = $(element)[0];
                    $target.data('audio-state') === 'play' ? $item.play() : $item.pause();
                });

            },

            getPanNodeValue: function(src) {
                var x = parseFloat(src.panNode.pan.value.toFixed(2));
                //console.log('getPanNodeValue ', $(src).attr('name'), x);
                return x;
            },

            setPanNodeValue: function(src, panValue, direction) {

                var currentVal = this.getPanNodeValue(src),
                    newVal;

                if (direction === 'left') {

                    newVal = currentVal < 0 ? (currentVal + 0.1) : (currentVal - 0.1);
                    src.panNode.pan.value = newVal;
                }

                return;

                //console.log('sound ', value);

                src.panNode.pan.value = value;
                
                //console.log('setting ', src.id, value);
            },

            getLocation: function(element) {
                return element.location;
            },

            setLocation: function(element, newLocation) {
                element.location = newLocation;
            },

            panLimit: function() {

            },
            
            // Event handler function to increase panning to the right and left
            // when the slider is moved
            panHandler: function(e) {

                var _this = this,
                    sliderValue = parseFloat(e.currentTarget.value),
                    direction = sliderValue > 0 ? 'right' : 'left';/*,
                    newPanValue = 0;*/

                /*
                    moving towards the sound obj place on right ear side, 
                    fetch the all sound obj position and set panning accordingly.
                 */
                    
                this.audios.each(function(index, element) {
                    
                    var $item = $(element)[0],
                        currenPannedValue = _this.getPanNodeValue(element),
                        newPanValue;

                    //console.log('slider ', sliderValue);


                    /*if (direction === 'left') {

                        // we are moving closer to left side
                        if (element.data('location') === 'left') {

                            //newPanValue = (currenPannedValue === -1 ? -(1 + sliderValue) : currenPannedValue > -1 ? (1 + sliderValue));
                            
                            if (currenPannedValue >= -1) {
                                newPanValue = -(1 + sliderValue);

                            }
                            
                            element.panNode.pan.value = newPanValue;

                        } 
                        // move away from right side object
                        else if (element.data('location') === 'right') {

                            //newPanValue = (currenPannedValue === 1 ? 1 : 1 + sliderValue);
                            
                            if (currenPannedValue <= 1) {
                                newPanValue = currenPannedValue + sliderValue;
                            }
                            
                            element.panNode.pan.value = newPanValue;

                        } else if (element.data('location') === 'center') {
                            newPanValue = -sliderValue;
                            element.panNode.pan.value = newPanValue;

                        }
                        console.log(element.attr('name'), 'newPanValue', newPanValue);

                    }*/

                    if (sliderValue < 0) {

                        newPanValue = currenPannedValue === 1 ? 1 : (currenPannedValue + 0.1);

                        if (currenPannedValue <= 1) {
                            element.panNode.pan.value = newPanValue;
                        }

                    } else if (sliderValue > 0) {

                        newPanValue = currenPannedValue === -1 ? -1 : (currenPannedValue - 0.1);

                        if (currenPannedValue >= 1) {

                            element.panNode.pan.value = newPanValue;

                        }
                    } else if (sliderValue === 0) {
                        //todo

                    }
                    
                    element.data({
                        position: newPanValue,
                        location: newPanValue === 0 ? 'center' : newPanValue < 0 ? 'left' : 'right'
                    });

                    element.closest('li').toggleClass('center', newPanValue === 0);

                    var obj =  '<tr><th>' + element.attr('name').toUpperCase() + '</th>';
                    obj += '<td>New: ' + newPanValue + '</td>';
                    obj += '<td>Previous: ' + currenPannedValue + '</td>';
                    obj += '<td>location: ' + element.data('location') + '</td></tr>';
                        
                    _this.$messageBox.append(obj);

                });
                
            },
            
            audioUpdated: function(e) {
                console.log(e);
            },

            resetLog: function() {
                this.$messageBox.empty();
            },

            initEvents: function() {

                this.$audioButton.on('click', this.togglePlay.bind(this));
                this.$panControl.on('input', this.panHandler.bind(this));
                this.$resetLog.on('click', this.resetLog.bind(this));
            },

            initAudioContext: function() {

                var _this = this;

                _this.audios.each(function(index, element) {

                    var $item = $(element[0]),
                        audioCtx = new AudioContext();
                    
                    // Create a stereo panner
                    var panNode = audioCtx.createStereoPanner();

                    // Create a MediaElementAudioSourceNode
                    // Feed the HTMLMediaElement into it
                    var source = audioCtx.createMediaElementSource($item[0]);
          
                    // connect the AudioBufferSourceNode to the gainNode
                    // and the gainNode to the destination, so we can play the
                    // music and adjust the panning using the controls
                    source.connect(panNode);
                    panNode.connect(audioCtx.destination);

                    element.panNode = panNode;

                    //set channel on load
                    element.panNode.pan.value = $item.data('position');
                });

            },

            init: function() {

                var audioSource = this.audioSrc;

                for (var i = 0; i < audioSource.length; i++) {

                    var $li = $('<li></li>').append('<h3></h3>'),
                        $audioTag = $('<audio>');

                    $audioTag.attr({
                        id: audioSource[i].name,
                        name: audioSource[i].name,
                        src: "audio/" + audioSource[i].name + audioSource[i].type,
                        controls: true,
                        loop: true,
                        class: 'audio'
                    });

                    $audioTag.data({
                        position: audioSource[i].position,
                        location: audioSource[i].location, // to determine sound channel, i.e. Left, Right, Center
                    });

                    this.audios.push($audioTag);                    
                    
                    $li.find('h3').text(audioSource[i].name);

                    $li.append($audioTag);
                    this.$audioList.append($li);
                    
                    $li.toggleClass('center', audioSource[i].position === 0);

                    $audioTag.on('changeData', this.audioUpdated.bind(this));
                    
                }
                
                //init audio context
                this.initAudioContext();
                this.initEvents();
                //this.initGyro();
            },

            initGyro: function() {

                // Position Variables
                var x = 0;
                var y = 0;
                var z = 0;

                // Speed - Velocity
                var vx = 0;
                var vy = 0;
                var vz = 0;

                // Acceleration
                var ax = 0;
                var ay = 0;
                var az = 0;
                var ai = 0;
                var arAlpha = 0;
                var arBeta = 0;
                var arGamma = 0;
                var rR = 0;

                var delay = 1000;
                var vMultiplier = 0.01;         
        
                var alpha = 0;
                var beta = 0;
                var gamma = 0;

                if (window.DeviceMotionEvent == undefined) {

                    document.getElementById("no").style.display = "block";
                    document.getElementById("yes").style.display = "none";

                } else {

                    window.ondevicemotion = function(event) {
                        ax = Math.round(Math.abs(event.accelerationIncludingGravity.x * 1));
                        ay = Math.round(Math.abs(event.accelerationIncludingGravity.y * 1));
                        az = Math.round(Math.abs(event.accelerationIncludingGravity.z * 1));        
                        ai = Math.round(event.interval * 100) / 100;
                        rR = event.rotationRate;
                        if (rR != null) {
                            arAlpha = Math.round(rR.alpha);
                            arBeta = Math.round(rR.beta);
                            arGamma = Math.round(rR.gamma);
                        }

                    }
                                
                    window.ondeviceorientation = function(event) {
                    alpha = Math.round(event.alpha);
                    beta = Math.round(event.beta);
                    gamma = Math.round(event.gamma);
                }               
                
                    function d2h(d) {return d.toString(16);}
                    function h2d(h) {return parseInt(h, 16);}
                
                    
                    setInterval(function() {
                        document.getElementById("xlabel").innerHTML = "X: " + ax;
                        document.getElementById("ylabel").innerHTML = "Y: " + ay;
                        document.getElementById("zlabel").innerHTML = "Z: " + az;                                       
                        document.getElementById("ilabel").innerHTML = "I: " + ai;                                       
                        document.getElementById("arAlphaLabel").innerHTML = "arA: " + arAlpha;                                                          
                        document.getElementById("arBetaLabel").innerHTML = "arB: " + arBeta;
                        document.getElementById("arGammaLabel").innerHTML = "arG: " + arGamma;                                                                                                  
                        document.getElementById("alphalabel").innerHTML = "Alpha: " + alpha;
                        document.getElementById("betalabel").innerHTML = "Beta: " + beta;
                        document.getElementById("gammalabel").innerHTML = "Gamma: " + gamma;
                    }, delay);
                } 
                
            } // end of gyro

        };


        var myAudioCtrl = new AudioController();
        myAudioCtrl.init();        
    })(jQuery);
