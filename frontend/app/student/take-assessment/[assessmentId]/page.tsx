'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { questionAPI, Question } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

function parseOptions(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((o) => (o == null ? '' : String(o)));
    }
    return [String(raw)];
  } catch {
    return [String(raw)];
  }
}

export default function TakeAssessmentPage() {
  const { isReady } = useAuth();
  const params = useParams();
  const router = useRouter();
  const assessmentId = parseInt(params.assessmentId as string);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<{ correct: number; total: number } | null>(null);

  useEffect(() => {
    if (!isReady) return;

    questionAPI.getQuestionsByAssessment(assessmentId)
      .then((res) => {
        console.log('Questions loaded:', res.data?.length ?? 0);
        setQuestions(res.data);
      })
      .catch((err) => {
        console.error('Error loading questions');
        setError('Failed to load questions');
      })
      .finally(() => setLoading(false));
  }, [isReady, assessmentId]);

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const submitAssessment = () => {
    console.log('Answers submitted, count:', Object.keys(answers).length);
    const correct = questions.filter(
      (q) => (answers[q.id] ?? '').trim() === (q.correctAnswer ?? '').trim()
    ).length;
    setScore({ correct, total: questions.length });
    setSubmitted(true);
    alert(`Assessment submitted! Score: ${correct} / ${questions.length}`);
  };

  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <AppLayout userRole="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading questions...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">{error}</div>
        </div>
      </AppLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <AppLayout userRole="student">
        <div className="max-w-3xl mx-auto p-6 space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Take Assessment</h1>
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            No questions found for this assessment.
          </div>
          <Button variant="outline" onClick={() => router.push('/student/assessments')}>
            Back to Assessments
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="student">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Take Assessment</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {answeredCount} of {questions.length} answered
            </p>
          </div>
          {submitted && score && (
            <div className="rounded-lg border border-border bg-card px-4 py-2 text-center">
              <p className="text-xs text-muted-foreground">Score</p>
              <p className="text-2xl font-bold text-primary">
                {score.correct}/{score.total}
              </p>
            </div>
          )}
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => {
            const options = parseOptions(question.options);
            const selected = answers[question.id];
            const isCorrect = submitted && selected?.trim() === question.correctAnswer?.trim();
            const isWrong = submitted && selected && !isCorrect;

            return (
              <div
                key={question.id}
                className={`rounded-lg border bg-card p-6 ${
                  submitted
                    ? isCorrect
                      ? 'border-green-400'
                      : isWrong
                      ? 'border-red-400'
                      : 'border-border'
                    : 'border-border'
                }`}
              >
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Question {index + 1}
                </p>
                <h3 className="mb-4 text-base font-semibold text-foreground">
                  {question.questionText}
                </h3>

                <div className="space-y-2">
                  {options.map((opt, i) => {
                    const safeOpt = opt ?? '';
                    const safeCorrect = question.correctAnswer ?? '';
                    const isSelected = selected === safeOpt;
                    const showCorrect = submitted && safeOpt.trim() === safeCorrect.trim();
                    const showWrong = submitted && isSelected && !showCorrect;

                    return (
                      <label
                        key={i}
                        className={`flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3 transition-colors ${
                          showCorrect
                            ? 'border-green-400 bg-green-50 text-green-800'
                            : showWrong
                            ? 'border-red-400 bg-red-50 text-red-800'
                            : isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:bg-muted/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={safeOpt}
                          checked={isSelected}
                          disabled={submitted}
                          onChange={() => handleAnswer(question.id, safeOpt)}
                          className="accent-primary"
                        />
                        <span className="text-sm">{safeOpt}</span>
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Correct answer:{' '}
                    <span className="font-medium text-green-700">{question.correctAnswer}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit / Back */}
        <div className="flex gap-3">
          {!submitted ? (
            <Button
              onClick={submitAssessment}
              disabled={answeredCount === 0}
              className="flex-1"
            >
              Submit Assessment
            </Button>
          ) : (
            <Button
              onClick={() => router.push('/student/assessments')}
              className="flex-1"
            >
              Back to Assessments
            </Button>
          )}
          {!submitted && (
            <Button
              variant="outline"
              onClick={() => router.push('/student/assessments')}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
