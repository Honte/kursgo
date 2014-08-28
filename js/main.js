(function(global) {
    'use strict';

    var CLASSES = {
            BOARD: 'board',
            STATUS: 'status',
            SUCCESS: 'success',
            FAIL: 'fail'
        };

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

    function decorateProblem(element) {
        var board = element.getElementsByClassName('board')[0],
            status = element.getElementsByClassName('status')[0],
            statusText = status.getElementsByTagName('p')[0],
            button = status.getElementsByTagName('a')[0],
            hasCompleted = false,
            player;

        function triggerSuccess(comment) {
            status.classList.remove(CLASSES.FAIL);
            status.classList.add(CLASSES.SUCCESS);
            statusText.innerHTML = 'Brawo! ' + comment;
            hasCompleted = true;
            player.config.showNotInKifu = false;
        }

        function triggerFail(comment) {
            status.classList.add(CLASSES.FAIL);
            status.classList.remove(CLASSES.SUCCESS);
            statusText.innerHTML = 'Źle. ' + comment;
            hasCompleted = true;
            player.config.showNotInKifu = false;
        }

        function triggerReset() {
            statusText.innerHTML = 'Twój ruch.';
            status.classList.remove(CLASSES.FAIL);
            status.classList.remove(CLASSES.SUCCESS);
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
            if (params.type === 'notinkifu' && params.isValid) {
                triggerFail(params.node.comment || '');
                return;
            }

            // check if there're no more moves
            // this condition in fact is not necessary :)
            if (params.type === 'nomoremoves') {

                // solution is hidden inside the move's comment
                if (params.node.comment && ~params.node.comment.indexOf('dobrze')) {
                    triggerSuccess(params.node.comment);
                } else {
                    triggerFail(params.node.comment || '');
                }
            }
        }

        button.addEventListener('click', function () {
            if (hasCompleted) {
                player.reset();
                triggerReset();
            }
            return false;
        });

        player = new WGo.BasicPlayer(board, {
            problemSgf: element.getAttribute('data-sgf')
        });
        player.addEventListener('nomoremoves', isProblemSolved);
        player.addEventListener('notinkifu', isProblemSolved);

        triggerReset();
    }

    global.addEventListener('load', function () {
        var elements = document.getElementsByClassName('sgf');

        Array.prototype.slice.call(elements).forEach(function (element) {
            if (element.classList.contains('problem')) {
                decorateProblem(element);
            } else if (element.classList.contains('diagram')) {
                decorateDiagram(element);
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