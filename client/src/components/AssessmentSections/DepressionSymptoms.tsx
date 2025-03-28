import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useFormContext } from '@/lib/formContext';
import { formOptions, depressionScoreInterpretation } from '@/lib/assessmentUtils';
import { AlertTriangle } from 'lucide-react';

const DepressionSymptoms: React.FC = () => {
  const { formData, updateFormData } = useFormContext();
  const depressionData = formData.depressionSymptoms;

  // Calculate total score whenever individual scores change
  useEffect(() => {
    const totalScore = depressionData.scores.reduce((sum, score) => sum + score, 0);
    if (totalScore !== depressionData.totalScore) {
      updateFormData('depressionSymptoms', { totalScore });
    }
  }, [depressionData.scores]);

  const handleScoreChange = (index: number, value: number) => {
    const newScores = [...depressionData.scores];
    newScores[index] = value;
    updateFormData('depressionSymptoms', { scores: newScores });
  };

  const depressionResult = depressionScoreInterpretation(depressionData.totalScore);

  return (
    <Card className="bg-white overflow-hidden shadow rounded-lg mb-6">
      <CardContent className="px-4 py-5 sm:p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">4. Depression Symptoms (PHQ-9 Scale)</h2>
        <p className="text-gray-600 mb-6">
          Over the last 2 weeks, how often have you been bothered by the following problems?
        </p>

        {/* Scale explanation */}
        <div className="mb-6 bg-blue-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-blue-800">Rating scale:</h3>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-y-2">
            <div className="text-sm text-gray-600"><span className="font-medium">0:</span> Not at all</div>
            <div className="text-sm text-gray-600"><span className="font-medium">1:</span> Several days</div>
            <div className="text-sm text-gray-600"><span className="font-medium">2:</span> More than half the days</div>
            <div className="text-sm text-gray-600"><span className="font-medium">3:</span> Nearly every day</div>
          </div>
        </div>

        <div className="space-y-6">
          {formOptions.depressionQuestions.map((question, index) => (
            <div 
              key={index} 
              className={`border-b border-gray-200 pb-4 ${
                index === 8 ? 'border-red-300 bg-red-50 p-2 rounded' : ''
              }`}
            >
              <div className="mb-3">
                <Label htmlFor={`depression-${index}`} className="block text-sm font-medium text-gray-700">
                  {question}
                </Label>
                {index === 8 && (
                  <div className="mt-1 text-xs text-red-600 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Note: This question is about self-harm thoughts. If score is &gt; 0, immediate crisis intervention may be needed.
                  </div>
                )}
              </div>
              <RadioGroup
                value={depressionData.scores[index].toString()}
                onValueChange={(value) => handleScoreChange(index, parseInt(value))}
                className="flex space-x-4 md:space-x-6"
              >
                {[0, 1, 2, 3].map((score) => (
                  <div key={score} className="flex items-center">
                    <RadioGroupItem value={score.toString()} id={`depression-${index}-${score}`} />
                    <Label htmlFor={`depression-${index}-${score}`} className="ml-1 text-sm text-gray-700">
                      {score}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* Crisis Alert for self-harm thoughts */}
          {depressionData.scores[8] > 0 && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-md text-red-700 text-sm">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <strong>CRISIS ALERT:</strong> 
                  <p className="mt-1">The survivor has indicated thoughts of self-harm. This requires immediate crisis intervention.</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Do not leave the person alone</li>
                    <li>Contact emergency services or crisis response team immediately</li>
                    <li>Connect with a mental health professional as soon as possible</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* PHQ-9 Score Summary */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium text-gray-700">Total PHQ-9 Score:</div>
              <div className="text-lg font-bold text-primary-700">{depressionData.totalScore}</div>
            </div>
            <div className="mt-2">
              <div className="text-sm font-medium text-gray-700 mb-1">Interpretation:</div>
              <div className={`text-sm ${depressionResult.color}`}>
                {depressionResult.level}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepressionSymptoms;
