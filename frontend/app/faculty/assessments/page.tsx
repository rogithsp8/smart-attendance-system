'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { DataTable } from '@/components/dashboard/data-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { Plus } from 'lucide-react';
import { assessmentAPI, subjectAPI, questionAPI, Assessment, Subject, Question } from '@/lib/api';

export default function FacultyAssessmentsPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [questions, setQuestions] = useState<Record<number, Question[]>>({});
  const [loadingQuestions, setLoadingQuestions] = useState<Record<number, boolean>>({});
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subjectId: '',
    totalMarks: '',
  });
  const [questionFormData, setQuestionFormData] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [assessmentsRes, subjectsRes] = await Promise.all([
        assessmentAPI.getAssessments(),
        subjectAPI.getSubjects(),
      ]);
      setAssessments(assessmentsRes.data);
      setSubjects(subjectsRes.data);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssessment = async () => {
    console.log('Creating assessment:', formData);
    
    if (!formData.title || !formData.subjectId || !formData.totalMarks) {
      alert('Please fill all fields');
      return;
    }

    try {
      const assessmentData = {
        title: formData.title,
        subjectId: parseInt(formData.subjectId),
        totalMarks: parseInt(formData.totalMarks),
      };
      
      await assessmentAPI.createAssessment(assessmentData);
      alert('Assessment created successfully!');
      setIsCreateDialogOpen(false);
      setFormData({ title: '', subjectId: '', totalMarks: '' });
      loadData(); // Refresh the list
    } catch (err) {
      console.error('Error creating assessment:', err);
      alert('Failed to create assessment');
    }
  };
  if (loading) {
    return (
      <AppLayout userRole="faculty" pageTitle="Assessments">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout userRole="faculty" pageTitle="Assessments">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Error: {error}</div>
        </div>
      </AppLayout>
    );
  }

  const loadQuestions = async (assessmentId: number) => {
    setLoadingQuestions(prev => ({ ...prev, [assessmentId]: true }));
    try {
      const response = await questionAPI.getQuestionsByAssessment(assessmentId);
      console.log('Questions loaded:', response.data);
      setQuestions(prev => ({ ...prev, [assessmentId]: response.data }));
    } catch (err) {
      console.error('Error loading questions:', err);
    } finally {
      setLoadingQuestions(prev => ({ ...prev, [assessmentId]: false }));
    }
  };

  const handleCreateQuestion = async () => {
    console.log('Creating question:', questionFormData);
    
    if (!questionFormData.questionText || !questionFormData.correctAnswer || 
        questionFormData.options.some(opt => opt.trim() === '')) {
      alert('Please fill all fields and provide at least 4 options');
      return;
    }

    try {
      const questionData = {
        questionText: questionFormData.questionText,
        options: JSON.stringify(questionFormData.options.filter(opt => opt.trim() !== '')),
        correctAnswer: questionFormData.correctAnswer,
        assessment: {
          id: selectedAssessmentId!,
          subjectId: 0, // Backend will populate this
          title: '', // Backend will populate this
          totalMarks: 0, // Backend will populate this
        },
      };
      
      await questionAPI.createQuestion(selectedAssessmentId!, questionData);
      alert('Question created successfully!');
      setIsQuestionDialogOpen(false);
      setQuestionFormData({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
      });
      
      // Reload questions for this assessment
      if (selectedAssessmentId) {
        await loadQuestions(selectedAssessmentId);
      }
    } catch (err) {
      console.error('Error creating question:', err);
      alert('Failed to create question');
    }
  };

  const assessmentColumns = [
    { key: 'title', label: 'Assessment Name', className: 'font-medium' },
    { 
      key: 'subjectId', 
      label: 'Subject ID',
      render: (value: any) => `Subject ${value}`,
    },
    { key: 'totalMarks', label: 'Total Marks' },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="space-y-2">
          <Button 
            size="sm" 
            onClick={() => {
              setSelectedAssessmentId(row.id);
              setIsQuestionDialogOpen(true);
              // Load questions when opening dialog
              loadQuestions(row.id);
            }}
          >
            Add Question
          </Button>
          {questions[row.id] && questions[row.id].length > 0 && (
            <div className="text-sm text-gray-600">
              {questions[row.id].length} question(s)
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <AppLayout userRole="faculty" pageTitle="Assessments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assessments</h1>
            <p className="mt-2 text-muted-foreground">Manage quizzes, assignments, and exams for your classes</p>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Create Assessment
          </Button>
        </div>

        {/* Create Assessment Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Assessment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Assessment Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Midterm Exam"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={formData.subjectId} onValueChange={(value) => setFormData({ ...formData, subjectId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                  placeholder="e.g., 100"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateAssessment} className="flex-1">
                  Create Assessment
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Question Dialog */}
        <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Question to Assessment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="questionText">Question</Label>
                <Textarea
                  id="questionText"
                  value={questionFormData.questionText}
                  onChange={(e) => setQuestionFormData({ ...questionFormData, questionText: e.target.value })}
                  placeholder="Enter your question here..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Options</Label>
                {questionFormData.options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...questionFormData.options];
                      newOptions[index] = e.target.value;
                      setQuestionFormData({ ...questionFormData, options: newOptions });
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="mt-2"
                  />
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setQuestionFormData({ 
                    ...questionFormData, 
                    options: [...questionFormData.options, ''] 
                  })}
                  className="mt-2"
                >
                  Add Option
                </Button>
              </div>
              <div>
                <Label htmlFor="correctAnswer">Correct Answer</Label>
                <Select value={questionFormData.correctAnswer} onValueChange={(value) => setQuestionFormData({ ...questionFormData, correctAnswer: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionFormData.options.filter(opt => opt.trim() !== '').map((option, index) => (
                      <SelectItem key={index} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateQuestion} className="flex-1">
                  Add Question
                </Button>
                <Button variant="outline" onClick={() => setIsQuestionDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Assessments Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">All Assessments</h2>
          <DataTable columns={assessmentColumns} data={assessments} />
        </div>

        {/* Questions Display */}
        {Object.entries(questions).some(([_, questions]) => questions.length > 0) && (
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="mb-4 text-lg font-semibold text-foreground">Questions</h3>
            {Object.entries(questions).map(([assessmentId, assessmentQuestions]) => (
              assessmentQuestions.length > 0 && (
                <div key={assessmentId} className="mb-4 border rounded-lg p-4">
                  <h4 className="font-medium mb-2">
                    Assessment {assessmentId} - {assessmentQuestions.length} Question(s)
                  </h4>
                  <div className="space-y-2">
                    {assessmentQuestions.map((question, index) => (
                      <div key={question.id} className="bg-gray-50 p-3 rounded">
                        <div className="font-medium">Q{index + 1}: {question.questionText}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Options: {JSON.parse(question.options || '[]').join(', ')}
                        </div>
                        <div className="text-sm text-green-600 mt-1">
                          Correct: {question.correctAnswer}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
