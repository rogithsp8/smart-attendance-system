'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { questionAPI, attemptAPI, Question, Attempt } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function TakeAssessmentPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const assessmentId = parseInt(params.assessmentId as string);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const loadQuestions = async () => {
      try {
        const response = await questionAPI.getQuestionsByAssessment(assessmentId);
        setQuestions(response.data);
      } catch (err) {
        setError('Failed to load questions');
        console.error('Error loading questions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [assessmentId, user?.id]);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      alert('Please answer all questions');
      return;
    }

    setSubmitting(true);
    try {
      const response = await attemptAPI.submitAttempt(user!.id, assessmentId, answers);
      alert(`Assessment submitted! Your score: ${response.data.score}%`);
      router.push('/student/assessments');
    } catch (err) {
      console.error('Error submitting assessment:', err);
      alert('Failed to submit assessment');
    } finally {
      setSubmitting(false);
    }
  };

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
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout userRole="student">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Take Assessment</h1>
          <p className="mt-2 text-muted-foreground">Answer all questions and submit your assessment</p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle>
                  Question {index + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{question.questionText}</Label>
                </div>
                
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  {(() => {
                    try {
                      const options = JSON.parse(question.options);
                      return Array.isArray(options) ? options : [question.options];
                    } catch {
                      return [question.options];
                    }
                  })().map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`q${question.id}-option${optionIndex}`}>
                        {option}
                      </RadioGroupItem>
                      <Label htmlFor={`q${question.id}-option${optionIndex}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length !== questions.length}
            className="px-8"
          >
            {submitting ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
