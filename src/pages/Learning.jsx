import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Learning() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessonsAndProgress();
  }, []);

  const loadLessonsAndProgress = async () => {
    try {
      const [lessonsRes, progressRes] = await Promise.all([
        api.get('/lessons'),
        api.get('/lessons/progress')
      ]);
      setLessons(lessonsRes.data.lessons);
      setCompleted(progressRes.data.completed_lessons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setQuizAnswer('');
    setQuizFeedback('');
  };

  const handleQuizSubmit = async () => {
    if (!selectedLesson) return;
    try {
      const res = await api.post('/lessons/complete', {
        lesson_id: selectedLesson.id,
        quiz_answer: quizAnswer
      });
      if (res.data.status === 'completed') {
        setQuizFeedback('✅ Correct! Lesson completed.');
        setCompleted(prev => [...prev, selectedLesson.id]);
        setSelectedLesson(null);
      } else {
        setQuizFeedback('❌ Incorrect answer. Try again.');
      }
    } catch (error) {
      setQuizFeedback('Error submitting answer.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading lessons...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Learning Center</h1>
      <div className="grid gap-3">
        {lessons.map((lesson, idx) => (
          <div
            key={lesson.id}
            className={`border rounded-lg p-4 cursor-pointer transition hover:shadow-md ${
              completed.includes(lesson.id) ? 'bg-green-50 border-green-300' : 'bg-white'
            }`}
            onClick={() => handleLessonClick(lesson)}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">{idx+1}. {lesson.title}</span>
              {completed.includes(lesson.id) && <span className="text-green-600 text-sm">✓ Completed</span>}
            </div>
          </div>
        ))}
      </div>

      {selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{selectedLesson.title}</h2>
              <button onClick={() => setSelectedLesson(null)} className="text-gray-500 text-2xl">&times;</button>
            </div>
            <div className="mb-4 whitespace-pre-wrap">{selectedLesson.content}</div>
            <div className="border-t pt-4 mt-4">
              <p className="font-semibold mb-2">{selectedLesson.quiz_question}</p>
              <input
                type="text"
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                className="border p-2 rounded w-full mb-2"
                placeholder="Your answer (A, B, C, or type answer)"
              />
              <button onClick={handleQuizSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Submit Answer
              </button>
              {quizFeedback && <p className="mt-2 text-sm">{quizFeedback}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}