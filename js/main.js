(function(global) {
    'use strict';

    var CORRECT_ANSWER = "[OK]",
        CLASSES = {
            BOARD: 'board',
            STATUS: 'status',
            IN_PROGRESS: 'in-progress',
            SUCCESS: 'success',
            FAIL: 'fail'
        };

    /**
     * Functionality decorator and proxy for WGo Player handlers.
     * It binds references to some specific DOMElement objects and calls handler function with following params:
     * - board - Reference to wgo-player placeholder (not yet wgo-player instance)
     * - sgf
     * - api - set of functions:
     *  + progress(text) - adds in-progress class
     *  + success(text) - adds success class, removes others
     *  + failure(text) - adds failure class, remove others
     *  + reset(text) - removes all classes
     *  + onClick(callback,scope) - button click callback
     *
     *
     * @param {DOMElement} element
     * @param {Function} handler
     */
    function decorateWgo(element, handler) {
        var board =      element.getElementsByClassName('board')[0],
            sgf =        element.getAttribute('data-sgf'),
            status =     element.getElementsByClassName('status')[0],
            statusText = status.getElementsByTagName('p')[0],
            button =     status.getElementsByTagName('a')[0];

        function setStatusText(text) {
            if (text) {
                statusText.innerHTML = text;
            }
        }

        handler(board, sgf, {
            progress: function (text) {
                status.classList.add(CLASSES.IN_PROGRESS);
                setStatusText(text);
            },
            success:  function (text) {
                status.classList.remove(CLASSES.FAIL);
                status.classList.remove(CLASSES.IN_PROGRESS);
                status.classList.add(CLASSES.SUCCESS);
                setStatusText(text);
            },

            failure: function (text) {
                status.classList.add(CLASSES.FAIL);
                status.classList.remove(CLASSES.IN_PROGRESS);
                status.classList.remove(CLASSES.SUCCESS);
                setStatusText(text);
            },

            reset: function (text) {
                status.classList.remove(CLASSES.FAIL);
                status.classList.remove(CLASSES.IN_PROGRESS);
                status.classList.remove(CLASSES.SUCCESS);
                setStatusText(text);
            },

            onClick: function (callback, scope) {
                button.addEventListener('click', function (e) {
                    return callback.call(scope || this, e) === true; // automatic return false;
                });
            }
        });
    }

    function decorateDiagram(element) {
        var board = element.getElementsByClassName('board')[0];

        new WGo.BasicPlayer(board, {
            sgf: element.getAttribute('data-sgf'),
            markLastMove: false,
            enableKeys: false,
            enableWheel: false,
            autoRespond: false,
            showNotInKifu: false,
            layout: {top: [], right: [], left: [], bottom: []}
        });
    }

    function decorateFreePlay(board, sgf, api) {
        var hasCompleted = false,
            counter = 0,
            player;

        player = new WGo.BasicPlayer(board, {
            sgf: sgf,
            markLastMove: false,
            enableKeys: false,
            enableWheel: false,
            autoRespond: false,
            autoPass: true,
            showNotInKifu: true,
            showVariations: false,
            responseDelay: 0,
            layout: {top: [], right: [], left: [], bottom: []}
        });

        function triggerSuccess(comment) {
            api.success('Brawo! ' + comment);
            hasCompleted = true;
            player.config.showNotInKifu = false;
        }

        function triggerReset() {
            api.reset('Twój ruch.');
            counter = 0;
            hasCompleted = false;
            player.config.showNotInKifu = true;
        }

        /**
         * Event handler for responded event.
         * Checks if all white stones have been caught. If yes  - triggers success, otherwise - updates status text .
         * @param {Object} params
         */
        function updateStatus(params) {
            if (hasCompleted) {
                return;
            }

            var whiteCount = params.position.schema.reduce(function (sum, el) { return sum + (el === WGo.W); }, 0);

            counter += 1;

            api.progress("Ruchów: " + counter + "<br>Kamieni do zbicia: " + whiteCount);

            if (whiteCount === 0) {
                triggerSuccess("Udało Ci się zbić białego. Liczba wykonanych ruchów: " + counter);
            }
        }

        player.addEventListener('responded', updateStatus);

        api.onClick(function () {
            player.reset();
            triggerReset();
        });
    }

    function decorateProblem(board, sgf, api) {
        var hasCompleted = false,
            player;

        function triggerSuccess(comment) {
            api.success('Brawo! ' + comment);
            hasCompleted = true;
            player.config.showNotInKifu = false;
        }

        function triggerFail(comment) {
            api.failure('Źle. ' + comment);
            hasCompleted = true;
            player.config.showNotInKifu = false;
        }

        function triggerReset() {
            api.reset('Twój ruch.');
            hasCompleted = false;
            player.config.showNotInKifu = true;
        }

        /**
         * Event handler for notinkifu and nomoremoves events.
         * Analysis of params will allow to determine what outcome of the event should be.
         * @param {Object} params
         */
        function isProblemSolved(params) {

            // do nothing if already solved/failed the problem
            if (hasCompleted) {
                return;
            }

            // fail when the move is valid but was not found in kifu
            if (params.type === 'notinkifu') {
                triggerFail(params.node.comment || '');
                return;
            }

            // check if there're no more moves
            // this condition in fact is not necessary :)
            if (params.type === 'nomoremoves') {

                // solution is hidden inside the move's comment
                if (params.node.comment && ~params.node.comment.indexOf(CORRECT_ANSWER)) {
                    triggerSuccess(params.node.comment.replace(CORRECT_ANSWER, ''));
                } else {
                    triggerFail(params.node.comment || '');
                }
            }
        }

        function whiteToPlay() {
            api.progress('Biały gra...');
        }

        function blackToPlay() {
            api.progress('Twój ruch');
        }

        api.onClick(function () {
            player.reset();
            triggerReset();
        });

        player = new WGo.BasicPlayer(board, {
            problemSgf: sgf
        });

        player.addEventListener('played', whiteToPlay);
        player.addEventListener('responded', blackToPlay);
        player.addEventListener('nomoremoves', isProblemSolved);
        player.addEventListener('notinkifu', isProblemSolved);

        triggerReset();
    }

    global.addEventListener('load', function () {
        var elements = document.getElementsByClassName('sgf');

        Array.prototype.slice.call(elements).forEach(function (element) {
            if (element.classList.contains('problem')) {
                decorateWgo(element, decorateProblem);
            } else if (element.classList.contains('diagram')) {
                decorateDiagram(element);
            } else if (element.classList.contains('freeplay')) {
                decorateWgo(element, decorateFreePlay);
            }
        });

        var selects = document.getElementsByClassName('lesson-selector');

        Array.prototype.slice.call(selects).forEach(function (el) {
           el.onchange = function (e) {
               var option = el.options[el.selectedIndex];

               if (!option.hasAttribute('selected')) {
                   document.location = document.location.origin + option.value;
               }
           }
        });
    });
}(window));