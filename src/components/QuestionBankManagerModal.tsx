import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, RotateCcw, Check, ShieldAlert, BookOpen, Save } from 'lucide-react';
import { CanadianTaxQuizQuestion, QuizTopic } from '../types';
import { loadCanadianTaxQuestions, saveCanadianTaxQuestions, resetTaxQuestionsToDefault } from '../data/canadianTaxQuiz';

interface QuestionBankManagerModalProps {
  onClose: () => void;
  onQuestionsUpdated?: () => void;
}

const TOPICS: QuizTopic[] = [
  'Personal Tax (T1)',
  'GST / HST & Sales Tax',
  'Canadian Payroll & Deductions',
  'Accounts Receivable & Payable',
  'Financial Statements & ASPE',
];

export const QuestionBankManagerModal: React.FC<QuestionBankManagerModalProps> = ({
  onClose,
  onQuestionsUpdated,
}) => {
  const [questions, setQuestions] = useState<CanadianTaxQuizQuestion[]>(() => loadCanadianTaxQuestions());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState<string>('ALL');

  // Form State for Editing/Adding
  const [formTopic, setFormTopic] = useState<QuizTopic>('Personal Tax (T1)');
  const [formQuestion, setFormQuestion] = useState<string>('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState<number>(0);
  const [formExplanation, setFormExplanation] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);

  const startEdit = (q: CanadianTaxQuizQuestion) => {
    setIsAddingNew(false);
    setEditingId(q.id);
    setFormTopic(q.topic);
    setFormQuestion(q.question);
    setFormOptions([...q.options]);
    setFormCorrectIndex(q.correctIndex);
    setFormExplanation(q.explanation);
  };

  const startAddNew = () => {
    setEditingId(null);
    setIsAddingNew(true);
    setFormTopic('Personal Tax (T1)');
    setFormQuestion('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormExplanation('');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || formOptions.some(opt => !opt.trim()) || !formExplanation.trim()) {
      alert('Please fill out the question, all 4 options, and the CRA explanation.');
      return;
    }

    let updated: CanadianTaxQuizQuestion[];

    if (isAddingNew) {
      const newQ: CanadianTaxQuizQuestion = {
        id: `can-custom-${Date.now()}`,
        topic: formTopic,
        question: formQuestion.trim(),
        options: formOptions.map(o => o.trim()),
        correctIndex: formCorrectIndex,
        explanation: formExplanation.trim(),
      };
      updated = [newQ, ...questions];
    } else if (editingId) {
      updated = questions.map(q => {
        if (q.id === editingId) {
          return {
            ...q,
            topic: formTopic,
            question: formQuestion.trim(),
            options: formOptions.map(o => o.trim()),
            correctIndex: formCorrectIndex,
            explanation: formExplanation.trim(),
          };
        }
        return q;
      });
    } else {
      return;
    }

    setQuestions(updated);
    saveCanadianTaxQuestions(updated);
    setEditingId(null);
    setIsAddingNew(false);
    if (onQuestionsUpdated) onQuestionsUpdated();
  };

  const handleDelete = (id: string) => {
    if (questions.length <= 3) {
      alert('The question bank must keep at least 3 questions to run a session.');
      return;
    }
    if (confirm('Are you sure you want to delete this question from the bank?')) {
      const updated = questions.filter(q => q.id !== id);
      setQuestions(updated);
      saveCanadianTaxQuestions(updated);
      if (onQuestionsUpdated) onQuestionsUpdated();
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset question bank to standard verified Canadian CRA tax & ASPE defaults?')) {
      const reset = resetTaxQuestionsToDefault();
      setQuestions(reset);
      setEditingId(null);
      setIsAddingNew(false);
      if (onQuestionsUpdated) onQuestionsUpdated();
    }
  };

  const filteredQuestions = filterTopic === 'ALL'
    ? questions
    : questions.filter(q => q.topic === filterTopic);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
                Canadian Accounting & Tax Practice
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white mt-0.5">
                Editable Question Bank & Tax Rule Manager
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Reset to default CRA tax rules"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Action Bar & Topic Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Filter Topic:</span>
              <select
                value={filterTopic}
                onChange={e => setFilterTopic(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-600 cursor-pointer"
              >
                <option value="ALL">All Topics ({questions.length})</option>
                {TOPICS.map(t => (
                  <option key={t} value={t}>
                    {t} ({questions.filter(q => q.topic === t).length})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={startAddNew}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Question</span>
            </button>
          </div>

          {/* Form for Editing or Adding a Question */}
          {(isAddingNew || editingId) && (
            <form onSubmit={handleSaveForm} className="p-5 bg-indigo-50/50 border border-indigo-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-200">
                <span className="font-bold text-indigo-950 text-sm">
                  {isAddingNew ? 'Add New Question to Bank' : 'Edit Canadian Tax Question'}
                </span>
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingId(null); }}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Knowledge Topic</label>
                  <select
                    value={formTopic}
                    onChange={e => setFormTopic(e.target.value as QuizTopic)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    {TOPICS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Correct Answer Selection</label>
                  <select
                    value={formCorrectIndex}
                    onChange={e => setFormCorrectIndex(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600 cursor-pointer font-semibold text-emerald-800"
                  >
                    <option value={0}>Option A is Correct</option>
                    <option value={1}>Option B is Correct</option>
                    <option value={2}>Option C is Correct</option>
                    <option value={3}>Option D is Correct</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  value={formQuestion}
                  onChange={e => setFormQuestion(e.target.value)}
                  placeholder="Enter the question text..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">4 Answer Choices (Mark which is correct above)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                        formCorrectIndex === idx ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {['A', 'B', 'C', 'D'][idx]}
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const updated = [...formOptions];
                          updated[idx] = e.target.value;
                          setFormOptions(updated);
                        }}
                        placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">CRA / Technical Explanation</label>
                <textarea
                  rows={2}
                  value={formExplanation}
                  onChange={e => setFormExplanation(e.target.value)}
                  placeholder="Explain why the answer is correct according to CRA or ASPE rules..."
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsAddingNew(false); setEditingId(null); }}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Question</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Questions in Bank */}
          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => (
              <div key={q.id} className="p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 mb-1">
                      {q.topic}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs">
                      {idx + 1}. {q.question}
                    </h4>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(q)}
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors cursor-pointer"
                      title="Edit Question"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600 pt-1">
                  {q.options.map((opt: string, oIdx: number) => (
                    <div
                      key={oIdx}
                      className={`px-2 py-1 rounded border flex items-center gap-2 ${
                        oIdx === q.correctIndex
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-950 font-semibold'
                          : 'border-slate-100 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span className="font-bold">{['A', 'B', 'C', 'D'][oIdx]}:</span>
                      <span className="truncate">{opt}</span>
                      {oIdx === q.correctIndex && <Check className="w-3 h-3 text-emerald-600 ml-auto shrink-0" />}
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span className="font-semibold text-slate-700">Explanation:</span> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-slate-500 text-xs">
            Changes are saved to local storage question bank. Randomly 3 are chosen per employee session.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
