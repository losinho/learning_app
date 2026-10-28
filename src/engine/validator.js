// Deterministic, offline validation engine (zero LLM calls)

export function stripNikkud(text) {
  if (!text) return '';
  return text.replace(/[\u0591-\u05C7]/g, '');
}

export function validateAnswer(exercise, submission) {
  if (!exercise || submission === undefined || submission === null) {
    return { isCorrect: false, message: 'נא לבחור תשובה' };
  }

  switch (exercise.type) {
    case 'image_word_match':
    case 'initial_sound':
    case 'letter_match':
    case 'word_picture_match':
    case 'visual_counting':
    case 'visual_subtraction':
    case 'ordinal_line':
    case 'visual_addition':
    case 'arithmetic_choice': {
      // submission is option id
      const isCorrect = String(submission) === String(exercise.correctOptionId);
      return {
        isCorrect,
        correctValue: exercise.correctOptionId,
        feedback: isCorrect ? 'מצוין! כל הכבוד!' : 'לא נורא, נסה שוב!'
      };
    }

    case 'build_word': {
      // submission is the tiles joined in the order the child placed them
      const isCorrect = String(submission) === String(exercise.expectedAnswer);
      return {
        isCorrect,
        correctValue: exercise.expectedAnswer,
        feedback: isCorrect ? 'מצוין! בנית את המילה!' : 'כמעט! ככה בונים את המילה:'
      };
    }

    case 'comparison_drill': {
      // submission is '<', '>', or '='
      let expected = '=';
      const leftVal = exercise.leftVal;
      const rightVal = exercise.rightVal;

      if (leftVal < rightVal) expected = '<';
      else if (leftVal > rightVal) expected = '>';

      const isCorrect = submission === expected;
      return {
        isCorrect,
        correctValue: expected,
        feedback: isCorrect ? 'נכון מאד!' : 'בדקו שוב איזה צד גדול יותר'
      };
    }

    case 'operator_choice': {
      // submission is '+' or '-'
      const isCorrect = submission === exercise.correctOperator;
      return {
        isCorrect,
        correctValue: exercise.correctOperator,
        feedback: isCorrect ? 'מעולה! פעולה נכונה!' : 'חשוב שוב, האם הכמות גדלה או קטנה?'
      };
    }

    case 'numeric_input':
    case 'arithmetic_drill': {
      // submission is a number or string
      const numericSubmission = Number(submission);
      const isCorrect = !isNaN(numericSubmission) && numericSubmission === Number(exercise.expectedAnswer);
      return {
        isCorrect,
        correctValue: exercise.expectedAnswer,
        feedback: isCorrect ? 'תשובה מדויקת!' : 'בדקו את החישוב שוב'
      };
    }

    case 'fill_in_blank': {
      // submission is string or choice id
      let isCorrect = false;
      if (typeof submission === 'string') {
        const cleanSub = submission.trim().toLowerCase();
        const cleanExp = String(exercise.expectedAnswer).trim().toLowerCase();
        isCorrect = cleanSub === cleanExp;
      }
      return {
        isCorrect,
        correctValue: exercise.expectedAnswer,
        feedback: isCorrect ? 'Great job! כל הכבוד!' : 'Try again! נסו שוב'
      };
    }

    case 'reading_comprehension_question': {
      // submission is choice index
      const isCorrect = Number(submission) === Number(exercise.correctIndex);
      return {
        isCorrect,
        correctValue: exercise.correctIndex,
        feedback: isCorrect ? 'נכון מאד! הבנת מצוין את הטקסט!' : 'כדאי להציץ שוב בטקסט'
      };
    }

    default:
      return { isCorrect: false, feedback: 'סוג תרגיל לא מוכר' };
  }
}
