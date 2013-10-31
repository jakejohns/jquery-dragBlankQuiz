/*
 *    jquery.drag-blank-quiz
 *
 *    Copyright © 2013 Jake Johns <jake@jakejohns.net>.
 *    
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation, either version 3 of the License, or
 *    (at your option) any later version.
 *    
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *    
 *    You should have received a copy of the GNU General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *    File: jquery.drag-blank-quiz.js
 *    Author: Jake Johns <jake@jakejohns.net>
 *    Description: creates a fill-in-the-blank quiz
 */
    

(function($){


    $.fn.dragBlankQuiz = function( options ){

        var baseSettings = $.extend({
            quizClass                 : 'drag-blank-quiz',
            choicesContainerClass     : 'quiz-choices-container',
            choiceClassPrefix         : 'choice-for-quiz',
            answerSelect              : '.quiz-answer',
            blankClass                : 'quiz-blank',
            hoverClass                : 'quiz-hover',
            correctClass              : 'quiz-correct',
            completeClass             : 'quiz-complete',
            scoreMessageClass         : 'quiz-score',
            messageClass              : 'quiz-message',
            messageCorrectClass       : 'quiz-message-correct',
            messageIncorrectClass     : 'quiz-message-incorrect',
            answerHeadingClass        : 'quiz-answer-heading',
            answerHeading             : 'Drag the answers below to the blanks!',
            messageCorrect            : 'Correct!',
            messageIncorrect          : 'Incorrect.',
            messageCorrectHighlight   : null,
            messageIncorrectHighlight : null,
            messageDelay              : 1000,
            messageRemoveEffect       : 'fade',
            messageRemoveOptions      : {},
            messageRemoveSpeed        : 200,
            showScoreOnComplete       : true,
            scoreMessagePattern       : 'Quiz complete! You made %SCORE% incorrect guesses.',
            fakeAnswers               : null,
            dropHandler               : handleDrop,
            onCorrect                 : onCorrect,
            onIncorrect               : onIncorrect,
            onComplete                : onComplete,
        }, options);


        // loop through each quiz
        return this.each(function(i){

            // the quiz
            quiz = $(this)

            // merge base settings with settings present in html5 data
            // attributes. Then set the result back to the data attributes so we
            // can access it later for quiz specific settings in callbacks
            settings = $.extend(baseSettings, quiz.data())
            quiz.data(settings).addClass(settings.quizClass);

            // init some variables.
            // quiz: used to determine parent quiz of blanks
            // totalQuestions: total number of questions in a quiz
            // correctAnswers: total number of correct answers so far
            // incorretAnswers: total number of incorrect answers so far
            quiz.data('quiz', true);
            quiz.data('totalQuestions', 0);
            quiz.data('correctAnswers',  0);
            quiz.data('incorrectAttempts',  0);

            // create list to hold our answer draggables, 
            // and append it to the quiz
            choices = $('<ul />', {
                'class' :  settings.choicesContainerClass
            }).appendTo(quiz);

            // add a heading for the answers
            $('<span />', {class: settings.answerHeadingClass})
            .html(settings.answerHeading)
            .insertBefore(choices)


            // init an array to temporarily hold the answers
            // this is so we can randomize the order later, rather than just
            // insert the dragables in the order in which we find them
            choiceItems = Array();

            // build a class name for per-quiz answer dragables
            quizChoiceClass = settings.choiceClassPrefix + '-' + i;

            // loop through each answer
            quiz.find(settings.answerSelect).each(function(){
            
                // identify and hide the answer
                ans = $(this).hide();

                // Create the draggable
                // use a span instead of li, because block draggables are hard
                // without widths specified.
                choiceItems.push(
                    $('<li />').append(
                        $('<span />').html(ans.html())
                        .addClass(settings.choiceClassPrefix)
                        .addClass(quizChoiceClass)
                        .draggable({
                            containment: quiz,
                            stack : '.' + quizChoiceClass,
                            cursor : 'move',
                            revert : true
                        }))
                );

                // Create the droppable
                // encode the correct answer in the data
                $('<span />', {
                    'class': settings.blankClass,
                    'data': {'answer' : ans.text()}
                }).data('quiz-id', i)
                .insertBefore(ans)
                .droppable({
                    accept: '.' + quizChoiceClass,
                    hoverClass : settings.hoverClass,
                    drop : settings.dropHandler
                });

                // increment the total questions of this quiz
                quiz.data().totalQuestions++;
            });
            
            // add fake choices to stack if they exist
            if(settings.fakeAnswers){
                $.each(settings.fakeAnswers, function(i, v){
                    choiceItems.push(
                        $('<li />').append(
                            $('<span />').html(v)
                            .addClass(settings.choiceClassPrefix)
                            .addClass(quizChoiceClass)
                            .draggable({
                                containment: quiz,
                                stack : '.' + quizChoiceClass,
                                cursor : 'move',
                                revert : true
                            }))
                    );
                })
            }

            // shuffle and insert the choices so they aren't obviously in order.
            shuffle(choiceItems)
            $.each(choiceItems, function(i, ele){
                ele.appendTo(choices);
            });

        });


        // Simple function to randomize an array
        // used to mix up the answers section
        // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        function shuffle(array) {
             var currentIndex = array.length, temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }
                
        // Default function to handle submitted answers
        function handleDrop(e, ui)
        {
            // the answer dragged
            given = ui.draggable;

            // the blank filled
            blank = $(this);
            
            // the parent quiz
            quiz = blank.parents('*:data(quiz)')

            // load quiz specific settings
            settings = quiz.data()
            
            validAnswer = blank.data('answer');
            givenAnswer = given.text();

            // check if this is the correct answer
            if ( validAnswer == givenAnswer ){
                given.addClass(settings.correctClass);
                given.draggable('disable');
                blank.droppable('disable');
                given.position( { of: blank, my: 'left top', at: 'left top' } );
                given.draggable( 'option', 'revert', false );

                quiz.data().correctAnswers++;
                settings.onCorrect(blank, e, ui)
            }else{ 
                // if the wrong answer...
                quiz.data().incorrectAttempts++;
                settings.onIncorrect(blank, e, ui)
            }

            // check if quiz is complete
            if(quiz.data().correctAnswers == quiz.data().totalQuestions){
               settings.onComplete(quiz) 
            }

        }


        // utility to normalize showing messages
        function quizMessage(blank, text, msgClass, color)
        {
            // find parent quiz and load quiz settings
            quiz = blank.parents('*:data(quiz)')
            settings = quiz.data()

            // remove any existing messages
            quiz.find('.' + settings.messageClass).remove()
            
            // initialize message
            msg = $('<div />')
                .html(text)
                .addClass(settings.messageClass)
                .addClass(msgClass)
                .css({'position':'absolute', 'zIndex' : '99999'})
                .hide();

            // insert and position message
            quiz.prepend(msg);
            msg.position( { of: blank, my: 'left top', at: 'left top' } );

            // animate message
            msg.show("highlight", {color: color})
                .delay(settings.messageDelay)
                .effect(
                    settings.messageRemoveEffect, 
                    settings.messageRemoveoptions,
                    settings.messageRemoveSpeed,
                    function(){
                        $(this).remove();
                    });
        }

        // default correct answer callback
        function onCorrect(blank, e, ui)
        {
            settings = blank.parents('*:data(quiz)').data()
            quizMessage(
                blank,
                settings.messageCorrect,
                settings.messageCorrectClass,
                settings.messageCorrectHighlight
            )
        }


        // default incorrect answer callback
        function onIncorrect(blank, e, ui)
        {
            settings = blank.parents('*:data(quiz)').data()
            quizMessage(
                blank,
                settings.messageIncorrect,
                settings.messageIncorrectClass,
                settings.messageIncorrectHighlight
            )
        }

        // default quiz complete callback
        function onComplete(quiz)
        {
            settings = quiz.data()
            quiz.effect("highlight", {color: settings.messageCorrectHighlight})
            quiz.addClass(settings.completeClass)

            if(settings.showScoreOnComplete){
                quiz.find('.' + settings.messageClass).remove()
                $('<div />', {class : settings.scoreMessageClass})
                .addClass(settings.scoreMessageClass)
                .html(settings.scoreMessagePattern.replace(
                    '%SCORE%', 
                    quiz.data('incorrectAttempts'))
                     ).prependTo(quiz);
            }
        }

    }
}(jQuery));


