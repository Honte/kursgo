(function(global) {
    'use strict';

    var CLASSES = {
            BOARD: 'board',
            STATUS: 'status',
            SUCCESS: 'success',
            FAIL: 'fail'
        };

    function decorateProblem(section) {
        var board = document.createElement('div'),
            status = document.createElement('div'),
            hasCompleted = false,
            player;

        function triggerSuccess(comment) {
            status.classList.remove(CLASSES.FAIL);
            status.classList.add(CLASSES.SUCCESS);
            status.innerHTML = 'Brawo! ' + comment + '<br/>Kliknij tutaj aby zacząć jeszcze raz.';
            hasCompleted = true;
            player.config.showNotInKifu = false;
        }

        function triggerFail(comment) {
            status.classList.add(CLASSES.FAIL);
            status.classList.remove(CLASSES.SUCCESS);
            status.innerHTML = 'Źle. ' + comment + '<br/>Kliknij tutaj aby spróbować jeszcze raz.';
            hasCompleted = true;
            player.config.showNotInKifu = false;
        }

        function triggerReset() {
            status.innerHTML = 'Twój ruch.';
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
                if (params.node.comment && ~params.node.comment.indexOf('RIGHT')) {
                    triggerSuccess(params.node.comment);
                } else {
                    triggerFail(params.node.comment || '');
                }
            }
        }

        board.classList.add(CLASSES.BOARD);
        status.classList.add(CLASSES.STATUS);

        section.appendChild(board);
        section.appendChild(status);

        status.addEventListener('click', function () {
            if (hasCompleted) {
                player.reset();
                triggerReset();
            }
            return false;
        });

        player = new WGo.BasicPlayer(board, {
            problemSgfFile: section.getAttribute('data-problem')
        });
        player.addEventListener('nomoremoves', isProblemSolved);
        player.addEventListener('notinkifu', isProblemSolved);

        triggerReset();
    }

    global.addEventListener('load', function () {
        var sections = document.getElementsByTagName('section');

        Array.prototype.slice.call(sections).forEach(function (section) {
            if (section.hasAttribute('data-problem')) {
                decorateProblem(section);
            }
        });
    });
}(window));