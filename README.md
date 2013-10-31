jquery-dragBlankQuiz
====================

Simple jquery plugin to create fill-in-the-blank quizes.

Similar to this http://fillintheblank.quizyplugin.com/

The functionality of the above linked plugin did not suit the clients needs, so
I wrote this really quick.


You will likely need to write better styles than what is here in `example.css`.



## Usage

```html
<html>
<head>
    <link href="example.css" media="all" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="jquery.min.js"></script>
    <script type="text/javascript" src="jquery-ui.min.js"></script> 
    <script type="text/javascript" src="jquery.drag-blank-quiz.js"></script> 

    <script type="text/javascript"> 
    $(document).ready(function(){
            $('.quiz').dragBlankQuiz();
            });
    </script> 
</head>

<body>

<div class="quiz">
    <p>Fill in the <span class="quiz-answer">blank</span>.</p>
</div>

</body>
    

</html>

```

## Options

option | default | description
---|---|---
quizClass                 | 'drag-blank-quiz'| class to add to quiz container
choicesContainerClass     | 'quiz-choices-container'| class to add to created choices ul which holds the draggable answers
choiceClassPrefix         | 'choice-for-quiz'| class added to choices, and used as prefix for quiz specific classes
answerSelect              | '.quiz-answer'| selector to identify answers
blankClass                | 'quiz-blank'| class for "blanks"
hoverClass                | 'quiz-hover'| class for blanks when hovered
correctClass              | 'quiz-correct'| class for draggables when correctly dragged
completeClass             | 'quiz-complete'| class to add to completed quiz
scoreMessageClass         | 'quiz-score'| class to add to final "score" message
messageClass              | 'quiz-message'| class to add to "correct" and "incorrect" messages
messageCorrectClass       | 'quiz-message-correct'| class to add to "correct" messages
messageIncorrectClass     | 'quiz-message-incorrect'| class to add to "incorrect" messages
answerHeadingClass        | 'quiz-answer-heading'| class to add to answer heading
answerHeading             | 'Drag the answers below to the blanks!'| text to add before answers
messageCorrect            | 'Correct!'| text to display when correct answer given
messageIncorrect          | 'Incorrect.'| text to display when incorrect answer given
messageCorrectHighlight   | null | color to use for "correct" message highlight
messageIncorrectHighlight | null |color to use for "incorrect" message highlight
messageDelay              | 1000 | delay before message is removed
messageRemoveEffect       | 'fade'| effect to use for message removal
messageRemoveOptions      | {}| options to pass to message removal effect
messageRemoveSpeed        | 200| speed to remove message
showScoreOnComplete       | true| flase to suppress displaying completion message
scoreMessagePattern       | 'Quiz complete! You made %SCORE% incorrect guesses.'| pattern to use when displaying final score. replaces "%SCORE%" with number of incorrect attempts.
fakeAnswers               | null| array of fake answers to add to dragable answers
dropHandler               | handleDrop| callback when anser is dropped on blank
onCorrect                 | onCorrect| callback when "correct" answer dropped on blank (called from handleDrop)
onIncorrect               | onIncorrect| callback when "incorrect" answer dropped on blank (called from handleDrop)
onComplete                | onComplete| callback when quiz is complete (called from handleDrop)


